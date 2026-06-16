import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Download, Wand2, FileText, ChevronDown, ChevronUp, Upload, MapPin, Phone, Mail, User, Printer, Loader2 } from 'lucide-react';
import * as api from '../api/index';
import { useUI } from '../context/UIContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


import resumeStyles from '../styles/ResumeTemplate.css?inline'; // Import CSS as string for PDF generation
import '../styles/ResumeTemplate.css'; // Also keep normal import for display? Or inject the style tag manually? 
// Vite ?inline des NOT add it to the document header. So we NEED BOTH if we want to see it AND send it.
// Actually, let's keep the original import if it was there? 
// The original was: import '../styles/ResumeTemplate.css';
// We add the named import for the variable.

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useUI();

  const [activeSection, setActiveSection] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [currentResumeId, setCurrentResumeId] = useState(resumeId === 'new' ? null : resumeId);

  // State for CV Data
  const [cvData, setCvData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      profession: '',
      summary: '',
      photo: null
    },
    experience: [],
    education: [],
    skills: []
  });

  // Track if data has been loaded
  const dataLoadedRef = useRef(false);
  const autoSaveTimeoutRef = useRef(null);

  // Load existing resume if editing
  useEffect(() => {
    const loadResume = async () => {
      if (resumeId && resumeId !== 'new' && !dataLoadedRef.current) {
        try {
          const { data } = await api.getResume(resumeId);
          setCvData({
            personal: data.personal || {},
            experience: data.experience || [],
            education: data.education || [],
            skills: data.skills || []
          });
          dataLoadedRef.current = true;
        } catch (error) {
          console.error('Failed to load resume:', error);
          showNotification('Greška pri učitavanju CV-a.', 'error');
          navigate('/app/builder/new');
        }
      }
    };
    loadResume();
  }, [resumeId, navigate]);

  // Auto-save function
  const saveResume = useCallback(async () => {
    setSaving(true);
    try {
      if (currentResumeId) {
        // Update existing
        await api.updateResume(currentResumeId, cvData);
        console.log('Updated resume:', currentResumeId);
      } else {
        // Create new
        const { data } = await api.createResume(cvData);
        setCurrentResumeId(data._id);
        // Update URL without reload
        window.history.replaceState(null, '', `/app/builder/${data._id}`);
        console.log('Created new resume:', data._id);
      }
      setLastSaved(new Date());
      // Dispatch event to refresh sidebar list
      window.dispatchEvent(new Event('resumeSaved'));
    } catch (error) {
      console.error('Save failed:', error);
      showNotification('Greška pri spremanju CV-a.', 'error');
    } finally {
      setSaving(false);
    }
  }, [cvData, currentResumeId]);

  // Trigger auto-save when cvData changes (debounced)
  useEffect(() => {
    // Skip if data hasn't been loaded yet for existing resumes
    if (resumeId !== 'new' && !dataLoadedRef.current) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (3 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      // Only save if there's at least a name
      if (cvData.personal.fullName) {
        saveResume();
      }
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [cvData, saveResume, resumeId]);

  // --- Data Handlers ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvData(prev => ({
          ...prev,
          personal: { ...prev.personal, photo: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, photo: null }
    }));
  };

  // --- AI Generation Handlers ---
  const generateSummary = async () => {
    if (!cvData.personal.fullName) return showNotification("Unesite ime i prezime prvo.", "info");

    const draftText = cvData.personal.summary || '';
    if (draftText.trim().length < 5) {
      return showNotification("Napišite barem jednu kratku rečenicu o sebi u polje ispod pa kliknite 'AI Pomoć' za poboljšanje.", "info");
    }

    setGenerating(true);
    try {
      const { data } = await api.generateContent({
        section: 'professional_summary',
        keywords: cvData.personal.fullName + " " + (cvData.experience[0]?.title || ''),
        draftText: draftText
      });

      setCvData(prev => ({
        ...prev,
        personal: { ...prev.personal, summary: data.content }
      }));
    } catch (error) {
      console.error(error);
      showNotification(error.response?.data?.message || "Greška pri generisanju sadržaja.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const generateDescription = async (index, title) => {
    if (!title) return showNotification("Unesite naziv pozicije.", "info");

    setGenerating(true);
    try {
      const { data } = await api.generateContent({
        section: 'experience_description',
        keywords: title
      });

      const newExp = [...cvData.experience];
      newExp[index].description = data.content;
      setCvData(prev => ({ ...prev, experience: newExp }));
    } catch (error) {
      console.error(error);
      showNotification(error.response?.data?.message || "Greška pri generisanju opisa.", "error");
    } finally {
      setGenerating(false);
    }
  };

  // --- Form Handlers ---
  const handlePersonalChange = (e) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [e.target.name]: e.target.value }
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...cvData.experience];
    newExp[index][field] = value;
    setCvData(prev => ({ ...prev, experience: newExp }));
  };

  const removeExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', year: '' }]
    }));
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...cvData.education];
    newEdu[index][field] = value;
    setCvData(prev => ({ ...prev, education: newEdu }));
  };

  const removeEducation = (index) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim());
    setCvData(prev => ({ ...prev, skills: skillsArray }));
  };


  // --- Export Handlers ---
  const exportPDF = async () => {
    try {
      setGenerating(true);
      const input = document.getElementById('cv-preview-content');

      // Get HTML content
      const html = input.outerHTML;

      // Request PDF from server
      const response = await api.downloadPDF({
        html,
        css: resumeStyles
      });

      // Download Blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Resume-${cvData.personal.fullName.replace(/\s+/g, '_') || 'Untitled'}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("PDF Export Error:", err);
      showNotification(`Greška pri izradi PDF-a.`, "error");
    } finally {
      setGenerating(false);
    }
  };

  // --- Print Handler ---
  const handlePrint = () => {
    window.print();
  };

  // --- UI Helper ---
  const SectionHeader = ({ title, icon: Icon, sectionName }) => (
    <button
      onClick={() => setActiveSection(activeSection === sectionName ? null : sectionName)}
      className={`w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl transition-all duration-200 ${activeSection === sectionName ? 'ring-2 ring-blue-500 shadow-md' : 'hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${activeSection === sectionName ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
          <Icon size={20} />
        </div>
        <span className={`font-medium text-lg ${activeSection === sectionName ? 'text-slate-800' : 'text-slate-600'}`}>{title}</span>
      </div>
      {activeSection === sectionName ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-100 font-sans">

      {/* LEFT: Editor Panel - Hidden on Print */}
      <div className="w-full lg:w-5/12 p-6 overflow-y-auto bg-white border-r border-slate-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 custom-scrollbar no-print">

        <div className="flex justify-between items-center mb-8 top-0 bg-white/80 backdrop-blur-sm z-20 py-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Uredite CV</h2>
            <p className="text-sm text-slate-500">Popunite detalje za dizajn</p>
          </div>
          <div className="text-xs text-slate-400">
            {saving ? (
              <span className="text-blue-500 animate-pulse">Spremanje...</span>
            ) : lastSaved ? (
              <span>Sačuvano {lastSaved.toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' })}</span>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 pb-20">
          {/* Personal Info Accordion */}
          <div className="space-y-2">
            <SectionHeader title="Lični Podaci" icon={FileText} sectionName="personal" />
            {activeSection === 'personal' && (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-300 flex items-center justify-center">
                    {cvData.personal.photo ? (
                      <img src={cvData.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                      Učitaj Sliku
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                    </label>
                    {cvData.personal.photo && (
                      <button onClick={handleRemovePhoto} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Ukloni sliku">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>

                <input name="fullName" placeholder="Ime i Prezime" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none" onChange={handlePersonalChange} value={cvData.personal.fullName} />
                <input name="profession" placeholder="Zanimanje / Titula" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none" onChange={handlePersonalChange} value={cvData.personal.profession} />
                <input name="email" placeholder="Email" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none" onChange={handlePersonalChange} value={cvData.personal.email} />
                <input name="phone" placeholder="Telefon" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none" onChange={handlePersonalChange} value={cvData.personal.phone} />
                <input name="address" placeholder="Adresa" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none" onChange={handlePersonalChange} value={cvData.personal.address} />

                <div className="relative pt-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Profesionalni Rezime</label>
                  <textarea name="summary" rows="4" className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-none resize-none mt-1" onChange={handlePersonalChange} value={cvData.personal.summary} placeholder="Napišite nekoliko riječi o sebi, a zatim kliknite 'AI Pomoć' za profesionalniji izgled..."></textarea>
                  <button onClick={generateSummary} disabled={generating} className="mt-2 text-xs flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 disabled:opacity-50">
                    <Wand2 size={12} /> {generating ? 'Generisanje...' : 'AI Pomoć'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Experience Accordion */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SectionHeader title="Radno Iskustvo" icon={FileText} sectionName="experience" />
              <button onClick={addExperience} className="p-4 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-100"><Plus size={24} /></button>
            </div>
            {activeSection === 'experience' && (
              <div className="space-y-4 animate-in slide-in-from-top-2">
                {cvData.experience.map((exp, index) => (
                  <div key={index} className="p-5 pt-12 bg-slate-50 border border-slate-200 rounded-xl relative">
                    <button onClick={() => removeExperience(index)} className="absolute top-3 right-3 p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors"><Trash2 size={18} /></button>
                    <input className="w-full mb-2 p-2 rounded border" placeholder="Pozicija" value={exp.title} onChange={(e) => updateExperience(index, 'title', e.target.value)} />
                    <input className="w-full mb-2 p-2 rounded border" placeholder="Kompanija" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                    <div className="flex gap-2">
                      <input type="date" className="w-1/2 mb-2 p-2 rounded border" value={exp.startDate} onChange={(e) => updateExperience(index, 'startDate', e.target.value)} />
                      <input type="date" className="w-1/2 mb-2 p-2 rounded border" value={exp.endDate} onChange={(e) => updateExperience(index, 'endDate', e.target.value)} />
                    </div>
                    <textarea rows="3" className="w-full p-2 rounded border" placeholder="Opis..." value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)}></textarea>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education Accordion */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SectionHeader title="Obrazovanje" icon={FileText} sectionName="education" />
              <button onClick={addEducation} className="p-4 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-100"><Plus size={24} /></button>
            </div>
            {activeSection === 'education' && (
              <div className="space-y-4 animate-in slide-in-from-top-2">
                {cvData.education.map((edu, index) => (
                  <div key={index} className="p-5 pt-12 bg-slate-50 border border-slate-200 rounded-xl relative">
                    <button onClick={() => removeEducation(index)} className="absolute top-3 right-3 p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors"><Trash2 size={18} /></button>
                    <input className="w-full mb-2 p-2 rounded border" placeholder="Škola / Univerzitet" value={edu.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} />
                    <input className="w-full mb-2 p-2 rounded border" placeholder="Stepen / Zvanje" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                  </div>
                ))}
              </div>
            )}
          </div>



          {/* Skills Accordion */}
          <div className="space-y-2">
            <SectionHeader title="Vještine" icon={FileText} sectionName="skills" />
            {activeSection === 'skills' && (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl animate-in slide-in-from-top-2">
                <p className="text-xs text-slate-500 mb-3">Unesite vještine odvojene zarezom (npr. JavaScript, Prodaja...)</p>
                <textarea rows="3" className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-none resize-none" placeholder="Vještine..." onChange={handleSkillsChange}></textarea>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={saveResume}
            disabled={saving || !cvData.personal.fullName}
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="animate-spin">⏳</span> Spremanje...
              </>
            ) : (
              <>
                💾 Sačuvaj CV
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT: Live Preview Panel */}
      <div className="w-full lg:w-7/12 bg-slate-200/50 p-8 overflow-y-auto flex flex-col items-center relative custom-scrollbar">

        {/* VISUAL EXPORT BAR - Hidden on Print */}
        <div className="sticky top-4 z-30 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-slate-200/50 flex gap-4 mb-8 no-print">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-900 shadow-md transition-all text-sm font-medium">
            <Printer size={16} /> Štampaj
          </button>
          <button
            onClick={exportPDF}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all text-sm font-medium disabled:opacity-70 disabled:cursor-wait"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Generisanje...
              </>
            ) : (
              <>
                <Download size={16} /> Preuzmi PDF
              </>
            )}
          </button>

        </div>

        {/* THE RESUME - Always Visible / Printed */}
        <div id="cv-preview-content" className="resume-container">

          {/* LEFT SIDEBAR */}
          <aside className="sidebar">
            {/* Profile Image */}
            <div className="profile-container">
              {cvData.personal.photo ? (
                <img src={cvData.personal.photo} className="profile-img" alt="Profile" />
              ) : (
                <div className="profile-placeholder"></div>
              )}
            </div>

            {/* Contact */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Kontakt</h3>
              <ul className="contact-list">
                {cvData.personal.address && (
                  <li className="contact-item">
                    <MapPin className="contact-icon" size={16} />
                    <span>{cvData.personal.address}</span>
                  </li>
                )}
                {cvData.personal.phone && (
                  <li className="contact-item">
                    <Phone className="contact-icon" size={16} />
                    <span>{cvData.personal.phone}</span>
                  </li>
                )}
                {cvData.personal.email && (
                  <li className="contact-item">
                    <Mail className="contact-icon" size={16} />
                    <span>{cvData.personal.email}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Education (Sidebar) */}
            {cvData.education.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">Obrazovanje</h3>
                {cvData.education.map((edu, i) => (
                  <div key={i} className="edu-item">
                    <div className="edu-degree">{edu.degree}</div>
                    <div className="edu-school">{edu.school}</div>

                  </div>
                ))}
              </div>
            )}

          </aside>

          {/* RIGHT MAIN CONTENT */}
          <main className="main-content">

            {/* Header */}
            <div className="header-block">
              <h1 className="header-name">{cvData.personal.fullName || 'Ime i prezime'}</h1>
              <div className="header-title">{cvData.personal.profession || 'Zanimanje'}</div>
            </div>

            {/* Profile */}
            {cvData.personal.summary && (
              <div className="main-section">
                <h2 className="main-title">Profil</h2>
                <p className="profile-text">
                  {cvData.personal.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {cvData.experience.length > 0 && (
              <div className="main-section">
                <h2 className="main-title">Radno iskustvo</h2>
                {cvData.experience.map((exp, i) => (
                  <div key={i} className="exp-item">
                    <div className="exp-header">
                      <div className="exp-title">{exp.title}</div>
                      <div className="exp-date">{exp.startDate} - {exp.endDate}</div>
                    </div>
                    <div className="exp-company">{exp.company}</div>
                    <p className="exp-desc">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills (Main Area - Two Column) */}
            {cvData.skills.length > 0 && cvData.skills[0] !== "" && (
              <div className="main-section">
                <h2 className="main-title">Vještine</h2>
                <div className="skills-grid">
                  {cvData.skills.map((skill, i) => (
                    <div key={i} className="skill-item">
                      <div className="skill-bullet"></div>
                      <span className="skill-text">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
