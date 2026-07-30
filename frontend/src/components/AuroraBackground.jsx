import React, { useEffect, useRef } from "react";

const colorPalettes = {
  apple: [
    "rgba(0, 113, 227, ",    // Electric Apple Blue
    "rgba(99, 102, 241, ",   // Vivid Indigo
    "rgba(139, 92, 246, ",   // Deep Violet
    "rgba(16, 185, 129, ",   // Emerald Teal
  ],
  cyber: [
    "rgba(236, 72, 153, ",   // Neon Pink
    "rgba(6, 182, 212, ",    // Neon Cyan
    "rgba(124, 58, 237, ",   // Royal Purple
    "rgba(245, 158, 11, ",   // Electric Amber
  ],
  emerald: [
    "rgba(16, 185, 129, ",   // Emerald Green
    "rgba(13, 148, 136, ",   // Deep Teal
    "rgba(2, 132, 199, ",    // Oceanic Blue
    "rgba(168, 85, 247, ",   // Purple Accent
  ],
};

const AuroraBackground = ({
  palette = "apple",
  customColors,
  opacity = 0.65,
  speed = 1.0,
  interactive = true,
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

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    if (interactive) window.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    const colors = customColors || colorPalettes[palette] || colorPalettes.apple;

    const render = () => {
      time += 0.008 * speed;
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      ctx.clearRect(0, 0, width, height);

      // Deep Midnight Canvas Base
      const baseGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      baseGrad.addColorStop(0, "rgba(10, 14, 26, 0.96)");
      baseGrad.addColorStop(0.6, "rgba(7, 10, 19, 0.98)");
      baseGrad.addColorStop(1, "rgba(5, 7, 13, 1)");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Undulating Aurora Waves
      colors.forEach((col, idx) => {
        ctx.save();
        ctx.beginPath();

        const layerTime = time + idx * 1.5;
        const waveY = height * (0.35 + idx * 0.12);

        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 25) {
          const normX = x / width;
          const sine1 = Math.sin(normX * Math.PI * 3 + layerTime * 1.8);
          const sine2 = Math.cos(normX * Math.PI * 2 - layerTime * 1.2);
          const mouseInfluence = Math.sin((x - mouseX) * 0.003) * 35;

          const y = waveY + sine1 * 60 + sine2 * 40 + mouseInfluence;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, waveY - 120, width, height);
        const alpha = opacity * (0.4 + idx * 0.15);

        grad.addColorStop(0, `${col}${alpha})`);
        grad.addColorStop(0.5, `${col}${alpha * 0.5})`);
        grad.addColorStop(1, `${col}0)`);

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      // Ambient Aurora Refraction Glow Orbs
      colors.forEach((col, idx) => {
        const orbX = width * (0.2 + idx * 0.22) + Math.sin(time + idx) * 80;
        const orbY = height * (0.3 + (idx % 2) * 0.25) + Math.cos(time * 0.8 + idx) * 60;
        const radius = Math.min(width, height) * 0.4;

        const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, radius);
        const orbAlpha = opacity * 0.25;

        orbGrad.addColorStop(0, `${col}${orbAlpha})`);
        orbGrad.addColorStop(0.7, `${col}${orbAlpha * 0.2})`);
        orbGrad.addColorStop(1, `${col}0)`);

        ctx.fillStyle = orbGrad;
        ctx.fillRect(0, 0, width, height);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [palette, customColors, opacity, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full ${className}`}
    />
  );
};

export default AuroraBackground;
