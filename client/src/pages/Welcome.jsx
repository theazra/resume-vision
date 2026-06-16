import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, FileSearch, ArrowRight } from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Dobrodošli u ResumeVision</h1>
                    <p className="text-xl text-gray-600">Kako želite nastaviti danas?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1: Create New CV */}
                    <div
                        onClick={() => navigate('/app/builder/new')}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer group"
                    >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <FilePlus size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Kreiraj Novi CV</h2>
                        <p className="text-gray-500 mb-6">Napravi profesionalnu biografiju od nule koristeći naš pametni kreator.</p>
                        <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                            Započni <ArrowRight size={18} className="ml-2" />
                        </div>
                    </div>

                    {/* Card 2: Scan Existing CV */}
                    <div
                        onClick={() => navigate('/app/dashboard')}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all cursor-pointer group"
                    >
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                            <FileSearch size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Skeniraj Postojeći CV</h2>
                        <p className="text-gray-500 mb-6">Učitaj svoj trenutni CV za detaljnu AI analizu i savjete za poboljšanje.</p>
                        <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                            Nastavi <ArrowRight size={18} className="ml-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
