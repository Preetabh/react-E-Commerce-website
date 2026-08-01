import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, QrCode, Cpu, Sparkles } from "lucide-react";
import { FaCoins } from "react-icons/fa6";

const LanyardCard = ({
  name = "Admin User",
  role = "Store Administrator",
  email = "admin@shopmart.com",
  contact = "+91 9876543210",
  balance = 0,
  profilePicture,
  isOwner = true,
  onBalanceClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Framer Motion 3D Physics Springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 relative z-10 select-none">
      {/* Lanyard Top Hanging Rope & Metal Clip */}
      <div className="flex flex-col items-center relative z-20">
        {/* Ribbon Strap Loop */}
        <div className="w-10 h-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-t-full shadow-md border-x-2 border-slate-700 flex flex-col items-center justify-between py-2 relative overflow-hidden">
          <div className="w-full text-[8px] font-black text-amber-400 tracking-widest rotate-90 uppercase whitespace-nowrap opacity-80">
            SHOP MART
          </div>
        </div>

        {/* Metallic Clip Holder */}
        <div className="w-8 h-4 bg-gradient-to-r from-slate-300 via-white to-slate-400 rounded-sm border border-slate-400 shadow-md flex items-center justify-center -mt-1 relative z-30">
          <div className="w-4 h-1.5 bg-slate-800 rounded-full border border-slate-400" />
        </div>

        {/* Steel Ring Swivel Hook */}
        <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-gradient-to-br from-slate-200 to-slate-400 -mt-1 shadow-sm flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900" />
        </div>
      </div>

      {/* 3D Tiltable Lanyard Pass Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden mt-1 group"
      >
        {/* Metallic Hologram Shine Overlay on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none transition-opacity duration-500 animate-pulse" />
        )}

        {/* Top Header Strip */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider text-slate-900 block leading-tight">
                SHOP MART
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                {isOwner ? "OFFICIAL ADMIN PASS" : "VIP MEMBER PASS"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <Cpu size={13} className="text-slate-700" />
            <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">
              CHIP-8402
            </span>
          </div>
        </div>

        {/* Main Badge Info */}
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar with Metallic Ring */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-slate-800 to-amber-500 shadow-md">
              <img
                src={
                  profilePicture ||
                  "https://img.icons8.com/ios7/1200/landlord.jpg"
                }
                alt={name}
                className="w-full h-full object-cover rounded-full border-2 border-white bg-slate-100"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-400 p-1.5 rounded-full border border-white shadow-xs">
              <Sparkles size={12} />
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1.5 flex-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-900 uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-900 px-3 py-0.5 rounded-full">
              {role}
            </span>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {name}
            </h2>

            <p className="text-xs text-slate-500 font-medium">{email}</p>
            <p className="text-[11px] text-slate-400 font-mono">{contact}</p>
          </div>
        </div>

        {/* Wallet Balance & QR Code Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          {/* Wallet Button */}
          <button
            onClick={onBalanceClick}
            type="button"
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-2xl shadow-xs transition-colors"
          >
            <FaCoins size={16} className="text-amber-400" />
            <div className="text-left">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block leading-none">
                Wallet
              </span>
              <span className="text-sm font-black text-white leading-tight">
                ₹ {(balance || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </button>

          {/* Security QR Code */}
          <div className="flex items-center gap-2 text-slate-400">
            <QrCode size={36} className="text-slate-800 opacity-90" />
            <div className="text-[9px] font-mono text-slate-400 leading-tight">
              <span>SECURED</span>
              <span className="block font-bold text-slate-600">VERIFIED</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LanyardCard;
