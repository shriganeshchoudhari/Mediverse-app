"use client";

import React from "react";
import { CatalogSubject } from "../../lib/api/curriculum";

interface ProgressItem {
  lessonId: string;
  completionPercentage: number;
  completed: boolean;
}

interface SectionProgressCardsProps {
  progressList: ProgressItem[];
  subjects: CatalogSubject[];
}

export default function SectionProgressCards({ progressList, subjects }: SectionProgressCardsProps) {
  // Aggregate progress by subject (replaces the old section-based aggregation)
  const subjectProgress = subjects.map((subject) => {
    let totalChapters = subject.chapters.length;
    let completedChapters = 0;
    
    subject.chapters.forEach((chapter) => {
      const match = progressList.find((p) => p.lessonId === chapter.id);
      if (match && match.completed) {
        completedChapters += 1;
      } else if (match && match.completionPercentage === 100) {
        completedChapters += 1;
      }
    });

    return {
      id: subject.id,
      title: subject.title,
      total: totalChapters,
      completed: completedChapters,
      percentage: totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100)
    };
  });

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <span>📚</span> Syllabus Mastery
      </h3>
      
      <div className="space-y-4">
        {subjectProgress.map((sec) => (
          <div key={sec.id}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium truncate pr-2">{sec.title}</span>
              <span className="text-slate-500">{sec.completed}/{sec.total}</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${sec.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
