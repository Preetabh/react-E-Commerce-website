import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Shop Mart...");
  const [isVisible, setIsVisible] = useState(true);

  // Generate floating background particle positions
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 2,
    }));
  }, []);

  useEffect(() => {
    // Check if user already loaded splash in this session
    if (sessionStorage.getItem("hasLoadedApp")) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sessionStorage.setItem("hasLoadedApp", "true");
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }

        const increment = Math.floor(Math.random() * 10) + 7;
        const next = Math.min(prev + increment, 100);

        if (next < 25) {
          setStatusText("Establishing Secure Luxury Gateway...");
        } else if (next < 55) {
          setStatusText("Loading Curated Premium Catalog...");
        } else if (next < 85) {
          setStatusText("Personalizing AI Concierge & Recommendations...");
        } else {
          setStatusText("Ready! Welcome to Shop Mart Luxury Mall");
        }

        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#05070d] text-white select-none overflow-hidden"
        >
          {/* Ambient Glowing Background Lights */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-blue-600/20 blur-[140px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-purple-600/20 blur-[130px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[110px] pointer-events-none" />

          {/* Laser Scanner Horizontal Beam */}
          <motion.div
            animate={{
              y: ["-100vh", "100vh"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] opacity-40 pointer-events-none"
          />

          {/* Floating Light Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
              }}
              className="absolute rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] pointer-events-none"
            />
          ))}

          {/* Main Content Card Container */}
          <div className="relative z-10 flex flex-col items-center max-w-md px-8 py-10 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 shadow-2xl shadow-black/80 text-center">
            {/* Concentric Pulse Ripples behind Logo */}
            <div className="relative flex items-center justify-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-24 h-24 rounded-full border border-cyan-400/40"
              />
              <motion.div
                animate={{ scale: [1, 2.1], opacity: [0.4, 0] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-24 h-24 rounded-full border border-indigo-500/30"
              />

              {/* Logo Component */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Logo size="lg" variant="light" showText={true} animated={true} />
              </motion.div>
            </div>

            {/* Audio/Data Soundwave Visualizer Bars */}
            <div className="flex items-center gap-1.5 h-6 mb-2">
              {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7].map((height, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [height, 1.4, 0.3, height],
                  }}
                  transition={{
                    duration: 0.8 + i * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1 bg-gradient-to-t from-blue-500 via-cyan-400 to-indigo-400 rounded-full h-full shadow-[0_0_8px_#38bdf8]"
                />
              ))}
            </div>

            {/* Progress Percentage Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-baseline gap-1 my-2"
            >
              <span className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                {progress}
              </span>
              <span className="text-2xl font-black text-cyan-400">%</span>
            </motion.div>

            {/* Dynamic Status Text */}
            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-semibold tracking-wide text-slate-300 h-6 mb-6"
            >
              {statusText}
            </motion.p>

            {/* Animated Progress Bar Track */}
            <div className="relative w-72 h-2.5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(56,189,248,0.9)] relative"
              >
                {/* Sparkle Light Head */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white rounded-full blur-[1px] shadow-[0_0_12px_#fff]" />
              </motion.div>
            </div>

            {/* Footer luxury mark */}
            <span className="text-[9px] uppercase tracking-[0.35em] text-slate-400/80 font-extrabold mt-8 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-cyan-400 animate-ping" />
              Next-Gen Shopping Platform
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
