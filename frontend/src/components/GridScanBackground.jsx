import React, { useEffect, useRef } from "react";

const GridScanBackground = ({
  gridSize = 34,
  scanColor = "#0071e3",
  lineColor = "rgba(0, 113, 227, 0.12)",
  scanSpeed = 1.2,
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

    let mouseX = -1000;
    let mouseY = -1000;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", handleResize);
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    let scanY = 0;

    const render = () => {
      scanY = (scanY + 2.5 * scanSpeed) % (height + 150);
      ctx.clearRect(0, 0, width, height);

      // Deep Canvas Backdrop
      ctx.fillStyle = "#070a13";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Matrix Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = lineColor;

      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render Laser Scan Beam Bar & Trailing Gradient
      const scanHeight = 120;
      const scanGrad = ctx.createLinearGradient(0, scanY - scanHeight, 0, scanY);
      scanGrad.addColorStop(0, "rgba(0, 113, 227, 0)");
      scanGrad.addColorStop(0.7, "rgba(0, 113, 227, 0.15)");
      scanGrad.addColorStop(1, "rgba(0, 113, 227, 0.7)");

      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - scanHeight, width, scanHeight);

      // Main Laser Line
      ctx.strokeStyle = scanColor;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = scanColor;

      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset shadow

      // Intersecting Node Flares & Mouse Proximity Pulsing
      const cols = Math.ceil(width / gridSize) + 1;
      const rows = Math.ceil(height / gridSize) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const nx = i * gridSize;
          const ny = j * gridSize;

          // Proximity to laser scan line
          const distToScan = Math.abs(ny - scanY);

          // Proximity to mouse
          const mdx = mouseX - nx;
          const mdy = mouseY - ny;
          const distToMouse = Math.sqrt(mdx * mdx + mdy * mdy);

          if (distToScan < 24 || distToMouse < 140) {
            let alpha = 0;
            if (distToScan < 24) alpha += (1 - distToScan / 24) * 0.9;
            if (distToMouse < 140) alpha += (1 - distToMouse / 140) * 0.8;
            alpha = Math.min(1, alpha);

            ctx.beginPath();
            ctx.arc(nx, ny, distToMouse < 140 ? 3.5 : 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = scanColor;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridSize, scanColor, lineColor, scanSpeed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full ${className}`}
    />
  );
};

export default GridScanBackground;
