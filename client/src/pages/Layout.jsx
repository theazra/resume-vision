import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { LayoutDashboard, FileSearch, FilePlus, LogOut, Home, Menu, X, FileEdit, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import * as api from '../api/index';

const Layout = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [showSavedResumes, setShowSavedResumes] = useState(true);

  // Custom Modal State
  const [cvToDelete, setCvToDelete] = useState(null);

  // Fetch saved resumes on mount
  const fetchSavedResumes = async () => {
    try {
      const { data } = await api.fetchResumes();
      setSavedResumes(data);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
  };

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  // Listen for resume save events to refresh sidebar
  useEffect(() => {
    const handleResumeSaved = () => {
      fetchSavedResumes();
    };
    window.addEventListener('resumeSaved', handleResumeSaved);
    return () => window.removeEventListener('resumeSaved', handleResumeSaved);
  }, []);

  // Delete Handlers
  const confirmDelete = (resume) => {
    setCvToDelete(resume); // Open Modal
  };

  const executeDelete = async () => {
    if (!cvToDelete) return;

    try {
      await api.deleteResume(cvToDelete._id);
      setSavedResumes(prev => prev.filter(r => r._id !== cvToDelete._id));
      // Navigate to fresh builder to clear inputs if we were on that resume
      if (window.location.pathname.includes(cvToDelete._id)) {
        window.location.href = '/app/builder/new';
      }
      setCvToDelete(null); // Close Modal
    } catch (error) {
      console.error('Delete failed:', error);
      showNotification('Greška pri brisanju.', 'error');
      setCvToDelete(null);
    }
  };

  // Navigation Items
  const navItems = [
    { path: '/app', end: true, label: 'Početna', icon: <Home size={20} /> },
    { path: '/app/dashboard', label: 'Moje Analize', icon: <LayoutDashboard size={20} /> },
    { path: '/app/builder/new', label: 'Novi CV', icon: <FilePlus size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <img src="/ress.png" alt="ResumeVision" className="h-10 w-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Uredi CV Section */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <button
              onClick={() => setShowSavedResumes(!showSavedResumes)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileEdit size={20} />
                <span>Uredi CV</span>
              </div>
              {showSavedResumes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showSavedResumes && (
              <div className="ml-4 mt-1 space-y-1">
                {savedResumes.length === 0 ? (
                  <p className="text-xs text-gray-400 px-4 py-2">Nema sačuvanih CV-ova</p>
                ) : (
                  savedResumes.map((resume) => (
                    <div key={resume._id} className="flex items-center group">
                      <NavLink
                        to={`/app/builder/${resume._id}`}
                        className={({ isActive }) =>
                          `flex-1 px-4 py-2 text-sm rounded-lg truncate ${isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`
                        }
                      >
                        {resume.personal?.fullName || 'Bez naziva'}
                      </NavLink>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          confirmDelete(resume);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity mr-2"
                        title="Obriši CV"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.result?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.result?.name || 'Korisnik'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.result?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Odjavi se
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/ress.png" alt="ResumeVision" className="h-8 w-auto" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-gray-600 bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-white p-4 shadow-xl" onClick={e => e.stopPropagation()}>
              <nav className="space-y-2 mt-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-blue-500 hover:bg-blue-50 rounded-lg mt-4"
                >
                  <LogOut size={20} />
                  Odjavi se
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {cvToDelete && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Brisanje CV-a</h3>
              <p className="text-sm text-gray-500 mb-6">
                Jeste li sigurni da želite trajno obrisati CV <span className="font-semibold text-gray-700">"{cvToDelete.personal?.fullName || 'Bez naziva'}"</span>?
                Ova radnja je nepovratna.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setCvToDelete(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Otkaži
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
