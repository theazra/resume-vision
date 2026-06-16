import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

const SkillRadarChart = ({ matchedSkills, missingSkills }) => {
    // Combine skills for the chart axes
    const data = [
        ...matchedSkills.map(skill => ({
            subject: skill,
            current: 100,
            required: 100,
            fullMark: 100
        })),
        ...missingSkills.map(item => ({
            subject: item.skill,
            current: 20, // Low value for missing
            required: 100,
            fullMark: 100
        }))
    ].slice(0, 8); // Limit to 8 for readability

    if (data.length < 3) return null; // Radar chart needs at least 3 axes

    return (
        <div className="w-full h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Zahtjevi Posla"
                        dataKey="required"
                        stroke="#9ca3af" // Stronger grey for the border
                        fill="#cbd5e1" // Stronger grey for fill
                        fillOpacity={0.4}
                    />
                    <Radar
                        name="Vaš Profil"
                        dataKey="current"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        fillOpacity={0.7}
                    />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillRadarChart;
