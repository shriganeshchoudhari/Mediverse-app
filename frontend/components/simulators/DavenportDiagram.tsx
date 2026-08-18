"use client";

import React, { useState, useMemo } from "react";
import { DavenportDiagramData, DavenportPoint } from "../../lib/simulations/acidBaseSolver";

interface DavenportDiagramProps {
  data: DavenportDiagramData;
  onPointClick?: (ph: number, hco3: number) => void;
}

export default function DavenportDiagram({ data, onPointClick }: DavenportDiagramProps) {
  const [hoveredIsobar, setHoveredIsobar] = useState<number | null>(null);
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showBufferLine, setShowBufferLine] = useState<boolean>(true);
  const [mouseCoords, setMouseCoords] = useState<{ ph: number; hco3: number } | null>(null);

  // SVG dimensions and coordinate mapping
  const width = 640;
  const height = 480;
  const padding = { top: 30, right: 40, bottom: 50, left: 55 };

  const minPH = 6.95;
  const maxPH = 7.75;
  const minHCO3 = 0;
  const maxHCO3 = 55;

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Convert (pH, HCO3) to SVG pixels (x, y)
  const scaleX = (ph: number) => {
    return padding.left + ((ph - minPH) / (maxPH - minPH)) * innerWidth;
  };

  const scaleY = (hco3: number) => {
    return padding.top + innerHeight - ((hco3 - minHCO3) / (maxHCO3 - minHCO3)) * innerHeight;
  };

  // Inverse mapping from SVG pixels to (pH, HCO3)
  const inverseX = (pixelX: number) => {
    const clampedX = Math.max(padding.left, Math.min(width - padding.right, pixelX));
    return minPH + ((clampedX - padding.left) / innerWidth) * (maxPH - minPH);
  };

  const inverseY = (pixelY: number) => {
    const clampedY = Math.max(padding.top, Math.min(height - padding.bottom, pixelY));
    return minHCO3 + ((padding.top + innerHeight - clampedY) / innerHeight) * (maxHCO3 - minHCO3);
  };

  // Convert point array to SVG path 'd' string
  const pointsToPath = (points: { ph: number; hco3: number }[]) => {
    const validPoints = points.filter(
      (p) => p.ph >= minPH && p.ph <= maxPH && p.hco3 >= minHCO3 && p.hco3 <= maxHCO3
    );
    if (validPoints.length === 0) return "";
    return validPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.ph).toFixed(1)} ${scaleY(p.hco3).toFixed(1)}`)
      .join(" ");
  };

  const currentPixel = {
    x: scaleX(data.currentPoint.ph),
    y: scaleY(data.currentPoint.hco3),
  };

  const normalPixel = {
    x: scaleX(data.normalPoint.ph),
    y: scaleY(data.normalPoint.hco3),
  };

  // Major ticks
  const phTicks = [7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7];
  const hco3Ticks = [10, 20, 24, 30, 40, 50];

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const ph = parseFloat(inverseX((clientX / rect.width) * width).toFixed(2));
    const hco3 = parseFloat(inverseY((clientY / rect.height) * height).toFixed(1));
    setMouseCoords({ ph, hco3 });
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onPointClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const ph = parseFloat(inverseX((clientX / rect.width) * width).toFixed(2));
    const hco3 = parseFloat(inverseY((clientY / rect.height) * height).toFixed(1));
    onPointClick(ph, hco3);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-bold text-white text-sm">Interactive Davenport Nomogram</h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-2.5 py-1 rounded-lg border transition ${
              showZones
                ? "bg-slate-800 text-teal-300 border-teal-500/40"
                : "bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-300"
            }`}
          >
            Clinical Zones
          </button>
          <button
            onClick={() => setShowBufferLine(!showBufferLine)}
            className={`px-2.5 py-1 rounded-lg border transition ${
              showBufferLine
                ? "bg-slate-800 text-teal-300 border-teal-500/40"
                : "bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-300"
            }`}
          >
            Buffer Lines
          </button>
        </div>
      </div>

      {/* Main SVG Diagram Container */}
      <div className="relative w-full aspect-[4/3] max-h-[460px] bg-slate-950 rounded-xl overflow-hidden border border-slate-850 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={() => setMouseCoords(null)}
          onClick={handleSvgClick}
        >
          <defs>
            {/* Gradient for Normal Physiological Operating Box */}
            <linearGradient id="normalBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
            </linearGradient>

            {/* Glowing filter for current operating point */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid Lines */}
          {phTicks.map((tick) => (
            <g key={`x-grid-${tick}`}>
              <line
                x1={scaleX(tick)}
                y1={padding.top}
                x2={scaleX(tick)}
                y2={height - padding.bottom}
                stroke="#1e293b"
                strokeWidth={tick === 7.4 ? 1.5 : 1}
                strokeDasharray={tick === 7.4 ? undefined : "3 3"}
              />
              <text
                x={scaleX(tick)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className={`text-[10px] font-mono ${tick === 7.4 ? "fill-teal-400 font-bold" : "fill-slate-500"}`}
              >
                {tick.toFixed(1)}
              </text>
            </g>
          ))}

          {hco3Ticks.map((tick) => (
            <g key={`y-grid-${tick}`}>
              <line
                x1={padding.left}
                y1={scaleY(tick)}
                x2={width - padding.right}
                y2={scaleY(tick)}
                stroke="#1e293b"
                strokeWidth={tick === 24 ? 1.5 : 1}
                strokeDasharray={tick === 24 ? undefined : "3 3"}
              />
              <text
                x={padding.left - 8}
                y={scaleY(tick) + 3}
                textAnchor="end"
                className={`text-[10px] font-mono ${tick === 24 ? "fill-teal-400 font-bold" : "fill-slate-500"}`}
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Clinical Diagnostic Zones Overlay */}
          {showZones && (
            <g opacity="0.65" className="transition-opacity duration-300">
              {/* Normal Box (pH 7.35 - 7.45, HCO3 22 - 26) */}
              <rect
                x={scaleX(7.35)}
                y={scaleY(26)}
                width={scaleX(7.45) - scaleX(7.35)}
                height={scaleY(22) - scaleY(26)}
                fill="url(#normalBoxGrad)"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                rx="3"
              />

              {/* Acute Resp Acidosis Zone Label */}
              <text
                x={scaleX(7.18)}
                y={scaleY(34)}
                textAnchor="middle"
                className="text-[9px] fill-rose-400/70 font-semibold tracking-wider uppercase"
              >
                Acute Resp Acidosis
              </text>

              {/* Chronic Resp Acidosis Zone Label */}
              <text
                x={scaleX(7.32)}
                y={scaleY(42)}
                textAnchor="middle"
                className="text-[9px] fill-indigo-400/70 font-semibold tracking-wider uppercase"
              >
                Chronic Resp Acidosis
              </text>

              {/* Metabolic Acidosis Zone Label */}
              <text
                x={scaleX(7.20)}
                y={scaleY(12)}
                textAnchor="middle"
                className="text-[9px] fill-amber-400/70 font-semibold tracking-wider uppercase"
              >
                Metabolic Acidosis
              </text>

              {/* Metabolic Alkalosis Zone Label */}
              <text
                x={scaleX(7.56)}
                y={scaleY(38)}
                textAnchor="middle"
                className="text-[9px] fill-cyan-400/70 font-semibold tracking-wider uppercase"
              >
                Metabolic Alkalosis
              </text>

              {/* Acute Resp Alkalosis Zone Label */}
              <text
                x={scaleX(7.62)}
                y={scaleY(18)}
                textAnchor="middle"
                className="text-[9px] fill-sky-400/70 font-semibold tracking-wider uppercase"
              >
                Acute Resp Alkalosis
              </text>
            </g>
          )}

          {/* PaCO2 Isobars */}
          {data.isobars.map((isobar) => {
            const isHovered = hoveredIsobar === isobar.paco2;
            const isCurrentIsobar = Math.abs(data.currentPoint.paco2 - isobar.paco2) < 2;
            const pathD = pointsToPath(isobar.points);

            // Find label anchor coordinate near pH 7.15 or 7.60
            const labelPt = isobar.points.find((p) => Math.abs(p.ph - (isobar.paco2 > 40 ? 7.15 : 7.65)) < 0.04);

            return (
              <g
                key={`isobar-${isobar.paco2}`}
                onMouseEnter={() => setHoveredIsobar(isobar.paco2)}
                onMouseLeave={() => setHoveredIsobar(null)}
                className="cursor-pointer"
              >
                <path
                  d={pathD}
                  fill="none"
                  stroke={isobar.color}
                  strokeWidth={isHovered || isCurrentIsobar ? 3 : 1.5}
                  strokeOpacity={isHovered ? 1 : isCurrentIsobar ? 0.9 : 0.45}
                  strokeDasharray={isobar.paco2 === 40 ? undefined : "4 2"}
                />
                {labelPt && (
                  <text
                    x={scaleX(labelPt.ph)}
                    y={scaleY(labelPt.hco3) - 5}
                    textAnchor="middle"
                    fill={isobar.color}
                    className={`text-[9px] font-mono font-bold ${isHovered ? "opacity-100 font-black" : "opacity-70"}`}
                  >
                    {isobar.paco2} mmHg
                  </text>
                )}
              </g>
            );
          })}

          {/* Non-Bicarbonate Buffer Lines */}
          {showBufferLine && (
            <>
              {/* Normal Non-Bicarbonate Buffer Line (passes through 7.40, 24 with slope -25 slykes) */}
              <path
                d={pointsToPath(data.normalBufferLine)}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              <text
                x={scaleX(7.08)}
                y={scaleY(32)}
                fill="#10b981"
                className="text-[9px] font-mono font-bold"
                transform={`rotate(-22, ${scaleX(7.08)}, ${scaleY(32)})`}
              >
                Normal Buffer Line (-25 slykes)
              </text>

              {/* Current Shifted Non-Bicarbonate Buffer Line if deviated */}
              {(Math.abs(data.currentPoint.ph - 7.4) > 0.05 || Math.abs(data.currentPoint.hco3 - 24) > 2) && (
                <path
                  d={pointsToPath(data.currentBufferLine)}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.75"
                />
              )}
            </>
          )}

          {/* Normal Operating Reference Marker (7.40, 24) */}
          <circle
            cx={normalPixel.x}
            cy={normalPixel.y}
            r="4"
            fill="#10b981"
            stroke="#ffffff"
            strokeWidth="1.5"
          />

          {/* Current Patient Operating Point (Crosshair & Pulsing Dot) */}
          <g filter="url(#glow)">
            {/* Crosshair Horizontal Line */}
            <line
              x1={padding.left}
              y1={currentPixel.y}
              x2={width - padding.right}
              y2={currentPixel.y}
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity="0.6"
            />
            {/* Crosshair Vertical Line */}
            <line
              x1={currentPixel.x}
              y1={padding.top}
              x2={currentPixel.x}
              y2={height - padding.bottom}
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity="0.6"
            />

            {/* Outer Pulse Ring */}
            <circle
              cx={currentPixel.x}
              cy={currentPixel.y}
              r="9"
              fill="#f43f5e"
              fillOpacity="0.25"
              className="animate-ping"
            />
            {/* Core Node */}
            <circle
              cx={currentPixel.x}
              cy={currentPixel.y}
              r="6"
              fill="#f43f5e"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>

          {/* Live Coordinates Callout Badge near current point */}
          <g
            transform={`translate(${
              currentPixel.x > width - 140 ? currentPixel.x - 130 : currentPixel.x + 12
            }, ${currentPixel.y < 70 ? currentPixel.y + 20 : currentPixel.y - 30})`}
          >
            <rect
              width="118"
              height="36"
              rx="6"
              fill="#0f172a"
              stroke="#f43f5e"
              strokeWidth="1.2"
              fillOpacity="0.95"
            />
            <text x="8" y="14" fill="#ffffff" className="text-[10px] font-bold font-mono">
              pH: <tspan fill="#f43f5e">{data.currentPoint.ph.toFixed(2)}</tspan>
            </text>
            <text x="8" y="27" fill="#ffffff" className="text-[10px] font-bold font-mono">
              [HCO₃⁻]: <tspan fill="#38bdf8">{data.currentPoint.hco3} mEq/L</tspan>
            </text>
          </g>

          {/* Axis Labels */}
          {/* X Axis */}
          <text
            x={width / 2}
            y={height - 12}
            textAnchor="middle"
            className="text-[11px] font-bold fill-slate-300 tracking-wide uppercase"
          >
            Arterial Blood pH (Normal: 7.35 – 7.45)
          </text>

          {/* Y Axis */}
          <text
            x={-(height / 2)}
            y={16}
            textAnchor="middle"
            transform="rotate(-90)"
            className="text-[11px] font-bold fill-slate-300 tracking-wide uppercase"
          >
            Plasma [HCO₃⁻] (mEq/L)
          </text>
        </svg>

        {/* Floating Mouse Inspector if active */}
        {mouseCoords && (
          <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg pointer-events-none text-[11px] font-mono text-slate-300 shadow-lg">
            Hover: pH <span className="text-teal-400 font-bold">{mouseCoords.ph}</span> | [HCO₃⁻]{" "}
            <span className="text-sky-400 font-bold">{mouseCoords.hco3} mEq/L</span>
          </div>
        )}
      </div>

      {/* Nomogram Operating Zone Card */}
      <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400 font-medium">Nomogram Location: </span>
          <strong className="text-teal-300 font-bold">{data.operatingZone}</strong>
          <p className="text-[11px] text-slate-400 mt-0.5">{data.zoneDescription}</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 self-start md:self-auto shrink-0 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal Point (7.40, 24)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Current Patient Point
          </div>
        </div>
      </div>
    </div>
  );
}
