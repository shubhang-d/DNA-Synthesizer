"use client";

import { useEffect, useRef } from "react";

export default function MolViewer({ pdbId = "1BNA", className = "" }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    let req;

    import("3dmol").then(($3Dmol) => {
      if (!isMounted || !containerRef.current) return;

      containerRef.current.innerHTML = "";

      const viewer = $3Dmol.createViewer(containerRef.current, {
        backgroundColor: "white",
        id: "molviewer_" + pdbId,
      });
      // 3dmol transparency can sometimes interfere with anti-aliasing. We will use absolute background color 
      // of slate-900 via hex code or simply transparent if supported well.
      // Slate-900 is #0F172A
      viewer.setBackgroundColor('#0F172A', 1.0);
      
      viewerRef.current = viewer;

      fetch(`https://files.rcsb.org/view/${pdbId}.pdb`)
        .then((res) => res.text())
        .then((data) => {
          if (!isMounted) return;
          viewer.addModel(data, "pdb");
          
          // Style it professionally (Slate & Indigo)
          viewer.setStyle(
            {},
            {
              cartoon: { color: "#4f46e5", style: "trace", thickness: 0.4 },
              stick: { radius: 0.15, colorscheme: "Jmol" },
            }
          );
          
          viewer.zoomTo();
          viewer.render();

          const spin = () => {
            if (isMounted) {
              viewer.rotate(0.3, "vy");
              viewer.render();
              req = requestAnimationFrame(spin);
            }
          };
          spin();
        })
        .catch((err) => console.error("Error fetching PDB:", err));
    }).catch(err => console.error("Error importing 3dmol", err));

    return () => {
      isMounted = false;
      if (req) cancelAnimationFrame(req);
      if (viewerRef.current) {
        try {
            viewerRef.current.clear();
        } catch {}
      }
    };
  }, [pdbId]);

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
        <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
