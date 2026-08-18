"use client";

import React from "react";
import Link from "next/link";
import { CatalogSubject } from "../../lib/api/curriculum";

interface ProgressItem {
  lessonId: string;
  completionPercentage: number;
  completed: boolean;
}

interface ContinueLearningWidgetProps {
  progressList: ProgressItem[];
  subjects: CatalogSubject[];
}

export default function ContinueLearningWidget({ progressList, subjects }: ContinueLearningWidgetProps) {
  // Find the first chapter that is in progress but not completed
  const inProgressChapterId = progressList.find(p => p.completionPercentage > 0 && !p.completed)?.lessonId;
  
  // Or find the first unstarted chapter
  const completedChapterIds = progressList.filter(p => p.completed).map(p => p.lessonId);
  const allChapters = subjects.flatMap(s => s.chapters);
  const nextChapterId = allChapters.find(c => !completedChapterIds.includes(c.id))?.id;

  const targetChapterId = inProgressChapterId || nextChapterId || allChapters[0]?.id;
  const targetChapter = allChapters.find(c => c.id === targetChapterId);

  if (!targetChapter) return null;

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
      
      <div>
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <span>🚀</span> Continue Learning
        </h3>
        <p className="text-slate-400 text-xs mb-4">Pick up where you left off or start your next topic.</p>
        
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg mb-6">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 block">Up Next</span>
          <h4 className="text-slate-100 font-semibold text-lg">{targetChapter.title}</h4>
          <p className="text-slate-500 text-xs mt-1">{targetChapter.estimatedMinutes}m estimated time</p>
        </div>
      </div>

      <Link 
        href={`/lessons/${targetChapter.id}`}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold text-center transition shadow-md shadow-blue-900/30 flex items-center justify-center gap-2"
      >
        Start Studying <span>→</span>
      </Link>
    </div>
  );
}
