"use client";

import React from "react";
import Link from "next/link";

interface FlashcardsDueWidgetProps {
  dueCount: number;
}

export default function FlashcardsDueWidget({ dueCount }: FlashcardsDueWidgetProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between h-[130px]">
      <div>
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <span>🧠</span> Spaced Repetition (SRS)
        </h3>
        <p className="text-[10px] text-slate-500 font-medium">Flashcards ready for review</p>
      </div>

      <div className="flex items-center justify-between gap-4 mt-2">
        <div>
          <span className="text-2xl font-black text-white block">
            {dueCount} <span className="text-xs font-semibold text-slate-400">cards due</span>
          </span>
        </div>
        {dueCount > 0 ? (
          <Link
            href="/lessons/homeostasis#step-18"
            className="text-[10px] px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded font-bold text-white transition shadow-md shadow-blue-900/25"
          >
            Review Now →
          </Link>
        ) : (
          <span className="text-[10px] px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded font-bold text-emerald-400 uppercase tracking-wide">
            Clear!
          </span>
        )}
      </div>
    </div>
  );
}
