// src/App.tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';

function App() {
  return (
    // Dark base background rakhte hain fallback ke liye
    <div className="bg-[#050505] min-h-screen text-white font-sans">
      <Navbar />
      <Hero />
      <Events />
      {/* Abhi yahan niche ke sections aayenge */}
      <div className="h-screen bg-black flex items-center justify-center">
         <h2 className="text-4xl text-gray-500">Scroll karke dekh, Events yahan aayenge...</h2>
      </div>
    </div>
  );
}

export default App;