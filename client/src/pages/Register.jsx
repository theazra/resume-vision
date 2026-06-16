import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react';

const Registracija = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex h-screen w-full bg-slate-50">
            {/* Lijeva Dekoracija - sakriveno na mobilnom */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-[#3C8DFF] to-[#EAF4FF] relative overflow-hidden items-center justify-center">

                <div className="relative z-10 text-white max-w-md p-10">
                    <h1 className="text-5xl font-bold mb-6">Pridružite nam se danas</h1>
                    <p className="text-xl text-white">Započnite svoje putovanje ka boljoj karijeri sa našim AI-powered alatima.</p>
                </div>
                {/* Dekorativni krugovi */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
            </div>

            {/* Desna Forma */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                {/* Link za Nazad */}
                <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 transition flex items-center gap-2">
                    &larr; Nazad na Početnu
                </Link>

                <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                            <UserPlus size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800">Kreirajte Račun</h2>
                        <p className="text-slate-500 mt-2">Počnite besplatno</p>
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
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="marko@primjer.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Lozinka</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                            <p className="text-xs text-slate-400 mt-2">Mora imati najmanje 8 karaktera</p>
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group">
                            Kreirajte Račun
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-600">
                        Već imate račun?
                        <Link to="/login" className="ml-1 text-indigo-600 font-medium hover:underline">Prijavite se</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registracija;