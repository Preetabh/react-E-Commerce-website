import { motion } from "framer-motion";

const Logo = ({
  size = "md",
  variant = "default",
  showText = true,
  animated = false,
  className = "",
}) => {
  const iconSizes = {
    sm: 30,
    md: 36,
    lg: 64,
    xl: 88,
  };

  const currentSize = typeof size === "number" ? size : iconSizes[size] || 36;

  const getColors = () => {
    switch (variant) {
      case "light":
        return {
          bg: "bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border border-white/25 shadow-lg shadow-black/20",
          textPrimary: "text-white drop-shadow-sm",
          textSecondary: "text-blue-200/90",
          glowColor: "from-cyan-400/40 via-blue-500/40 to-indigo-500/40",
          ringColor: "border-cyan-400/30",
        };
      case "dark":
        return {
          bg: "bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl shadow-slate-950/40",
          textPrimary: "text-slate-900",
          textSecondary: "text-slate-500",
          glowColor: "from-blue-600/30 via-indigo-600/30 to-purple-600/30",
          ringColor: "border-slate-700/40",
        };
      case "gold":
        return {
          bg: "bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-amber-900/30 backdrop-blur-md border border-amber-500/30 shadow-xl",
          textPrimary: "text-amber-400",
          textSecondary: "text-amber-600",
          glowColor: "from-amber-500/40 via-yellow-500/30 to-orange-500/30",
          ringColor: "border-amber-400/40",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/80 text-white shadow-xl shadow-blue-950/30 border border-slate-800/80",
          textPrimary: "text-slate-900",
          textSecondary: "text-slate-500",
          glowColor: "from-blue-500/40 via-indigo-500/40 to-purple-500/40",
          ringColor: "border-blue-500/30",
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Emblem Container with Rotating Holographic Orbit & Glow */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className="relative flex items-center justify-center"
      >
        {/* Animated Rotating Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className={`absolute -inset-1.5 rounded-2xl border ${colors.ringColor} border-dashed pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity`}
        />

        {/* Ambient Multi-layer Aura Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${colors.glowColor} blur-md -z-10`}
        />

        {/* Core Emblem Badge Box */}
        <div
          className={`relative flex items-center justify-center rounded-2xl p-2 transition-all duration-300 overflow-hidden ${colors.bg}`}
          style={{ width: currentSize, height: currentSize }}
        >
          {/* Shimmering Light Sweep Bar across Emblem */}
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
          />

          {/* SVG Luxury Emblem */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md relative z-10"
          >
            <defs>
              <linearGradient
                id="luxuryLogoGradMain"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="45%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>

              <linearGradient
                id="luxuryLogoGradAccent"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>

              <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Hexagonal Geometric Luxury Frame */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M 50 8 L 86 28 L 86 72 L 50 92 L 14 72 L 14 28 Z"
              fill="url(#luxuryLogoGradMain)"
              fillOpacity="0.12"
              stroke="url(#luxuryLogoGradMain)"
              strokeWidth="3.5"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />

            {/* Shopping Bag Crown Arch */}
            <path
              d="M 34 32 C 34 18, 66 18, 66 32"
              stroke="url(#luxuryLogoGradMain)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Interlocking Glowing S-M Luxury Ribbon Crest */}
            <path
              d="M 30 46 C 30 38, 70 36, 70 46 C 70 56, 30 54, 30 64 C 30 74, 70 72, 70 64"
              stroke="url(#luxuryLogoGradMain)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#neonGlow)"
            />

            {/* Glowing Accent Sparks */}
            <circle cx="70" cy="30" r="3.5" fill="#38bdf8" className="animate-ping opacity-75" />
            <circle cx="70" cy="30" r="3.5" fill="#38bdf8" />
            <circle cx="30" cy="70" r="3.5" fill="#a855f7" />
          </svg>
        </div>
      </motion.div>

      {/* Brand Name Typography with Shimmering Gradient */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-xl font-black tracking-tight leading-none transition-colors">
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-indigo-400 transition-all duration-300">
                Shop
              </span>
              <span className={variant === "light" ? "text-white" : "text-slate-900"}>
                Mart
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <span className="h-[1px] w-2 bg-blue-500/60 rounded-full" />
            <span
              className={`text-[9px] sm:text-[10px] font-extrabold tracking-[0.25em] uppercase ${colors.textSecondary}`}
            >
              Luxury Mall
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
