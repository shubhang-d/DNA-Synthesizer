"use client";

import { useEffect, useRef, useState } from "react";

export default function DNAHelixViewer() {
  const ref = useRef();

  useEffect(() => {
    let frame;
    const element = ref.current;
    let angle = 0;

    const rotate = () => {
      angle = (angle + 0.5) % 360;
      if (element) element.style.transform = `rotateY(${angle}deg)`;
      frame = requestAnimationFrame(rotate);
    };

    rotate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // keep track of randomly positioned particles in state so they are only
  // generated on the client after hydration. this prevents SSR vs client
  // mismatches caused by Math.random() being different each render.
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${1 + Math.random() * 2}s`
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="w-full h-80 bg-[#111827]/80 border border-gray-700 rounded-3xl relative overflow-hidden neon-gradient-cyan">
      <div
        ref={ref}
        className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.1s linear" }}
      >
        {/* placeholder for rotating helix */}
        DNA HELIX
      </div>
      {/* glowing particles (rendered only after client mount) */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-70 animate-ping"
          style={p}
        />
      ))}
    </div>
  );
}