const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 px-6 md:px-12 border-t border-teal-900/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-[#d4af37] font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Announcements</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#d4af37] font-bold mb-4">Social</h4>
          <div className="flex space-x-4">
            {/* Social Icons Placeholders */}
            <div className="w-8 h-8 border border-teal-800 rounded-full flex items-center justify-center hover:bg-teal-900 transition-colors cursor-pointer">F</div>
            <div className="w-8 h-8 border border-teal-800 rounded-full flex items-center justify-center hover:bg-teal-900 transition-colors cursor-pointer">In</div>
            <div className="w-8 h-8 border border-teal-800 rounded-full flex items-center justify-center hover:bg-teal-900 transition-colors cursor-pointer">X</div>
          </div>
        </div>
        <div>
          <h4 className="text-[#d4af37] font-bold mb-4">Community</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Discord Link</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Clubly Link</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-teal-900/30 text-xs text-center flex justify-between items-center">
        <p>© 2026 TECHNETICS. All rights reserved.</p>
        <div className="w-8 h-8 bg-teal-900/50 rounded-full flex items-center justify-center cursor-pointer border border-teal-700">
          <span className="text-[#d4af37] font-bold">↑</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;