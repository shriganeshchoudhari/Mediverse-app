"use client";

import React, { useEffect, useState } from "react";

interface PhysiologyAnimationProps {
  chapterId: string;
}

export default function PhysiologyAnimation({ chapterId }: PhysiologyAnimationProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 1. Homeostasis & Cell Membrane: Lipid Bilayer Active/Passive transport
  if (chapterId === "homeostasis" || chapterId === "cell-membrane-transport") {
    const particleY = 30 + (frame * 1.2) % 140;
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
        <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Cell Membrane Transport Mechanism</h4>
        <svg width="100%" height="200" className="max-w-[400px]">
          {/* Extracellular space */}
          <text x="10" y="20" fill="#94a3b8" fontSize="10" className="font-semibold">Extracellular Fluid</text>
          
          {/* Lipid Bilayer Top */}
          <rect x="0" y="80" width="400" height="10" fill="#3b82f6" rx="2" />
          {/* Channel Protein */}
          <rect x="180" y="70" width="40" height="60" fill="#10b981" rx="4" />
          <rect x="195" y="70" width="10" height="60" fill="#020617" />
          {/* Lipid Bilayer Bottom */}
          <rect x="0" y="110" width="400" height="10" fill="#3b82f6" rx="2" />

          {/* Intracellular space */}
          <text x="10" y="190" fill="#94a3b8" fontSize="10" className="font-semibold">Intracellular Fluid (Cytoplasm)</text>

          {/* Flowing ions/particles through the channel */}
          <circle cx="200" cy={particleY} r="6" fill="#fbbf24" className="animate-pulse" />
          <circle cx="200" cy={(particleY + 50) % 140 + 30} r="6" fill="#fbbf24" opacity="0.6" />
        </svg>
      </div>
    );
  }

  // 2. Cardiac Cycle Cycle pulsation
  if (chapterId === "cardiac-cycle") {
    const scale = 1 + Math.sin((frame * Math.PI) / 25) * 0.08;
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
        <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Cardiac Muscle Cycles (Systole / Diastole)</h4>
        <svg width="100%" height="200" className="max-w-[400px]">
          <g transform={`translate(200, 100) scale(${scale})`}>
            {/* Heart shape */}
            <path
              d="M0 -30 C-20 -60, -50 -60, -50 -30 C-50 0, -20 20, 0 45 C20 20, 50 0, 50 -30 C50 -60, 20 -60, 0 -30 Z"
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="2"
            />
            {/* Valves indicator */}
            <line x1="-15" y1="-10" x2="15" y2="-10" stroke="#cbd5e1" strokeWidth="3" />
          </g>
          <text x="10" y="190" fill="#94a3b8" fontSize="10" className="font-semibold">
            Status: {scale > 1 ? "Ventricular Diastole (Filling)" : "Ventricular Systole (Ejection)"}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Action Potential Propagation
  if (chapterId === "action-potential") {
    const signalX = (frame * 4) % 400;
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
        <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Axon Potential Nerve Impulse Propagation</h4>
        <svg width="100%" height="200" className="max-w-[400px]">
          {/* Axon */}
          <rect x="0" y="90" width="400" height="20" fill="#334155" rx="3" />
          {/* Myelin Sheaths */}
          <rect x="40" y="85" width="80" height="30" fill="#10b981" rx="2" opacity="0.8" />
          <rect x="160" y="85" width="80" height="30" fill="#10b981" rx="2" opacity="0.8" />
          <rect x="280" y="85" width="80" height="30" fill="#10b981" rx="2" opacity="0.8" />

          {/* Nodes of Ranvier label */}
          <text x="130" y="140" fill="#64748b" fontSize="8">Node of Ranvier</text>
          
          {/* Electrical signal pulse */}
          <circle cx={signalX} cy="100" r="8" fill="#fbbf24" className="shadow-lg" />
          <circle cx={signalX} cy="100" r="14" fill="#fbbf24" opacity="0.3" />
        </svg>
      </div>
    );
  }

  // 4. Respiratory Ventilation mechanics
  if (chapterId === "respiratory-mechanics") {
    const diaphragmY = 140 + Math.sin((frame * Math.PI) / 25) * 15;
    const lungRadiusX = 25 + Math.sin((frame * Math.PI) / 25) * 5;
    const lungRadiusY = 40 + Math.sin((frame * Math.PI) / 25) * 7;
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
        <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Mechanics of Respiration</h4>
        <svg width="100%" height="200" className="max-w-[400px]">
          {/* Trachea */}
          <rect x="195" y="10" width="10" height="50" fill="#cbd5e1" />

          {/* Left Lung */}
          <ellipse cx="160" cy="90" rx={lungRadiusX} ry={lungRadiusY} fill="#ec4899" opacity="0.8" />
          {/* Right Lung */}
          <ellipse cx="240" cy="90" rx={lungRadiusX} ry={lungRadiusY} fill="#ec4899" opacity="0.8" />

          {/* Diaphragm line */}
          <path d={`M 100 ${diaphragmY} Q 200 ${diaphragmY - 30} 300 ${diaphragmY}`} fill="none" stroke="#ef4444" strokeWidth="4" />
          
          <text x="10" y="190" fill="#94a3b8" fontSize="10" className="font-semibold">
            Cycle phase: {diaphragmY > 140 ? "Inspiration (Chest expands)" : "Expiration (Chest recoils)"}
          </text>
        </svg>
      </div>
    );
  }

  // Default Fallback
  return null;
}
