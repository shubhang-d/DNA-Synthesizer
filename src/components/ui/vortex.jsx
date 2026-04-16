"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

function createParticle(width, height, rangeY, baseHue) {
  const radius = Math.random() * 1.8 + 0.5;
  const distance = Math.random() * Math.min(width, rangeY) * 0.45;
  const angle = Math.random() * Math.PI * 2;

  return {
    angle,
    distance,
    radius,
    speed: 0.0015 + Math.random() * 0.004,
    drift: Math.random() * 0.8 + 0.2,
    hue: baseHue + Math.random() * 50 - 20,
    alpha: Math.random() * 0.65 + 0.2,
    x: width / 2 + Math.cos(angle) * distance,
    y: height / 2 + Math.sin(angle) * distance,
  };
}

export function Vortex({
  children,
  className,
  backgroundColor = "#020617",
  rangeY = 600,
  particleCount = 250,
  baseHue = 165,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId;
    let particles = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = Array.from({ length: particleCount }, () =>
        createParticle(rect.width, rect.height, rangeY, baseHue)
      );
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach((particle) => {
        if (!reducedMotion) {
          particle.angle += particle.speed;
          particle.distance += Math.sin(particle.angle * 2) * 0.08 * particle.drift;
          particle.x = centerX + Math.cos(particle.angle) * particle.distance;
          particle.y = centerY + Math.sin(particle.angle * 1.4) * particle.distance * 0.45;
        }

        const glow = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 6
        );
        glow.addColorStop(0, `hsla(${particle.hue}, 95%, 65%, ${particle.alpha})`);
        glow.addColorStop(1, `hsla(${particle.hue}, 95%, 55%, 0)`);

        context.fillStyle = glow;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 6, 0, Math.PI * 2);
        context.fill();
      });

      if (!reducedMotion) {
        frameId = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [backgroundColor, baseHue, particleCount, rangeY]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.18)_48%,rgba(2,6,23,0.88)_100%)]" />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}
