import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend
} from "recharts";

interface SpirometryGraphsProps {
  volumeTimeData: any[];
  flowVolumeData: any[];
  normalVolumeTimeData: any[];
  normalFlowVolumeData: any[];
  fev1: number;
  fvc: number;
}

export default function SpirometryGraphs({
  volumeTimeData,
  flowVolumeData,
  normalVolumeTimeData,
  normalFlowVolumeData,
  fev1,
  fvc
}: SpirometryGraphsProps) {
  
  // Combine datasets for volumeTime
  const combinedVolumeTime = volumeTimeData.map((d, idx) => ({
    time: d.time,
    patientVolume: d.volume,
    normalVolume: normalVolumeTimeData[idx]?.volume || null
  }));

  // Combine datasets for flowVolume
  const combinedFlowVolume = flowVolumeData.map((d, idx) => ({
    volume: d.volume,
    patientFlow: d.flow,
    normalFlow: normalFlowVolumeData[idx]?.flow || null
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Volume-Time Curve */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[380px]">
        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
          <span>📈</span> Volume vs. Time (Forced Expirogram)
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedVolumeTime}
              margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={11}
                label={{
                  value: "Time (seconds)",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#64748b",
                }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={[0, 6.5]}
                label={{
                  value: "Volume (Liters)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "#64748b",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#1e293b",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              {/* Normal Reference */}
              <Line
                type="monotone"
                dataKey="normalVolume"
                name="Normal Ref (FVC=5.5L)"
                stroke="#475569"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              
              {/* Patient */}
              <Line
                type="monotone"
                dataKey="patientVolume"
                name="Patient Volume"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />

              {/* FEV1 marker at t = 1.0 */}
              <ReferenceDot
                x={1.0}
                y={fev1}
                r={6}
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center text-[10px] text-slate-500 mt-2">
          Orange dot indicates FEV₁ (Forced Expiratory Volume in 1 second) = <span className="text-amber-400 font-bold">{fev1.toFixed(2)} L</span>
        </div>
      </div>

      {/* Flow-Volume Loop */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[380px]">
        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
          <span>🔄</span> Flow-Volume Loop
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedFlowVolume}
              margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="volume"
                stroke="#64748b"
                fontSize={11}
                domain={[0, 6.5]}
                type="number"
                label={{
                  value: "Volume (Liters)",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#64748b",
                }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={[-6, 12]}
                type="number"
                label={{
                  value: "Flow Rate (L/s)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "#64748b",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#1e293b",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              {/* Normal Reference Loop */}
              <Line
                type="monotone"
                dataKey="normalFlow"
                name="Normal Ref Loop"
                stroke="#475569"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              
              {/* Patient Loop */}
              <Line
                type="monotone"
                dataKey="patientFlow"
                name="Patient Loop"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
