"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Eye,
  Layers,
  Maximize2,
  Minimize2,
  Sliders,
  Ruler,
  Scan,
  RotateCcw,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  ShieldCheck,
  Radio,
  Crosshair,
  Compass
} from 'lucide-react';
import {
  getDicomClinicalPresets,
  DicomSeries,
  MprPlane,
  DICOM_WINDOW_PRESETS,
  WindowPreset,
  applyWindowLevel,
  calculateCaliperMeasurement,
  calculateRoiMetrics,
  getMprSlice
} from '../../.gemini/skills/DicomPacsEngine';

export default function DicomPacsSimulator() {
  const presets = useMemo(() => getDicomClinicalPresets(), []);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0].id);
  const currentSeries = useMemo(
    () => presets.find(p => p.id === selectedPresetId) || presets[0],
    [presets, selectedPresetId]
  );

  const [activeTab, setActiveTab] = useState<'viewer' | 'pathology-notes' | 'dicom-tags'>('viewer');

  // Slice navigation
  const [currentSliceIndex, setCurrentSliceIndex] = useState<number>(8); // start in middle
  const [currentPlane, setCurrentPlane] = useState<MprPlane>('axial');

  // Window / Level state
  const [windowWidth, setWindowWidth] = useState<number>(currentSeries.defaultWindow.width);
  const [windowLevel, setWindowLevel] = useState<number>(currentSeries.defaultWindow.level);
  const [invertGrayscale, setInvertGrayscale] = useState<boolean>(false);
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(true);

  // Tools state
  const [activeTool, setActiveTool] = useState<'probe' | 'caliper'>('probe');
  const [caliperPoints, setCaliperPoints] = useState<{ p1: { x: number; y: number } | null; p2: { x: number; y: number } | null }>({
    p1: { x: 8, y: 16 },
    p2: { x: 24, y: 16 }
  });
  const [probePoint, setProbePoint] = useState<{ x: number; y: number }>({ x: 16, y: 16 });

  // Main Canvas Ref
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync window preset on series change
  useEffect(() => {
    setWindowWidth(currentSeries.defaultWindow.width);
    setWindowLevel(currentSeries.defaultWindow.level);
    setCurrentSliceIndex(Math.floor(currentSeries.sliceCount / 2));
    setCaliperPoints({ p1: { x: 8, y: 16 }, p2: { x: 24, y: 16 } });
    setProbePoint({ x: 16, y: 16 });
  }, [currentSeries]);

  // Current slice pixel data
  const currentSlice = useMemo(() => {
    return getMprSlice(currentSeries, currentPlane, currentSliceIndex);
  }, [currentSeries, currentPlane, currentSliceIndex]);

  // Render main canvas
  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, pixels } = currentSlice;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    for (let i = 0; i < pixels.length; i++) {
      const hu = pixels[i];
      let gray = applyWindowLevel(hu, windowWidth, windowLevel);
      if (invertGrayscale) gray = 255 - gray;

      const pIdx = i * 4;
      imgData.data[pIdx] = gray;     // R
      imgData.data[pIdx + 1] = gray; // G
      imgData.data[pIdx + 2] = gray; // B
      imgData.data[pIdx + 3] = 255;  // A
    }
    ctx.putImageData(imgData, 0, 0);
  }, [currentSlice, windowWidth, windowLevel, invertGrayscale]);

  // Caliper distance calculation
  const caliperDistance = useMemo(() => {
    if (!caliperPoints.p1 || !caliperPoints.p2) return null;
    const spacing = currentSeries.slices[0]?.metadata.pixelSpacingMm || [0.8, 0.8];
    return calculateCaliperMeasurement(caliperPoints.p1, caliperPoints.p2, spacing);
  }, [caliperPoints, currentSeries]);

  // Probe ROI metric calculation
  const probeMetrics = useMemo(() => {
    const { width, height, pixels } = currentSlice;
    const { x, y } = probePoint;
    const safeX = Math.max(0, Math.min(width - 1, x));
    const safeY = Math.max(0, Math.min(height - 1, y));

    // Sample 3x3 neighborhood around probe point
    const sampledHu: number[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = safeX + dx;
        const ny = safeY + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          sampledHu.push(pixels[ny * width + nx]);
        }
      }
    }

    const singlePixelHu = pixels[safeY * width + safeX] ?? -1000;
    const metrics = calculateRoiMetrics(sampledHu);
    return {
      singleHu: singlePixelHu,
      ...metrics
    };
  }, [probePoint, currentSlice]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.floor(((e.clientX - rect.left) / rect.width) * currentSlice.width);
    const clickY = Math.floor(((e.clientY - rect.top) / rect.height) * currentSlice.height);

    if (activeTool === 'probe') {
      setProbePoint({ x: clickX, y: clickY });
    } else if (activeTool === 'caliper') {
      if (!caliperPoints.p1 || (caliperPoints.p1 && caliperPoints.p2)) {
        setCaliperPoints({ p1: { x: clickX, y: clickY }, p2: null });
      } else {
        setCaliperPoints(prev => ({ ...prev, p2: { x: clickX, y: clickY } }));
      }
    }
  };

  const handleApplyPreset = (wp: WindowPreset) => {
    setWindowLevel(wp.level);
    setWindowWidth(wp.width);
  };

  const maxSliceIdx = currentPlane === 'axial' ? currentSeries.sliceCount - 1 : currentSeries.rows - 1;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Track C2 &bull; Radiology, Medical Imaging &amp; PACS
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                DICOM 3.0 / Multi-Planar Reconstruction (MPR)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACR / RSNA Standard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Advanced DICOM Radiology PACS Viewer &amp; Multi-Planar Reconstruction
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Diagnostic clinical radiology workstation. Navigate volumetric CT slice stacks, adjust Hounsfield Unit
              (HU) Window/Level contrast for brain, subdural, lung, bone, and soft tissue, reconstruct orthogonal
              Axial, Coronal, and Sagittal planes, and perform precision digital caliper and ROI radiodensity measurements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              PACS Live Station
            </span>
          </div>
        </div>

        {/* Clinical Study Preset Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
            Select Diagnostic Imaging Case:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presets.map(p => {
              const isSelected = p.id === currentSeries.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPresetId(p.id)}
                  className={`p-3.5 rounded-xl border text-left transition relative ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/70 shadow-md shadow-cyan-900/20'
                      : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{p.organSystem}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/60 text-cyan-400 border border-cyan-500/20">
                      {p.modality} ({p.sliceCount} slices)
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 line-clamp-1">{p.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.clinicalIndication}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('viewer')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'viewer'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Scan className="w-4 h-4" />
          PACS Viewport &amp; Tri-Planar MPR
        </button>

        <button
          onClick={() => setActiveTab('pathology-notes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'pathology-notes'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          Radiologic Findings &amp; Clinical Pearls
        </button>

        <button
          onClick={() => setActiveTab('dicom-tags')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'dicom-tags'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Info className="w-4 h-4" />
          DICOM Header Metadata
        </button>
      </div>

      {/* Tab 1: Interactive PACS Viewport & MPR */}
      {activeTab === 'viewer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Viewport & Toolbar (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            {/* Viewport Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              {/* Plane Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['axial', 'coronal', 'sagittal'] as MprPlane[]).map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setCurrentPlane(p);
                      setCurrentSliceIndex(0);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                      currentPlane === p
                        ? 'bg-cyan-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Tool Mode Selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTool('probe')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    activeTool === 'probe'
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  ROI Density Probe
                </button>

                <button
                  onClick={() => setActiveTool('caliper')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    activeTool === 'caliper'
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Linear Caliper
                </button>

                <button
                  onClick={() => setInvertGrayscale(prev => !prev)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    invertGrayscale
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Invert Gray
                </button>
              </div>
            </div>

            {/* Main Interactive Screen */}
            <div className="relative aspect-square max-w-[540px] mx-auto bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center cursor-crosshair">
              {/* HTML5 Canvas */}
              <div
                onClick={handleCanvasClick}
                className="relative w-full h-full flex items-center justify-center"
              >
                <canvas
                  ref={mainCanvasRef}
                  className="w-full h-full object-contain [image-rendering:pixelated]"
                />

                {/* SVG Overlays for Crosshairs & Calipers */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Caliper line and markers */}
                  {caliperPoints.p1 && (
                    <circle
                      cx={`${(caliperPoints.p1.x / currentSlice.width) * 100}%`}
                      cy={`${(caliperPoints.p1.y / currentSlice.height) * 100}%`}
                      r="4"
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}
                  {caliperPoints.p2 && (
                    <circle
                      cx={`${(caliperPoints.p2.x / currentSlice.width) * 100}%`}
                      cy={`${(caliperPoints.p2.y / currentSlice.height) * 100}%`}
                      r="4"
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}
                  {caliperPoints.p1 && caliperPoints.p2 && (
                    <line
                      x1={`${(caliperPoints.p1.x / currentSlice.width) * 100}%`}
                      y1={`${(caliperPoints.p1.y / currentSlice.height) * 100}%`}
                      x2={`${(caliperPoints.p2.x / currentSlice.width) * 100}%`}
                      y2={`${(caliperPoints.p2.y / currentSlice.height) * 100}%`}
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  )}

                  {/* Probe Point Target */}
                  {activeTool === 'probe' && (
                    <g>
                      <circle
                        cx={`${(probePoint.x / currentSlice.width) * 100}%`}
                        cy={`${(probePoint.y / currentSlice.height) * 100}%`}
                        r="6"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={`${(probePoint.x / currentSlice.width) * 100 - 3}%`}
                        y1={`${(probePoint.y / currentSlice.height) * 100}%`}
                        x2={`${(probePoint.x / currentSlice.width) * 100 + 3}%`}
                        y2={`${(probePoint.y / currentSlice.height) * 100}%`}
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={`${(probePoint.x / currentSlice.width) * 100}%`}
                        y1={`${(probePoint.y / currentSlice.height) * 100 - 3}%`}
                        x2={`${(probePoint.x / currentSlice.width) * 100}%`}
                        y2={`${(probePoint.y / currentSlice.height) * 100 + 3}%`}
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </svg>

                {/* On-Screen DICOM Text Overlay */}
                <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-300/80 bg-black/40 px-2 py-1 rounded backdrop-blur-xs space-y-0.5">
                  <div>{currentSeries.slices[0]?.metadata.patientName}</div>
                  <div>ID: {currentSeries.slices[0]?.metadata.patientId}</div>
                  <div>MOD: {currentSeries.modality} &bull; KVP: {currentSeries.slices[0]?.metadata.kvp}</div>
                </div>

                <div className="absolute top-2 right-2 text-[10px] font-mono text-right text-cyan-300/80 bg-black/40 px-2 py-1 rounded backdrop-blur-xs space-y-0.5">
                  <div>PLANE: {currentPlane.toUpperCase()}</div>
                  <div>SLICE: {currentSliceIndex + 1} / {maxSliceIdx + 1}</div>
                  <div>THICK: {currentSeries.slices[0]?.metadata.sliceThicknessMm} mm</div>
                </div>

                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300/80 bg-black/40 px-2 py-1 rounded backdrop-blur-xs space-y-0.5">
                  <div>W: {windowWidth} &bull; L: {windowLevel}</div>
                  <div>ZOOM: 1.0x</div>
                </div>

                {caliperDistance && activeTool === 'caliper' && (
                  <div className="absolute bottom-2 right-2 text-[11px] font-mono font-bold text-cyan-300 bg-black/70 px-2.5 py-1 rounded border border-cyan-500/40">
                    DIST: {caliperDistance.distanceMm} mm ({caliperDistance.distanceCm} cm)
                  </div>
                )}
              </div>
            </div>

            {/* Slice Navigation Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Slice Navigation ({currentPlane.toUpperCase()})
                </span>
                <span className="font-mono text-cyan-400">
                  Slice {currentSliceIndex + 1} of {maxSliceIdx + 1}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={currentSliceIndex <= 0}
                  onClick={() => setCurrentSliceIndex(prev => Math.max(0, prev - 1))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input aria-label="Current Slice Index"
                  type="range"
                  min={0}
                  max={maxSliceIdx}
                  value={currentSliceIndex}
                  onChange={e => setCurrentSliceIndex(parseInt(e.target.value))}
                  className="flex-1 accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                />
                <button
                  disabled={currentSliceIndex >= maxSliceIdx}
                  onClick={() => setCurrentSliceIndex(prev => Math.min(maxSliceIdx, prev + 1))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Window Presets Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-medium text-slate-400">Window / Level Contrast Presets:</div>
              <div className="flex items-center gap-2 flex-wrap">
                {DICOM_WINDOW_PRESETS.map(wp => {
                  const isActive = windowLevel === wp.level && windowWidth === wp.width;
                  return (
                    <button
                      key={wp.id}
                      onClick={() => handleApplyPreset(wp)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                        isActive
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-sm'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {wp.name}
                    </button>
                  );
                })}
              </div>

              {/* Sliders for manual Level and Width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Window Level (Center):</span>
                    <span className="font-mono text-cyan-400">{windowLevel} HU</span>
                  </div>
                  <input aria-label="Window Level (Center)"
                    type="range"
                    min={-1000}
                    max={1000}
                    value={windowLevel}
                    onChange={e => setWindowLevel(parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-950 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Window Width:</span>
                    <span className="font-mono text-cyan-400">{windowWidth} HU</span>
                  </div>
                  <input aria-label="Window Width"
                    type="range"
                    min={1}
                    max={2500}
                    value={windowWidth}
                    onChange={e => setWindowWidth(parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-950 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: ROI Probe & Multi-Planar Orthogonal Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* ROI Density Probe Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-amber-400" />
                  ROI Density &amp; Tissue Classifier
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  X:{probePoint.x} Y:{probePoint.y}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
                  <div className="text-[10px] text-slate-400 uppercase">Single Pixel HU:</div>
                  <div className="text-lg font-bold font-mono text-amber-400">
                    {probeMetrics.singleHu} <span className="text-xs font-normal">HU</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
                  <div className="text-[10px] text-slate-400 uppercase">Mean ROI Density:</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    {probeMetrics.meanHu} <span className="text-xs font-normal">HU</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] text-slate-400">Tissue Classification:</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {probeMetrics.tissueClassification}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Min: {probeMetrics.minHu} HU &bull; Max: {probeMetrics.maxHu} HU &bull; StdDev: {probeMetrics.stdDev}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/30 p-2.5 rounded-lg border border-slate-800">
                Click anywhere on the CT slice in Probe mode to sample local radiodensity attenuation and auto-classify tissue composition.
              </div>
            </div>

            {/* Tri-Planar MPR Thumbnails */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Multi-Planar Reconstruction (MPR)
              </h3>
              <p className="text-xs text-slate-400">Orthogonal anatomical projections from volumetric CT dataset:</p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {(['axial', 'coronal', 'sagittal'] as MprPlane[]).map(plane => {
                  const isSelected = currentPlane === plane;
                  return (
                    <button
                      key={plane}
                      onClick={() => {
                        setCurrentPlane(plane);
                        setCurrentSliceIndex(0);
                      }}
                      className={`p-2.5 rounded-xl border transition flex flex-col items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded flex items-center justify-center font-mono text-xs text-cyan-400 font-bold">
                        {plane[0].toUpperCase()}
                      </div>
                      <span className="font-bold uppercase text-[10px]">{plane}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pathology Notes */}
      {activeTab === 'pathology-notes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Clinical &amp; Radiologic Diagnostic Report</h2>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Clinical Context:</div>
            <p className="text-sm text-slate-200 leading-relaxed">{currentSeries.clinicalIndication}</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Key Radiologic Findings:</div>
            <p className="text-sm text-slate-200 leading-relaxed">{currentSeries.pathologyFinding}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-amber-300">Hounsfield Unit Diagnostic Matrix:</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                <li>Air / Pneumothorax: -1000 HU</li>
                <li>Normal Lung Parenchyma: -700 to -800 HU</li>
                <li>Simple Fluid / Serous Effusion: 0 to 15 HU</li>
                <li>Acute Clotted Blood / Hemoperitoneum: 55 to 80 HU</li>
                <li>Iodinated Contrast Enhancement: 150 to 300 HU</li>
                <li>Cortical Bone / Calvarium: &gt; 1000 HU</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-blue-300">Windowing Strategy Pearls:</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                <li>Brain window (W:80, L:40) enhances loss of insular ribbon and subtle cytotoxic edema in hyperacute ischemic stroke.</li>
                <li>Subdural window (W:150, L:75) prevents acute hemorrhage from blending with the hyperdense inner table of the skull.</li>
                <li>Lung window (W:1500, L:-600) prevents ground glass and consolidation from appearing completely blacked out.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: DICOM Tags Inspector */}
      {activeTab === 'dicom-tags' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">DICOM Header Metadata Tags (PS 3.3)</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Modality: {currentSeries.modality}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tag Element</th>
                  <th className="py-3 px-4">Attribute Name</th>
                  <th className="py-3 px-4">VR</th>
                  <th className="py-3 px-4">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                <tr>
                  <td className="py-2.5 px-4 text-cyan-400">(0010,0010)</td>
                  <td className="py-2.5 px-4 font-sans text-white">Patient&apos;s Name</td>
                  <td className="py-2.5 px-4 text-slate-400">PN</td>
                  <td className="py-2.5 px-4">{currentSeries.slices[0]?.metadata.patientName}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-cyan-400">(0010,0020)</td>
                  <td className="py-2.5 px-4 font-sans text-white">Patient ID</td>
                  <td className="py-2.5 px-4 text-slate-400">LO</td>
                  <td className="py-2.5 px-4">{currentSeries.slices[0]?.metadata.patientId}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-cyan-400">(0008,0060)</td>
                  <td className="py-2.5 px-4 font-sans text-white">Modality</td>
                  <td className="py-2.5 px-4 text-slate-400">CS</td>
                  <td className="py-2.5 px-4">{currentSeries.modality}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-cyan-400">(0008,1030)</td>
                  <td className="py-2.5 px-4 font-sans text-white">Study Description</td>
                  <td className="py-2.5 px-4 text-slate-400">LO</td>
                  <td className="py-2.5 px-4">{currentSeries.slices[0]?.metadata.studyDescription}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-cyan-400">(0018,0050)</td>
                  <td className="py-2.5 px-4 font-sans text-white">Slice Thickness</td>
                  <td className="py-2.5 px-4 text-slate-400">DS</td>
                  <td className="py-2.5 px-4">{currentSeries.slices[0]?.metadata.sliceThicknessMm} mm</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-cyan-400">(0028,0030)</td>
                  <td className="py-2.5 px-4 font-sans text-white">Pixel Spacing</td>
                  <td className="py-2.5 px-4 text-slate-400">DS</td>
                  <td className="py-2.5 px-4">{currentSeries.slices[0]?.metadata.pixelSpacingMm.join(' \\ ')} mm</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-cyan-400">(0028,1050)</td>
                  <td className="py-2.5 px-4 font-sans text-white">Window Center</td>
                  <td className="py-2.5 px-4 text-slate-400">DS</td>
                  <td className="py-2.5 px-4">{windowLevel}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-cyan-400">(0028,1051)</td>
                  <td className="py-2.5 px-4 font-sans text-white">Window Width</td>
                  <td className="py-2.5 px-4 text-slate-400">DS</td>
                  <td className="py-2.5 px-4">{windowWidth}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
