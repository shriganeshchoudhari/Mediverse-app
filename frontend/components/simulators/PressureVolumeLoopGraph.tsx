import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

interface PVGraphProps {
  preload: number; // EDV
  afterload: number; // Diastolic Aortic Pressure
  contractility: number; // Slope of ESPVR
}

export default function PressureVolumeLoopGraph({ preload, afterload, contractility }: PVGraphProps) {
  const V0 = 10; // Volume intercept of ESPVR
  const systolicPressure = afterload + 40;
  
  // ESV based on ESPVR slope and peak systolic pressure
  const esv = Math.max(systolicPressure / contractility + V0, 30); 
  const edv = preload;
  
  const data = [];
  
  // 1. Isovolumetric relaxation
  data.push({ v: esv, p: systolicPressure });
  data.push({ v: esv, p: 8 }); 
  
  // 2. Ventricular Filling (EDPVR)
  const fillingSteps = 15;
  for (let i = 0; i <= fillingSteps; i++) {
    const v = esv + ((edv - esv) * (i / fillingSteps));
    const p = 5 + Math.exp(0.025 * (v - 80)); 
    data.push({ v, p });
  }
  
  const endFillingPressure = 5 + Math.exp(0.025 * (edv - 80));

  // 3. Isovolumetric contraction
  data.push({ v: edv, p: afterload });
  
  // 4. Ejection
  const ejectionSteps = 15;
  for (let i = 0; i <= ejectionSteps; i++) {
    const fraction = i / ejectionSteps;
    const p = afterload + (systolicPressure - afterload) * Math.sin(fraction * Math.PI);
    const v = edv - ((edv - esv) * fraction);
    data.push({ v, p });
  }
  
  // Close loop
  data.push({ v: esv, p: systolicPressure });

  // Generate ESPVR line for reference
  const espvrData = [
    { v: V0, p: 0 },
    { v: esv * 1.5, p: (esv * 1.5 - V0) * contractility }
  ];

  // Valve Events
  const valveEvents = [
    { x: edv, y: endFillingPressure, label: "Mitral Closes", fill: "#f59e0b" },
    { x: edv, y: afterload, label: "Aortic Opens", fill: "#ef4444" },
    { x: esv, y: systolicPressure, label: "Aortic Closes", fill: "#10b981" },
    { x: esv, y: 8, label: "Mitral Opens", fill: "#3b82f6" }
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart margin={{ top: 25, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="v" 
            type="number" 
            domain={[0, 200]} 
            stroke="#94a3b8"
            label={{ value: 'Left Ventricular Volume (mL)', position: 'bottom', fill: '#94a3b8' }}
          />
          <YAxis 
            dataKey="p" 
            type="number" 
            domain={[0, 200]} 
            stroke="#94a3b8"
            label={{ value: 'Pressure (mmHg)', angle: -90, position: 'left', fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            formatter={(value: any, name: any) => [
              typeof value === 'number' ? value.toFixed(1) : value, 
              name === 'p' ? 'Pressure (mmHg)' : 'Volume (mL)'
            ]}
            labelFormatter={() => ''}
          />
          
          {/* ESPVR Reference Line */}
          <Line 
            data={espvrData} 
            dataKey="p" 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
            name="ESPVR"
          />

          {/* PV Loop */}
          <Line 
            data={data} 
            dataKey="p" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={false}
            isAnimationActive={false}
            name="PV Loop"
          />

          {/* Render Valve Events Dots */}
          {valveEvents.map((evt, idx) => (
            <ReferenceDot
              key={idx}
              x={evt.x}
              y={evt.y}
              r={6}
              fill={evt.fill}
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legend guide for valves */}
      <div className="flex justify-center gap-6 text-xs text-slate-400 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-white/20"></span>
          <span>Mitral Valve Closes (EDV)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-white/20"></span>
          <span>Aortic Valve Opens</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-white/20"></span>
          <span>Aortic Valve Closes (ESV)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] border border-white/20"></span>
          <span>Mitral Valve Opens</span>
        </div>
      </div>
    </div>
  );
}
