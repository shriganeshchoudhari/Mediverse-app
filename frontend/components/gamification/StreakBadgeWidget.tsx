'use client';

import React from 'react';
import { Flame, Trophy, Award, Zap, Star, ShieldCheck, Clock } from 'lucide-react';

export interface StudentAchievement {
  code: string;
  name: string;
  category: 'DIAGNOSTIC_ACCURACY' | 'SPEED' | 'STREAK' | 'OSCE_MASTERY';
  description: string;
  icon: string;
  unlockedAt?: string;
  progressPercent: number;
}

export default function StreakBadgeWidget({
  currentStreakDays = 14,
  bestStreakDays = 21,
  diagnosticAccuracy = 94,
  achievements = [
    { code: 'ACH_DIFF_MASTER', name: 'Differential Master', category: 'DIAGNOSTIC_ACCURACY', description: 'Diagnosed 50 consecutive clinical cases with >90% accuracy', icon: 'Trophy', unlockedAt: '2026-08-20', progressPercent: 100 },
    { code: 'ACH_OSCE_SPEED', name: 'Speed Clinician', category: 'SPEED', description: 'Completed 10 OSCE stations under 6 minutes each', icon: 'Zap', unlockedAt: '2026-08-25', progressPercent: 100 },
    { code: 'ACH_7_DAY_STREAK', name: 'Consistency Champion', category: 'STREAK', description: 'Maintained a 14-day continuous clinical study streak', icon: 'Flame', unlockedAt: '2026-08-29', progressPercent: 100 },
    { code: 'ACH_SOAP_PERFECTION', name: 'Attending Grade Charting', category: 'OSCE_MASTERY', description: 'Earned 10 HONORS grades on Mock EMR SOAP note evaluations', icon: 'ShieldCheck', progressPercent: 70 },
  ],
}: {
  currentStreakDays?: number;
  bestStreakDays?: number;
  diagnosticAccuracy?: number;
  achievements?: StudentAchievement[];
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Streak & Accuracy Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak Counter */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame size={28} className="animate-bounce" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">Clinical Streak</div>
            <div className="text-2xl font-black text-white">{currentStreakDays} Days</div>
            <div className="text-[10px] text-slate-400">Best: {bestStreakDays} days</div>
          </div>
        </div>

        {/* Diagnostic Accuracy */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Star size={28} />
          </div>
          <div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Diagnostic Acc.</div>
            <div className="text-2xl font-black text-white">{diagnosticAccuracy}%</div>
            <div className="text-[10px] text-slate-400">Top 5% Cohort Percentile</div>
          </div>
        </div>

        {/* Daily Challenge Timer */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Clock size={28} />
          </div>
          <div>
            <div className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Daily Case Challenge</div>
            <div className="text-sm font-bold text-white">Acute Chest Pain</div>
            <div className="text-[10px] text-emerald-400">Resets in 6h 32m (+50 XP)</div>
          </div>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Trophy size={14} className="text-amber-400" /> Clinical Achievement Badges
          </h4>
          <span className="text-xs text-indigo-400 font-mono">
            {achievements.filter(a => a.progressPercent === 100).length}/{achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach, idx) => {
            const isUnlocked = ach.progressPercent === 100;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isUnlocked ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  {ach.icon === 'Trophy' ? <Trophy size={18} /> : ach.icon === 'Zap' ? <Zap size={18} /> : ach.icon === 'Flame' ? <Flame size={18} /> : <ShieldCheck size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-white truncate">{ach.name}</span>
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 font-mono">UNLOCKED</span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">{ach.progressPercent}%</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
