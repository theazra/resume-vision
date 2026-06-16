import React from 'react'
import { Link } from 'react-router-dom'


const CallToAction = () => {


  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  return (
    <div id='cta' className="w-full max-w-5xl mx-auto px-4 mt-20 mb-10">
      {/* Kontejner sa blagom pozadinom i okvirom */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12">

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Tekstualni dio */}
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              Pronađite posao koji <span className="text-[#4F7FF5]">odgovara vašim vještinama</span>
            </h2>

            <p className="text-gray-600 max-w-xl">
              Uz pomoć AI alata analiziramo vaš CV, otkrivamo prednosti i slabosti
              te preporučujemo idealne pozicije na osnovu vašeg profila.
            </p>
          </div>

          {/* Dugme sa bojom kao na slici */}
          <div className="md:w-1/3 flex justify-center md:justify-end">
            <Link to="/login" className="bg-[#4F7FF5] hover:bg-[#4070F4] text-white px-8 py-4 rounded-full flex items-center gap-3 transition-all shadow-lg">
              {/* SVG ikona rakete u bijeloj boji */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
              <span className="font-semibold">Počnite odmah</span>
            </Link>
          </div>

        </div>
      </div>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${showScrollTop
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16 pointer-events-none"
          }`}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>


  )
}

export default CallToAction