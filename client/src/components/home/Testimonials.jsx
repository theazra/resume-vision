import React from 'react';
import { BookOpen as BookUserIcon } from 'lucide-react';

const Testimonials = () => {
  const cardsData = [
    {
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
      name: 'Emina Mešić',
      handle: '@neilstellar',
      date: 'April 20, 2025',
      message: 'Uz ovaj alat dobila sam profesionalan CV za samo nekoliko minuta, a AI mi je odmah ponudio poslove koji savršeno odgovaraju mojim vještinama.'
    },
    {
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      name: 'Azra Karabegović',
      handle: '@averywrites',
      date: 'Maj 10, 2025',
      message: 'Nikada nisam mislio da će traženje posla biti ovako jednostavno. Sistem je preporučio poslove koje nisam ni znao da postoje!'
    },
    {
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
      name: 'Emrah Duraković',
      handle: '@jordantalks',
      date: 'Juni 5, 2025',
      message: 'Impresivno! CV je bio spreman za slanje za manje od 5 minuta, a dobio sam tri poziva za intervju u prvoj sedmici.'
    },
    {
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
      name: 'Aldin Hodžić',
      handle: '@liamsmith',
      date: 'Juli 12, 2025',
      message: 'AI preporuke su bile tačno ono što mi je trebalo. Pronašao sam savršenu poziciju koju nikada ne bih sam pronašao.'
    },
  ];

  const CreateCard = ({ card }) => (
    <div className="p-4 rounded-xl mx-2 shadow-md hover:shadow-lg transition-all duration-200 
                    w-60 sm:w-64 md:w-72 shrink-0 bg-white">
      <div className="flex gap-2">
        <img className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full" src={card.image} alt={card.name} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-medium text-sm sm:text-base">{card.name}</p>
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5" viewBox="0 0 16 16" fill="blue">
              <path fillRule="evenodd" d="M6 10.793l-3.146-3.147-.708.707L6 12.207l8-8-.708-.707-7.292 7.293z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm text-slate-500">{card.handle}</span>
        </div>
      </div>

      <p className="text-sm sm:text-base py-4 text-gray-800">
        {card.message}
      </p>

      <div className="flex items-center justify-between text-slate-500 text-xs sm:text-sm">
        <span>Objavljeno</span>
        <p>{card.date}</p>
      </div>
    </div>
  );

  return (
    <section id='testimonials' className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-20">
      {/* Header */}
      <div className="flex justify-center mb-3 mt-12">
        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100/60 border border-blue-100 rounded-full px-4 py-1.5 w-fit">
          <BookUserIcon width={14} className="text-blue-600" />
          <span className="font-medium">O nama</span>
        </div>
      </div>


      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          Korisnici o nama
        </h2>
        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
          Pridružite se hiljadama uspješnih tražitelja posla
        </p>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }
        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      {/* Row 1 */}
      <div className="marquee-row w-full mx-auto overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-linear-to-r from-white to-transparent pointer-events-none"></div>
        <div className="marquee-inner flex transform-gpu min-w-[200%] py-4 sm:py-5 md:py-6">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-linear-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default Testimonials;
