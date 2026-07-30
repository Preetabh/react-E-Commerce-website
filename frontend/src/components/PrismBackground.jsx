import React, { useEffect, useRef } from "react";

const PrismBackground = ({
  opacity = 0.55,
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

    // Prismatic Refractive Light Beams
    const prismRays = [
      { color: "rgba(0, 113, 227, ", size: 0.65, speed: 0.008, phase: 0 },
      { color: "rgba(139, 92, 246, ", size: 0.55, speed: 0.012, phase: 2.1 },
      { color: "rgba(236, 72, 153, ", size: 0.48, speed: 0.007, phase: 4.2 },
      { color: "rgba(16, 185, 129, ", size: 0.42, speed: 0.011, phase: 1.5 },
      { color: "rgba(245, 158, 11, ", size: 0.38, speed: 0.015, phase: 3.6 },
    ];

    const render = () => {
      time += 0.01 * speed;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Ambient Deep Space Canvas Gradient
      const bgGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        20,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, "rgba(15, 23, 42, 0.95)");
      bgGrad.addColorStop(0.7, "rgba(11, 15, 25, 0.98)");
      bgGrad.addColorStop(1, "rgba(7, 10, 19, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Refracted Prismatic Spectral Light Beams
      prismRays.forEach((ray, i) => {
        const cx =
          width / 2 +
          Math.sin(time * ray.speed * 10 + ray.phase) * (width * 0.3) +
          (mouseX - width / 2) * 0.12 * (i + 1);
        const cy =
          height / 2 +
          Math.cos(time * ray.speed * 8 + ray.phase) * (height * 0.25) +
          (mouseY - height / 2) * 0.12 * (i + 1);

        const radius = Math.max(width, height) * ray.size;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

        const rayAlpha = (0.28 + Math.sin(time + ray.phase) * 0.1) * opacity;
        grad.addColorStop(0, `${ray.color}${rayAlpha})`);
        grad.addColorStop(0.5, `${ray.color}${rayAlpha * 0.35})`);
        grad.addColorStop(1, `${ray.color}0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // Refractive Prism Light Rays (Dynamic Angles)
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const angle = time * 0.6 + (i * Math.PI) / 2;
        const rayLength = 220 + Math.sin(time * 2 + i) * 60;
        const x1 = mouseX + Math.cos(angle) * rayLength;
        const y1 = mouseY + Math.sin(angle) * rayLength;

        const lineGrad = ctx.createLinearGradient(mouseX, mouseY, x1, y1);
        lineGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
        lineGrad.addColorStop(0.4, "rgba(0, 113, 227, 0.25)");
        lineGrad.addColorStop(1, "rgba(236, 72, 153, 0)");

        ctx.strokeStyle = lineGrad;
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full ${className}`}
    />
  );
};

export default PrismBackground;
