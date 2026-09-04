'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Text } from '@react-three/drei';
import { Glasses, Move3d, Sparkles, HelpCircle, Volume2 } from 'lucide-react';
import { SPATIAL_DISSECTION_TOOLS, DEFAULT_MEDICAL_XR_CONFIG } from '@/.gemini/skills/3d/SpatialXRPresets';
import LifelikeHeartModel from './LifelikeHeartModel';

function HeartOrganModel({ isBeating = true }: { isBeating?: boolean }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <LifelikeHeartModel bpm={isBeating ? 72 : 0} isPaused={!isBeating} wetness={0.95} enableTorsion={true} />
    </Float>
  );
}

export default function SpatialAnatomyCanvas({
  organName = 'Human Heart & Great Vessels',
  domain = 'Allopathic MBBS (Cardiology)',
}: {
  organName?: string;
  domain?: string;
}) {
  const [isXrSupported, setIsXrSupported] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<string>('socratic-pointer');
  const [spatialAnnotation, setSpatialAnnotation] = useState<string | null>(
    'Left Ventricle: Primary pumping chamber generating systemic systolic pressure.'
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-vr').then(setIsXrSupported).catch(() => setIsXrSupported(false));
    }
  }, []);

  const handleEnterVR = async () => {
    if (typeof window !== 'undefined' && 'xr' in navigator) {
      try {
        const session = await (navigator as any).xr.requestSession(
          DEFAULT_MEDICAL_XR_CONFIG.mode,
          DEFAULT_MEDICAL_XR_CONFIG
        );
        console.log('WebXR Session Started:', session);
      } catch (err) {
        alert('WebXR headset not detected. Launching spatial desktop 3D emulation mode.');
      }
    } else {
      alert('WebXR browser API not supported on this browser. Running high-fidelity 3D canvas.');
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 shadow-lg">
          <div className="text-xs text-indigo-400 font-mono flex items-center gap-1.5 font-bold">
            <Move3d size={14} /> SPATIAL WEBXR ANATOMY
          </div>
          <div className="text-sm font-bold text-white">{organName}</div>
        </div>

        <div className="flex items-center gap-2">
          {/* Spatial Tools */}
          <div className="flex bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80">
            {SPATIAL_DISSECTION_TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTool(t.id)}
                title={t.description}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all font-medium ${
                  selectedTool === t.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Enter VR Button */}
          <button
            onClick={handleEnterVR}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Glasses size={16} /> Enter WebXR VR Mode
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
          <pointLight position={[0, 2, 2]} intensity={1} color="#f43f5e" />

          <HeartOrganModel />

          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>

      {/* Bottom Floating Socratic Spatial Annotation Panel */}
      {spatialAnnotation && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 shadow-2xl flex items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-[11px] font-mono text-indigo-400 font-bold uppercase">Active Socratic Callout</div>
              <p className="text-xs text-slate-200">{spatialAnnotation}</p>
            </div>
          </div>

          <button
            onClick={() => alert('Spatial audio narration triggered in VR headset.')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium border border-slate-700"
          >
            <Volume2 size={14} /> Play Spatial Audio
          </button>
        </div>
      )}
    </div>
  );
}
