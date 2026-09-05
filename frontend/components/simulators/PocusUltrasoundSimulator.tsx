'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ACOUSTIC_WINDOWS,
  EFAST_CHECKLIST_STEPS,
  computeAcousticGain,
  calculateCaliperDistance,
  generateMModeColumn,
  evaluateEfastSession,
  AcousticWindow,
  ProbeType,
  PocusPathology,
  UltrasoundSettings,
  CaliperMeasurement,
  CaliperPoint,
  EfastEvaluationReport
} from '@/.gemini/skills/PocusUltrasoundEngine';
import {
  Activity,
  Sliders,
  Maximize2,
  Minimize2,
  Camera,
  Play,
  Pause,
  Ruler,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface ScenarioPreset {
  id: string;
  title: string;
  patientProfile: string;
  initialVitals: string;
  pathology: PocusPathology;
  expectedPrimaryWindow: AcousticWindow;
  clinicalVignette: string;
}

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'trauma_hemoperitoneum',
    title: 'Polytrauma: Blunt Abdominal Injury (MVA)',
    patientProfile: '28-year-old male driver, unrestrained high-speed collision with steering wheel impact.',
    initialVitals: 'BP 92/58 mmHg, HR 124 bpm, SpO2 96%, RR 24/min. Abdominal guarding right flank.',
    pathology: 'HEMOPERITONEUM',
    expectedPrimaryWindow: 'RUQ_MORISONS_POUCH',
    clinicalVignette: 'Perform immediate STAT eFAST to rule out intraperitoneal hemorrhage requiring emergent exploratory laparotomy.'
  },
  {
    id: 'trauma_tamponade',
    title: 'Penetrating Precordial Stab Wound',
    patientProfile: '34-year-old female, single stab wound medial to left nipple in the cardiac danger box.',
    initialVitals: 'BP 80/50 mmHg, HR 138 bpm, muffled heart sounds, distended jugular veins (Beck\'s Triad).',
    pathology: 'PERICARDIAL_EFFUSION_TAMPONADE',
    expectedPrimaryWindow: 'CARDIAC_SUBXIPHOID',
    clinicalVignette: 'Assess the subxiphoid window immediately for hemopericardium and RV diastolic collapse indicating tamponade.'
  },
  {
    id: 'trauma_pneumothorax',
    title: 'Chest Trauma: Acute Hypoxemic Dyspnea',
    patientProfile: '22-year-old male struck in chest by falling beam. Unilateral absent breath sounds on right.',
    initialVitals: 'BP 102/66 mmHg, HR 118 bpm, SpO2 86% on room air, RR 30/min, tracheal deviation to left.',
    pathology: 'PNEUMOTHORAX',
    expectedPrimaryWindow: 'LUNG_PLEURAL',
    clinicalVignette: 'Perform thoracic ultrasound to evaluate pleural sliding, A-lines, and M-mode barcode sign for tension pneumothorax.'
  },
  {
    id: 'resp_pulmonary_edema',
    title: 'Acute Heart Failure & Dyspnea (BLUE Protocol)',
    patientProfile: '68-year-old female with ischemic cardiomyopathy presenting with severe orthopnea and crackles.',
    initialVitals: 'BP 178/104 mmHg, HR 110 bpm, SpO2 88% on 4L nasal cannula, pitting pedal edema.',
    pathology: 'PULMONARY_EDEMA',
    expectedPrimaryWindow: 'LUNG_PLEURAL',
    clinicalVignette: 'Scan bilateral anterior lung zones for diffuse laser-like B-lines (>3 per rib space, "lung rockets") indicating pulmonary edema.'
  },
  {
    id: 'normal_screening',
    title: 'Baseline Normal Trauma Screening',
    patientProfile: '45-year-old cyclist who fell onto grass. Mild left shoulder pain, soft non-tender abdomen.',
    initialVitals: 'BP 122/78 mmHg, HR 74 bpm, SpO2 99%, RR 14/min, GCS 15.',
    pathology: 'NORMAL',
    expectedPrimaryWindow: 'RUQ_MORISONS_POUCH',
    clinicalVignette: 'Complete a full negative 5-view eFAST survey documenting normal pleural sliding, clear hepatorenal space, and dry pericardium.'
  }
];

export default function PocusUltrasoundSimulator() {
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>(SCENARIO_PRESETS[0]);
  const [activeWindow, setActiveWindow] = useState<AcousticWindow>('RUQ_MORISONS_POUCH');
  const [activeProbe, setActiveProbe] = useState<ProbeType>('CURVILINEAR_ABDOMINAL');

  // Ultrasound machine settings
  const [settings, setSettings] = useState<UltrasoundSettings>({
    gainDb: 50,
    depthCm: 16,
    frequencyMhz: 3.5,
    dynamicRangeDb: 60,
    tgcNear: 0,
    tgcMid1: 0,
    tgcMid2: 0,
    tgcFar: 0,
    mode: 'B_MODE',
    isFrozen: false,
    showGrid: true,
    caliperActive: false
  });

  // Caliper measurement
  const [caliper, setCaliper] = useState<CaliperMeasurement>({
    start: null,
    end: null,
    distanceMm: null
  });

  // eFAST Protocol state tracking
  const [assessedWindows, setAssessedWindows] = useState<Set<AcousticWindow>>(new Set<AcousticWindow>(['RUQ_MORISONS_POUCH']));
  const [candidateDiagnosis, setCandidateDiagnosis] = useState<string>('');
  const [evaluationReport, setEvaluationReport] = useState<EfastEvaluationReport | null>(null);
  const [showDebrief, setShowDebrief] = useState(false);

  // Active window details
  const windowDef = useMemo(() => ACOUSTIC_WINDOWS[activeWindow], [activeWindow]);

  // Sync recommended probe and defaults on window change
  const handleSelectWindow = (w: AcousticWindow) => {
    setActiveWindow(w);
    setAssessedWindows(prev => new Set<AcousticWindow>([...Array.from(prev), w]));
    const targetDef = ACOUSTIC_WINDOWS[w];
    setActiveProbe(targetDef.recommendedProbe);
    setSettings(prev => ({
      ...prev,
      depthCm: targetDef.defaultDepthCm,
      frequencyMhz: targetDef.defaultFrequencyMhz
    }));
  };

  // Switch scenario
  const handleSelectScenario = (sc: ScenarioPreset) => {
    setSelectedScenario(sc);
    handleSelectWindow(sc.expectedPrimaryWindow);
    setCandidateDiagnosis('');
    setEvaluationReport(null);
    setShowDebrief(false);
    setCaliper({ start: null, end: null, distanceMm: null });
  };

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const timeSecRef = useRef<number>(0);
  const mModeHistoryRef = useRef<number[][]>([]);

  // Canvas click handler for caliper measurement
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!settings.caliperActive || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!caliper.start || (caliper.start && caliper.end)) {
      setCaliper({
        start: { x, y },
        end: null,
        distanceMm: null
      });
    } else {
      const dist = calculateCaliperDistance(caliper.start, { x, y }, rect.height, settings.depthCm);
      setCaliper({
        start: caliper.start,
        end: { x, y },
        distanceMm: dist
      });
    }
  };

  // Reset Caliper
  const handleResetCaliper = () => {
    setCaliper({ start: null, end: null, distanceMm: null });
  };

  // Evaluate eFAST Protocol
  const handleEvaluateEfast = () => {
    const report = evaluateEfastSession(assessedWindows, candidateDiagnosis, selectedScenario.pathology);
    setEvaluationReport(report);
    setShowDebrief(true);
  };

  // Socratic AI Assistant Bridge
  const handleAskAiAboutWindow = () => {
    const pathologyDesc = windowDef.pathologyDescriptions[selectedScenario.pathology] || 'No specific pathology defined.';
    const ctx = `[POCUS Ultrasound Consultation] Patient Case: ${selectedScenario.title}. 
Acoustic Window: ${windowDef.name}. 
Selected Probe: ${activeProbe} at ${settings.frequencyMhz} MHz, Depth: ${settings.depthCm} cm, Gain: ${settings.gainDb} dB. 
Active Clinical State: ${selectedScenario.pathology}. 
Normal Anatomy: ${windowDef.normalDescription}. 
Sonographic Findings: ${pathologyDesc}. 
Candidate Vitals: ${selectedScenario.initialVitals}.`;

    window.dispatchEvent(new CustomEvent('mediverse:open-ai-with-context', {
      detail: { context: ctx }
    }));
  };

  // -------------------------------------------------------------------------
  // Main Ultrasound CRT Rendering Engine
  // -------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      if (!settings.isFrozen) {
        timeSecRef.current += 0.033;
      }
      const t = timeSecRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark cathode ray tube / LCD background
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, width, height);

      if (settings.mode === 'B_MODE') {
        // Render 2D B-Mode ultrasound
        renderBMode(ctx, width, height, t);
      } else {
        // Render M-Mode (Motion Mode) split screen
        renderMMode(ctx, width, height, t);
      }

      // Draw Caliper Overlays if active
      if (caliper.start) {
        ctx.save();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);

        // Draw start crosshair
        drawCrosshair(ctx, caliper.start.x, caliper.start.y);

        if (caliper.end) {
          drawCrosshair(ctx, caliper.end.x, caliper.end.y);
          // Connecting line
          ctx.beginPath();
          ctx.moveTo(caliper.start.x, caliper.start.y);
          ctx.lineTo(caliper.end.x, caliper.end.y);
          ctx.stroke();

          // Caliper text badge
          const midX = (caliper.start.x + caliper.end.x) / 2;
          const midY = (caliper.start.y + caliper.end.y) / 2;
          ctx.setLineDash([]);
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1;
          ctx.fillRect(midX - 35, midY - 22, 70, 20);
          ctx.strokeRect(midX - 35, midY - 22, 70, 20);

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${caliper.distanceMm} mm`, midX, midY - 12);
        }
        ctx.restore();
      }

      // Live Telemetry / Machine Header HUD
      renderUltrasoundHUD(ctx, width, height);

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    const drawCrosshair = (c: CanvasRenderingContext2D, x: number, y: number) => {
      c.beginPath();
      c.moveTo(x - 6, y);
      c.lineTo(x + 6, y);
      c.moveTo(x, y - 6);
      c.lineTo(x, y + 6);
      c.stroke();
    };

    const renderBMode = (c: CanvasRenderingContext2D, w: number, h: number, elapsed: number) => {
      c.save();

      // Top margin for acoustic origin
      const originY = 32;
      const isLinear = activeProbe === 'LINEAR_VASCULAR_LUNG';
      const sectorApexX = w / 2;
      const maxSectorRadius = h - originY - 20;

      // Clip field of view (Sector wedge for curvilinear/cardiac, rectangle for linear)
      c.beginPath();
      if (isLinear) {
        const marginX = w * 0.15;
        c.rect(marginX, originY, w * 0.7, maxSectorRadius);
      } else {
        const sectorAngle = activeProbe === 'PHASED_ARRAY_CARDIAC' ? Math.PI * 0.45 : Math.PI * 0.4;
        c.moveTo(sectorApexX, originY);
        c.arc(sectorApexX, originY, maxSectorRadius, Math.PI / 2 - sectorAngle / 2, Math.PI / 2 + sectorAngle / 2);
        c.closePath();
      }
      c.clip();

      // Base acoustic background speckle gradient
      const bgGrad = c.createLinearGradient(0, originY, 0, h);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(0.5, '#070a14');
      bgGrad.addColorStop(1, '#020408');
      c.fillStyle = bgGrad;
      c.fill();

      // Subtle dynamic acoustic speckle (Rayleigh simulation)
      c.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let s = 0; s < 70; s++) {
        const sx = (Math.sin(s * 13 + elapsed * 1.5) * 0.5 + 0.5) * w;
        const sy = originY + (Math.cos(s * 19 + elapsed * 1.2) * 0.5 + 0.5) * maxSectorRadius;
        c.fillRect(sx, sy, 2, 2);
      }

      // Respiratory & Cardiac periodic motion factors
      const respOffset = Math.sin(elapsed * 0.35 * 2 * Math.PI) * 4;
      const cardiacCycle = Math.sin(elapsed * 1.25 * 2 * Math.PI);
      const cardiacScale = 1.0 + cardiacCycle * 0.05;

      // Combine normal structures + active pathology structures
      const currentStructures = [...windowDef.structures];
      const pathStructs = windowDef.pathologyStructures[selectedScenario.pathology];
      if (pathStructs) {
        currentStructures.push(...pathStructs);
      }

      // Render anatomical structures with depth attenuation & TGC
      currentStructures.forEach(str => {
        const normY = str.centerY;
        const gainMultiplier = computeAcousticGain(normY, settings);

        // Position coordinates
        let posX = str.centerX * w;
        let posY = originY + normY * maxSectorRadius + (activeWindow === 'LUNG_PLEURAL' ? 0 : respOffset);

        let rx = str.radiusX * (isLinear ? w * 0.7 : w * 0.8);
        let ry = str.radiusY * maxSectorRadius;

        // Apply cardiac pulsation if in cardiac window
        if (activeWindow === 'CARDIAC_SUBXIPHOID' && str.type !== 'parenchyma') {
          rx *= cardiacScale;
          ry *= cardiacScale;
        }

        // Apply lung sliding motion
        if (activeWindow === 'LUNG_PLEURAL' && str.id === 'pleural_line' && selectedScenario.pathology !== 'PNEUMOTHORAX') {
          // Shimmering pleura lateral translation
          posX += Math.sin(elapsed * 14) * 3;
        }

        // Effective echogenicity scaled by user Gain and TGC curve
        const effectiveEcho = Math.min(1.0, str.echogenicity * gainMultiplier);
        const grayVal = Math.floor(effectiveEcho * 240);

        c.save();
        c.translate(posX, posY);
        if (str.rotationRad) {
          c.rotate(str.rotationRad);
        }

        if (str.type === 'fluid') {
          // Anechoic / Jet-black with subtle internal noise
          c.fillStyle = `rgb(${Math.floor(grayVal * 0.2)}, ${Math.floor(grayVal * 0.25)}, ${Math.floor(grayVal * 0.3)})`;
          c.beginPath();
          c.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
          c.fill();
        } else if (str.type === 'shadow') {
          // Acoustic shadow beneath bone/rib: clean dark strip
          c.fillStyle = 'rgba(2, 4, 8, 0.92)';
          c.beginPath();
          c.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
          c.fill();
        } else if (str.type === 'pleura' || str.type === 'wall') {
          // Hyperechoic reflective border
          c.fillStyle = `rgb(${grayVal}, ${grayVal}, ${Math.min(255, grayVal + 15)})`;
          c.beginPath();
          c.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
          c.fill();
        } else {
          // Standard tissue parenchyma (speckled)
          const grad = c.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
          grad.addColorStop(0, `rgb(${grayVal}, ${grayVal}, ${grayVal})`);
          grad.addColorStop(1, `rgb(${Math.floor(grayVal * 0.6)}, ${Math.floor(grayVal * 0.6)}, ${Math.floor(grayVal * 0.7)})`);
          c.fillStyle = grad;
          c.beginPath();
          c.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
          c.fill();
        }

        c.restore();
      });

      // Lateral acoustic border outline
      c.restore(); // restore clipping

      // Draw sector outline & depth markers
      c.save();
      c.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      c.lineWidth = 1;

      if (isLinear) {
        const marginX = w * 0.15;
        c.strokeRect(marginX, originY, w * 0.7, maxSectorRadius);
      } else {
        const sectorAngle = activeProbe === 'PHASED_ARRAY_CARDIAC' ? Math.PI * 0.45 : Math.PI * 0.4;
        c.beginPath();
        c.moveTo(sectorApexX, originY);
        c.arc(sectorApexX, originY, maxSectorRadius, Math.PI / 2 - sectorAngle / 2, Math.PI / 2 + sectorAngle / 2);
        c.closePath();
        c.stroke();
      }

      // Depth ticks (graticules) on right side
      const depthTicksCount = Math.min(12, Math.floor(settings.depthCm));
      c.fillStyle = '#64748b';
      c.font = '9px monospace';
      c.textAlign = 'left';
      c.textBaseline = 'middle';

      const tickX = isLinear ? w * 0.86 : w * 0.88;
      for (let d = 1; d <= depthTicksCount; d += (settings.depthCm > 14 ? 2 : 1)) {
        const depthFrac = d / settings.depthCm;
        const tickY = originY + depthFrac * maxSectorRadius;

        c.beginPath();
        c.moveTo(tickX, tickY);
        c.lineTo(tickX + 6, tickY);
        c.stroke();

        c.fillText(`${d}`, tickX + 9, tickY);
      }

      // Focal Zone caret
      const focalY = originY + maxSectorRadius * 0.55;
      c.fillStyle = '#38bdf8';
      c.beginPath();
      c.moveTo(tickX + 5, focalY - 4);
      c.lineTo(tickX + 1, focalY);
      c.lineTo(tickX + 5, focalY + 4);
      c.fill();

      // Probe Orientation Dot (Standard green marker at top-left)
      const markerX = isLinear ? w * 0.16 : w * 0.32;
      c.fillStyle = '#22c55e';
      c.beginPath();
      c.arc(markerX, originY + 8, 4, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    const renderMMode = (c: CanvasRenderingContext2D, w: number, h: number, elapsed: number) => {
      // Split screen: Top 35% is miniature B-mode with M-mode sample line; bottom 65% is sweeping M-mode strip
      const splitY = h * 0.38;

      // 1. Mini B-Mode at top
      c.save();
      c.beginPath();
      c.rect(0, 0, w, splitY);
      c.clip();
      renderBMode(c, w, splitY * 2.2, elapsed);
      c.restore();

      // Draw vertical cursor M-line through B-mode
      c.save();
      c.strokeStyle = '#f59e0b';
      c.lineWidth = 1.5;
      c.setLineDash([3, 2]);
      c.beginPath();
      c.moveTo(w / 2, 28);
      c.lineTo(w / 2, splitY - 4);
      c.stroke();
      c.restore();

      // Divider line
      c.strokeStyle = '#334155';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, splitY);
      c.lineTo(w, splitY);
      c.stroke();

      // Label
      c.fillStyle = '#f59e0b';
      c.font = 'bold 10px monospace';
      c.fillText('M-MODE MOTION SWEEP (50 mm/s)', 12, splitY + 14);

      // 2. M-Mode sweep history update
      const newCol = generateMModeColumn(activeWindow, selectedScenario.pathology, elapsed, 100);
      const intensities = newCol.map(p => p.intensity);

      if (!settings.isFrozen) {
        mModeHistoryRef.current.push(intensities);
        const maxColumns = Math.floor(w - 24);
        if (mModeHistoryRef.current.length > maxColumns) {
          mModeHistoryRef.current.shift();
        }
      }

      // Draw M-mode rolling raster
      const mHistory = mModeHistoryRef.current;
      const startX = 12;
      const mStartY = splitY + 22;
      const mHeight = h - mStartY - 16;
      const colWidth = 1.5;

      mHistory.forEach((column, colIdx) => {
        const curX = startX + colIdx * colWidth;
        const rowHeight = mHeight / column.length;

        column.forEach((val, rowIdx) => {
          const curY = mStartY + rowIdx * rowHeight;
          c.fillStyle = `rgb(${val}, ${val}, ${Math.min(255, val + 10)})`;
          c.fillRect(curX, curY, colWidth + 0.5, rowHeight + 0.5);
        });
      });

      // M-mode Depth scale ticks on the left
      c.fillStyle = '#64748b';
      c.font = '9px monospace';
      c.textAlign = 'right';
      for (let d = 1; d <= 4; d++) {
        const y = mStartY + (d / 4) * mHeight;
        c.fillText(`${(d * (settings.depthCm / 4)).toFixed(0)}cm`, startX - 2, y);
      }
    };

    const renderUltrasoundHUD = (c: CanvasRenderingContext2D, w: number, _h: number) => {
      c.save();
      c.font = '10px monospace';
      c.fillStyle = '#94a3b8';

      // Top Left: Hospital / Clinic info & Scenario
      c.fillText('MEDIVERSE TRAUMA ULTRASOUND • ACUTE POCUS RESUS', 12, 16);

      // Top Right: Machine Technical Readouts
      c.textAlign = 'right';
      const fps = settings.isFrozen ? 0 : 32;
      c.fillText(`MI 1.1  TIS 0.2  FPS ${fps}  GAIN ${settings.gainDb}dB  ${settings.frequencyMhz.toFixed(1)}MHz`, w - 12, 16);

      // Freeze Badge
      if (settings.isFrozen) {
        c.fillStyle = '#ef4444';
        c.fillRect(w / 2 - 40, 6, 80, 18);
        c.fillStyle = '#ffffff';
        c.font = 'bold 11px monospace';
        c.textAlign = 'center';
        c.fillText('❄ FROZEN', w / 2, 19);
      }

      c.restore();
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    activeWindow,
    activeProbe,
    settings,
    selectedScenario,
    caliper,
    windowDef
  ]);

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Hospital Monitor Status Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                Point-of-Care Ultrasound (POCUS) Station
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Live Acoustic Core
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Virtual Emergency Sonography • eFAST Trauma • BLUE Pleural • Hemodynamic RUSH Protocol
            </p>
          </div>
        </div>

        {/* Scenario Quick Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="pocus-scenario-select" className="text-xs text-slate-400 font-semibold">
            Patient Case:
          </label>
          <select
            id="pocus-scenario-select"
            value={selectedScenario.id}
            onChange={(e) => {
              const sc = SCENARIO_PRESETS.find(s => s.id === e.target.value);
              if (sc) handleSelectScenario(sc);
            }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            {SCENARIO_PRESETS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clinical Patient Vignette Banner */}
      <div className="bg-slate-900/40 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-4 text-slate-300">
          <span className="font-semibold text-white">Profile:</span> {selectedScenario.patientProfile}
          <span className="text-slate-500">•</span>
          <span className="font-semibold text-white">Vitals:</span> <span className="text-rose-400 font-mono">{selectedScenario.initialVitals}</span>
        </div>
        <button
          onClick={handleAskAiAboutWindow}
          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-md font-semibold transition text-xs shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Consult Attending Radiologist
        </button>
      </div>

      {/* Main Sonography Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT COLUMN: Anatomical Torso Phantom & Window Selector (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800 p-5 bg-slate-900/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-400" />
                Acoustic Windows (eFAST)
              </h2>
              <span className="text-[10px] font-mono text-slate-500">
                {assessedWindows.size}/5 Viewed
              </span>
            </div>

            {/* Torso Phantom Graphic with Interactive Probe Hotspots */}
            <div className="relative w-full aspect-[4/5] bg-slate-950/70 rounded-xl border border-slate-800 p-3 mb-4 flex items-center justify-center overflow-hidden">
              {/* Torso Stylized Wireframe */}
              <svg viewBox="0 0 200 250" className="w-full h-full opacity-40">
                {/* Clavicles */}
                <path d="M 60 40 Q 100 45, 140 40" stroke="#94a3b8" strokeWidth="2" fill="none" />
                {/* Sternum */}
                <line x1="100" y1="45" x2="100" y2="110" stroke="#94a3b8" strokeWidth="3" />
                {/* Ribcage arcs */}
                <path d="M 50 60 Q 100 70, 150 60" stroke="#475569" strokeWidth="1.5" fill="none" />
                <path d="M 45 80 Q 100 95, 155 80" stroke="#475569" strokeWidth="1.5" fill="none" />
                <path d="M 40 105 Q 100 120, 160 105" stroke="#475569" strokeWidth="1.5" fill="none" />
                {/* Costal margins */}
                <path d="M 40 105 Q 80 125, 100 115 Q 120 125, 160 105" stroke="#94a3b8" strokeWidth="2" fill="none" />
                {/* Pelvic Brim */}
                <path d="M 55 180 C 80 195, 120 195, 145 180 C 130 220, 70 220, 55 180 Z" stroke="#475569" strokeWidth="1.5" fill="none" />
                {/* Flanks */}
                <path d="M 45 60 Q 30 130, 55 180" stroke="#64748b" strokeWidth="2" fill="none" />
                <path d="M 155 60 Q 170 130, 145 180" stroke="#64748b" strokeWidth="2" fill="none" />
              </svg>

              {/* Hotspot 1: Cardiac Subxiphoid */}
              <button
                onClick={() => handleSelectWindow('CARDIAC_SUBXIPHOID')}
                title="Cardiac Subxiphoid 4-Chamber"
                className={`absolute left-[50%] top-[46%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-lg ${
                  activeWindow === 'CARDIAC_SUBXIPHOID'
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/30 scale-110'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                <span className="text-[11px] font-black">SX</span>
              </button>

              {/* Hotspot 2: RUQ Morison's Pouch */}
              <button
                onClick={() => handleSelectWindow('RUQ_MORISONS_POUCH')}
                title="RUQ / Morison's Pouch"
                className={`absolute left-[30%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-lg ${
                  activeWindow === 'RUQ_MORISONS_POUCH'
                    ? 'bg-blue-500 text-white ring-4 ring-blue-500/30 scale-110'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                <span className="text-[11px] font-black">RUQ</span>
              </button>

              {/* Hotspot 3: LUQ Splenorenal */}
              <button
                onClick={() => handleSelectWindow('LUQ_SPLENORENAL')}
                title="LUQ / Splenorenal Recess"
                className={`absolute left-[70%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-lg ${
                  activeWindow === 'LUQ_SPLENORENAL'
                    ? 'bg-purple-500 text-white ring-4 ring-purple-500/30 scale-110'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                <span className="text-[11px] font-black">LUQ</span>
              </button>

              {/* Hotspot 4: Pelvic Suprapubic */}
              <button
                onClick={() => handleSelectWindow('PELVIC_SUPRAPUBIC')}
                title="Pelvic / Suprapubic Recess"
                className={`absolute left-[50%] top-[78%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-lg ${
                  activeWindow === 'PELVIC_SUPRAPUBIC'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-500/30 scale-110'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                <span className="text-[11px] font-black">PEL</span>
              </button>

              {/* Hotspot 5: Anterior Lung / Pleural Zone */}
              <button
                onClick={() => handleSelectWindow('LUNG_PLEURAL')}
                title="Anterior Lung Pleura (Rib Spaces 2-4)"
                className={`absolute left-[33%] top-[25%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-lg ${
                  activeWindow === 'LUNG_PLEURAL'
                    ? 'bg-sky-500 text-white ring-4 ring-sky-500/30 scale-110'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                <span className="text-[11px] font-black">LNG</span>
              </button>
            </div>

            {/* Window Selection List */}
            <div className="space-y-1.5">
              {EFAST_CHECKLIST_STEPS.map((step) => {
                const isSelected = activeWindow === step.window;
                const isViewed = assessedWindows.has(step.window);

                return (
                  <button
                    key={step.window}
                    onClick={() => handleSelectWindow(step.window)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isViewed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{step.title}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Window Sonographic Pearl */}
          <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300">
            <div className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              {windowDef.name}
            </div>
            <p className="text-slate-400 leading-relaxed line-clamp-3">
              {windowDef.clinicalPurpose}
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: Main Ultrasound Screen Canvas & Top Bar (6 cols) */}
        <div className="lg:col-span-6 p-4 flex flex-col items-center justify-center bg-black">
          {/* Ultrasound Machine Monitor Outer Frame */}
          <div className="w-full relative rounded-xl border-4 border-slate-800 bg-[#05070d] shadow-2xl overflow-hidden flex flex-col items-center">
            
            {/* Live Canvas */}
            <canvas
              ref={canvasRef}
              width={560}
              height={440}
              onClick={handleCanvasClick}
              className={`w-full h-auto max-h-[460px] object-contain ${
                settings.caliperActive ? 'cursor-crosshair' : 'cursor-default'
              }`}
            />

            {/* Monitor Bezel Bottom Control Bar */}
            <div className="w-full bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettings(s => ({ ...s, isFrozen: !s.isFrozen }))}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition ${
                    settings.isFrozen
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {settings.isFrozen ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  {settings.isFrozen ? 'UNFREEZE' : 'FREEZE'}
                </button>

                <button
                  onClick={() => setSettings(s => ({ ...s, mode: s.mode === 'B_MODE' ? 'M_MODE' : 'B_MODE' }))}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition ${
                    settings.mode === 'M_MODE'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  {settings.mode === 'B_MODE' ? 'M-MODE' : '2D B-MODE'}
                </button>
              </div>

              {/* Caliper Measurement Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSettings(s => ({ ...s, caliperActive: !s.caliperActive }));
                    if (!settings.caliperActive) handleResetCaliper();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition ${
                    settings.caliperActive
                      ? 'bg-yellow-500 text-slate-950 ring-2 ring-yellow-400/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  CALIPER
                </button>

                {caliper.distanceMm !== null && (
                  <div className="bg-slate-950 border border-yellow-500/60 text-yellow-300 px-2 py-0.5 rounded font-mono text-xs font-bold">
                    {caliper.distanceMm} mm
                  </div>
                )}

                {settings.caliperActive && (
                  <button
                    onClick={handleResetCaliper}
                    title="Reset Caliper Points"
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Active Window Finding Debrief */}
          <div className="w-full mt-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-300">Live Sonographic Anatomy:</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {activeProbe.replace('_', ' ')}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {windowDef.pathologyDescriptions[selectedScenario.pathology] || windowDef.normalDescription}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Sonographer Console Dials, TGC & eFAST Exam Board (3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-800 p-5 bg-slate-900/30 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Ultrasound Console Controls
            </h2>

            {/* Transducer Probe Selection */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Transducer Probe:
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-bold text-center">
                <button
                  onClick={() => {
                    setActiveProbe('CURVILINEAR_ABDOMINAL');
                    setSettings(s => ({ ...s, frequencyMhz: 3.5, depthCm: 16 }));
                  }}
                  className={`py-1.5 rounded transition ${
                    activeProbe === 'CURVILINEAR_ABDOMINAL'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Curvilinear
                </button>
                <button
                  onClick={() => {
                    setActiveProbe('PHASED_ARRAY_CARDIAC');
                    setSettings(s => ({ ...s, frequencyMhz: 2.5, depthCm: 18 }));
                  }}
                  className={`py-1.5 rounded transition ${
                    activeProbe === 'PHASED_ARRAY_CARDIAC'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Phased (Echo)
                </button>
                <button
                  onClick={() => {
                    setActiveProbe('LINEAR_VASCULAR_LUNG');
                    setSettings(s => ({ ...s, frequencyMhz: 10.0, depthCm: 6 }));
                  }}
                  className={`py-1.5 rounded transition ${
                    activeProbe === 'LINEAR_VASCULAR_LUNG'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Linear (Lung)
                </button>
              </div>
            </div>

            {/* Depth & Overall Gain Sliders */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300 font-medium">Gain (Overall):</span>
                  <span className="font-mono text-blue-400 font-bold">{settings.gainDb} dB</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={settings.gainDb}
                  onChange={(e) => setSettings(s => ({ ...s, gainDb: Number(e.target.value) }))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300 font-medium">Depth:</span>
                  <span className="font-mono text-emerald-400 font-bold">{settings.depthCm} cm</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  value={settings.depthCm}
                  onChange={(e) => setSettings(s => ({ ...s, depthCm: Number(e.target.value) }))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* 4-Zone Time-Gain Compensation (TGC) */}
            <div className="mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Time-Gain Compensation (TGC)
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-mono text-slate-400">
                <div>
                  <label>Near</label>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={settings.tgcNear}
                    onChange={(e) => setSettings(s => ({ ...s, tgcNear: Number(e.target.value) }))}
                    className="w-full accent-indigo-500 h-1 bg-slate-800 rounded mt-1"
                  />
                  <span>{settings.tgcNear > 0 ? `+${settings.tgcNear}` : settings.tgcNear}</span>
                </div>
                <div>
                  <label>Mid 1</label>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={settings.tgcMid1}
                    onChange={(e) => setSettings(s => ({ ...s, tgcMid1: Number(e.target.value) }))}
                    className="w-full accent-indigo-500 h-1 bg-slate-800 rounded mt-1"
                  />
                  <span>{settings.tgcMid1 > 0 ? `+${settings.tgcMid1}` : settings.tgcMid1}</span>
                </div>
                <div>
                  <label>Mid 2</label>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={settings.tgcMid2}
                    onChange={(e) => setSettings(s => ({ ...s, tgcMid2: Number(e.target.value) }))}
                    className="w-full accent-indigo-500 h-1 bg-slate-800 rounded mt-1"
                  />
                  <span>{settings.tgcMid2 > 0 ? `+${settings.tgcMid2}` : settings.tgcMid2}</span>
                </div>
                <div>
                  <label>Far</label>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={settings.tgcFar}
                    onChange={(e) => setSettings(s => ({ ...s, tgcFar: Number(e.target.value) }))}
                    className="w-full accent-indigo-500 h-1 bg-slate-800 rounded mt-1"
                  />
                  <span>{settings.tgcFar > 0 ? `+${settings.tgcFar}` : settings.tgcFar}</span>
                </div>
              </div>
            </div>

            {/* Official eFAST Protocol Signoff */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  eFAST Final Report
                </span>
                <span className="text-[10px] text-slate-400">
                  {assessedWindows.size === 5 ? 'Ready' : 'Incomplete'}
                </span>
              </div>

              <div className="mb-2">
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  Candidate Diagnostic Impression:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Positive hemoperitoneum RUQ"
                  value={candidateDiagnosis}
                  onChange={(e) => setCandidateDiagnosis(e.target.value)}
                  className="w-full bg-slate-850 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleEvaluateEfast}
                disabled={!candidateDiagnosis.trim()}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                Submit Official Sonologist Finding
              </button>
            </div>
          </div>

          {/* Quick Presets Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Machine Preset:</span>
            <button
              onClick={() => {
                setSettings({
                  gainDb: 50,
                  depthCm: 16,
                  frequencyMhz: 3.5,
                  dynamicRangeDb: 60,
                  tgcNear: 0,
                  tgcMid1: 0,
                  tgcMid2: 0,
                  tgcFar: 0,
                  mode: 'B_MODE',
                  isFrozen: false,
                  showGrid: true,
                  caliperActive: false
                });
                handleResetCaliper();
              }}
              className="hover:text-blue-400 underline font-medium"
            >
              Factory Reset Dials
            </button>
          </div>
        </div>

      </div>

      {/* Official Dean's eFAST Assessment Report Modal */}
      {showDebrief && evaluationReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    eFAST Competency Assessment
                  </h3>
                  <p className="text-xs text-slate-400">
                    Emergency Medicine & Trauma Ultrasound Core Curriculum
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDebrief(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Score Banner */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Score</div>
                <div className="text-2xl font-black text-blue-400">{evaluationReport.scorePercentage}%</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Diagnostic Result</div>
                <div className={`text-sm font-black mt-1.5 ${
                  evaluationReport.accuracy === 'ACCURATE'
                    ? 'text-emerald-400'
                    : evaluationReport.accuracy === 'PARTIAL'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {evaluationReport.accuracy}
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Clinical Decision</div>
                <div className={`text-sm font-black mt-1.5 ${
                  evaluationReport.passedEvaluation ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {evaluationReport.passedEvaluation ? 'CERTIFIED PASS' : 'REMEDIATION'}
                </div>
              </div>
            </div>

            {/* Clinical Summary */}
            <div className="mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
              <span className="font-bold text-white block mb-1">Attending Faculty Summary:</span>
              <p className="text-slate-400">{evaluationReport.clinicalSummary}</p>
            </div>

            {/* Recommendations */}
            <div className="mb-5">
              <span className="text-xs font-bold text-white block mb-2">Key Learning Points:</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {evaluationReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowDebrief(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
            >
              Continue Clinical Sonography Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
