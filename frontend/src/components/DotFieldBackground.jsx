import React, { useEffect, useRef } from "react";

const DotFieldBackground = ({
  dotColor = "rgba(0, 113, 227, 0.25)",
  activeColor = "rgba(0, 113, 227, 0.8)",
  gap = 28,
  dotRadius = 1.8,
  waveRadius = 160,
  speed = 1,
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.015 * speed;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const originX = i * gap;
          const originY = j * gap;

          // Distance from mouse position
          const dx = mouseX - originX;
          const dy = mouseY - originY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Sine wave ambient float
          const waveOffset = Math.sin(time + i * 0.3 + j * 0.3) * 3;

          let drawX = originX;
          let drawY = originY + waveOffset;
          let currentRadius = dotRadius;
          let alpha = 0.15;
          let glow = false;

          // Mouse wave repulsion & highlight
          if (dist < waveRadius) {
            const factor = (1 - dist / waveRadius);
            const angle = Math.atan2(dy, dx);
            const push = factor * 14;

            drawX -= Math.cos(angle) * push;
            drawY -= Math.sin(angle) * push;

            currentRadius = dotRadius + factor * 2.8;
            alpha = 0.15 + factor * 0.7;
            glow = true;
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, currentRadius, 0, Math.PI * 2);

          if (glow) {
            ctx.fillStyle = activeColor;
            ctx.shadowBlur = 8;
            ctx.shadowColor = activeColor;
          } else {
            ctx.fillStyle = dotColor;
            ctx.shadowBlur = 0;
          }

          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotColor, activeColor, gap, dotRadius, waveRadius, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full ${className}`}
    />
  );
};

export default DotFieldBackground;
