import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Cell,
} from "recharts";

interface RenalGraphsProps {
  autoregData: any[];
  starlingData: any[];
  currentBp: number;
  currentGfr: number;
}

export default function RenalGraphs({
  autoregData,
  starlingData,
  currentBp,
  currentGfr,
}: RenalGraphsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Autoregulation Curve */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
          <span>🛡️</span> GFR Autoregulation Curve (50 - 200 mmHg)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={autoregData}
              margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="bp"
                stroke="#64748b"
                fontSize={11}
                type="number"
                domain={[50, 200]}
                label={{
                  value: "Systemic Blood Pressure (mmHg)",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#64748b",
                }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={[0, 180]}
                label={{
                  value: "GFR (mL/min)",
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
              <Line
                type="monotone"
                dataKey="gfr"
                name="GFR Curve"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={false}
              />
              {/* Highlight the current operating point on the curve */}
              <ReferenceDot
                x={currentBp}
                y={currentGfr}
                r={6}
                fill="#f43f5e"
                stroke="#fff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Starling Forces Balance */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
          <span>⚖️</span> Glomerular Starling Pressure Balance
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={starlingData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={[0, 80]}
                label={{
                  value: "Pressure (mmHg)",
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
              <Bar dataKey="value" name="Pressure (mmHg)" radius={[4, 4, 0, 0]}>
                {starlingData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.name.includes("Capillary") 
                        ? "#3b82f6" 
                        : entry.name.includes("Bowman") 
                          ? "#f43f5e" 
                          : entry.name.includes("Colloid") 
                            ? "#eab308" 
                            : "#10b981"
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
