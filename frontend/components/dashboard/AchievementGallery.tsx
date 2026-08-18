"use client";

import React from "react";

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconEmoji: string;
  xpReward: number;
  earned: boolean;
  earnedAt?: string;
}

interface AchievementGalleryProps {
  achievements: Achievement[];
}

export default function AchievementGallery({ achievements }: AchievementGalleryProps) {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 text-center text-slate-500 text-xs">
        No achievements available.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <span>🏆</span> Achievements & Badges
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id || ach.code}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
              ach.earned
                ? "bg-slate-950/60 border-blue-500/20 text-slate-200"
                : "bg-slate-950/10 border-slate-900 text-slate-600 opacity-50"
            }`}
          >
            <span className={`text-2xl mb-1 ${ach.earned ? "animate-pulse" : ""}`}>
              {ach.iconEmoji || "🎖️"}
            </span>
            <span className="text-[11px] font-bold block truncate max-w-full">{ach.title}</span>
            <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">
              {ach.description}
            </span>
            {ach.earned && ach.xpReward > 0 && (
              <span className="text-[8px] mt-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 rounded font-bold">
                +{ach.xpReward} XP
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
