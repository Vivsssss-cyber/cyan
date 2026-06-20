import React, { useState } from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { PageTransition } from './PageTransition';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import imgBarista from '../../assets/75adf614b8712bb3f1cd560c4243486363fb60c3.png';

const slides = [
  {
    title: 'Welcome to Your Restaurant Startup',
    bullets: [
      'You are the founder-management team of a restaurant startup',
      'Make strategic decisions over 3-5 simulated years',
      'Balance growth ambitions with operational realities',
      'Learn real business trade-offs in a risk-free environment',
    ],
  },
  {
    title: 'How the Market Works',
    bullets: [
      'Your restaurant serves Premium and Regular customers',
      'Each location has a shared demand pool across all teams',
      'Your marketing and positioning determine your market capture',
      'Competitor actions directly impact your demand',
    ],
  },
  {
    title: 'Understanding Capacity',
    bullets: [
      'Floor space determines max customers served simultaneously',
      'Capacity = Floor Area / 25 sq ft per customer',
      'Excess demand means lost revenue you cannot recover',
      'Plan your space based on expected footfall',
    ],
  },
  {
    title: 'Competition & Market Share',
    bullets: [
      'All teams share the same market pool in each location',
      'Increased marketing spend captures more shared demand',
      'Market share is anonymised — visible as relative positions',
      'Location-specific competition pressure affects results',
    ],
  },
  {
    title: 'Key Terms to Know',
    bullets: [
      'AOV: Average Order Value — revenue per customer transaction',
      'Runway: Weeks of cash remaining at current burn rate',
      'Retention Rate: % of customers who return next week',
      'Burn Rate: Weekly cash outflow from all operating costs',
    ],
  },
];

export function WelcomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useAppNavigate();
  const slide = slides[currentSlide];
  const totalSlides = slides.length;

  const goNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(c => c + 1);
    } else {
      navigate('/setup/location');
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  return (
    <GridBackground className="flex flex-col items-center justify-center">
      <PageTransition>
      <div className="w-full max-w-[1288px] mx-auto px-6 flex flex-col items-center justify-center min-h-screen">
        {/* Main card */}
        <div className="relative w-full bg-white/60 rounded-2xl border border-white shadow-[0px_2.5px_10px_0px_rgba(255,255,255,0)] overflow-hidden">
          {/* Close button */}
          <button className="absolute top-6 right-6 z-20 text-[#606569] hover:text-[#202326] transition-colors">
            <X size={24} />
          </button>

          {/* Header inside card */}
          <div className="flex items-center justify-between px-8 pt-8 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7">
                <svg className="w-full h-full" fill="none" viewBox="0 0 32 32">
                  <path d="M16 1L31 9V23L16 31L1 23V9L16 1Z" fill="none" stroke="#202326" strokeWidth="1.5" />
                  <text x="16" y="20" textAnchor="middle" fill="#202326" style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Inter' }}>SV</text>
                </svg>
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px', color: '#202326', letterSpacing: '-0.24px' }}>
                Start Up Valley
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>Role:</span>
              <div className="bg-[#fafafa] flex items-center gap-2 px-3 py-1.5 rounded-full shadow-[0px_0px_0px_0px_#e1e4eb,0px_3px_8px_0px_rgba(0,0,0,0.06)]">
                <span className="text-[#0f172b]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px' }}>
                  Restaurant Owner
                </span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="#000" strokeWidth="1.2" />
                  <path d="M2 14C2 11 5 9 8 9C11 9 14 11 14 14" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#e5e7eb] mx-8" />

          {/* Content area */}
          <div className="flex items-start gap-8 px-8 py-10">
            {/* Left: text content */}
            <div className="flex-1 min-w-0">
              <h2
                className="text-[#202326] mb-6"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '28px', letterSpacing: '-0.28px', lineHeight: 1.3 }}
              >
                {slide.title}
              </h2>
              <ul className="space-y-4">
                {slide.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#202326] shrink-0" />
                    <span
                      className="text-[#404346]"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', lineHeight: 1.6 }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: illustration */}
            <div className="w-[340px] h-[240px] rounded-xl overflow-hidden shrink-0 border border-[#e5e7eb] bg-white">
              <img
                src={imgBarista.src}
                alt="Restaurant illustration"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 pb-8">
            <button
              onClick={goPrev}
              disabled={currentSlide === 0}
              className={`w-8 h-8 rounded-full border border-[#d1d5db] flex items-center justify-center transition-all ${
                currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f3f4f6] cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} className="text-[#606569]" />
            </button>

            <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              Slide {currentSlide + 1} of {totalSlides}
            </span>

            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? 'bg-[#202326] scale-125' : 'bg-[#c4c4c4]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="w-8 h-8 rounded-full border border-[#d1d5db] flex items-center justify-center hover:bg-[#f3f4f6] transition-all cursor-pointer"
            >
              <ChevronRight size={16} className="text-[#606569]" />
            </button>
          </div>
        </div>

        {/* Start button below card */}
        {currentSlide === totalSlides - 1 && (
          <button
            onClick={() => navigate('/setup/location')}
            className="mt-6 relative rounded-[46px] overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            style={{
              backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 853 56\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"1\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(0.0000059396 8 -120.81 -4.2396 426.5 -21)\"><stop stop-color=\"rgba(0,95,88,1)\" offset=\"0\"/><stop stop-color=\"rgba(0,60,73,1)\" offset=\"1\"/></radialGradient></defs></svg>')",
              backgroundSize: '100% 100%',
            }}
          >
            <div className="flex items-center justify-center gap-2 px-12 py-3.5">
              <span className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px' }}>
                Start Your Business
              </span>
              <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5H11M11 5L7 1M11 5L7 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-[-1px] pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_8px_1px_rgba(20,20,20,0.5)]" />
            <div className="absolute border border-[#0e3a3e] inset-[-1px] pointer-events-none rounded-[47px]" />
          </button>
        )}
      </div>
      </PageTransition>
    </GridBackground>
  );
}
