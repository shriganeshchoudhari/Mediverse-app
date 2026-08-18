"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ActivityData {
  day: string;
  minutes: number;
}

interface WeeklyActivityChartProps {
  data: ActivityData[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { day: "Mon", minutes: 0 },
    { day: "Tue", minutes: 0 },
    { day: "Wed", minutes: 0 },
    { day: "Thu", minutes: 0 },
    { day: "Fri", minutes: 0 },
    { day: "Sat", minutes: 0 },
    { day: "Sun", minutes: 0 },
  ];

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 h-[280px] flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <span>📊</span> Study Time This Week
        </h3>
        <p className="text-[10px] text-slate-500 font-medium">Minutes spent reviewing curriculum content</p>
      </div>

      <div className="flex-1 h-0 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
              itemStyle={{ color: "#38bdf8", fontSize: "12px" }}
              cursor={{ fill: "rgba(56, 189, 248, 0.05)" }}
            />
            <Bar dataKey="minutes" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
