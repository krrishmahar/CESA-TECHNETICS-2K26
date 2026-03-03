import { motion } from 'framer-motion';

const eventsList = [
  { title: "The Tri-Wizard Tournament", desc: "Model-building race with magical datasets.", team: "1-3", prize: "₹15,000" },
  { title: "The Dark Mark Bounty", desc: "Autonomous drones battle in arcane arenas.", team: "3-4", prize: "₹12,000" },
  { title: "Half Blood Prince's Handbook", desc: "Design spellbinding interfaces under pressure.", team: "2", prize: "₹10,000" },
  { title: "The Gameshow", desc: "Competitive coding under enchanted constraints.", team: "2-3", prize: "₹10,000" },
  // Baaki 4 yahan add kar lena array mein
];

const Events = () => {
  return (
    <div className="py-20 px-8 bg-[#021516] min-h-screen" id="events">
      <h2 className="text-5xl text-[#d4af37] mb-12" style={{ fontFamily: "'Cinzel', serif" }}>
        The Eight Magical Trials
      </h2>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {eventsList.map((event, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-[#031d1f] border border-[#d4af37]/30 rounded-xl p-4 flex flex-col group hover:border-[#d4af37] transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-[#d4af37] mb-4">{event.title}</h3>
            
            {/* Poster Image Placeholder */}
            <div className="w-full h-48 bg-black/50 rounded-lg mb-4 border border-[#d4af37]/20 flex items-center justify-center overflow-hidden">
               {/* Replace with actual image: <img src="..." className="object-cover" /> */}
               <span className="text-xs text-gray-500">Poster Placeholder</span>
            </div>

            <p className="text-sm text-gray-300 mb-4 flex-grow">{event.desc}</p>
            
            <div className="text-xs text-gray-400 mb-4 flex justify-between">
              <span>Team: {event.team}</span>
              <span>Prize: {event.prize}</span>
            </div>

            <button className="w-max px-4 py-2 text-xs font-semibold text-teal-100 border border-teal-800 rounded-md hover:bg-teal-900/50 transition-colors">
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Events;