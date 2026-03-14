import { motion } from 'framer-motion';

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  duration: 2 + Math.random() * 3,
  delay: Math.random() * 5,
  color: (i % 3 === 0) ? '#B5FFF0' : (i % 2 === 0) ? '#ffffff' : '#d4af37',
}));

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#021516]">
      {/* Twinkling Stars */}
      <div className="absolute inset-0 z-0">
        {STARS.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: star.color,
              boxShadow: `0 0 10px 1px ${star.color}66`,
            }}
            animate={{ opacity: [0, 0.7, 0.2, 0.8, 0], scale: [0.5, 1, 0.8, 1.2, 0.5] }}
            transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Ambient particles background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#B5FFF0]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#B5FFF0]/5 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60" />
      
      {/* Subtle Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};