'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AuscultationPoint,
  AUSCULTATION_POINTS,
  AuscultationAudioSynthesizer,
} from '@/.gemini/skills/OSCEExamSkills';
import { Stethoscope, Volume2, VolumeX, ShieldAlert, CheckCircle2, Info, Eye } from 'lucide-react';

interface VirtualAuscultationExamProps {
  onAuscultatePoint?: (point: AuscultationPoint) => void;
  onLogFinding?: (findingText: string) => void;
  heartRateBpm?: number;
}

export default function VirtualAuscultationExam({
  onAuscultatePoint,
  onLogFinding,
  heartRateBpm = 104,
}: VirtualAuscultationExamProps) {
  const [activeView, setActiveView] = useState<'anterior' | 'posterior'>('anterior');
  const [selectedPoint, setSelectedPoint] = useState<AuscultationPoint | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [loggedFindings, setLoggedFindings] = useState<string[]>([]);
  const [showAnatomicalOverlays, setShowAnatomicalOverlays] = useState(true);

  const synthRef = useRef<AuscultationAudioSynthesizer | null>(null);

  useEffect(() => {
    synthRef.current = new AuscultationAudioSynthesizer();
    synthRef.current.init();

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  const handleSelectPoint = (point: AuscultationPoint) => {
    setSelectedPoint(point);
    setIsPlayingAudio(true);
    if (synthRef.current) {
      synthRef.current.playPointSound(point, heartRateBpm);
    }
    if (onAuscultatePoint) {
      onAuscultatePoint(point);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (synthRef.current) synthRef.current.stop();
      setIsPlayingAudio(false);
    } else if (selectedPoint && synthRef.current) {
      synthRef.current.playPointSound(selectedPoint, heartRateBpm);
      setIsPlayingAudio(true);
    }
  };

  const handleRecordFinding = (findingText: string) => {
    if (!loggedFindings.includes(findingText)) {
      const updated = [...loggedFindings, findingText];
      setLoggedFindings(updated);
      if (onLogFinding) onLogFinding(findingText);
    }
  };

  const currentPoints = AUSCULTATION_POINTS.filter((p) => p.view === activeView);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6 text-slate-100">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
            <Stethoscope size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Virtual Stethoscope & Auscultation</h3>
            <p className="text-xs text-slate-400">
              Interactive landmark auscultation. Click acoustic targets to listen to synthesized hemodynamics.
            </p>
          </div>
        </div>

        {/* View Switcher & Toggles */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center">
            <button
              onClick={() => {
                setActiveView('anterior');
                if (synthRef.current) synthRef.current.stop();
                setIsPlayingAudio(false);
                setSelectedPoint(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'anterior'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Anterior Thorax
            </button>
            <button
              onClick={() => {
                setActiveView('posterior');
                if (synthRef.current) synthRef.current.stop();
                setIsPlayingAudio(false);
                setSelectedPoint(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'posterior'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Posterior Back
            </button>
          </div>

          <button
            onClick={() => setShowAnatomicalOverlays(!showAnatomicalOverlays)}
            className={`p-2 rounded-xl border transition-colors ${
              showAnatomicalOverlays
                ? 'bg-slate-800 border-slate-700 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title="Toggle landmark guides"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Main Examination Canvas & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Thorax Map Area */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 relative flex flex-col items-center justify-center min-h-[380px]">
          {/* Anatomical Torso SVG Silhouette */}
          <div className="relative w-full max-w-[340px] aspect-[3/4] select-none">
            <svg
              viewBox="0 0 300 400"
              className="w-full h-full text-slate-800 stroke-slate-700 stroke-[1.5] fill-slate-900/50"
            >
              {/* Head & Neck outline */}
              <path d="M 125,20 C 125,10 175,10 175,20 C 175,45 165,60 165,65 L 185,75 C 230,90 250,130 250,200 C 250,280 235,380 220,390 L 80,390 C 65,380 50,280 50,200 C 50,130 70,90 115,75 L 135,65 C 135,60 125,45 125,20 Z" />
              {/* Rib cage subtle contours */}
              <path
                d="M 100,120 Q 150,140 200,120 M 90,160 Q 150,185 210,160 M 95,200 Q 150,225 205,200 M 105,240 Q 150,265 195,240"
                className="stroke-slate-800 stroke-[1] fill-none"
              />
              {/* Sternal Border / Spine */}
              {activeView === 'anterior' ? (
                <line x1="150" y1="80" x2="150" y2="230" className="stroke-slate-800 stroke-[2] stroke-dasharray-2" />
              ) : (
                <line x1="150" y1="70" x2="150" y2="360" className="stroke-slate-700 stroke-[2.5]" />
              )}
            </svg>

            {/* Landmark targets */}
            {currentPoints.map((point) => {
              const isSelected = selectedPoint?.id === point.id;
              const isCardiac = point.system === 'cardiac';

              return (
                <button
                  key={point.id}
                  onClick={() => handleSelectPoint(point)}
                  style={{
                    left: `${point.xPercent}%`,
                    top: `${point.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute group z-20 focus:outline-none transition-all duration-300`}
                >
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform ${
                      isSelected
                        ? 'bg-rose-500 border-white scale-125 animate-pulse'
                        : isCardiac
                        ? 'bg-indigo-900/90 border-indigo-400 hover:scale-110 hover:border-white'
                        : 'bg-teal-900/90 border-teal-400 hover:scale-110 hover:border-white'
                    }`}
                  >
                    <Stethoscope size={14} className={isSelected ? 'text-white' : 'text-slate-200'} />
                  </div>

                  {/* Landmark Label Hover */}
                  {showAnatomicalOverlays && (
                    <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-slate-700 text-[10px] text-slate-300 font-mono px-1.5 py-0.5 rounded shadow pointer-events-none opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all">
                      {point.name}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 font-mono mt-3">
            {activeView === 'anterior'
              ? 'Anterior: Aortic, Pulmonic, Erb, Tricuspid, Apex & Upper Lobes'
              : 'Posterior: Posterior Thorax, Basilar Segments & Spine Alignment'}
          </div>
        </div>

        {/* Auscultation Diagnostic Feed */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPoint ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                      selectedPoint.system === 'cardiac'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                        : 'bg-teal-950/80 text-teal-300 border border-teal-800/40'
                    }`}
                  >
                    {selectedPoint.system} Examination
                  </span>
                  <h4 className="text-base font-bold text-white">{selectedPoint.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{selectedPoint.anatomicalLocation}</p>
                </div>

                {/* Audio Controls */}
                <button
                  onClick={handleToggleAudio}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                  title={isPlayingAudio ? 'Mute acoustic playback' : 'Play acoustic sound'}
                >
                  {isPlayingAudio ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>

              {/* Sound Character & Waveform indicator */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Acoustic Profile</span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    HR: {heartRateBpm} BPM | {selectedPoint.audioFrequencyHz} Hz
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed font-mono">
                  {selectedPoint.pathologicalSoundDescription}
                </p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex items-start gap-1.5">
                  <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                  <span>{selectedPoint.clinicalSignificance}</span>
                </div>
              </div>

              {/* Log Findings Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Log Auscultatory Finding to Clinical Chart:</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    `Auscultated ${selectedPoint.name}: ${selectedPoint.modulationType.replace('_', ' ').toUpperCase()}`,
                    `Detected ${selectedPoint.clinicalSignificance.split('(')[0].trim()}`,
                  ].map((finding, idx) => {
                    const isLogged = loggedFindings.includes(finding);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleRecordFinding(finding)}
                        disabled={isLogged}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                          isLogged
                            ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-indigo-900/40 hover:border-indigo-500'
                        }`}
                      >
                        {isLogged ? <CheckCircle2 size={13} /> : null}
                        <span>{finding}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
              <Stethoscope size={36} className="mx-auto text-slate-600" />
              <div className="text-sm font-semibold text-slate-300">Stethoscope Disengaged</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click any of the pulsing anatomical landmark points on the torso to auscultate the patient’s cardiac valves or pulmonary segments.
              </p>
            </div>
          )}

          {/* Logged Findings Summary */}
          {loggedFindings.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Charted Auscultation Findings ({loggedFindings.length})
              </div>
              <ul className="space-y-1">
                {loggedFindings.map((f, i) => (
                  <li key={i} className="text-xs text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
