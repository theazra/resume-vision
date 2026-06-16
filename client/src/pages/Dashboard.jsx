import React, { useEffect, useState } from 'react';
import * as api from '../api/index';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Upload, FileText, Briefcase, CheckCircle, AlertCircle, Trash2, Zap, Loader2, MessageSquare, ChevronUp } from 'lucide-react';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import InterviewPrep from '../components/InterviewPrep';

const Dashboard = () => {
  const { user } = useAuth();
  const { showNotification, showConfirm } = useUI();
  const [cvs, setCvs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [analyzingJobId, setAnalyzingJobId] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial Fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        const cvsData = await api.fetchCVs();
        setCvs(cvsData.data);
        // Removed initial job fetch to keep list empty by default
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, []);

  const handleCVClick = async (cv) => {
    setSelectedCV(cv);
    try {
      const jobsData = await api.fetchJobs(cv._id);
      setJobs(jobsData.data);
    } catch (error) {
      console.error("Failed to load jobs", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv', file);

    setUploading(true);
    try {
      const { data } = await api.uploadCV(formData);
      setCvs([...cvs, data]);
      setSelectedCV(data);

      // Refresh jobs based on the new CV
      try {
        const jobsData = await api.fetchJobs(data._id);
        setJobs(jobsData.data);
      } catch (jobError) {
        console.error("Failed to fetch jobs after upload", jobError);
      }

      showNotification("Uspješno dodano!", "success");
    } catch (error) {
      console.log(error);
      showNotification("Greška pri učitavanju CV-a.", "error");
    }
    setUploading(false);
  };

  const handleDeleteCV = async (e, id) => {
    e.stopPropagation();
    showConfirm({
      title: "Obriši analizu?",
      message: "Jeste li sigurni da želite trajno obrisati ovu analizu?",
      danger: true,
      icon: <Trash2 size={32} />,
      onConfirm: async () => {
        try {
          await api.deleteCV(id);
          const updatedCvs = cvs.filter((cv) => cv._id !== id);
          setCvs(updatedCvs);
          if (selectedCV?._id === id) {
            setSelectedCV(null);
            setJobs([]);
          }
          if (updatedCvs.length === 0) setJobs([]);
          showNotification("Analiza obrisana.", "success");
        } catch (error) {
          showNotification("Greška pri brisanju.", "error");
        }
      }
    });
  };

  const handleAnalyzeGap = async (job) => {
    if (!selectedCV) {
      showNotification("Molimo prvo odaberite CV za analizu.", "info");
      return;
    }

    setAnalyzingJobId(job.id);
    setGapAnalysis(null); // Reset previous analysis

    try {
      const { data } = await api.analyzeSkillGap({
        cvId: selectedCV._id,
        jobTitle: job.title,
        jobSnippet: job.snippet
      });
      setGapAnalysis({ ...data, jobTitle: job.title, jobSnippet: job.snippet });
      setInterviewQuestions(null); // Reset questions for new analysis

      // Smooth scroll to analysis
      setTimeout(() => {
        document.getElementById('gap-analysis-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Gap analysis failed", error);
      showNotification("Neuspješna analiza vještina. Pokušajte ponovo.", "error");
    } finally {
      setAnalyzingJobId(null);
    }
  };

  const handleGenerateInterview = async () => {
    if (!gapAnalysis || !selectedCV) return;

    setGeneratingQuestions(true);
    try {
      const { data } = await api.generateInterviewQuestions({
        cvId: selectedCV._id,
        jobTitle: gapAnalysis.jobTitle,
        jobSnippet: gapAnalysis.jobSnippet // We need to make sure jobSnippet is in gapAnalysis or reconstruct it
      });
      setInterviewQuestions(data);
      // Scroll to questions
      setTimeout(() => {
        document.getElementById('interview-prep-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Failed to generate questions", error);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 animate-fade-in-up">Dobrodošli, {user?.result?.email}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in-up stagger-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Upload className="w-5 h-5 text-blue-500" /> Učitaj CV
          </h2>
          <p className="text-gray-500 mb-4 text-sm">Učitaj svoj CV (PDF) da biste dobili analizu pomoću umjetne inteligencije i preporuke za posao..</p>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klikni da učitaš </span> ili povuci i ispusti</p>
              <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
            </div>
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={uploading} />
          </label>
          {uploading && <p className="text-center mt-2 text-blue-600">Analiziranje...</p>}
        </div>

        {/* CV List / Analysis */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2 animate-fade-in-up stagger-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <FileText className="w-5 h-5 text-purple-500" /> Tvoja CV Analiza
          </h2>
          {cvs.length === 0 ? (
            <p className="text-gray-500">Nema učitanog CV-a.</p>
          ) : (
            <div className="space-y-4">
              {cvs.map((cv) => (
                <div key={cv._id} onClick={() => handleCVClick(cv)}
                  className={`p-4 border rounded-lg cursor-pointer transition ${selectedCV?._id === cv._id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{cv.fileName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{new Date(cv.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={(e) => handleDeleteCV(e, cv._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete CV"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {cv.analysis.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-200 text-xs rounded-full text-gray-700">{skill}</span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {cv.analysis.suggestions.length > 0 ? (
                      <div className="flex items-start gap-1 text-amber-600">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <span>{cv.analysis.suggestions[0]}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Odlično urađeno! Nema važnih prijedloga.</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Analysis View */}
        {selectedCV && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl col-span-1 md:col-span-3 border-t-4 border-blue-500 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  Analysis: {selectedCV.fileName}
                </h2>
                <p className="text-gray-500 text-sm mt-1 ml-11">Učitano na {new Date(selectedCV.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-6 bg-blue-50/50 border border-blue-100 px-6 py-3 rounded-2xl">
                <span className="text-blue-900 font-bold uppercase tracking-wider text-xs">CV Score</span>
                <span className={`text-3xl font-black ${selectedCV.analysis.score >= 70 ? 'text-green-600' :
                  selectedCV.analysis.score >= 40 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                  {selectedCV.analysis.score}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Suggestions Column */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" /> Prijedlozi za poboljšanje
                </h3>
                <div className="space-y-3">
                  {selectedCV.analysis.suggestions.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <div className="mt-1 min-w-[20px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Column */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-500" /> Detektovane vještine
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCV.analysis.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Recommendations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-3 animate-fade-in-up stagger-3">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800 uppercase tracking-tight">
            <Briefcase className="w-5 h-5 text-green-500" /> Preporučeni poslovi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="group p-5 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                    <Zap className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 italic">{job.location}</p>
                  <div className="mt-4 p-3 bg-blue-50/30 rounded-xl border border-blue-100/50">
                    <p className="text-[11px] text-gray-700 font-medium line-clamp-4 leading-relaxed">
                      {cleanText(job.snippet)}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => handleAnalyzeGap(job)}
                    disabled={analyzingJobId === job.id}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-blue-200 shadow-lg hover:bg-blue-700 hover:shadow-blue-300 transition-all disabled:opacity-50"
                  >
                    {analyzingJobId === job.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    Analiza nedostajućih vještina
                  </button>
                  <a href={job.link} target="_blank" rel="noreferrer" className="block text-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200">Pošalji prijavu</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis Result Section */}
        {gapAnalysis && (
          <div id="gap-analysis-section" className="col-span-3 mt-4">
            <SkillGapAnalysis
              analysis={gapAnalysis}
              jobTitle={gapAnalysis.jobTitle}
              onClose={() => setGapAnalysis(null)}
            />

            {/* ATS Score Improvement Notification */}
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4 animate-bounce-subtle">
              <div className="p-3 bg-green-500 text-white rounded-full">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-green-800">Poboljšajte svoj ATS Score!</h4>
                <p className="text-sm text-green-700">Dodavanjem <span className="font-bold">{gapAnalysis.missingSkills.length} vještina</span> koje nedostaju, vaš ATS match bi se mogao povećati na preko <span className="font-bold">90%</span>!</p>
              </div>
            </div>

            {/* AI Interview Prep Trigger */}
            {!interviewQuestions ? (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleGenerateInterview}
                  disabled={generatingQuestions}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50"
                >
                  {generatingQuestions ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generisanje pitanja...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      Generiši AI Pitanja za Intervju
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div id="interview-prep-section" className="mt-8">
                <InterviewPrep questions={interviewQuestions} jobTitle={gapAnalysis.jobTitle} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-2xl shadow-2xl transition-all duration-300 transform z-50 hover:bg-blue-700 hover:scale-110 active:scale-95 border-b-4 border-blue-800 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        title="Nazad na vrh"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default Dashboard
