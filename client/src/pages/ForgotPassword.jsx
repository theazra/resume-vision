import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import * as api from '../api/index';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await api.forgotPassword({ email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Nešto je pošlo po zlu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <Link to="/login" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition mb-6">
                        <ArrowLeft size={16} className="mr-2" />
                        Nazad na Prijavu
                    </Link>

                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                            <KeyRound size={32} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Zaboravljena Lozinka?</h2>
                    <p className="text-center text-slate-600 mb-8">
                        Ne brinite. Unesite svoju email adresu i poslat ćemo vam link za resetovanje lozinke.
                    </p>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Adresa</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="unesite@email.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Slanje...' : 'Pošalji Link'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
