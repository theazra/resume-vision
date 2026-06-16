import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('../utils/pdfParser.cjs');
import fs from 'fs';
import auth from '../middleware/auth.js';
import CV from '../models/CV.js';
import Resume from '../models/Resume.js';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfController from '../controllers/pdfController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to call Gemini with retries and exponential backoff
const callGeminiWithRetry = async (prompt, modelName = "gemini-flash-latest", maxRetries = 3) => {
    let attempt = 0;
    let delay = 2000; // start with 2s delay

    while (attempt < maxRetries) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            attempt++;
            console.error(`Gemini API call attempt ${attempt} failed for model ${modelName}:`, error.message);
            
            if (attempt >= maxRetries) {
                // If the primary model failed consistently, try fallbacks
                if (modelName === "gemini-flash-latest") {
                    console.log("Retrying with fallback model gemini-2.5-flash...");
                    try {
                        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                        const result = await fallbackModel.generateContent(prompt);
                        const response = await result.response;
                        return response.text();
                    } catch (fallbackError) {
                        console.error("Fallback model gemini-2.5-flash also failed:", fallbackError.message);
                        throw fallbackError;
                    }
                }
                throw error;
            }

            // Wait with exponential backoff
            console.log(`Waiting ${delay}ms before retry attempt ${attempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
};

// Helper function to analyze CV with Gemini
const analyzeCVWithAI = async (text) => {
    const prompt = `
    Analiziraj sljedeći tekst biografije (CV). Izdvoji ključne vještine (kao listu odvojenu zarezima) i navedi 3-5 konkretnih prijedloga za poboljšanje.
    Također daj ocjenu od 0 do 100.
    Vrati SAMO validan JSON objekat u ovom formatu (sadržaj na bosanskom jeziku):
    {
        "skills": ["vještina1", "vještina2"],
        "suggestions": ["savjet1", "savjet2"],
        "score": 85
    }
    Ne dodaji nikakvo markdown formatiranje ili objašnjenja. Samo JSON.

    Tekst Biografije:
    ${text.substring(0, 5000)} // Limitirani tekst
    `;

    try {
        const textResponse = await callGeminiWithRetry(prompt);
        // Clean up markdown code blocks if present
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("analyzeCVWithAI failed after retries:", error.message);

        // If quota limit reached, return mock data immediately
        if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
            console.log("Gemini Quota Reached during upload - Serving Mock CV Analysis");
            return {
                skills: ["JavaScript", "React", "Node.js", "CSS", "Tailwind"],
                suggestions: [
                    "Dodan mock profil zbog ograničenja API kvote.",
                    "Dodajte više detalja o konkretnim projektima.",
                    "Istaknite certifikate ako ih posjedujete."
                ],
                score: 75
            };
        }

        // Return a specific fallback for other persistent failures
        return {
            skills: ["Nije moguće izdvojiti vještine"],
            suggestions: ["Servis za analizu je trenutno preopterećen. Pokušajte sa novim uploadom kasnije."],
            score: 0
        };
    }
};

// Upload CV
router.post('/upload', auth, upload.single('cv'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        let text = '';
        try {
            const data = await pdf(dataBuffer);
            text = data.text;

            if (!text || text.trim().length < 50) {
                return res.status(400).json({
                    message: 'Nije moguće izdvojiti dovoljno teksta iz ovog PDF-a. Fajl je možda skeniran (slika) ili šifriran. Molimo pokušajte sa standardnim tekstualnim PDF-om.'
                });
            }
        } catch (parseError) {
            console.error("PDF Parse Error:", parseError);
            return res.status(400).json({ message: 'Failed to read PDF file. It may be corrupted or in an unsupported format.' });
        }

        // AI Analysis
        const analysis = await analyzeCVWithAI(text);

        const newCV = new CV({
            user: req.userId,
            fileName: req.file.originalname,
            filePath: req.file.path,
            parsedText: text,
            analysis
        });

        await newCV.save();
        res.status(201).json(newCV);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get User's CVS
router.get('/cvs', auth, async (req, res) => {
    try {
        const cvs = await CV.find({ user: req.userId });
        res.status(200).json(cvs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching CVs" });
    }
});

// Delete CV
router.delete('/cv/:id', auth, async (req, res) => {
    try {
        const cv = await CV.findOne({ _id: req.params.id, user: req.userId });

        if (!cv) {
            return res.status(404).json({ message: "CV not found" });
        }

        // Delete file from storage
        if (fs.existsSync(cv.filePath)) {
            fs.unlinkSync(cv.filePath);
        }

        // Delete from DB
        await CV.findByIdAndDelete(req.params.id);

        res.json({ message: "CV deleted successfully" });
    } catch (error) {
        console.error("Delete CV Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/review/:id', auth, async (req, res) => {
    try {
        const cv = await CV.findOne({ _id: req.params.id, user: req.userId });
        if (!cv) return res.status(404).json({ message: "CV not found" });
        res.json(cv.analysis);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Simple in-memory cache
let jobCache = {
    query: null,
    data: null,
    timestamp: 0
};
const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

// Job Recommendations via RapidAPI JSearch
router.get('/jobs', auth, async (req, res) => {
    try {
        let targetCV;
        // If a specific CV ID is provided, use that
        if (req.query.cv_id) {
            targetCV = await CV.findOne({ _id: req.query.cv_id, user: req.userId });
        } else {
            // Otherwise default to the latest
            targetCV = await CV.findOne({ user: req.userId }).sort({ createdAt: -1 });
        }

        let query = 'Developer'; // Default

        if (targetCV && targetCV.analysis && targetCV.analysis.skills.length > 0) {
            // Filter out general or fallback/error skills
            const invalidSkills = [
                "General", 
                "Nije moguće izdvojiti vještine", 
                "Greška pri analizi", 
                "Servis trenutno nedostupan"
            ];
            const validSkills = targetCV.analysis.skills.filter(s => s && !invalidSkills.includes(s.trim()));
            if (validSkills.length > 0) {
                query = validSkills.slice(0, 2).join(' ');
            }
        }

        const cleanSnippet = (text) => {
            if (!text) return "";
            return text
                .replace(/<[^>]*>?/gm, ' ') // Remove HTML tags
                .replace(/&nbsp;/g, ' ')    // Specific &nbsp;
                .replace(/&amp;/g, '&')     // &
                .replace(/&lt;/g, '<')      // <
                .replace(/&gt;/g, '>')      // >
                .replace(/&quot;/g, '"')   // "
                .replace(/&#39;/g, "'")    // '
                .replace(/\s+/g, ' ')      // Normalize whitespace
                .trim();
        };

        // CHECK CACHE
        const now = Date.now();
        if (jobCache.query === query && jobCache.data && (now - jobCache.timestamp < CACHE_DURATION)) {
            console.log("Serving jobs from cache for:", query);
            // Re-clean in case cache has old format
            const cleanedCachedJobs = jobCache.data.map(j => ({ ...j, snippet: cleanSnippet(j.snippet) }));
            return res.json(cleanedCachedJobs);
        }

        // JOOBLE API (Bosnia)
        const joobleUrl = `https://ba.jooble.org/api/${process.env.JOOBLE_API_KEY}`;
        const joobleParams = {
            keywords: query,
            location: 'Bosnia and Herzegovina'
        };

        console.log("Searching Jooble with:", joobleUrl, joobleParams);

        const response = await axios.post(joobleUrl, joobleParams, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Jooble returns { totalCount: 123, jobs: [...] }
        const rawJobs = response.data.jobs || [];

        const jobs = rawJobs.map((job, index) => ({
            id: job.id || index,
            title: job.title,
            company: job.company || "Unknown",
            location: job.location,
            link: job.link,
            snippet: cleanSnippet(job.snippet),
            logo: null
        })).slice(0, 10);

        // UPDATE CACHE
        jobCache = {
            query: query,
            data: jobs,
            timestamp: now
        };

        res.json(jobs);
    } catch (error) {
        console.error("Job Search Error:", error.message);

        // Return cached data on error if available, otherwise mock
        if (jobCache.data) {
            console.log("Serving stale cache due to API error");
            return res.json(jobCache.data);
        }

        res.json([
            { id: 'mock1', title: 'Backend Developer (API Quota Limit)', company: 'System', location: 'Remote', link: '#', snippet: 'Looking for a backend developer experienced in Node.js and MongoDB.' },
            { id: 'mock2', title: 'Try Again in 1 Hour', company: 'System', location: 'Settings', link: '#', snippet: 'System maintenance in progress.' }
        ]);
    }
});

// Skill Gap Analysis
router.post('/analyze-skill-gap', auth, async (req, res) => {
    try {
        const { cvId, jobTitle, jobSnippet } = req.body;

        const cv = await CV.findOne({ _id: cvId, user: req.userId });
        if (!cv) {
            return res.status(404).json({ message: "CV not found" });
        }

        const prompt = `
        Analiziraj usklađenost između CV-a i opisa posla. 
        
        PODACI O POSLU:
        Naslov: ${jobTitle || "Nije navedeno"}
        Opis: ${(jobSnippet || "").substring(0, 2000)}

        TEKST BIOGRAFIJE (CV):
        ${(cv.parsedText || "").substring(0, 4000)}

        ZADATAK:
        1. Izdvoji potrebne vještine iz opisa posla (hard i soft skills).
        2. Uporedi ih sa vještinama u CV-u.
        3. Identifikuj:
           - "matchedSkills": vještine koje korisnik ima.
           - "missingSkills": vještine koje nedostaju, sa prioritetom (High, Medium, Low) na osnovu važnosti za posao.
        4. Izračunaj "matchScore" (0-100%).
        5. Generiši personalizovane "recommendations" kako popuniti praznine.

        Vrati SAMO validan JSON objekat u ovom formatu (sadržaj na bosanskom jeziku):
        {
            "matchScore": 75,
            "matchedSkills": ["JavaScript", "React"],
            "missingSkills": [
                {"skill": "Docker", "priority": "High"},
                {"skill": "Testing", "priority": "Medium"}
            ],
            "recommendations": [
                "Nauči Docker osnove kroz online kurseve.",
                "Dodaj projekat koji koristi Unit Testing u svoj CV."
            ]
        }
        Ne dodaji markdown formatiranje. Samo JSON.
        `;

        const textResponse = await callGeminiWithRetry(prompt);

        console.log("Gemini Raw Response (Gap Analysis):", textResponse);

        let jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        // Final fallback if JSON starts with text
        const jsonStart = jsonStr.indexOf('{');
        const jsonEnd = jsonStr.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
        }

        const analysis = JSON.parse(jsonStr);
        res.json(analysis);
    } catch (error) {
        console.error("Skill Gap Analysis Error:", error);

        // Handle Quota Limit (429) gracefully for presentation
        if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
            console.log("Gemini Quota Reached - Serving Mock Analysis");
            return res.json({
                "matchScore": 82,
                "matchedSkills": ["JavaScript", "React", "Node.js", "REST APIs"],
                "missingSkills": [
                    { "skill": "Docker", "priority": "High" },
                    { "skill": "Unit Testing (Jest)", "priority": "Medium" },
                    { "skill": "AWS Deployment", "priority": "Low" }
                ],
                "recommendations": [
                    "S obzirom na trenutno ograničenje API-ja, ovo je ogledni primjer analize.",
                    "Instalirajte Docker i prođite kroz 'Getting Started' vodič.",
                    "Dodajte Jest testove u vaše postojeće React projekte za bolji match score.",
                    "Istražite AWS Free Tier za deployment vaših aplikacija."
                ]
            });
        }

        // Return a mock fallback on persistent errors
        return res.json({
            "matchScore": 50,
            "matchedSkills": ["Greška pri analizi"],
            "missingSkills": [
                { "skill": "Servis trenutno nedostupan", "priority": "High" }
            ],
            "recommendations": [
                "Trenutno nismo u mogućnosti da analiziramo usklađenost zbog preopterećenja AI servisa. Molimo pokušajte ponovo za nekoliko trenutaka."
            ]
        });
    }
});

// AI Interview Prep
router.post('/generate-interview-questions', auth, async (req, res) => {
    try {
        const { cvId, jobTitle, jobSnippet } = req.body;

        const cv = await CV.findOne({ _id: cvId, user: req.userId });
        if (!cv) {
            return res.status(404).json({ message: "CV not found" });
        }

        const prompt = `
        Na osnovu sljedećih podataka, generiši 5 personalizovanih pitanja za intervju (kombinacija bihevioralnih i tehničkih) i kratke smjernice za najbolje odgovore.
        
        POZICIJA: ${jobTitle || "Nije navedeno"}
        OPIS POSLA: ${(jobSnippet || "").substring(0, 2000)}
        
        CV KANDIDATA (TEKST):
        ${(cv.parsedText || "").substring(0, 3000)}

        FORMAT ODGOVORA (Vrati samo validan JSON na bosanskom jeziku):
        [
            {
                "question": "Pitanje 1?",
                "type": "Technical",
                "hint": "Kratka smjernica za odgovor..."
            },
            ...
        ]
        Ne dodaji markdown.
        `;

        const textResponse = await callGeminiWithRetry(prompt);

        console.log("Gemini Raw Response (Interview Prep):", textResponse);

        let jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        // Brute force JSON extraction
        const jsonStart = jsonStr.indexOf('[');
        const jsonEnd = jsonStr.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
        }

        const questions = JSON.parse(jsonStr);
        res.json(questions);
    } catch (error) {
        console.error("Interview Prep Error:", error);

        // Handle Quota Limit (429) or other errors gracefully
        console.log("Serving Mock Questions due to Gemini API issue");
        return res.json([
            {
                "question": "Možete li opisati projekt na kojem ste koristili React i s kojim ste se izazovima susreli?",
                "type": "Technical",
                "hint": "Fokusirajte se na state management ili performanse."
            },
            {
                "question": "Kako pristupate rješavanju konflikata unutar tima?",
                "type": "Behavioral",
                "hint": "Kratka smjernica: koristite STAR metodu (situacija, zadatak, akcija, rezultat)."
            },
            {
                "question": "Koja je razlika između SQL i NoSQL baza podataka u kontekstu vašeg iskustva?",
                "type": "Technical",
                "hint": "Spomenite MongoDB ako ste ga koristili i objasnite skalabilnost."
            }
        ]);
    }
});

// Generate Content Helper
const generateCVContent = async (section, keywords, draftText) => {
    try {
        let prompt = "";
        if (section === "professional_summary") {
            if (draftText && draftText.trim().length > 5) {
                prompt = `
                Korisnik je napisao sljedeći nacrt za svoj profesionalni rezime u CV-u:
                "${draftText}"
                
                Zadatak: Preformuliši i unaprijedi ovaj tekst da zvuči visoko profesionalno, gramatički ispravno i samouvjereno. Ključne informacije koje je korisnik naveo moraju biti zadržane. Tekst treba biti dugačak oko 3-4 rečenice.
                VAŽNO REČENIČNO PRAVILO: Strogo je zabranjeno započeti tekst sa zamjenicom "Ja" ili frazom "Ja sam". Umjesto toga, započni tekst direktno sa titulom ili vještinom (npr. "Fokusirani softver inženjer sa...", "Kreativni dizajner koji...").
                Vrati SAMO tekst rezimea, bez navodnika. Na bosanskom jeziku.
                `;
            } else {
                prompt = `
                Napiši profesionalni rezime za CV na osnovu ovih ključnih riječi/pozicije: "${keywords}".
                Rezime treba biti profesionalan i dugačak oko 3-4 rečenice.
                VAŽNO REČENIČNO PRAVILO: Strogo je zabranjeno započeti tekst sa zamjenicom "Ja" ili frazom "Ja sam". Umjesto toga, započni tekst direktno sa titulom (npr. "Iskusni profesionalac sa...", "Motivisani stručnjak koji...").
                Vrati SAMO tekst rezimea, bez navodnika ili JSON-a. Na bosanskom jeziku.
                `;
            }
        } else if (section === "experience_description") {
            prompt = `
            Napiši 3-4 profesionalne tačke (bullet points) za opis posla na poziciji: "${keywords}".
            Fokusiraj se na postignuća i odgovornosti.
            Vrati SAMO tekst, svaka tačka u novom redu, počevši sa "- ". Na bosanskom jeziku.
            `;
        } else {
            return "Nepoznata sekcija.";
        }

        return await callGeminiWithRetry(prompt);
    } catch (error) {
        console.error("AI Generation Error:", error);
        return null; // Return null on failure
    }
};

router.post('/generate-content', auth, async (req, res) => {
    try {
        const { section, keywords, draftText } = req.body;
        if (!keywords && !draftText) return res.status(400).json({ message: "Keywords or draft required" });

        const content = await generateCVContent(section, keywords, draftText);

        if (!content) {
            return res.status(503).json({ message: "Servis trenutno nije dostupan." });
        }

        res.json({ content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ========== RESUME CRUD (Created CVs) ==========

// Create new resume
router.post('/resume', auth, async (req, res) => {
    try {
        const newResume = new Resume({
            user: req.userId,
            ...req.body
        });
        await newResume.save();
        res.status(201).json(newResume);
    } catch (error) {
        console.error('Create Resume Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get resume by ID
router.get('/resume/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.json(resume);
    } catch (error) {
        console.error('Get Resume Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update resume
router.put('/resume/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { $set: req.body },
            { new: true }
        );
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.json(resume);
    } catch (error) {
        console.error('Update Resume Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all user's resumes
router.get('/resumes', auth, async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.userId }).select('personal.fullName updatedAt');
        res.json(resumes);
    } catch (error) {
        console.error('Get Resumes Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete resume
router.delete('/resume/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Delete Resume Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// PDF Generation
router.post('/download-pdf', auth, pdfController.generatePDF);

export default router;
