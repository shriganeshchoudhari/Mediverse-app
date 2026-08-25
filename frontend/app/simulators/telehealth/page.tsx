import React from 'react';
import AudioStreamer from '@/components/simulators/AudioStreamer';

export default function TelehealthSimulatorPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-xl font-bold text-white font-mono">Telehealth Simulator</h1>
          </div>
          <div className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-mono">
            CASE: Acute Abdomen (Standardized Patient)
          </div>
        </div>

        {/* Video / Avatar Area */}
        <div className="flex-1 bg-slate-950 relative flex items-center justify-center">
          {/* Mock Avatar */}
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <svg className="w-20 h-20 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-white text-lg font-medium">John (45y, Male)</h2>
            <p className="text-slate-400 text-sm">AI Patient</p>
          </div>
        </div>

        {/* Interaction Area (Audio Streamer) */}
        <div className="bg-slate-900 p-6 border-t border-slate-800">
          <AudioStreamer />
        </div>
      </div>
    </div>
  );
}
