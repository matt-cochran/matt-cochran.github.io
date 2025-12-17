import React, { useState } from 'react';
import { DEFAULT_DETAILS, PartyDetails } from './types';
import { ConfettiTrigger } from './components/ConfettiTrigger';
import { EditControls } from './components/EditControls';
import { CountdownTimer } from './components/CountdownTimer';
import QRCode from 'react-qr-code';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Gift, 
  PartyPopper, 
  Settings, 
  ExternalLink, 
  Share2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [details, setDetails] = useState<PartyDetails>(DEFAULT_DETAILS);
  const [isEditing, setIsEditing] = useState(false);
  const [confettiCount, setConfettiCount] = useState(0);

  const handleConfetti = () => {
    setConfettiCount(c => c + 1);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const isGooglePhotosLink = (url: string) => {
    return url.includes('photos.google.com') || url.includes('photos.app.goo.gl');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-gray-800 font-sans selection:bg-pink-200">
      <ConfettiTrigger trigger={confettiCount} />

      {/* Floating Edit Button */}
      <button 
        onClick={() => setIsEditing(true)}
        className="fixed top-4 right-4 z-40 bg-white/80 backdrop-blur p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-purple-200 text-purple-600 group"
      >
        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        <span className="sr-only">Edit Details</span>
      </button>

      {/* Edit Sidebar */}
      <AnimatePresence>
        {isEditing && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.5 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black z-40"
               onClick={() => setIsEditing(false)}
             />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 pointer-events-none"
            >
              <div className="h-full pointer-events-auto">
                 <EditControls details={details} onChange={setDetails} onClose={() => setIsEditing(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <div className="inline-block p-4 mb-6 relative">
             <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute -top-6 -right-6 text-5xl"
             >
               🦄
             </motion.div>
             <div className="absolute -top-2 -left-4 text-4xl animate-bounce">🎈</div>
             <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm font-fredoka tracking-wide">
               {details.childName}
             </h1>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-6 font-fredoka">
            Is Turning <span className="text-pink-500 text-5xl inline-block transform hover:scale-110 transition-transform cursor-pointer" onClick={handleConfetti}>{details.age}!</span>
          </h2>
          
          <div className="max-w-lg mx-auto bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 mb-8">
             <p className="text-lg sm:text-xl text-gray-600 leading-relaxed italic">
               "{details.welcomeMessage}"
             </p>
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <CountdownTimer targetDate={details.date} />

        {/* Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 mt-8">
          {/* Time & Date */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-purple-100/50 border-2 border-transparent hover:border-purple-200 transition-all"
          >
             <div className="flex items-start gap-4">
               <div className="bg-pink-100 p-3 rounded-2xl">
                 <Calendar className="w-8 h-8 text-pink-600" />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-1 font-fredoka">When</h3>
                 <p className="text-xl text-purple-600 font-semibold">{formatDate(details.date)}</p>
                 <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{details.time}</span>
                 </div>
               </div>
             </div>
          </motion.div>

          {/* Location */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-purple-100/50 border-2 border-transparent hover:border-indigo-200 transition-all"
          >
             <div className="flex items-start gap-4">
               <div className="bg-indigo-100 p-3 rounded-2xl">
                 <MapPin className="w-8 h-8 text-indigo-600" />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-1 font-fredoka">Where</h3>
                 <p className="text-xl text-purple-600 font-semibold">{details.locationName}</p>
                 <p className="text-gray-500 mt-1">{details.address}</p>
                 <a 
                   href={`https://maps.google.com/?q=${encodeURIComponent(details.address)}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-600 mt-2 font-semibold"
                 >
                   View Map <ExternalLink className="w-3 h-3 ml-1" />
                 </a>
               </div>
             </div>
          </motion.div>
        </div>

        {/* Photo Gallery Section */}
        {details.galleryImages && details.galleryImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
             <div className="flex items-center justify-center gap-3 mb-8">
                <Camera className="w-8 h-8 text-pink-500" />
                <h3 className="text-3xl font-bold text-gray-800 font-fredoka">Sweet Memories</h3>
                <Camera className="w-8 h-8 text-pink-500" />
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {details.galleryImages.filter(url => url.trim() !== "").map((url, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03, rotate: index % 2 === 0 ? 2 : -2 }}
                    className="aspect-square bg-white p-2 rounded-2xl shadow-lg shadow-purple-100 overflow-hidden transform transition-all duration-300 group"
                  >
                    {isGooglePhotosLink(url) ? (
                       <a 
                         href={url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="w-full h-full flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 transition-colors p-4 text-center group-hover:text-purple-600"
                       >
                         <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                           <ImageIcon className="w-8 h-8 text-pink-500" />
                         </div>
                         <span className="text-sm font-bold text-gray-600 group-hover:text-purple-600">View on Google Photos</span>
                         <span className="text-xs text-gray-400 mt-1">(Link opens in new tab)</span>
                       </a>
                    ) : (
                      <img 
                        src={url} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </motion.div>
                ))}
             </div>
          </motion.div>
        )}

        {/* RSVP Section - The Hero of Functionality */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Gift size={200} />
          </div>
          <div className="absolute bottom-0 left-0 p-8 opacity-10">
            <PartyPopper size={150} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
             <div className="flex-1 text-center md:text-left">
               <div className="inline-block bg-white/20 backdrop-blur rounded-full px-4 py-1 text-sm font-semibold mb-4 border border-white/20">
                 RSVP Required
               </div>
               <h3 className="text-4xl md:text-5xl font-black mb-4 font-fredoka">Scan to RSVP</h3>
               <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-md">
                 Please let us know if you can make it by scanning the QR code or clicking the button below!
               </p>
               
               <a 
                 href={details.rsvpLink}
                 target="_blank"
                 rel="noreferrer"
                 className="inline-flex items-center justify-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl w-full md:w-auto group"
               >
                 RSVP Link
                 <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </a>
             </div>

             {/* QR Code Card */}
             <div className="bg-white p-6 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
               <div className="bg-gray-900 p-2 rounded-xl">
                 <div className="bg-white p-4 rounded-lg">
                    <div className="w-48 h-48 sm:w-56 sm:h-56">
                      <QRCode 
                        value={details.rsvpLink} 
                        style={{ height: "100%", width: "100%", maxWidth: "100%" }}
                        viewBox={`0 0 256 256`}
                        level="M"
                      />
                    </div>
                 </div>
               </div>
               <div className="text-center mt-4">
                 <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">Scan Me</p>
               </div>
             </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            Made with <span className="text-pink-500">❤️</span> for {details.childName}
          </p>
          <button 
             onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${details.childName}'s Birthday`,
                    text: details.welcomeMessage,
                    url: window.location.href,
                  });
                }
             }}
             className="mt-4 inline-flex items-center text-purple-400 hover:text-purple-600 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-1" /> Share this page
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;
