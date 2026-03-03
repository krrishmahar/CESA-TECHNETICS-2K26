import { motion } from 'framer-motion';
import logo from '../assets/technetics-head.svg';

const navLinks = ["About", "Events", "Clubly", "Discord", "Sponsors", "Contact Us"];

const Navbar = () => {
  return (
    <motion.nav 
      // Navbar load hote time upar se slide down hogi
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between"
    >
      {/* 1. Logo Section */}
      <div className="flex-shrink-0 cursor-pointer">
        <img src={logo} alt="Technetics" />
      </div>

      {/* 2. Links Section - The Glassmorphism Pill */}
      <div className="hidden md:flex items-center space-x-2 px-6 py-2 rounded-full bg-[#111111]/60 backdrop-blur-md border border-white/10 shadow-lg">
        {navLinks.map((link) => (
          <a 
            key={link} 
            href={`#${link.toLowerCase().replace(' ', '-')}`}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group"
          >
            {link}
            {/* Hover Glow Effect - Niche ek choti si line aayegi hover pe */}
            <span className="absolute inset-x-0 bottom-0 h-[1px] bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </a>
        ))}
      </div>

      {/* 3. Mobile Menu Toggle (Responsive design ke liye) */}
      <div className="md:hidden flex items-center">
        <button className="text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18m-18 6h18" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;