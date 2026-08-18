"use client";

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

export interface QuizScoreData {
  quizName: string;
  score: number;
}

interface QuizScoreChartProps {
  data: QuizScoreData[];
}

export default function QuizScoreChart({ data }: QuizScoreChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { quizName: "Cell Membrane", score: 80 },
    { quizName: "Action Potential", score: 90 },
    { quizName: "Homeostasis", score: 75 },
    { quizName: "Cardiovascular", score: 85 },
  ];

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 h-[280px] flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <span>📈</span> Quiz Performance
        </h3>
        <p className="text-[10px] text-slate-500 font-medium">Recent quiz scores (%)</p>
      </div>

      <div className="flex-1 h-0 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="quizName"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.substring(0, 10) + "..."}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
              itemStyle={{ color: "#10b981", fontSize: "12px" }}
              cursor={{ stroke: "rgba(16, 185, 129, 0.2)", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0f172a", stroke: "#10b981", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#0f172a", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
