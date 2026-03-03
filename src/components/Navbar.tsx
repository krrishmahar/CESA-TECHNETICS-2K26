import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/technetics-head.svg';

const navLinks = ["About", "Events", "Clubly", "Discord", "Sponsors", "Contact Us"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'bg-[#021516]/80 backdrop-blur-lg border-b border-[#d4af37]/20 py-3' : 'bg-transparent'
      }`}
    >
      {/* 1. Logo Section with subtle glow */}
      <div className="flex-shrink-0 cursor-pointer group">
        <img 
          src={logo} 
          alt="Technetics" 
          className="h-10 w-auto transition-transform group-hover:scale-110" 
        />
      </div>

      {/* 2. Navigation Links - Floating Glass Pill */}
      <div className="hidden md:flex items-center space-x-2 px-6 py-2 rounded-full bg-[#111111]/40 backdrop-blur-md border border-white/10 shadow-2xl">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(' ', '-')}`}
            className="px-4 py-2 text-xs font-bold tracking-widest text-gray-400 hover:text-[#d4af37] transition-all duration-300 relative group uppercase"
          >
            {link}
            {/* Hover Animated Underline */}
            <span className="absolute inset-x-0 bottom-1 h-[1px] bg-[#d4af37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
          </a>
        ))}
      </div>

      {/* 3. Action Button / Mobile Menu */}
      <div className="flex items-center gap-4">
        <button className="hidden md:block px-5 py-2 border border-[#d4af37]/50 text-[#d4af37] text-[10px] font-black tracking-widest rounded-lg hover:bg-[#d4af37] hover:text-[#021516] transition-all uppercase">
          Portal
        </button>
        
        <div className="md:hidden flex items-center">
          <button className="text-[#d4af37] hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18m-18 6h18" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;