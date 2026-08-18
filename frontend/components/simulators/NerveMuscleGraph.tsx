import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NerveMuscleGraphProps {
  data: any[];
}

export default function NerveMuscleGraph({ data }: NerveMuscleGraphProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
        <span>⚡</span> Scrolling Myogram (Contraction Force & Stimulus Spikes)
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(val) => `${val.toFixed(1)}s`}
              label={{
                value: "Elapsed Time (s)",
                position: "insideBottom",
                offset: -5,
                fill: "#64748b",
              }}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              domain={[0, 100]}
              label={{
                value: "Active Force (grams)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#64748b",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#a855f7"
              fontSize={11}
              domain={[0, 12]}
              label={{
                value: "Stimulus (V)",
                angle: 90,
                position: "insideRight",
                offset: 10,
                fill: "#a855f7",
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
              yAxisId="left"
              type="monotone"
              dataKey="force"
              name="Muscle Force (g)"
              stroke="#ec4899"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="step"
              dataKey="stim"
              name="Stimulus Pulse (V)"
              stroke="#a855f7"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
