'use client';
import React, { useState } from 'react';
import { BHMS_CURRICULUM } from '@/lib/curriculum/bhmsCurriculumScaffold';

export default function BHMSPage() {
  const [activeYear, setActiveYear] = useState<number>(1);

  const currentYearData = BHMS_CURRICULUM.find(y => y.year === activeYear);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 pb-20">
      <h1 className="text-3xl font-bold mb-6">BHMS Curriculum</h1>
      
      <div className="flex border-b mb-6">
        {BHMS_CURRICULUM.map((year) => (
          <button
            key={year.year}
            onClick={() => setActiveYear(year.year)}
            className={`py-2 px-6 font-medium text-sm transition-colors ${
              activeYear === year.year
                ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Year {year.year}
          </button>
        ))}
      </div>

      {currentYearData && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">{currentYearData.title}</h2>
          <p className="text-slate-400 mb-6">{currentYearData.description}</p>

          <div className="space-y-6">
            {currentYearData.subjects.map((subject) => (
              <div key={subject.id} className="border rounded-lg p-6 bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                <p className="text-sm text-slate-400 mb-4">Code: {subject.code} | Credits: {subject.creditHours}</p>
                <p className="mb-4">{subject.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subject.lessons.map((lesson) => (
                    <div key={lesson.id} className="border rounded p-4 bg-slate-950/60 text-slate-300 border-slate-800">
                      <h4 className="font-medium mb-1">{lesson.title}</h4>
                      <p className="text-xs text-slate-400 mb-2">CCH Code: {lesson.cchCode}</p>
                      <p className="text-sm text-slate-300 mb-3">{lesson.description}</p>
                      <div className="flex flex-wrap gap-1 text-xs">
                        {lesson.has3DContent && <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">3D</span>}
                        {lesson.hasSimulation && <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">Sim</span>}
                        {lesson.isClinical && <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded">Clinical</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
