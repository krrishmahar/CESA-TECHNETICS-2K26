import { motion } from 'framer-motion';

const InfoSections = () => {
  const handleMapRedirect = () => {
    window.open("https://maps.app.goo.gl/YourActualCollegeLink", "_blank");
  };

  const handleRegistration = () => {
    window.open("https://clubly.in/technetics2k26", "_blank");
  };

  return (
    <div className="bg-[#021516] px-6 md:px-12 py-24 text-white font-sans space-y-32">
      
      {/* 1. What is Technetics? */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl text-[#d4af37] mb-10" style={{ fontFamily: "'Cinzel', serif" }}>
          What is Technetics?
        </h2>
        <div className="border border-[#d4af37]/20 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-[#031d1f] to-[#021516] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-[#d4af37]/10"></div>
          <h3 className="text-2xl font-bold text-teal-100 mb-6 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-teal-500"></span>
            An Arcane-Tech Convergence
          </h3>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-4xl">
            Technetics 2K26 is the flagship technical festival of <span className="text-[#d4af37] font-semibold">VPPCOE&VA</span>. 
            It is a mystical realm where the boundaries of technology and magic blur. Join us for three days of intense 
            coding battles, hardware enchantments, and arcane design challenges. Whether you are a master sorcerer 
            of code or a novice wizard looking to learn, Technetics has a trial waiting for you.
          </p>
        </div>
      </motion.div>

      {/* 2. Official Registration Portal (Clubly) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }} 
        className="max-w-7xl mx-auto border-2 border-teal-500/30 rounded-3xl p-8 md:p-16 bg-[#021b1c] relative overflow-hidden text-center md:text-left"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <div className="inline-block px-4 py-1 bg-teal-900/40 text-teal-300 border border-teal-700 rounded-full text-[10px] font-black tracking-[0.3em] mb-6">
              POWERED BY CLUBLY
            </div>
            <h2 className="text-4xl md:text-5xl text-white mb-6 font-bold">Secure Your Seat In The <span className="text-teal-400 font-black">Ministry</span></h2>
            <p className="text-gray-400 max-w-xl text-base md:text-lg mb-8 leading-relaxed">
              Clubly is our official all-in-one digital gateway. Manage your team, track trial progress, 
              and download your enchanted certificates through the portal developed by Shaan Edroos.
            </p>
            <button 
              onClick={handleRegistration}
              className="px-10 py-4 bg-teal-500 text-black hover:bg-teal-400 rounded-xl transition-all font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(20,184,166,0.3)]"
            >
              Register on Clubly
            </button>
          </div>
          <div className="hidden lg:block w-1/3 opacity-20">
             {/*  */}
          </div>
        </div>
      </motion.div>

      {/* 3. Discord & Sponsors */}
      <div className="max-w-7xl mx-auto space-y-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl text-[#d4af37] mb-8" style={{ fontFamily: "'Cinzel', serif" }}>Join The Owl Network</h2>
            <div className="space-y-6 mb-10">
              {['Instant Trial Q&A', '24/7 Arcane Bot Support', 'Live Ministry Announcements', 'Direct Organizer Interaction'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="h-2 w-2 rounded-full bg-[#d4af37] group-hover:scale-150 transition-transform"></div>
                  <span className="text-gray-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
            <button className="px-8 py-4 border-2 border-indigo-500 text-indigo-300 hover:bg-indigo-900/40 rounded-xl transition-all font-bold uppercase tracking-widest text-sm">
              Join Discord Server
            </button>
          </motion.div>
          
          <div className="h-80 bg-gradient-to-br from-[#042a2b] to-[#021516] border border-[#d4af37]/20 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="text-center z-10 transition-transform group-hover:scale-110 duration-500">
                <h3 className="text-6xl font-black text-teal-400 mb-2 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">DISCORD ✦</h3>
                <p className="text-xs text-teal-600 tracking-[0.5em] uppercase font-black">Owl Signal Active</p>
             </div>
             <div className="absolute -bottom-10 w-64 h-20 bg-teal-500/20 rounded-[100%] blur-[60px]"></div>
          </div>
        </div>
      </div>

      {/* 4. Apparate Here (Map) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16"
      >
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl text-[#d4af37] mb-8" style={{ fontFamily: "'Cinzel', serif" }}>Apparate Here</h2>
          <h3 className="text-2xl font-bold text-white mb-6">Vasantdada Patil Pratishthan's College of Engineering & Visual Arts</h3>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-4 border-[#d4af37]/30 pl-6">
            Vasantdada Patil Educational Complex, Eastern Express Highway, Sion-Chunabhatti, Mumbai 400022
          </p>
          <div className="bg-teal-900/20 border border-teal-800/50 p-6 rounded-2xl mb-8">
            <p className="text-teal-300 font-bold flex items-center gap-3 italic">
              <span className="text-2xl">⚡</span> Arrival window: April 17-19, 2026
            </p>
          </div>
          <button 
            onClick={handleMapRedirect}
            className="w-fit px-8 py-4 border-2 border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-black rounded-xl transition-all font-black uppercase tracking-widest text-sm"
          >
            Open in Maps
          </button>
        </div>
        
        <div className="h-[450px] w-full rounded-3xl overflow-hidden border-2 border-[#d4af37]/20 shadow-[0_0_40px_rgba(212,175,55,0.1)] relative group">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.439832743845!2d72.8724!3d19.0431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf2a3f890255%3A0xc328a2a7f5df582d!2sVasantdada%20Patil%20Pratishthan's%20College%20of%20Engineering%20And%20Visual%20Arts!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(80%) contrast(120%)' }} 
            allowFullScreen={true} 
            loading="lazy" 
            className="absolute inset-0"
          ></iframe>
          <div className="absolute inset-0 pointer-events-none border-[12px] border-[#021516] rounded-3xl"></div>
        </div>
      </motion.div>

    </div>
  );
};

export default InfoSections;