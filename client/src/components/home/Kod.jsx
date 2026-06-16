import React from 'react'
import { Lightbulb } from "lucide-react";


const Kod = () => {
    const [isHover, setIsHover] = React.useState(false);

    return (
        <>

            <div className="flex justify-center mb-3 mt-20">
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100/60 border border-blue-100 rounded-full px-4 py-1.5 w-fit">

                    <Lightbulb width={14} className="text-blue-600" />
                    <span className="font-medium">Efikasnost</span>

                </div>
            </div>



            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
                    Zašto se koristi?
                </h2>
                <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
                    Pametan CV. Pametniji poslovi. Jedna platforma
                </p>
            </div>


            <div className="flex flex-col md:flex-row items-center justify-center mt-10 gap-8">

                {/* Slika */}
                <img
                    className="w-full max-w-md md:max-w-lg xl:max-w-xl object-contain"
                    src="/poc.png"
                    alt="Opis slike"
                />

                {/* Kartice */}
                <div
                    className="px-4 md:px-0 flex flex-col gap-6"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className={`p-6 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300 flex gap-4 rounded-xl transition-colors ${!isHover ? 'border-violet-300 bg-violet-100' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-violet-600">
                                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                            </svg>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">AI CV Analiza</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Automatski skeniraj postojeći CV i dobij detaljnu analizu mana, nedostajućih vještina i savjete za poboljšanje.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-6 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 flex gap-4 rounded-xl transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-green-600">
                                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                            </svg>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Asistent za kreiranje CV-a</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Kreiraj profesionalan CV za nekoliko minuta uz AI prijedloge sadržaja prilagođene tvom iskustvu i industriji.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
                            <svg className="size-6 stroke-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 15V3" />
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <path d="m7 10 5 5 5-5" />
                            </svg>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Personalizovana preporuka poslova i brza prijava</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Na osnovu tvog CV-a preporučujemo trenutno aktuelne poslove i omogućavamo brzu prijavu direktno sa platforme.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Font i globalni stil */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </>
    );
};

export default Kod;
