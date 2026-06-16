import React from 'react'
import { Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';

const Hero = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const logos = [
    'https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg',
    'https://saasly.prebuiltui.com/assets/companies-logo/framer.svg',
    'https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg',
    'https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg',
    'https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg',
  ];

  return (
    <>
      <div id='hero' className="relative pb-64 bg-linear-to-b from-white to-blue-50 rounded-b-[120px]">

        {/* Glowy background blob - positioned behind everything */}
        <div className="absolute inset-x-0 top-1/3 z-0 flex justify-center pointer-events-none">
          <div className="w-96 h-96 xl:w-[520px] xl:h-[520px] bg-blue-400 blur-[120px] opacity-40"></div>
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between w-full py-0 px-6 md:px-12 lg:px-20 xl:px-32 text-sm">
          <a href="/">
            <img src="/ress.png" className="h-16 w-auto object-contain" alt='logo' />
          </a>

          <div className="hidden md:flex items-center gap-8 text-slate-800 transition duration-500">
            <a href="#" className="hover:text-blue-600 transition">Početna</a>
            <a href="#features" className="hover:text-blue-600 transition">Funkcije</a>
            <a href="#testimonials" className="hover:text-blue-600 transition">Iskustva</a>
          </div>

          <div className="flex gap-2">
            <Link to='/login'
              className="hidden md:block px-6 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all rounded-full text-white"
            >
              Početak
            </Link>
            <Link to='/login'
              className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900"
            >
              Login
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden active:scale-90 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-50 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <a href="#" className="text-white">Home</a>
          <a href="#features" className="text-white">Features</a>
          <a href="#testimonials" className="text-white">Testimonials</a>
          <button
            onClick={() => setMenuOpen(false)}
            className="shadow-lg shadow-blue-400/50 active:ring-4 active:ring-white ring-offset-2 aspect-square p-1 items-center justify-center bg-blue-600 hover:bg-blue-700 transition text-white rounded-md flex"
          >
            X
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center text-sm mt-20 px-4 md:px-16 lg:px-24 xl:px-40 text-black">

          {/* Avatars + Stars */}
          <div className="flex items-center mt-24">
            <div className="flex -space-x-3 pr-3">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="" className="w-8 h-8 object-cover rounded-full border-2 border-white transform transition-transform duration-300 hover:-translate-y-2" />
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="" className="w-8 h-8 object-cover rounded-full border-2 border-white transform transition-transform duration-300 hover:-translate-y-2" />
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="" className="w-8 h-8 object-cover rounded-full border-2 border-white transform transition-transform duration-300 hover:-translate-y-2" />
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="" className="w-8 h-8 object-cover rounded-full border-2 border-white transform transition-transform duration-300 hover:-translate-y-2" />
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white transform transition-transform duration-300 hover:-translate-y-2" />
            </div>

            <div>
              <div className="flex ">
                {Array(5).fill(0).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="text-transparent fill-blue-500"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700">
                10,000+ zadovoljnih korisnika
              </p>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]">
            Pronađi savršen posao uz
            <br />
            <span
              className="text-transparent"
              style={{
                background: 'linear-gradient(to right, #1e40af, #3b82f6)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            >
              AI
            </span>{' '}
            alate.
          </h1>

          <p className="max-w-md text-center text-base my-7">
            Kreiraj CV, analiziraj ga i otkrij poslove koji ti najbolje odgovaraju.          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link to='/login'
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-blue-400 flex items-center transition-colors"
            >
              Početak
            </Link>

            <button className="flex items-center gap-2 border border-slate-400 hover:bg-blue-50 transition rounded-full px-7 h-12 text-slate-700">
              <span>Demo</span>
            </button>
          </div>
        </div>

      </div>

    </>
  );
};

export default Hero;