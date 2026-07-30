import React, { useEffect, useRef } from "react";

const LightRaysBackground = ({
  color = "#0071e3",
  secondaryColor = "#8b5cf6",
  opacity = 0.5,
  rayCount = 7,
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
    let mouseY = height * 0.2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      targetMouseX = e.clientX;
      targetMouseY = e.clientY * 0.4;
    };

    window.addEventListener("resize", handleResize);
    if (interactive) window.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    // Volumetric Rays Config
    const rays = Array.from({ length: rayCount }).map((_, i) => ({
      angle: (i / rayCount) * Math.PI * 0.9 - Math.PI * 0.45,
      width: Math.random() * 0.15 + 0.08,
      speed: (Math.random() * 0.4 + 0.6) * 0.005,
      opacityFactor: Math.random() * 0.4 + 0.6,
    }));

    const render = () => {
      time += 0.015 * speed;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Light Origin (top center or mouse driven)
      const originX = mouseX;
      const originY = -50;

      // Volumetric Beam Sweep
      rays.forEach((ray, i) => {
        const currentAngle = ray.angle + Math.sin(time * ray.speed * 10 + i) * 0.12;
        const beamWidth = width * ray.width;

        const x1 = originX + Math.sin(currentAngle - 0.1) * height * 1.5;
        const y1 = height * 1.2;
        const x2 = originX + Math.sin(currentAngle + 0.1) * height * 1.5;
        const y2 = height * 1.2;

        const grad = ctx.createLinearGradient(originX, originY, (x1 + x2) / 2, y1);

        const currentOpacity = (0.2 + Math.sin(time + i) * 0.12) * ray.opacityFactor * opacity;

        grad.addColorStop(0, "rgba(255, 255, 255, " + currentOpacity * 1.2 + ")");
        grad.addColorStop(0.3, "rgba(0, 113, 227, " + currentOpacity + ")");
        grad.addColorStop(0.7, "rgba(139, 92, 246, " + currentOpacity * 0.5 + ")");
        grad.addColorStop(1, "rgba(0, 113, 227, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
      });

      // Top Volumetric Laser Glow Orb
      const orbGrad = ctx.createRadialGradient(originX, 0, 0, originX, 0, width * 0.5);
      orbGrad.addColorStop(0, "rgba(0, 113, 227, " + opacity * 0.6 + ")");
      orbGrad.addColorStop(0.5, "rgba(139, 92, 246, " + opacity * 0.2 + ")");
      orbGrad.addColorStop(1, "rgba(0, 113, 227, 0)");

      ctx.fillStyle = orbGrad;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, secondaryColor, opacity, rayCount, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full ${className}`}
    />
  );
};

export default LightRaysBackground;
