"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid config
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    themeVariables: {
      background: "#0b1329",
      primaryColor: "#1e293b",
      primaryTextColor: "#f1f5f9",
      lineColor: "#3b82f6",
    }
  });
}

export default function Mermaid({ chart }: { chart: string }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    
    const renderId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
    
    const drawDiagram = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(renderId, chart);
        setSvg(renderedSvg);
        setError(null);
      } catch (err: any) {
        console.error("Mermaid parsing error:", err);
        setError("Invalid diagram syntax");
      }
    };

    drawDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg text-red-400 text-xs font-mono my-4">
        <div>Failed to render flowchart: {error}</div>
        <pre className="mt-2 opacity-70 text-[10px]">{chart}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={elementRef}
      className="bg-slate-900/20 border border-slate-800 p-6 rounded-lg my-6 flex justify-center overflow-x-auto shadow-inner min-h-[150px] items-center"
    >
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full flex justify-center" />
      ) : (
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">
          Generating Flowchart...
        </span>
      )}
    </div>
  );
}
