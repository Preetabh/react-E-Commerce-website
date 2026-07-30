import React, { useEffect, useRef } from "react";

const plasmaPalettes = {
  apple: [
    [0, 113, 227],    // #0071e3 Electric Apple Blue
    [139, 92, 246],   // #8b5cf6 Deep Violet
    [16, 185, 129],   // #10b981 Emerald Teal
    [236, 72, 153],   // #ec4899 Neon Magenta
  ],
  cyber: [
    [6, 182, 212],    // #06b6d4 Neon Cyan
    [236, 72, 153],   // #ec4899 Neon Pink
    [124, 58, 237],   // #7c3aed Royal Purple
    [245, 158, 11],   // #f59e0b Electric Amber
  ],
};

const PlasmaBackground = ({
  palette = "apple",
  speed = 1.0,
  scale = 1.0,
  opacity = 0.5,
  interactive = true,
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = Math.floor(window.innerWidth / 2));
    let height = (canvas.height = Math.floor(window.innerHeight / 2));

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      width = canvas.width = Math.floor(window.innerWidth / 2);
      height = canvas.height = Math.floor(window.innerHeight / 2);
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      targetMouseX = (e.clientX / window.innerWidth) * width;
      targetMouseY = (e.clientY / window.innerHeight) * height;
    };

    window.addEventListener("resize", handleResize);
    if (interactive) window.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    const colors = plasmaPalettes[palette] || plasmaPalettes.apple;

    const render = () => {
      time += 0.015 * speed;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      const factorX = (0.012 * scale) / (width / 400);
      const factorY = (0.012 * scale) / (height / 400);

      let ptr = 0;
      for (let y = 0; y < height; y++) {
        const ny = y * factorY;
        const dy = y - mouseY;

        for (let x = 0; x < width; x++) {
          const nx = x * factorX;
          const dx = x - mouseX;
          const dist = Math.sqrt(dx * dx + dy * dy) * 0.05;

          // React Bits Plasma Shader Equation
          const v1 = Math.sin(nx + time);
          const v2 = Math.sin(ny + time * 1.2);
          const v3 = Math.sin(nx + ny + time * 0.8);
          const v4 = Math.sin(dist + time * 1.5);

          const value = (v1 + v2 + v3 + v4 + 4) / 8; // Normalize 0 to 1

          // Color interpolation across palette
          const colorIndex = value * (colors.length - 1);
          const idx1 = Math.floor(colorIndex);
          const idx2 = Math.min(idx1 + 1, colors.length - 1);
          const pct = colorIndex - idx1;

          const c1 = colors[idx1];
          const c2 = colors[idx2];

          const r = Math.round(c1[0] + (c2[0] - c1[0]) * pct);
          const g = Math.round(c1[1] + (c2[1] - c1[1]) * pct);
          const b = Math.round(c1[2] + (c2[2] - c1[2]) * pct);

          data[ptr] = r;
          data[ptr + 1] = g;
          data[ptr + 2] = b;
          data[ptr + 3] = Math.round(opacity * 255 * (0.6 + value * 0.4));

          ptr += 4;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [palette, speed, scale, opacity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full object-cover ${className}`}
    />
  );
};

export default PlasmaBackground;
