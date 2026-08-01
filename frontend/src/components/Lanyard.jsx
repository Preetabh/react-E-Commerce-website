import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, QrCode, Sparkles, CreditCard, Move, Award } from 'lucide-react';
import { FaCoins } from 'react-icons/fa6';
import './Lanyard.css';

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  // Additional profile data props
  userName = "Shop Mart Member",
  userRole = "VERIFIED MEMBER",
  userEmail = "user@shopmart.com",
  userContact = "+91 9876543210",
  userBalance = 250,
  isOwner = false,
  onBalanceClick,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Motion Values for Card Drag Physics
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Spring Physics for Dynamic Ribbon Stretch & Sway
  const smoothX = useSpring(dragX, { stiffness: 220, damping: 15, mass: 1 });
  const smoothY = useSpring(dragY, { stiffness: 220, damping: 15, mass: 1 });

  // Ribbon Stretch & Dynamic Angular Flexing (Top is 100% Fixed at Top 0)
  const ribbonScaleY = useTransform(smoothY, [-60, 220], [0.85, 1.45]);
  const ribbonSkewX = useTransform(smoothX, [-180, 180], [-16, 16]);
  
  // Individual Ribbon Angles adapting dynamically towards drag direction
  const leftRibbonRotate = useTransform(smoothX, [-180, 180], [-28, 4]);
  const rightRibbonRotate = useTransform(smoothX, [-180, 180], [-4, 28]);

  // Metallic Clip & Ring Rotation angle (Tilts smoothly with drag)
  const clipRotate = useTransform(smoothX, [-180, 180], ["-18deg", "18deg"]);

  return (
    <div className="lanyard-wrapper">
      <div className="flex flex-col items-center justify-start relative z-10 select-none w-full">
        
        {/* TOP FIXED NECK RIBBON ANCHOR - TOP IS IMMOVABLE AT TOP 0 */}
        <div className="flex flex-col items-center relative z-20 pointer-events-none">
          {/* Dual V-Shape Ribbon Straps Pinned at Top Center */}
          <motion.div
            style={{
              scaleY: ribbonScaleY,
              skewX: ribbonSkewX,
              transformOrigin: "top center",
            }}
            className="flex justify-center items-end relative h-52 w-56 overflow-hidden"
          >
            {/* Left Neck Ribbon Strap - Pinned Top Right Origin */}
            <motion.div
              style={{ rotate: leftRibbonRotate, transformOrigin: "top right" }}
              className="lanyard-ribbon-left rounded-t-sm relative flex items-center justify-center"
            >
              <span className="text-[8px] font-black text-amber-400/90 uppercase tracking-widest -rotate-90 whitespace-nowrap">
                SHOP MART OFFICIAL PASS
              </span>
            </motion.div>

            {/* Right Neck Ribbon Strap - Pinned Top Left Origin */}
            <motion.div
              style={{ rotate: rightRibbonRotate, transformOrigin: "top left" }}
              className="lanyard-ribbon-right rounded-t-sm relative flex items-center justify-center -ml-2"
            >
              <span className="text-[8px] font-black text-amber-400/90 uppercase tracking-widest rotate-90 whitespace-nowrap">
                VERIFIED IDENTITY BADGE
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Physics Drag & Pull Card Badge + Attached Metallic Clip (MOVE IN 100% UNISON) */}
        <motion.div
          drag
          dragSnapToOrigin={true}
          dragElastic={0.65}
          dragConstraints={{ left: -180, right: 180, top: -60, bottom: 220 }}
          onDrag={(e, info) => {
            dragX.set(info.offset.x);
            dragY.set(info.offset.y);
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            setIsDragging(false);
            dragX.set(0);
            dragY.set(0);
          }}
          whileDrag={{ scale: 1.05, cursor: "grabbing" }}
          style={{
            x: smoothX,
            y: smoothY,
          }}
          className="flex flex-col items-center relative z-30 cursor-grab active:cursor-grabbing group -mt-10"
        >
          {/* Stainless Steel Metallic Clip Holder & Swivel Ring (HARD-LOCKED TO CARD TOP) */}
          <motion.div
            style={{ rotate: clipRotate }}
            className="flex flex-col items-center z-40 mb-[-12px]"
          >
            {/* Stainless Steel Metallic Clip Holder */}
            <div className="w-10 h-4.5 bg-gradient-to-r from-slate-300 via-white to-slate-400 rounded-sm border border-slate-400 shadow-md flex items-center justify-center relative">
              <div className="w-5 h-1.5 bg-slate-800 rounded-full border border-slate-400" />
            </div>

            {/* Steel Swivel Ring Hook */}
            <div className="w-7 h-7 rounded-full border-2 border-slate-300 bg-gradient-to-br from-slate-200 to-slate-400 -mt-1 shadow-sm flex items-center justify-center z-40">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900" />
            </div>
          </motion.div>

          {/* Identity Card Badge Body */}
          <div
            onClick={() => {
              if (!isDragging) {
                setIsFlipped(!isFlipped);
              }
            }}
            className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl transition-shadow duration-300 overflow-hidden group lanyard-card-container z-30"
          >
            {/* Drag & Pull Indicator Pill */}
            <div className="absolute top-2.5 right-4 z-40 flex items-center gap-1 bg-slate-100/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
              <Move size={10} className="text-slate-700 animate-pulse" />
              <span>Drag &amp; Pull</span>
            </div>

            {/* FRONT FACE OF CARD */}
            {!isFlipped ? (
              <div className="space-y-4">
                {/* Custom Front Image if Provided */}
                {frontImage ? (
                  <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                    <img
                      src={frontImage}
                      alt="Card Front"
                      className={`w-full h-full object-${imageFit}`}
                    />
                  </div>
                ) : (
                  <>
                    {/* Top Header Strip */}
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 pr-28">
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

                      <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs text-[9px] font-black uppercase tracking-widest border border-amber-400/80">
                        <Award size={12} className="text-slate-950" />
                        <span>RIBBON TAG</span>
                      </div>
                    </div>

                    {/* Main Badge Info */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                      {/* Avatar with Metallic Golden Foil Frame */}
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-slate-800 to-amber-500 shadow-md">
                          <img
                            src={
                              userRole === "STORE OWNER & ADMINISTRATOR" || isOwner
                                ? "https://img.icons8.com/ios7/1200/landlord.jpg"
                                : "https://static.vecteezy.com/system/resources/previews/020/192/489/non_2x/winner-human-or-happy-human-logo-design-vector.jpg"
                            }
                            alt={userName}
                            className="w-full h-full object-cover rounded-full border-2 border-white bg-slate-100"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-400 p-1.5 rounded-full border border-white shadow-xs">
                          <Sparkles size={12} />
                        </div>
                      </div>

                      {/* User Details */}
                      <div className="space-y-1.5 flex-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-900 px-3 py-0.5 rounded-full">
                          {userRole}
                        </span>

                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                          {userName}
                        </h2>

                        <p className="text-xs text-slate-500 font-medium">{userEmail}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{userContact}</p>
                      </div>
                    </div>

                    {/* Wallet Balance & QR Code Bottom Bar */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBalanceClick) onBalanceClick();
                        }}
                        type="button"
                        className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-2xl shadow-xs transition-colors"
                      >
                        <FaCoins size={16} className="text-amber-400" />
                        <div className="text-left">
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block leading-none">
                            Wallet Balance
                          </span>
                          <span className="text-sm font-black text-white leading-tight">
                            ₹ {(userBalance || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 text-slate-400">
                        <QrCode size={36} className="text-slate-800 opacity-90" />
                        <div className="text-[9px] font-mono text-slate-400 leading-tight">
                          <span>SECURED</span>
                          <span className="block font-bold text-slate-600">VERIFIED</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* BACK FACE OF CARD */
              <div className="space-y-4 text-center py-4">
                {backImage ? (
                  <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                    <img
                      src={backImage}
                      alt="Card Back"
                      className={`w-full h-full object-${imageFit}`}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 py-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-800">
                      <CreditCard size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Shop Mart Identity Card</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      This official digital credential provides access to express checkouts, exclusive cashback deals, and priority Genius support.
                    </p>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-widest pt-2">
                      CLICK TO FLIP BACK
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
