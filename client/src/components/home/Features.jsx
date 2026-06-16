import React from 'react'
import { Zap } from "lucide-react";


const Features = () => {
  return (
    
      <div id="features">
        {/* Features Section */}

      
          <div className="flex justify-center mb-3 mt-20">
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100/60 border border-blue-100 rounded-full px-4 py-1.5 w-fit">
              <Zap width={14} className="text-blue-600" />
              <span className="font-medium">Jednostavnost</span>
            </div>
          </div>



          <div  className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
              Kako radi?
            </h2>
            <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
              Tri jednostavna koraka do posla iz snova            
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Kreirajte svoj CV</h3>
                <p className="text-slate-600">
                  Izradite svoj profesionalni CV koristeći naš intuitivni editor s prijedlozima zasnovanim na umjetnoj inteligenciji                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI analiza</h3>
                <p className="text-slate-600">
                  Naša umjetna inteligencija analizira vaše vještine, iskustvo i kvalifikacije kako bi razumjela vaš profil                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pronađite odgovarajuće poslove</h3>
                <p className="text-slate-600">
                  Primajte personalizirane preporuke za posao koje savršeno odgovaraju vašim kvalifikacijama
                </p>
              </div>
            </div>
          </div>
    </div>
  )
}

export default Features