import { motion } from 'framer-motion';

const InfoSections = () => {
  return (
    <div className="bg-[#021516] px-6 md:px-12 py-20 text-white font-sans space-y-24">
      
      {/* 1. What is Technetics? */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-7xl mx-auto">
        <h2 className="text-4xl text-[#d4af37] mb-8" style={{ fontFamily: "'Cinzel', serif" }}>What is Technetics?</h2>
        <div className="border border-[#d4af37]/30 rounded-xl p-8 bg-gradient-to-br from-[#031d1f] to-[#021516]">
          <h3 className="text-xl font-bold text-teal-100 mb-4">An Arcane-Tech Convergence</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Technetics 2K26 is the premier flagship technical festival of VPPCOE&VA. It is a mystical realm where the boundaries of technology and magic blur. Join us for three days of intense coding battles, hardware enchantments, and arcane design challenges. Whether you are a master sorcerer of code or a novice wizard looking to learn, Technetics has a trial waiting for you.
          </p>
        </div>
      </motion.div>

      {/* 2. Official Registration Portal (Clubly) */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-7xl mx-auto border border-[#d4af37]/30 rounded-xl p-8 md:p-12 bg-[#021b1c]">
        <h2 className="text-4xl text-[#d4af37] mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Official Registration Portal</h2>
        <div className="inline-block px-4 py-1 bg-teal-900/40 text-teal-300 border border-teal-700 rounded-full text-xs font-bold tracking-widest mb-4">
          CLUBLY
        </div>
        <p className="text-gray-300 max-w-2xl mb-8 text-sm md:text-base">
          Clubly is an all-in-one digital gateway for student activities and college clubs, developed by Shaan Edroos.
        </p>
        <button className="px-6 py-3 border border-teal-500 text-teal-300 hover:bg-teal-900/60 rounded-md transition-all font-semibold text-sm">
          Register on Clubly
        </button>
      </motion.div>

      {/* 3. Discord & Sponsors Grid */}
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Discord */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl text-[#d4af37] mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Join The Owl Network</h2>
            <ul className="space-y-4 text-gray-300 mb-8 list-none">
              <li className="flex items-center gap-2"><span className="text-[#d4af37]">•</span> Instant Q&A</li>
              <li className="flex items-center gap-2"><span className="text-[#d4af37]">•</span> 24/7 Bot support</li>
              <li className="flex items-center gap-2"><span className="text-[#d4af37]">•</span> Live announcements</li>
              <li className="flex items-center gap-2"><span className="text-[#d4af37]">•</span> Organizer interaction</li>
            </ul>
            <button className="px-6 py-3 border border-teal-500 text-teal-300 hover:bg-teal-900/60 rounded-md transition-all font-semibold text-sm">
              Join Discord Server
            </button>
          </motion.div>
          
          <div className="h-64 bg-gradient-to-br from-[#042a2b] to-[#021516] border border-[#d4af37]/20 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
             {/* Simple graphic placeholder matching your figma */}
             <div className="text-center z-10">
                <h3 className="text-5xl font-black text-teal-400 mb-2 drop-shadow-lg">DISCORD ✦</h3>
                <p className="text-xs text-teal-600 tracking-widest uppercase font-bold">Owl Signal Active</p>
             </div>
             <div className="absolute bottom-8 w-40 h-8 bg-black/40 rounded-[100%] blur-sm"></div>
          </div>
        </div>

        {/* Sponsors */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl text-[#d4af37] mb-8" style={{ fontFamily: "'Cinzel', serif" }}>Ministry Approved By</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['AETHER CLOUD', 'ARCBYTE LABS', 'NEBULA SYSTEMS', 'MYSTIC AI'].map((sponsor, i) => (
              <div key={i} className="h-24 border border-teal-800/50 bg-[#031d1f] rounded-lg flex items-center justify-center hover:border-[#d4af37]/50 transition-colors cursor-pointer">
                <span className="text-teal-500 font-bold text-sm tracking-wider">{sponsor}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 4. Apparate Here (Map) */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl text-[#d4af37] mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Apparate Here</h2>
          <h3 className="text-2xl font-bold text-white mb-4">Vasantdada Patil Pratishthan's College of Engineering & Visual Arts</h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
            Vasantdada Patil Educational Complex, Eastern Express Highway, Near Everard Nagar, Sion-Chunabhatti, Mumbai, Maharashtra 400022
          </p>
          <p className="text-teal-300 font-bold mb-8">Event Date: April 17-19, 2026</p>
          <button className="px-6 py-3 border border-teal-500 text-teal-300 hover:bg-teal-900/60 rounded-md transition-all font-semibold text-sm">
            Open in Maps
          </button>
        </div>
        
        <div className="h-80 md:h-full bg-[#010e0f] border border-[#d4af37]/30 rounded-xl flex items-center justify-center">
            <span className="text-gray-600 font-semibold">Embedded Map Placeholder</span>
        </div>
      </motion.div>

    </div>
  );
};

export default InfoSections;