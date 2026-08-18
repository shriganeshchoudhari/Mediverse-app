import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

interface FrankStarlingProps {
  preload: number; // EDV
  contractility: number; // Inotropy
  currentStrokeVolume: number;
}

export default function FrankStarlingGraph({ preload, contractility, currentStrokeVolume }: FrankStarlingProps) {
  // Model: SV = SV_max * (1 - exp(-k * (EDV - EDV_0)))
  // SV_max is highly dependent on contractility
  const edv0 = 40;
  const svMax = 60 * contractility;
  const k = 0.012;

  // Generate curve points for EDV from 40 to 200
  const curveData = [];
  for (let edv = 40; edv <= 200; edv += 10) {
    const sv = Math.max(0, svMax * (1 - Math.exp(-k * (edv - edv0))));
    curveData.push({ edv, sv });
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="edv" 
            type="number" 
            domain={[0, 200]} 
            stroke="#94a3b8"
            label={{ value: 'End-Diastolic Volume / Preload (mL)', position: 'bottom', fill: '#94a3b8' }}
          />
          <YAxis 
            dataKey="sv" 
            type="number" 
            domain={[0, 160]} 
            stroke="#94a3b8"
            label={{ value: 'Stroke Volume (mL)', angle: -90, position: 'left', fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            formatter={(value: any) => [typeof value === 'number' ? value.toFixed(1) : value, 'Stroke Volume (mL)']}
            labelFormatter={(label) => `EDV: ${label} mL`}
          />
          
          {/* Frank Starling Curve */}
          <Line 
            data={curveData} 
            dataKey="sv" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={false}
            isAnimationActive={false}
            name="Frank-Starling Curve"
          />

          {/* Current Operating Point Dot */}
          <ReferenceDot 
            x={preload} 
            y={currentStrokeVolume} 
            r={8} 
            fill="#3b82f6" 
            stroke="#ffffff" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
