import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, doc, deleteDoc
} from 'firebase/firestore';
import {
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged
} from 'firebase/auth';
import {
  Globe, MapPin, Sparkles, Compass, X, MessageSquare, Send, ExternalLink
} from 'lucide-react';

import { firebaseConfig } from './firebaseConfig';
import { PACKAGES } from './constants/packages';
import PackageCard from './components/PackageCard';
import './index.css';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'global-tour-pro-v2';
const apiKey = 'AIzaSyCk9Xkd2iyoMPT4h29EXPrXVAHoubUuzKc'; // optional Gemini API key

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [tripType, setTripType] = useState('All');
  const [scrolled, setScrolled] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedMapPkg, setSelectedMapPkg] = useState(null);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your GlobalTour AI assistant. How can I help you plan your dream vacation today?'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  const exploreRef = useRef(null);

  // Navbar scroll state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Firebase auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (window.__initial_auth_token) {
          await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error(err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Listen to bookings
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'bookings'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setBookings(data.sort((a, b) => (b.bookedAt || 0) - (a.bookedAt || 0)));
      },
      err => console.error(err)
    );
    return () => unsubscribe();
  }, [user]);

  // AI Assistant send
 const handleAiSend = async () => {
  if (!aiInput.trim() || isAiLoading) return;

  const userMsg = { role: 'user', text: aiInput };
  setAiMessages(prev => [...prev, userMsg]);
  setAiInput('');
  setIsAiLoading(true);

  try {
    const systemPrompt = `
You are GLOBAL AI, a powerful travel assistant similar to ChatGPT or Gemini.
You MUST answer any question the user asks, with clear, complete, and helpful information.
You CAN answer:
- General knowledge
- Travel planning, routes, maps, distances
- Visas, best time to visit, weather, budgets, packing, culture
- Questions about any country or city in the world

When the question is about our packages, prefer these real packages:
${PACKAGES.map(p => `- ${p.title} in ${p.location}`).join('\n')}

Guidelines:
- Do NOT say "I cannot show a map" or "I am just an assistant".
- If user says "give map" or "show location", describe the place, nearby major cities, and how to reach it (by flight/train/road).
- Use simple English, short paragraphs, and friendly tone.
`;

 const payload = {
  contents: [
    {
      role: 'user',
      parts: [{ text: aiInput }]
    }
  ],
  systemInstruction: {
    parts: [{ text: systemPrompt }]
  }
};

const res = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(payload)
  }
);
    const data = await res.json();
    const aiText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm not sure right now, please try asking in a different way.";

    setAiMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
  } catch (err) {
    console.error(err);
    setAiMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        text: 'There was an error talking to the AI service. Please try again in a moment.'
      }
    ]);
  } finally {
    setIsAiLoading(false);
  }
};

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);
useEffect(() => {
  const last = aiMessages[aiMessages.length - 1];
  if (!last || last.role !== 'user') return;

  const text = last.text.toLowerCase();
  if (text.includes('map of alleppey') || text.includes('alleppey location')) {
    const pkg = PACKAGES.find(p =>
      p.location.toLowerCase().includes('alleppey')
    );
    if (pkg) setSelectedMapPkg(pkg);
  }
}, [aiMessages]);


  // Book package
  const handleBook = async pkg => {
    if (!user) return;
    setIsBooking(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'bookings'), {
        ...pkg,
        userId: user.uid,
        bookedAt: Date.now(),
        status: 'Confirmed'
      });
      setActiveTab('itinerary');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  // Delete booking
  const deleteBooking = async id => {
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'bookings', id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchClick = () => {
    setActiveTab('explore');
    setTimeout(() => {
      exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filtered = useMemo(
    () =>
      PACKAGES.filter(
        p =>
          (category === 'All' || p.category === category) &&
          (tripType === 'All' || p.type === tripType) &&
          (p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.location.toLowerCase().includes(search.toLowerCase()) ||
            p.type.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, category, tripType]
  );

  const tripTypes = ['All', 'Adventure', 'Culture', 'Luxury', 'Nature', 'History', 'Leisure'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      {/* HEADER */}
      <header
        className={`sticky top-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 border-b border-slate-800 py-3 backdrop-blur-xl'
            : 'bg-slate-950/80 border-b border-transparent py-5 backdrop-blur-xl'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="bg-blue-600 p-2.5 rounded-xl text-white">
              <Globe size={26} />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter">
              GLOBAL<span className="text-blue-400">TOUR</span>
            </span>
          </div>
          <nav className="hidden lg:flex gap-10 items-center font-bold text-[13px] uppercase tracking-widest text-slate-300">
            {['home', 'explore', 'itinerary'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`hover:text-blue-400 ${
                  activeTab === t ? 'text-blue-400' : ''
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={handleSearchClick}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-500 shadow-lg shadow-blue-500/30"
            >
              PLAN TRIP
            </button>
          </nav>
        </div>
      </header>

      <main>
        {activeTab === 'home' && (
          <section className="relative h-[750px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1503221043305-f7498f8b7888?auto=format&fit=crop&w=1920&q=80"
                className="w-full h-full object-cover"
                alt="Beautiful Landscape"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-900"></div>
            </div>
            <div className="relative z-10 text-center text-white px-6 max-w-5xl">
              <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full mb-8">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  AI Powered Travel Planning
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9]">
                Design Your <span className="text-blue-400">Next Journey</span>
              </h1>
              <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-300 font-medium mb-8">
                Discover curated tours across the globe, tailored to your mood, budget, and travel style.
              </p>
              <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <MapPin
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Where to? (e.g. Iceland, Italy, Sydney)"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-800/80 text-slate-50 font-semibold outline-none placeholder:text-slate-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSearchClick()}
                  />
                </div>
                <button
                  onClick={handleSearchClick}
                  className="bg-blue-600 hover:bg-blue-500 transition-colors px-10 py-5 rounded-2xl font-black uppercase text-sm shadow-lg shadow-blue-600/30"
                >
                  Find Packages
                </button>
              </div>
            </div>
          </section>
        )}

        {(activeTab === 'explore' || activeTab === 'home') && (
          <div className="max-w-7xl mx-auto px-6 py-20" ref={exploreRef}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-50">
                  Discover <span className="text-blue-400">Global</span> Destinations
                </h2>
                <p className="text-slate-400 font-semibold mt-2 uppercase text-xs">
                  Curated travel experiences for 2026
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
                  {['All', 'International', 'Domestic'].map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                        category === c
                          ? 'bg-slate-950 text-blue-400 shadow-sm'
                          : 'text-slate-400 hover:text-slate-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
              {tripTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setTripType(t)}
                  className={`px-6 py-3 rounded-full whitespace-nowrap text-[10px] font-black uppercase border transition-all ${
                    tripType === t
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map(pkg => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onBook={handleBook}
                    onViewMap={setSelectedMapPkg}
                    isLoading={isBooking}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-slate-900/80 rounded-[3rem] border-2 border-dashed border-slate-700">
                <Compass
                  size={64}
                  className="mx-auto text-slate-600 mb-6 animate-pulse"
                />
                <h3 className="text-2xl font-black uppercase text-slate-50">
                  No routes found
                </h3>
                <p className="text-slate-400 font-semibold mt-2">
                  Try searching "Europe", "Safari" or "Asia"
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('All');
                    setTripType('All');
                  }}
                  className="mt-6 bg-slate-50 text-slate-900 px-8 py-3 rounded-xl font-black text-xs uppercase hover:bg-slate-200"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'itinerary' && (
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-5xl font-black uppercase mb-12 tracking-tighter text-slate-50">
              My <span className="text-blue-400">Trips</span>
            </h2>
            <div className="grid gap-6">
              {bookings.length > 0 ? (
                bookings.map(b => (
                  <div
                    key={b.id}
                    className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 flex flex-col md:flex-row gap-8 items-center shadow-sm hover:shadow-xl hover:border-blue-500/60 transition-shadow"
                  >
                    <img
                      src={b.image}
                      className="w-full md:w-48 h-32 object-cover rounded-2xl"
                      alt=""
                    />
                    <div className="flex-1">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                        {b.type}
                      </span>
                      <h4 className="text-2xl font-black mb-1 text-slate-50">
                        {b.title}
                      </h4>
                      <p className="text-slate-400 font-semibold text-xs">
                        <MapPin size={12} className="inline mr-1" />
                        {b.location}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="text-3xl font-black mb-4 text-slate-50">
                        ${b.price}
                      </div>
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="text-red-400 font-black text-[10px] uppercase hover:text-red-300"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-[3rem] bg-slate-900/80">
                  <p className="font-black text-slate-500 uppercase tracking-widest mb-6">
                    Your bags aren't packed yet!
                  </p>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-blue-600/30 hover:bg-blue-500"
                  >
                    Start Browsing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* AI ASSISTANT  */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end gap-4">
        {aiOpen && (
          <div className="bg-slate-950 w-[350px] md:w-[400px] h-[500px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-800">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight leading-none">
                    Global AI
                  </h3>
                  <span className="text-[10px] opacity-80 font-bold uppercase tracking-widest">
                    Travel Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="hover:bg-white/10 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950">
              {aiMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 p-4 rounded-2xl rounded-tl-none border border-slate-800 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about tours or trips..."
                className="flex-1 bg-slate-900 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/50 text-slate-100 placeholder:text-slate-500"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAiSend()}
              />
              <button
                onClick={handleAiSend}
                disabled={!aiInput.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-blue-500"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
            aiOpen ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          {aiOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </button>
      </div>

      {/* MAP MODAL */}
      {selectedMapPkg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-950 w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-50">
                  {selectedMapPkg.location}
                </h3>
                <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest mt-1">
                  Live Satellite Preview
                </p>
              </div>
              <button
                onClick={() => setSelectedMapPkg(null)}
                className="p-3 bg-slate-950 shadow-sm rounded-full hover:rotate-90 transition-transform border border-slate-800 text-slate-200"
              >
                <X />
              </button>
            </div>
            <div className="h-[450px] bg-slate-900 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(37,99,235,0.12)_1px,transparent_1px)] bg-[length:20px_20px] opacity-60"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-slate-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 shadow-2xl border border-slate-700">
                  Target Area: {selectedMapPkg.coordinates[1]}N, {selectedMapPkg.coordinates[0]}E
                </div>
                <MapPin size={64} className="text-blue-500 animate-bounce" fill="currentColor" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/95 p-6 rounded-2xl backdrop-blur-md flex justify-between items-center shadow-xl border border-slate-800">
                <div>
                  <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Route Info
                  </span>
                  <span className="font-bold text-sm text-slate-100">
                    Direct connections from your location available.
                  </span>
                </div>
                <button
                   className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 hover:bg-blue-500"
                    onClick={() => {
                  const [lng, lat] = selectedMapPkg.coordinates;
                  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                window.open(url, '_blank');
                }}
              >
            Open in Google Maps <ExternalLink size={14} />
             </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 text-white py-12 px-6 mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Globe className="text-blue-500" size={40} />
            <span className="text-3xl font-black tracking-tighter uppercase">
              GLOBAL<span className="text-blue-500">TOUR</span>
            </span>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            © 2025 World Travel Group - All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
