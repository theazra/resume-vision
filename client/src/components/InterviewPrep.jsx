import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, ShieldCheck, Download } from 'lucide-react';

const InterviewPrep = ({ questions, jobTitle }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    if (!questions || questions.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-8 animate-fade-in-up">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6" />
                        AI Priprema za Intervju
                    </h3>
                    <p className="text-purple-100 text-sm mt-1">Personalizovana pitanja za: <span className="font-semibold text-white">{jobTitle}</span></p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-white" />
                </div>
            </div>

            <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm italic mb-4">
                    Na osnovu vašeg CV-a i opisa posla, AI je generisao najvjerovatnija pitanja koja možete očekivati.
                </p>

                {questions.map((item, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md">
                        <button
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 text-left transition-colors"
                        >
                            <div className="flex gap-3 items-start">
                                <span className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.type === 'Technical' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {item.type}
                                </span>
                                <span className="font-semibold text-gray-800">{item.question}</span>
                            </div>
                            {expandedIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                        </button>

                        {expandedIndex === index && (
                            <div className="p-4 bg-white border-t border-gray-50 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex gap-3">
                                    <div className="mt-1 shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Savjet za odgovor</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed bg-purple-50 p-3 rounded-lg border border-purple-100">
                                            {item.hint}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    <p className="text-xs text-amber-700">
                        <strong>Pro Tip:</strong> Pripremite se koristeći STAR metodu (Situation, Task, Action, Result) za bihevioralna pitanja.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InterviewPrep;
