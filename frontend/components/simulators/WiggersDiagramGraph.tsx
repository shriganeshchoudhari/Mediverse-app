import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WiggersProps {
  heartRate: number;
  preload: number;
  afterload: number;
  contractility: number;
}

export default function WiggersDiagramGraph({ heartRate, preload, afterload, contractility }: WiggersProps) {
  const cycleDurationMs = 60000 / heartRate;
  
  // ESV calculation
  const V0 = 10;
  const systolicPressure = afterload + 40;
  const esv = Math.max(systolicPressure / contractility + V0, 30);
  const edv = preload;
  const diaP = 5 + Math.exp(0.02 * (edv - 120));

  const data = [];
  const steps = 100;
  
  // Timings (normalized 0 to 1)
  const atrialEnd = 0.15;
  const icEnd = 0.25;
  const ejectionEnd = 0.55;
  const irEnd = 0.65;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const timeMs = t * cycleDurationMs;
    
    let lvPressure = diaP;
    let aorticPressure = afterload - 5;
    let atrialPressure = 5;
    let lvVolume = edv;
    let ecg = 0;
    let phonocardiogram = 0; // Heart sounds (S1 / S2)

    // 1. Atrial Systole
    if (t < atrialEnd) {
      const phaseT = t / atrialEnd;
      atrialPressure = 5 + 7 * Math.sin(phaseT * Math.PI);
      lvPressure = diaP + (atrialPressure - 5) * 0.7;
      lvVolume = (edv - 12) + 12 * Math.sin(phaseT * (Math.PI / 2));
      
      // ECG P-wave
      if (t >= 0.02 && t <= 0.10) {
        ecg = 12 * Math.sin(((t - 0.02) / 0.08) * Math.PI);
      }
    }
    // 2. Isovolumetric Contraction
    else if (t >= atrialEnd && t < icEnd) {
      const phaseT = (t - atrialEnd) / (icEnd - atrialEnd);
      lvPressure = diaP + (afterload - diaP) * phaseT;
      aorticPressure = afterload - 5 * (1 - phaseT); // slight diastolic decay
      atrialPressure = 6 + 3 * Math.sin(phaseT * Math.PI); // c-wave
      lvVolume = edv;
      
      // ECG QRS-complex
      if (t >= 0.15 && t <= 0.20) {
        const qrsT = (t - 0.15) / 0.05;
        if (qrsT < 0.3) ecg = -10 * (qrsT / 0.3);
        else if (qrsT < 0.7) ecg = 70 * ((qrsT - 0.3) / 0.4) - 10;
        else ecg = 70 - 90 * ((qrsT - 0.7) / 0.3);
      }
      
      // Heart Sound S1
      if (t >= 0.15 && t <= 0.19) {
        phonocardiogram = 40 * Math.sin(((t - 0.15) / 0.04) * Math.PI * 4); // high frequency vibration
      }
    }
    // 3. Ventricular Ejection
    else if (t >= icEnd && t < ejectionEnd) {
      const phaseT = (t - icEnd) / (ejectionEnd - icEnd);
      const bump = (systolicPressure - afterload) * Math.sin(phaseT * Math.PI);
      lvPressure = afterload + bump;
      aorticPressure = lvPressure;
      atrialPressure = 4 + 8 * phaseT; // filling during contraction
      lvVolume = edv - (edv - esv) * Math.sin(phaseT * (Math.PI / 2));
      
      // ECG T-wave (repolarization)
      if (t >= 0.45 && t <= 0.55) {
        ecg = 18 * Math.sin(((t - 0.45) / 0.10) * Math.PI);
      }
    }
    // 4. Isovolumetric Relaxation
    else if (t >= ejectionEnd && t < irEnd) {
      const phaseT = (t - ejectionEnd) / (irEnd - ejectionEnd);
      lvPressure = systolicPressure - (systolicPressure - diaP) * phaseT;
      // Dicrotic notch in aortic pressure
      aorticPressure = (afterload + 15) - 10 * Math.sin(phaseT * (Math.PI / 2));
      atrialPressure = 12 + 2 * Math.sin(phaseT * (Math.PI / 2)); // v-wave peak
      lvVolume = esv;
      
      // Heart Sound S2
      if (t >= 0.55 && t <= 0.59) {
        phonocardiogram = 30 * Math.sin(((t - 0.55) / 0.04) * Math.PI * 5); // higher frequency, shorter
      }
    }
    // 5. Rapid Filling & Diastasis
    else {
      const phaseT = (t - irEnd) / (1 - irEnd);
      lvPressure = 5 + 3 * phaseT;
      aorticPressure = (afterload + 5) - (afterload - diastolicPressure(preload)) * phaseT;
      atrialPressure = 8 - 3 * Math.sin(phaseT * (Math.PI / 2));
      // Rapid passive filling curve
      lvVolume = esv + ((edv - 12) - esv) * (1 - Math.exp(-5.0 * phaseT));
    }

    data.push({
      time: Math.round(timeMs),
      LVP: Math.round(Math.max(0, lvPressure)),
      AP: Math.round(Math.max(0, aorticPressure)),
      LAP: Math.round(Math.max(0, atrialPressure)),
      LVV: Math.round(lvVolume),
      ECG: Math.round(ecg),
      PCG: Math.round(phonocardiogram)
    });
  }

  function diastolicPressure(edvVal: number) {
    return 10 + (edvVal - 120) * 0.1;
  }

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" type="number" stroke="#94a3b8" />
            
            {/* Pressures Axis */}
            <YAxis 
              yAxisId="left" 
              domain={[0, 200]} 
              stroke="#94a3b8" 
              label={{ value: 'Pressure (mmHg)', angle: -90, position: 'left', fill: '#94a3b8' }} 
            />
            
            {/* Volume Axis */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 200]} 
              stroke="#60a5fa" 
              label={{ value: 'Volume (mL)', angle: 90, position: 'right', fill: '#60a5fa' }} 
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
              labelFormatter={(label) => `Time: ${label} ms`}
            />
            
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            <Line yAxisId="left" type="monotone" dataKey="AP" name="Aortic Pressure" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="left" type="monotone" dataKey="LVP" name="LV Pressure" stroke="#3b82f6" strokeWidth={3.5} dot={false} isAnimationActive={false} />
            <Line yAxisId="left" type="monotone" dataKey="LAP" name="LA Pressure" stroke="#10b981" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="LVV" name="LV Volume" stroke="#60a5fa" strokeWidth={2} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Auxiliary ECG and Phono trace */}
      <div className="h-[90px] border-t border-slate-800 pt-2 flex flex-col gap-1">
        <div className="h-[40px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 0, right: 30, left: 52, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[-25, 80]} hide />
              <Line type="monotone" dataKey="ECG" name="ECG (Lead II)" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Legend verticalAlign="top" height={15} wrapperStyle={{ fontSize: '10px' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[40px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 0, right: 30, left: 52, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[-50, 50]} hide />
              <Line type="monotone" dataKey="PCG" name="Phonocardiogram (Heart Sounds)" stroke="#e2e8f0" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Legend verticalAlign="top" height={15} wrapperStyle={{ fontSize: '10px' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
