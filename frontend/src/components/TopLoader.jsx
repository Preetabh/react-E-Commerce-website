import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const TopLoader = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setProgress(25);

    const timer1 = setTimeout(() => {
      setProgress(70);
    }, 160);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 420);

    const timer3 = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-1.5 overflow-hidden">
          {/* Ambient Glow Line (Soft Background Glow) */}
          <motion.div
            initial={{ width: "0%", opacity: 0.8 }}
            animate={{ width: `${progress}%`, opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 via-purple-500 to-pink-500 blur-sm shadow-[0_0_20px_#38bdf8]"
          />

          {/* Crisp Main Progress Bar */}
          <motion.div
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: `${progress}%`, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 via-indigo-500 to-purple-600 relative"
          >
            {/* Shimmer Light Pulse Sweep */}
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
            />

            {/* Glowing Leading Flare Head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-300 blur-md shadow-[0_0_15px_#fff,-0_0_25px_#38bdf8]" />
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_8px_#fff]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TopLoader;
