import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const TargetCursor = ({
  color = "#0071e3",
  targetSelector = "button, a, input, select, textarea, .apple-card, .apple-card-dark, .apple-btn-primary, .apple-btn-dark, .apple-3d-card, [role='button'], [data-target-cursor]",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [targetBounds, setTargetBounds] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 26, stiffness: 380, mass: 0.45 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Do not mount custom target cursor on touch / mobile devices
    if (window.matchMedia("(hover: none)").matches) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target.closest(targetSelector);
      if (target) {
        setIsHovered(true);
        const rect = target.getBoundingClientRect();
        setTargetBounds({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: Math.min(rect.width + 10, 480),
          height: Math.min(rect.height + 10, 480),
        });
      } else {
        setIsHovered(false);
        setTargetBounds(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible, targetSelector]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Central Precision Laser Point */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#0071e3] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_#0071e3]"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
      />

      {/* React Bits Target Reticle Frame */}
      <motion.div
        className="fixed top-0 left-0 border rounded-2xl flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-colors duration-200"
        style={{
          x: isHovered && targetBounds ? targetBounds.x : cursorX,
          y: isHovered && targetBounds ? targetBounds.y : cursorY,
          width: isHovered && targetBounds ? targetBounds.width : 34,
          height: isHovered && targetBounds ? targetBounds.height : 34,
          borderColor: isHovered ? color : "rgba(0, 113, 227, 0.45)",
          boxShadow: isHovered
            ? `0 0 20px ${color}66, inset 0 0 12px ${color}22`
            : "0 0 10px rgba(0, 113, 227, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {/* Corner Aiming Brackets */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#0071e3] rounded-tl-md" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#0071e3] rounded-tr-md" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#0071e3] rounded-bl-md" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#0071e3] rounded-br-md" />

        {/* Center Target Dot when hovering */}
        {isHovered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-[#0071e3] shadow-[0_0_8px_#0071e3]"
          />
        )}
      </motion.div>
    </div>
  );
};

export default TargetCursor;
