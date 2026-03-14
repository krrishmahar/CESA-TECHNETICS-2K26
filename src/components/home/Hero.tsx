import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import React from 'react';

// Use placeholders or local paths if you have them. 
// For now, I'll use the logic from the original Hero.tsx
const heroVideo = '/video/optimized_hero.webm'; 
const heroVideoMobile = '/video/optimized_hero_mobile.webm'; 

const TARGET_DATE = new Date("2026-03-16T00:00:00").getTime();

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showContent, setShowContent] = useState(false);

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (videoRef.current) {
      videoRef.current.play().catch(err => console.error("Playback failed:", err));
    }

    return () => clearInterval(timer);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const video = videoRef.current;
      const loopStartTime = video.duration - 5; 
      const revealTime = 1; // Faster reveal for the intro replacement
      
      if (video.currentTime >= revealTime && !showContent) {
        setShowContent(true);
      }

      if (video.currentTime >= video.duration - 0.1) {
        video.currentTime = loopStartTime;
      }
    }
  };

  // If video fails or isn't there, we show a fallback gradient
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline 
          loop
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover opacity-60"
        >
          <source src={heroVideoMobile} type="video/webm" media="(max-width: 768px)" />
          <source src={heroVideo} type="video/webm" />
        </video>
        {/* Fallback & Overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#021516]/80 via-[#021516]/40 to-[#021516]"></div>
      </div>

      <div className={`relative z-30 text-center px-4 flex flex-col items-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        
        <motion.h1 
          className="mb-2 drop-shadow-[0_0_30px_rgba(255,183,0,0.6)]"
          style={{
            fontFamily: "'Harry P', 'Cinzel', serif",
            fontWeight: 400,
            fontSize: 'clamp(64px, 10vw, 128px)',
            lineHeight: '100%',
            textAlign: 'center',
            background: 'linear-gradient(90deg, #FFE092 0%, #FFB702 26.68%, #FFC229 42.24%, #FFE6A8 56.25%, #FFD05A 70.39%, #FFB700 81.87%, #FFB804 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          TECHNETICS 2K26
        </motion.h1>
        
        <motion.p 
          style={{
            fontFamily: "'BlackChancery', serif",
            fontSize: 'clamp(24px, 6vw, 42px)',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#B5FFF0',
          }}
          className="mb-6 drop-shadow-lg"
        >
          Where Code Meets Magic.
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10 mt-8">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <React.Fragment key={unit}>
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
                  <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
                  <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />

                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#F5E6C8] rounded-sm flex flex-col items-center justify-center text-center border-2 border-[#d4af37] shadow-xl">
                    <span className="text-2xl sm:text-4xl font-bold text-[#2d1f14]">
                      {String(value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-sm text-[#6b4f2a] font-wizard">
                      {unit.toUpperCase()}
                    </span>
                  </div>
                </div>
                {index < 3 && <span className="text-[#d4af37] text-2xl hidden sm:block">✦</span>}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
