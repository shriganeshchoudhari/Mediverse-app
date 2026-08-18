"use client";

import React from "react";

export interface LeaderboardEntry {
  userId: string;
  name: string;
  currentXp: number;
  dailyStreak: number;
  rank: number;
}

interface LeaderboardPreviewProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardPreview({ entries, currentUserId }: LeaderboardPreviewProps) {
  const topEntries = entries ? entries.slice(0, 5) : [];

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between h-[280px]">
      <div>
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <span>🏆</span> Global Leaderboard
        </h3>
        <p className="text-[10px] text-slate-500 font-medium">Rankings of MBBS students by XP</p>
      </div>

      <div className="flex-1 mt-4 space-y-2 overflow-y-auto pr-1">
        {topEntries.map((entry) => {
          const isCurrentUser = entry.userId === currentUserId;
          return (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                isCurrentUser ? "bg-blue-500/10 border border-blue-500/20" : "bg-slate-950/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    entry.rank === 1
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : entry.rank === 2
                      ? "bg-slate-300/20 text-slate-300 border border-slate-300/30"
                      : entry.rank === 3
                      ? "bg-amber-600/20 text-amber-500 border border-amber-600/30"
                      : "bg-slate-900 text-slate-400"
                  }`}
                >
                  {entry.rank}
                </span>
                <span className={`font-semibold ${isCurrentUser ? "text-blue-400" : "text-slate-300"}`}>
                  {entry.name}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-white block">{entry.currentXp} XP</span>
                {entry.dailyStreak > 0 && (
                  <span className="text-[8px] text-orange-400 font-bold">🔥 {entry.dailyStreak}d streak</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
