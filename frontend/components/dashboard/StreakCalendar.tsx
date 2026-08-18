"use client";

import React from "react";

export interface ActivityDay {
  date: string;
  active: boolean;
}

interface StreakCalendarProps {
  activityDays: ActivityDay[];
}

export default function StreakCalendar({ activityDays }: StreakCalendarProps) {
  // Safe default generation: past 28 days layout
  const days = activityDays && activityDays.length > 0 ? activityDays : Array.from({ length: 28 }).map((_, i) => ({
    date: `Day-${i}`,
    active: false
  }));

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between h-[130px]">
      <div>
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <span>📅</span> Streak Calendar
        </h3>
        <p className="text-[10px] text-slate-500 font-medium">Your study consistency map</p>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mt-2">
        {days.slice(-28).map((day, idx) => (
          <div
            key={idx}
            title={day.date}
            className={`w-full aspect-square rounded-sm border transition-all ${
              day.active
                ? "bg-orange-500 border-orange-400 shadow-sm shadow-orange-500/25"
                : "bg-slate-950/60 border-slate-900"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
