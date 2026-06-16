import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react';

const Prijava = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Lijeva Dekoracija - sakriveno na mobilnom */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-[#3C8DFF] to-[#EAF4FF] relative overflow-hidden items-center justify-center">

        <div className="relative z-10 text-white max-w-md p-10">
          <h1 className="text-5xl font-bold mb-6">Dobrodošli nazad!</h1>
          <p className="text-xl text-white">Pristupite svom kontrolnom panelu kako biste nastavili sa kreiranjem profesionalnog CV-a i pronalaženjem posla iz snova.</p>
        </div>
        {/* Dekorativni krugovi */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      {/* Desna Forma */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Link za Nazad */}
        <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 transition flex items-center gap-2">
          &larr; Nazad na Početnu
        </Link>

        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <User size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Prijavite se</h2>
            <p className="text-slate-500 mt-2">Unesite svoje podatke za pristup računu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="email">Email Adresa</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="marko@primjer.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Lozinka</label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">Zaboravili ste lozinku?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group">
              Prijavite se
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center text-slate-600">
            Nemate račun?
            <Link to="/register" className="ml-1 text-blue-600 font-medium hover:underline">Registrujte se sada</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prijava;