import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import SkillRadarChart from './SkillRadarChart';

const SkillGapAnalysis = ({ analysis, jobTitle, onClose }) => {
    if (!analysis) return null;

    const { matchScore, matchedSkills, missingSkills, recommendations } = analysis;

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                    <XCircle className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Analiza nedostajućih vještina
                </h3>
                <p className="text-blue-100 text-sm mt-1">Usklađenost sa pozicijom: <span className="font-semibold text-white">{jobTitle}</span></p>
            </div>

            <div className="p-6 space-y-8">
                {/* Match Score */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-1 bg-gray-50 rounded-full mb-2">
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" strokeWidth="3" />
                                <circle
                                    cx="18" cy="18" r="16" fill="none"
                                    className={`stroke-current ${matchScore >= 70 ? 'text-green-500' : matchScore >= 40 ? 'text-amber-500' : 'text-red-500'}`}
                                    strokeWidth="3"
                                    strokeDasharray={`${matchScore}, 100`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 18 18)"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-800">{matchScore}%</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Match Score</p>
                    <div className="mt-4 w-full bg-gray-100 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-1000 ${matchScore >= 70 ? 'bg-green-500' : matchScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${matchScore}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-4 max-w-xs mx-auto italic">
                    </p>

                    <div className="mt-8 border-t pt-6">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2 justify-center mb-4">
                            <TrendingUp className="w-5 h-5 text-indigo-500" /> Vizuelna Analiza Usklađenosti
                        </h4>
                        <SkillRadarChart matchedSkills={matchedSkills} missingSkills={missingSkills} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matched Skills */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" /> Posjedujete ({matchedSkills.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {matchedSkills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 font-medium">
                                    {skill}
                                </span>
                            ))}
                            {matchedSkills.length === 0 && <p className="text-sm text-gray-400 italic">Nema direktnih poklapanja.</p>}
                        </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> Nedostaje ({missingSkills.length})
                        </h4>
                        <div className="space-y-2">
                            {missingSkills.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50 border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(item.priority)}`}>
                                        {item.priority}
                                    </span>
                                </div>
                            ))}
                            {missingSkills.length === 0 && <p className="text-sm text-gray-400 italic">Posjedujete sve ključne vještine!</p>}
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="space-y-4 border-t pt-6">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-500" /> AI Preporuke
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        {recommendations.map((rec, i) => (
                            <div key={i} className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-blue-800 leading-relaxed font-medium">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Zatvori
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SkillGapAnalysis;
