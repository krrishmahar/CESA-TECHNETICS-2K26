import { motion } from 'framer-motion';

const InfoSections = () => {
  return (
    <div className="bg-[#021516] px-8 py-20 text-white font-sans">
      
      {/* Registration Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="max-w-6xl mx-auto border border-[#d4af37]/30 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-[#031d1f] to-[#021516] mb-16"
      >
        <h2 className="text-4xl text-[#d4af37] mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Official Registration Portal</h2>
        <div className="inline-block px-3 py-1 bg-teal-900/50 text-teal-200 border border-teal-700 rounded-md text-sm font-semibold mb-4">
          CLUBLY
        </div>
        <p className="text-gray-300 max-w-2xl mb-8">
          Clubly is an all-in-one digital gateway for student activities and college clubs, developed by Shaan Edroos.
        </p>
        <button className="px-6 py-3 bg-transparent border border-teal-500 text-teal-300 hover:bg-teal-900/40 rounded-md transition-all font-semibold">
          Register on Clubly
        </button>
      </motion.div>

      {/* Grid for Discord & Sponsors */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Discord Owl Network */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="p-8"
        >
          <h2 className="text-3xl text-[#d4af37] mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Join The Owl Network</h2>
          <ul className="space-y-3 text-gray-300 mb-8 list-disc pl-5">
            <li>Instant Q&A</li>
            <li>24/7 Bot support</li>
            <li>Live announcements</li>
            <li>Organizer interaction</li>
          </ul>
          <button className="px-6 py-3 border border-teal-500 text-teal-300 hover:bg-teal-900/40 rounded-md transition-all">
            Join Discord Server
          </button>
        </motion.div>

        {/* Discord Graphic Placeholder */}
        <div className="bg-gradient-to-br from-teal-900/40 to-black/40 border border-[#d4af37]/20 rounded-xl flex items-center justify-center p-8">
           <div className="text-center">
              <h3 className="text-4xl font-black text-teal-400 mb-2">DISCORD ✦</h3>
              <p className="text-xs text-teal-600 tracking-widest uppercase">Owl Signal Active</p>
           </div>
        </div>
      </div>

      {/* Map Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        <div>
          <h2 className="text-4xl text-[#d4af37] mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Apparate Here</h2>
          <h3 className="text-xl font-bold mb-2">Vasantdada Patil Pratishthan's College of Engineering & Visual Arts</h3>
          <p className="text-gray-400 text-sm mb-4">
            Vasantdada Patil Educational Complex, Eastern Express Highway, Near Everard Nagar, Sion-Chunabhatti, Mumbai, Maharashtra 400022
          </p>
          <p className="text-teal-200 font-semibold mb-8">Event Date: April 17-19, 2026</p>
          <button className="px-6 py-3 border border-teal-500 text-teal-300 hover:bg-teal-900/40 rounded-md transition-all">
            Open in Maps
          </button>
        </div>
        
        {/* Map iframe placeholder */}
        <div className="h-64 md:h-full bg-black/50 border border-[#d4af37]/30 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">Embedded Map Placeholder</span>
        </div>
      </motion.div>

    </div>
  );
};

export default InfoSections;