import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Calendar, MapPin, Clock, Gift, PartyPopper, Settings, 
  ExternalLink, Share2, Camera, Image as ImageIcon,
  X, Save, Trash2, Plus, Sparkles, Loader2, Heart, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";

// --- Defaults ---
const DEFAULT_DETAILS = {
  childName: "Sophie",
  age: 7,
  date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  time: "14:00",
  locationName: "The Secret Garden Pavilion",
  address: "777 Rose Petal Lane, Blossom Valley",
  rsvpLink: "https://docs.google.com/forms/",
  welcomeMessage: "Get ready for a day of sparkles, laughter, and magical surprises! We can't wait to see your smiling face.",
  theme: "Balloons & Sparkles",
  galleryImages: [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592839494881-334346416199?q=80&w=800&auto=format&fit=crop",
  ]
};

// --- Magical Effects Components ---

const ScrollSparkles = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY.current);
      
      if (diff > 15) {
        const id = Date.now() + Math.random();
        const newSparkle = {
          id,
          x: Math.random() * window.innerWidth,
          y: currentScrollY + (Math.random() * 100), // Appears near current scroll
        };
        setSparkles(prev => [...prev.slice(-15), newSparkle]);
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute text-rose-300 pointer-events-none select-none"
            style={{ left: s.x, top: s.y - window.scrollY }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const Floating = ({ children, delay = 0, duration = 4, range = 20, className = "" }) => (
  <motion.div
    animate={{ 
      y: [0, -range, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      ease: "easeInOut", 
      delay 
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    const update = () => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff <= 0) setTimeLeft(p => ({ ...p, expired: true }));
      else setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60),
        expired: false
      });
    };
    const timer = setInterval(update, 1000);
    update();
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) return <div className="script-font text-rose-400 text-2xl py-6">The Party Has Started! ✨</div>;

  const Box = ({ v, l }: { v: number, l: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white w-14 h-14 sm:w-20 sm:h-20 rounded-2xl shadow-md flex items-center justify-center border-b-4 border-rose-100 mb-1">
        <span className="text-xl sm:text-3xl font-black text-rose-400 font-fredoka tracking-tighter">{v.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">{l}</span>
    </div>
  );

  return (
    <div className="flex justify-center gap-3 sm:gap-6 py-8">
      <Box v={timeLeft.d} l="Days" />
      <Box v={timeLeft.h} l="Hours" />
      <Box v={timeLeft.m} l="Mins" />
      <Box v={timeLeft.s} l="Secs" />
    </div>
  );
};

const MagicWriter = ({ details, onGenerated }: { details: any, onGenerated: (m: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const generate = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a very sweet, girly birthday invitation message (2 short sentences) for ${details.childName}'s ${details.age}th birthday. Include balloons and magic sparkles. Theme: ${details.theme}.`
      });
      if (resp.text) onGenerated(resp.text.trim());
    } catch (e) {
      alert("The magic wand is sleeping! ✨");
    } finally { setLoading(false); }
  };

  return (
    <button 
      onClick={generate} 
      disabled={loading} 
      className="w-full mt-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-500 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      {loading ? "Casting Spell..." : "AI Magic Writer"}
    </button>
  );
};

// --- Main App ---

function App() {
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [isEditing, setIsEditing] = useState(false);

  const fire = () => {
    const scalar = 2;
    const heart = confetti.shapeFromText({ text: '❤️', scalar });
    const star = confetti.shapeFromText({ text: '⭐', scalar });
    const balloon = confetti.shapeFromText({ text: '🎈', scalar });

    confetti({ 
      particleCount: 100, 
      spread: 70, 
      origin: { y: 0.6 }, 
      colors: ['#fb7185', '#fda4af', '#fff1f2', '#f472b6', '#ffd700'],
      shapes: [heart, star, balloon, 'circle'],
      scalar: 1.2
    });
  };

  useEffect(() => { 
    fire(); 
  }, []);

  const formatDate = (ds: string) => {
    try { return new Date(ds).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); }
    catch { return ds; }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden selection:bg-rose-200 relative">
      {/* Scroll-triggered magical trail */}
      <ScrollSparkles />
      
      {/* Editor Trigger */}
      <button 
        onClick={() => setIsEditing(true)} 
        className="fixed top-6 right-6 z-40 bg-white/90 p-3 rounded-full shadow-xl border border-rose-100 text-rose-400 hover:scale-110 active:scale-95 transition-all"
      >
        <Settings size={24} />
      </button>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center relative">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <Floating className="absolute top-20 left-10 text-6xl opacity-40" delay={0} range={30}>🎈</Floating>
          <Floating className="absolute top-40 right-10 text-6xl opacity-40" delay={1.5} range={25}>✨</Floating>
          <Floating className="absolute bottom-10 left-1/4 text-6xl opacity-30" delay={0.8} range={40}>🎈</Floating>
          <Floating className="absolute top-1/2 left-4 text-4xl opacity-30" delay={2} range={15}>💝</Floating>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative inline-block mb-2">
            <Floating className="absolute -top-16 -right-16 text-9xl rotate-12" delay={0} duration={5} range={25}>🎈</Floating>
            <Floating className="absolute -top-8 -left-24 text-7xl -rotate-12" delay={0.5} duration={6} range={20}>🎈</Floating>
            
            <h1 className="text-7xl sm:text-9xl font-black rainbow-text font-fredoka tracking-tighter py-6 drop-shadow-sm">
              {details.childName}
            </h1>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-500 mb-8 font-fredoka flex flex-col items-center">
            <span className="script-font text-rose-400 text-4xl mb-2">Celebrating</span>
            <span>Turning <motion.span 
              whileHover={{ scale: 1.1, rotate: 2 }} 
              onClick={fire} 
              className="text-rose-500 text-7xl inline-block cursor-pointer underline decoration-rose-200 decoration-wavy underline-offset-8"
            >{details.age}!</motion.span></span>
          </h2>

          <div className="max-w-xl mx-auto glass p-10 rounded-[3rem] shadow-xl shadow-rose-100/50 italic text-gray-500 text-lg sm:text-xl leading-relaxed relative border-2 border-rose-50">
            <div className="absolute -top-4 -left-4 text-3xl">🎈</div>
            <div className="absolute -bottom-4 -right-4 text-3xl">✨</div>
            "{details.welcomeMessage}"
          </div>
        </motion.div>

        {/* Stable Countdown */}
        <Countdown targetDate={details.date} />
      </div>

      {/* Info Grid */}
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-rose-100/40 flex items-start gap-6 border-2 border-rose-50"
        >
          <div className="bg-rose-50 p-5 rounded-[1.5rem]"><Calendar className="text-rose-400 w-8 h-8" /></div>
          <div>
            <h3 className="text-2xl font-bold mb-1 font-fredoka text-gray-700">When</h3>
            <p className="text-xl text-rose-500 font-black">{formatDate(details.date)}</p>
            <p className="text-rose-300 font-bold flex items-center gap-2 mt-2"><Clock size={16} /> {details.time}</p>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-rose-100/40 flex items-start gap-6 border-2 border-rose-50"
        >
          <div className="bg-rose-50 p-5 rounded-[1.5rem]"><MapPin className="text-rose-400 w-8 h-8" /></div>
          <div>
            <h3 className="text-2xl font-bold mb-1 font-fredoka text-gray-700">Where</h3>
            <p className="text-xl text-rose-500 font-black">{details.locationName}</p>
            <p className="text-rose-300 font-bold mt-1 text-sm">{details.address}</p>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(details.address)}`} target="_blank" className="text-rose-400 font-black mt-4 inline-flex items-center gap-2 hover:text-rose-600 transition-colors bg-rose-50/50 px-4 py-2 rounded-full text-xs">Open Map <ExternalLink size={14}/></a>
          </div>
        </motion.div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <div className="flex items-center gap-8 mb-16">
          <div className="h-0.5 bg-gradient-to-r from-transparent to-rose-200 flex-1"></div>
          <h3 className="text-3xl font-bold text-gray-700 font-fredoka flex items-center gap-3">
            <Camera className="text-rose-400" /> <span className="script-font">Sweet Snapshots</span>
          </h3>
          <div className="h-0.5 bg-gradient-to-l from-transparent to-rose-200 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {details.galleryImages.filter(u => u.trim() !== "").map((url, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, rotate: i % 2 === 0 ? -3 : 3, scale: 0.95 }}
              whileInView={{ opacity: 1, rotate: i % 2 === 0 ? -1 : 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              className="bg-white p-4 pb-12 shadow-2xl shadow-rose-200 relative group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl z-20">🎈</div>
              <div className="aspect-square overflow-hidden bg-rose-50">
                <img src={url} className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500" alt="Memory" />
              </div>
              <div className="mt-4 text-center script-font text-rose-300">Magical Moment</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RSVP Section */}
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-[4rem] p-12 sm:p-20 text-white shadow-2xl shadow-rose-200 relative overflow-hidden flex flex-col md:flex-row items-center gap-16"
        >
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12"><Heart size={300} fill="white" /></div>
          <div className="absolute -bottom-10 -left-10 p-20 opacity-10 -rotate-12"><Star size={250} fill="white" /></div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h3 className="text-5xl font-black mb-6 font-fredoka tracking-tight leading-tight">Your Magic Ticket!</h3>
            <p className="text-rose-100 text-xl mb-12 max-w-sm leading-relaxed font-bold">Will you join us for cake and celebration? Let us know!</p>
            <motion.a 
              href={details.rsvpLink} 
              target="_blank" 
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: ["0 0 0 rgba(255,255,255,0)", "0 0 30px rgba(255,255,255,0.4)", "0 0 0 rgba(255,255,255,0)"]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="bg-white text-rose-500 px-14 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:bg-rose-50 transition-all inline-block border-b-8 border-rose-100 active:border-b-0 active:translate-y-2"
            >
              RSVP HERE!
            </motion.a>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="bg-white p-10 rounded-[4rem] shadow-2xl active:scale-95 transition-all z-10 cursor-pointer relative"
            onClick={fire}
          >
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🎈</div>
            <div className="p-4 bg-rose-50/30 rounded-3xl border-4 border-rose-100 border-dashed">
              <QRCode value={details.rsvpLink} size={160} level="H" fgColor="#fb7185" />
            </div>
            <p className="text-rose-300 text-[10px] text-center mt-6 font-black uppercase tracking-[0.4em]">Scan for Magic</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Editor Sidebar */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="fixed inset-0 bg-rose-900/20 backdrop-blur-md z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 right-0 w-full sm:w-[32rem] bg-white z-50 p-12 overflow-y-auto shadow-2xl border-l-4 border-rose-100">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black font-fredoka text-gray-700">Magical Settings</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-rose-50 rounded-full text-rose-300 transition-colors"><X size={32} /></button>
              </div>

              <div className="space-y-10">
                <div className="relative">
                  <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">Birthday Star</label>
                  <input value={details.childName} onChange={e => setDetails({...details, childName: e.target.value})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem] focus:ring-4 focus:ring-rose-200 outline-none text-rose-600 font-bold" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">Age</label>
                    <input type="number" value={details.age} onChange={e => setDetails({...details, age: parseInt(e.target.value) || 0})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem] focus:ring-4 focus:ring-rose-200 text-rose-600 font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">Theme</label>
                    <input value={details.theme} onChange={e => setDetails({...details, theme: e.target.value})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem] focus:ring-4 focus:ring-rose-200 text-rose-600 font-bold" />
                  </div>
                </div>

                <MagicWriter details={details} onGenerated={m => setDetails({...details, welcomeMessage: m})} />

                <div>
                  <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">Invitation Message</label>
                  <textarea rows={3} value={details.welcomeMessage} onChange={e => setDetails({...details, welcomeMessage: e.target.value})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem] text-sm text-gray-600 font-medium leading-relaxed" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div><label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">Date</label><input type="date" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem]" /></div>
                  <div><label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">Time</label><input type="time" value={details.time} onChange={e => setDetails({...details, time: e.target.value})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem]" /></div>
                </div>

                <div className="pt-6 border-t-2 border-rose-50">
                   <h3 className="text-lg font-black font-fredoka text-gray-700 mb-6 flex items-center gap-2"><MapPin size={18} className="text-rose-400" /> Location Details</h3>
                  <div className="mb-6">
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">Venue Name</label>
                    <input value={details.locationName} onChange={e => setDetails({...details, locationName: e.target.value})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">Full Address</label>
                    <input value={details.address} onChange={e => setDetails({...details, address: e.target.value})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem]" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">RSVP Link (URL)</label>
                  <input value={details.rsvpLink} onChange={e => setDetails({...details, rsvpLink: e.target.value})} className="w-full p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem] text-xs" />
                </div>

                <div className="pt-10 border-t-2 border-rose-100">
                  <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2 mb-8"><ImageIcon size={14} /> Gallery Photos</label>
                  {details.galleryImages.map((u, i) => (
                    <div key={i} className="flex gap-4 mb-6 items-center">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-rose-100">
                        {u ? <img src={u} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-rose-200" />}
                      </div>
                      <input value={u} placeholder="Image URL..." onChange={e => {
                        const n = [...details.galleryImages]; n[i] = e.target.value; setDetails({...details, galleryImages: n});
                      }} className="flex-1 p-4 text-xs bg-rose-50 border-2 border-rose-100 rounded-xl outline-none" />
                      <button onClick={() => setDetails({...details, galleryImages: details.galleryImages.filter((_, idx) => idx !== i)})} className="p-3 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={20}/></button>
                    </div>
                  ))}
                  <button onClick={() => setDetails({...details, galleryImages: [...details.galleryImages, ""]})} className="w-full py-5 border-4 border-dashed border-rose-100 rounded-[1.5rem] text-xs text-rose-300 font-black hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center gap-2 transition-all"><Plus size={16}/> ADD PHOTO</button>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm pt-12 pb-6">
                <button onClick={() => setIsEditing(false)} className="w-full py-6 bg-rose-400 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-rose-200 flex items-center justify-center gap-3 hover:bg-rose-500 transition-all active:scale-95"><Save size={24}/> SAVE CHANGES</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shared Footer */}
      <footer className="text-center text-sm text-rose-300 mt-32 px-6">
        <p className="flex items-center justify-center gap-3 font-bold script-font text-xl">
          Made with <Heart size={20} fill="#fb7185" className="text-rose-400" /> for {details.childName}'s {details.age}th Birthday
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={() => { fire(); if (navigator.share) navigator.share({ title: `${details.childName}'s Invite`, url: window.location.href }); }} className="text-rose-400 font-black hover:text-rose-600 inline-flex items-center gap-2 bg-white px-8 py-3 rounded-full border-2 border-rose-50 shadow-sm transition-all hover:scale-105 active:scale-95"><Share2 size={16}/> Share Invitation</button>
        </div>
        <p className="mt-12 text-[10px] uppercase tracking-[0.5em] opacity-50">Sparkle Bash &bull; 2024</p>
      </footer>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);