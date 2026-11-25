import React, { useState } from 'react';
import { BuildingId, WorkspaceLaunchOptions } from '../types/navigation';

interface LandingPageProps {
  onOpenBuilding: (building: BuildingId, options?: WorkspaceLaunchOptions) => void;
}

interface FaqEntry {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqEntry[] = [
  {
    question: 'What is Navique?',
    answer:
      'Navique is a next-generation intelligent indoor navigation platform designed to help visitors explore complex buildings like shopping malls, multi-specialty hospitals, and transport terminals through interactive multi-floor maps, search, turn-by-turn guidance, and life-saving emergency evacuation routes.',
  },
  {
    question: 'How do I use Navique?',
    answer:
      'Simply choose your building from the directory or scan an on-site QR checkpoint. You can search for specific shops or departments, select your desired destination, and follow clear highlighted paths across single or multiple floors.',
  },
  {
    question: 'Can I explore different floors?',
    answer:
      'Yes! Navique supports full multi-floor exploration. You can switch effortlessly between Ground Floor (GF), First Floor (1F), Second Floor (2F), and Third Floor (3F) to inspect every clinic, store, lift, escalator, and amenity.',
  },
  {
    question: 'Which buildings can I explore?',
    answer:
      'You can explore our interactive demos for both a four-floor Shopping Mall and City Care Hospital. Each environment has its own dedicated floor maps, directory, corridor network, and emergency scenarios.',
  },
  {
    question: 'Does Navique support wheelchair-friendly navigation?',
    answer:
      'Absolutely. Inclusivity is at our core. Enabling Wheelchair-Friendly Mode recalculates routes to avoid all stairs and escalators, exclusively routing visitors through accessible lifts and step-free corridors.',
  },
  {
    question: 'Which languages are supported?',
    answer:
      'Navique natively supports English, Telugu, and Hindi for interface labels, floor names, place details, turn-by-turn navigation instructions, emergency alerts, and AI assistant conversations.',
  },
  {
    question: 'How does Emergency Navigation work?',
    answer:
      'When triggered in Emergency Mode, Navique displays active prototype alerts and danger zones, avoids blocked or unsafe pathways, calculates a safe route to the nearest available emergency exit, and provides a simulated SOS assistance request.',
  },
  {
    question: 'Do I need to create an account to use Navique?',
    answer:
      'No account creation or app installation is required. Navique runs instantly in any mobile or desktop web browser with zero friction.',
  },
  {
    question: 'What is the AI Navigation Assistant?',
    answer:
      'The AI assistant is your personal indoor concierge. You can ask questions like "Where is the pharmacy?", "Which floor has Cardiology?", or "Where is the nearest emergency exit?" and receive accurate building-specific directions in your chosen language.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenBuilding }) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-[#111111]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fbf8f3]/95 backdrop-blur-md border-b border-brand-borderWarm/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a className="flex items-center gap-3 group" href="#top">
            <div className="w-10 h-10 rounded-full bg-brand-maroon flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif-heading text-2xl font-bold tracking-tight text-neutral-900 leading-none">
                Navique
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-maroon mt-1">
                Indoor Intelligence
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-700">
            <a className="hover:text-brand-maroon transition-colors whitespace-nowrap" href="#about">
              About
            </a>
            <a className="hover:text-brand-maroon transition-colors whitespace-nowrap" href="#features">
              Features
            </a>
            <a className="hover:text-brand-maroon transition-colors whitespace-nowrap" href="#benefits">
              Benefits
            </a>
            <a className="hover:text-brand-maroon transition-colors whitespace-nowrap" href="#demos">
              Live Demos
            </a>
            <a className="hover:text-brand-maroon transition-colors whitespace-nowrap" href="#safety">
              Safety SOS
            </a>
            <a className="hover:text-brand-maroon transition-colors whitespace-nowrap" href="#faqs">
              FAQs
            </a>
          </nav>

          {/* Primary Action CTA Button */}
          <div className="flex items-center gap-3">
            <a
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-brand-maroon hover:bg-brand-maroonHover transition-all shadow hover:shadow-md active:scale-95 whitespace-nowrap"
              href="#demos"
            >
              Explore Navique
            </a>
          </div>
        </div>
      </header>
      <main id="top">
        {/* Hero */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-[#fbf8f3]">
          <div className="absolute left-8 top-12 opacity-40 select-none pointer-events-none hidden lg:block">
            <svg fill="none" height="48" stroke="#741046" strokeWidth="1.5" viewBox="0 0 48 48" width="48">
              <path d="M12 24 C12 16, 24 16, 24 24 C24 32, 36 32, 36 24" />
            </svg>
          </div>
          <div className="absolute right-16 top-16 opacity-30 select-none pointer-events-none hidden lg:block">
            <svg fill="#741046" height="32" viewBox="0 0 24 24" width="32">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <div className="absolute left-16 top-20 opacity-35 select-none pointer-events-none hidden lg:block">
            <svg className="w-4 h-4" fill="#741046" height="18" viewBox="0 0 24 24" width="18">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <div className="absolute right-24 top-24 opacity-25 select-none pointer-events-none hidden lg:block">
            <svg className="w-3 h-3" fill="#741046" height="14" viewBox="0 0 24 24" width="14">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 leading-[1.12] mb-6">
              Navigate Every Space.
              <br />
              <span className="italic font-normal">Find Your Way</span> with Confidence.
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-700 leading-relaxed font-normal mb-10">
              Explore complex multi-storey buildings with intelligent indoor navigation. Discover destinations, effortlessly traverse multi-floor architectures, and discover accessible, safe routes with Navique.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide text-white bg-brand-maroon hover:bg-brand-maroonHover transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                href="#demos"
              >
                <span>Explore Navique</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </a>
              <a
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide text-neutral-900 border border-neutral-300 hover:border-neutral-800 bg-white/50 hover:bg-white transition-all active:scale-95"
                href="#features"
              >
                Discover Features
              </a>
            </div>

            <div className="mt-12 flex justify-center items-center opacity-85">
              <svg fill="none" height="24" stroke="#741046" strokeLinecap="round" strokeWidth="2" viewBox="0 0 220 24" width="180">
                <path d="M5 12 Q 35 2 65 12 T 125 12 T 185 12 T 215 12" />
              </svg>
            </div>
          </div>
        </section>
        {/* Venue Highlights */}
        <section className="bg-black py-7 px-4 border-y border-neutral-800">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-center text-xs tracking-widest uppercase text-neutral-400 font-semibold mb-6">
              Trusted Across Premier Multi-Floor Venues
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <button
                  type="button"
                  onClick={() => onOpenBuilding('hospital')}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-neutral-200 hover:text-white hover:border-neutral-500 transition-all text-xs sm:text-sm font-medium tracking-wide cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-teal" />
                  <span>City General Hospital</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenBuilding('mall')}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-neutral-200 hover:text-white hover:border-neutral-500 transition-all text-xs sm:text-sm font-medium tracking-wide cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-maroon" />
                  <span>Grand Galleria Malls</span>
                </button>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-neutral-200 text-xs sm:text-sm font-medium tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Central Metro Terminals</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-neutral-200 text-xs sm:text-sm font-medium tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>International Airport Hubs</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-neutral-200 text-xs sm:text-sm font-medium tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Apex Convention Complex</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* How It Works */}
        <section className="py-24 bg-[#fbf8f3]" id="about">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950 mb-4">
                Getting around is simple.
                <br />
                We make it effortless.
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base">
                Navique strips away the confusion of maze-like indoor public spaces with three intuitive steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="text-center px-6 py-8 rounded-2xl bg-white/60 border border-brand-borderLight shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-cream border border-brand-borderWarm flex items-center justify-center text-brand-maroon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-neutral-900 mb-2">
                  1. Choose Your Building
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Explore complex indoor environments through interactive multi-floor maps tailored to any venue.
                </p>
              </div>

              <div className="text-center px-6 py-8 rounded-2xl bg-white/60 border border-brand-borderLight shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-cream border border-brand-borderWarm flex items-center justify-center text-brand-maroon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-neutral-900 mb-2">
                  2. Find &amp; Select Destination
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Search stores, emergency rooms, labs, food joints, or restrooms with our lightning-fast smart directory.
                </p>
              </div>

              <div className="text-center px-6 py-8 rounded-2xl bg-white/60 border border-brand-borderLight shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-cream border border-brand-borderWarm flex items-center justify-center text-brand-maroon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-neutral-900 mb-2">
                  3. Follow Your Route
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Receive step-by-step visual guidance with custom filters for step-free and elevator access paths.
                </p>
              </div>
            </div>

            <div className="relative max-w-3xl mx-auto bg-brand-creambg/90 border border-brand-borderWarm p-8 sm:p-12 rounded-3xl text-center shadow-sm">
              <div className="absolute -left-3 top-6 opacity-30 select-none hidden sm:block">
                <svg height="40" stroke="#111" strokeWidth="2" viewBox="0 0 50 50" width="40">
                  <line x1="5" x2="35" y1="10" y2="40" />
                  <line x1="15" x2="45" y1="10" y2="40" />
                  <line x1="25" x2="55" y1="10" y2="40" />
                </svg>
              </div>
              <div className="text-brand-maroon font-serif text-5xl font-bold leading-none mb-3">“</div>
              <blockquote className="font-serif-heading text-xl sm:text-2xl md:text-3xl text-neutral-900 italic font-medium leading-relaxed mb-2">
                “Navique transforms complex indoor mazes into intuitive 3D journeys, bringing clarity, accessibility, and emergency peace of mind to every visitor.”
              </blockquote>
            </div>
          </div>
        </section>
        {/* Core Capabilities */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="features">
          <div className="bg-brand-teal rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-neutral-950 relative overflow-hidden shadow-xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-14 text-white">
              <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Features you&apos;ll love <span className="inline-block ml-2 text-brand-cream/90">✦</span>
              </h2>
              <p className="text-teal-50 text-sm sm:text-base leading-relaxed">
                Making indoor navigation smarter, simpler, and safer for hospitals, malls, and bustling public transit hubs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Floating Assistant Preview Card */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-100 flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
                  <div className="w-12 h-12 rounded-full bg-brand-maroon/10 text-brand-maroon flex items-center justify-center font-bold text-lg">
                    AI
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-900">Navique Smart Assistant</h4>
                    <p className="text-xs text-neutral-500 font-medium">Real-time Multilingual Concierge</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 font-sans text-xs sm:text-sm">
                  <div className="bg-neutral-100 text-neutral-700 p-3.5 rounded-2xl rounded-tl-sm max-w-[85%]">
                    “Where is the nearest elevator and accessible restroom on the 2nd floor?”
                  </div>
                  <div className="bg-brand-maroon/10 text-brand-maroon p-3.5 rounded-2xl rounded-tr-sm max-w-[90%] ml-auto text-right font-medium">
                    “Lifts (A) are 24m ahead along the West corridor. Step-free accessible restrooms are right next to Kids Play Zone.”
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenBuilding('hospital', { openAssistant: true })}
                  className="w-full p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="text-xs text-neutral-600 font-medium">
                    Try asking: &quot;Guide me to Paediatrics&quot;
                  </span>
                  <span className="text-brand-maroon font-semibold text-xs whitespace-nowrap">
                    Quick Ask →
                  </span>
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-6">
                  <span className="w-2 h-2 rounded-full bg-brand-teal" />
                  <span className="w-2 h-2 rounded-full bg-neutral-300" />
                  <span className="w-2 h-2 rounded-full bg-neutral-300" />
                </div>
              </div>

              {/* Right: Key feature points */}
              <div className="lg:col-span-6 space-y-6 text-white">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all hover:bg-white/15">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-brand-teal flex items-center justify-center shrink-0 shadow">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">Interactive 3D Building Maps &amp; Multi-Floor Views</h4>
                      <p className="text-teal-50 text-xs sm:text-sm leading-relaxed">
                        Inspect every floor across malls and hospitals with interactive markers, corridor routing, zoom controls, and emergency exits.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all hover:bg-white/15">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-brand-teal flex items-center justify-center shrink-0 shadow">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" strokeWidth="2" />
                        <path d="M12 7v5l3 3" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">Wheelchair-Friendly Routes (Step-Free)</h4>
                      <p className="text-teal-50 text-xs sm:text-sm leading-relaxed">
                        Dedicated accessibility engine that filters out stairs and escalators, automatically prioritizing accessible lifts and wide corridors.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all hover:bg-white/15">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-brand-teal flex items-center justify-center shrink-0 shadow">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">Multilingual Support: English, Telugu &amp; Hindi</h4>
                      <p className="text-teal-50 text-xs sm:text-sm leading-relaxed">
                        Native localization ensuring visitors comfortably read directions, emergency alerts, place details, and AI responses in their language.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Benefits */}
        <section className="py-24 bg-[#fbf8f3]" id="benefits">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950 mb-4">
                Everything you need to navigate smarter
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base">
                Navique combines architectural building exploration, routing intelligence, accessibility, and emergency assistance in one unified platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 p-8 rounded-2xl border border-brand-borderLight text-center hover:border-brand-maroon/30 transition-all hover:shadow-lg group">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-cream flex items-center justify-center text-brand-maroon group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-neutral-900 mb-2">Interactive 3D Maps</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Explore detailed high-fidelity structural layouts across interconnected floors with zoom, pan, and clickable markers.
                </p>
              </div>

              <div className="bg-white/80 p-8 rounded-2xl border border-brand-borderLight text-center hover:border-brand-maroon/30 transition-all hover:shadow-lg group">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-cream flex items-center justify-center text-brand-maroon group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-neutral-900 mb-2">Multi-Floor Transitions</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Switch smoothly across GF, 1F, 2F, and 3F with clear corridor paths linking lifts, escalators, and stairwells.
                </p>
              </div>

              <div className="bg-white/80 p-8 rounded-2xl border border-brand-borderLight text-center hover:border-brand-maroon/30 transition-all hover:shadow-lg group">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-cream flex items-center justify-center text-brand-maroon group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-neutral-900 mb-2">Smart Place Search</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Instantly locate shops, clinics, ATMs, food court counters, washrooms, and service booths with live autocomplete.
                </p>
              </div>

              <div className="bg-white/80 p-8 rounded-2xl border border-brand-borderLight text-center hover:border-brand-maroon/30 transition-all hover:shadow-lg group">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-cream flex items-center justify-center text-brand-maroon group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-neutral-900 mb-2">Intelligent Route Guidance</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Graph-calculated walkable pathways with walking minutes, distance metrics, and floor transition prompts.
                </p>
              </div>

              <div className="bg-white/80 p-8 rounded-2xl border border-brand-borderLight text-center hover:border-brand-maroon/30 transition-all hover:shadow-lg group">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-cream flex items-center justify-center text-brand-maroon group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-neutral-900 mb-2">Wheelchair-Friendly Routes</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Zero-stair guarantee. Automatically prioritizes wide corridors, step-free paths, and spacious elevator bays.
                </p>
              </div>

              <div className="bg-white/80 p-8 rounded-2xl border border-brand-borderLight text-center hover:border-brand-maroon/30 transition-all hover:shadow-lg group">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-cream flex items-center justify-center text-brand-maroon group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-neutral-900 mb-2">Multilingual Support</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Effortlessly toggle interface labels, directions, and AI guidance across English, Telugu, and Hindi seamlessly.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Interactive Demos */}
        <section className="py-24 bg-[#faf6ee] border-y border-brand-borderWarm" id="demos">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center justify-center gap-3 text-brand-maroon text-lg mb-3 tracking-widest select-none opacity-90">
                <span>✦</span>
                <span className="text-xs opacity-60">◆</span>
                <span>✦</span>
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950 mb-4">
                Explore Navique in Action
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base">
                Experience how Navique transforms complex building navigation across diverse environments. Select an interactive showcase below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Mall Showcase Card */}
              <div className="bg-white rounded-3xl p-8 border border-brand-borderWarm shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Multi-Floor Retail
                    </span>
                    <span className="text-xs font-mono text-neutral-500">4 Floors · GF to 3F</span>
                  </div>
                  <h3 className="font-serif-heading text-2xl font-bold text-neutral-950 mb-3">
                    Shopping Mall Navigation
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    Effortless retail wayfinding across multi-level shopping centers. Seamlessly discover fashion brands, dining zones, cinema screens, and accessible lifts.
                  </p>
                  <div className="space-y-2.5 mb-8">
                    <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-800 shrink-0">3rd Floor</span>
                      <span className="text-neutral-700 font-medium text-right">
                        Multiplex Cinema, Food Court &amp; Barbeque Nation
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-800 shrink-0">2nd Floor</span>
                      <span className="text-neutral-700 font-medium text-right">
                        Apple Store, Croma, Bowling Zone &amp; VR Arcade
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-800 shrink-0">1st Floor</span>
                      <span className="text-neutral-700 font-medium text-right">
                        Zara, H&amp;M, Shoppers Stop, Nike &amp; Puma
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-800 shrink-0">Ground Floor</span>
                      <span className="text-neutral-700 font-medium text-right">
                        Zudio, Reliance Smart Bazaar, Apollo Pharmacy &amp; Starbucks
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBuilding('mall')}
                  className="w-full py-3.5 rounded-full text-sm font-semibold tracking-wide text-white bg-brand-maroon hover:bg-brand-maroonHover active:scale-95 transition-all flex items-center justify-center gap-2 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-maroon cursor-pointer"
                >
                  <span>Explore Shopping Mall</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              {/* Hospital Showcase Card */}
              <div className="bg-white rounded-3xl p-8 border border-brand-borderWarm shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Healthcare Campus
                    </span>
                    <span className="text-xs font-mono text-neutral-500">4 Levels · GF to 3F</span>
                  </div>
                  <h3 className="font-serif-heading text-2xl font-bold text-neutral-950 mb-3">
                    City Hospital Navigation
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    Stress-free medical wayfinding across multi-wing healthcare complexes. Rapidly reach speciality clinics, diagnostic imaging suites, surgical floors, and triage care.
                  </p>
                  <div className="space-y-2.5 mb-8">
                    <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-800 shrink-0">3rd Floor</span>
                      <span className="text-neutral-700 font-medium text-right">
                        Operation Theatres (OT 1 &amp; OT 3), ICU &amp; Maternity
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-800 shrink-0">2nd Floor</span>
                      <span className="text-neutral-700 font-medium text-right">
                        MRI, CT Scan, X-Ray, Pathology &amp; Dialysis Unit
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-800 shrink-0">1st Floor</span>
                      <span className="text-neutral-700 font-medium text-right">
                        Cardiology, Neurology, Orthopaedics &amp; Paediatrics
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-800 shrink-0">Ground Floor</span>
                      <span className="text-neutral-700 font-medium text-right">
                        Emergency Wing, Trauma Care, 24/7 Pharmacy &amp; Labs
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBuilding('hospital')}
                  className="w-full py-3.5 rounded-full text-sm font-semibold tracking-wide text-white bg-neutral-950 hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-700 cursor-pointer"
                >
                  <span>Explore Hospital</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* Platform Capabilities */}
        <section className="py-20 bg-[#fbf8f3]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                Departments, amenities, facilities and so much more!
              </h2>
            </div>
            <div className="bg-white rounded-2xl border border-brand-borderLight overflow-hidden shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-brand-borderLight text-xs sm:text-sm font-medium text-neutral-800">
                {[
                  'Retail & Boutiques',
                  'Emergency Rooms (ER)',
                  'Food Courts & Cafes',
                  'Diagnostic Labs & X-Ray',
                  'ATMs & Currency Exchange',
                  'Wheelchair Ramps & Lifts',
                  'Escalator & Stairwells',
                  'Car Parking Zones',
                  'Information & Help Desks',
                  '24/7 Medical Pharmacy',
                  'Cinema & Auditorium Halls',
                  'Safe Fire Exits & Assembly',
                ].map((label) => (
                  <div key={label} className="p-4 sm:p-5 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-maroon shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Safety & Emergency */}
        <section className="py-24 bg-[#faf6ee] border-t border-brand-borderWarm relative" id="safety">
          <div className="absolute left-6 top-16 opacity-30 select-none hidden lg:block">
            <svg fill="none" height="40" stroke="#741046" strokeWidth="2" viewBox="0 0 24 24" width="40">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-3">
                !
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950 mb-4">
                Your Safety Comes First
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base">
                During critical emergencies, finding the nearest safe exit matters most. Prototype intelligent evacuation demonstrations when every second counts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-12">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl p-8 border border-brand-borderWarm shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-600">
                    Emergency Tool
                  </span>
                  <h3 className="font-serif-heading text-2xl font-bold text-neutral-900 mt-2 mb-1">
                    Emergency Mode &amp; SOS
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium mt-1 mb-6">
                    Instant one-tap prototype safety dispatch
                  </p>
                  <div className="text-3xl font-serif-heading font-bold text-neutral-900 mb-6 pb-6 border-b border-neutral-100">
                    1-Tap <span className="text-xs font-semibold text-neutral-700 ml-1.5 font-sans">demo mode</span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 mb-8">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Active emergency scenario alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Simulated SOS assistance request
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Current floor &amp; zone location tagging
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Multilingual evacuation guidance
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBuilding('mall', { emergency: true, openSOS: true })}
                  className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                >
                  Activate SOS Mode
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-3xl p-8 border-2 border-brand-maroon shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow whitespace-nowrap">
                  Core Life Safety
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-maroon">
                    Dynamic Routing
                  </span>
                  <h3 className="font-serif-heading text-2xl font-bold text-neutral-900 mt-2 mb-1">
                    Safe Exit Finder
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium mt-1 mb-6">
                    Autonomous hazard avoidance routing
                  </p>
                  <div className="text-3xl font-serif-heading font-bold text-brand-maroon mb-6 pb-6 border-b border-neutral-100">
                    Real-Time{' '}
                    <span className="text-xs font-semibold text-neutral-700 ml-1.5 font-sans">re-routing</span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-neutral-700 mb-8 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="text-brand-maroon">★</span> Automated evacuation path generator
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-maroon">★</span> Bypasses blocked corridors &amp; hazards
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-maroon">★</span> Nearest safe emergency exit detection
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-maroon">★</span> Wheelchair-aware safe routing option
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBuilding('mall', { emergency: true })}
                  className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-maroon hover:bg-brand-maroonHover text-white transition-all shadow hover:shadow-md cursor-pointer"
                >
                  Find Nearest Safe Exit
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl p-8 border border-brand-borderWarm shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-600">
                    Threat Awareness
                  </span>
                  <h3 className="font-serif-heading text-2xl font-bold text-neutral-900 mt-2 mb-1">
                    Hazard &amp; Danger Zones
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium mt-1 mb-6">
                    Critical building areas
                  </p>
                  <div className="text-3xl font-serif-heading font-bold text-neutral-900 mb-6 pb-6 border-b border-neutral-100">
                    Live Map{' '}
                    <span className="text-xs font-semibold text-neutral-700 ml-1.5 font-sans">overlays</span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 mb-8">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Fire &amp; blocked corridor demo scenarios
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Visual danger zone &amp; unsafe path markers
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Clear step-by-step evacuation instructions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Works across both Mall &amp; Hospital
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBuilding('hospital', { emergency: true })}
                  className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                >
                  Check Danger Zones
                </button>
              </div>
            </div>

            {/* AI Assistant Callout Banner */}
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="px-3 py-1 bg-brand-teal text-neutral-950 font-bold text-[10px] uppercase rounded-full tracking-wider">
                  Integrated Safety
                </span>
                <h4 className="font-serif-heading text-xl sm:text-2xl font-bold mt-2">
                  Navique AI Navigation Assistant
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Ask questions naturally: “Where is the nearest safe exit?” or “Which floor has Cardiology?”
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenBuilding('mall', { openAssistant: true })}
                className="shrink-0 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
              >
                Try AI Assistant
              </button>
            </div>
          </div>
        </section>
        {/* FAQs */}
        <section className="bg-black text-white pt-24 pb-20 border-t border-neutral-900" id="faqs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-400 text-sm max-w-xl mx-auto">
                Everything you need to know about Navique indoor wayfinding, floor switching, accessibility, and emergency systems.
              </p>
            </div>

            <div className="divide-y divide-neutral-800 border-y border-neutral-800">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={item.question} className="py-6">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
                    >
                      <h3 className="text-base sm:text-lg font-medium text-neutral-100 group-hover:text-brand-teal transition-colors">
                        {item.question}
                      </h3>
                      <span className="text-xl text-neutral-400 group-hover:text-white transition-transform font-light shrink-0">
                        {isOpen ? '✕' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="mt-4 text-sm leading-relaxed pr-6 md:text-base text-neutral-300">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Final CTA & Footer */}
        <section className="bg-black text-white pt-10 pb-20 border-t border-neutral-900">
          <div className="max-w-5xl mx-auto px-4 text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 mb-8">
              Trusted across key public venues &amp; healthcare centers
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-neutral-400 font-bold text-sm tracking-wider uppercase opacity-80">
              <span>METRO RAILWAY</span>
              <span>CITY HOSPITAL</span>
              <span>PACIFIC MALL</span>
              <span>GRAND CONVENTION</span>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 text-center mb-24">
            <h2 className="font-serif-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Your Destination Is Just a Few Steps Away.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal">
              Explore smarter indoor navigation with interactive floor maps, intelligent directions, and reliable emergency assistance.
            </p>
            <a
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all shadow-lg active:scale-95"
              href="#demos"
            >
              Explore Navique
            </a>
          </div>

          <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-neutral-900 text-neutral-400 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-brand-maroon flex items-center justify-center text-white text-[10px] font-bold">
                    N
                  </div>
                  <span className="font-serif-heading text-lg font-bold text-white tracking-wide">
                    Navique
                  </span>
                </div>
                <p className="text-neutral-400 max-w-sm leading-relaxed mb-4">
                  Making indoor navigation smarter, simpler, and safer for hospitals, retail malls, and public hubs worldwide.
                </p>
                <p className="text-neutral-600 text-[11px]">
                  Universal Accessibility · Multi-Floor Indoor Wayfinding
                </p>
              </div>
              <div>
                <h5 className="text-white font-semibold uppercase tracking-wider mb-4 text-[11px]">
                  Quick Links
                </h5>
                <ul className="space-y-2.5">
                  <li>
                    <a className="hover:text-white transition-colors" href="#top">
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#about">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#features">
                      Features
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#benefits">
                      Benefits
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-white font-semibold uppercase tracking-wider mb-4 text-[11px]">
                  Explore Demos
                </h5>
                <ul className="space-y-2.5">
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenBuilding('mall')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Shopping Mall Map
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenBuilding('hospital')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      City Care Hospital
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenBuilding('mall', { emergency: true })}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Safe Exit SOS Demo
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenBuilding('hospital', { openAssistant: true })}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      AI Assistant
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-white font-semibold uppercase tracking-wider mb-4 text-[11px]">
                  Platform &amp; Legal
                </h5>
                <ul className="space-y-2.5">
                  <li>
                    <a className="hover:text-white transition-colors" href="#benefits">
                      Accessibility Commitment
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#safety">
                      Emergency Prototype Notice
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#faqs">
                      Platform FAQs
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px] gap-4">
              <p>© 2026 Navique. All rights reserved.</p>
              <p className="flex items-center gap-4">
                <span>Built for Universal Accessibility</span>
                <span>•</span>
                <span>Multi-Floor Indoor Standard</span>
              </p>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
};
