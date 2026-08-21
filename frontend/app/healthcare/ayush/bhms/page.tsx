'use client';
import React, { useState } from 'react';
import { BHMS_CURRICULUM } from '@/lib/curriculum/bhmsCurriculumScaffold';

export default function BHMSPage() {
  const [activeYear, setActiveYear] = useState<number>(1);

  const currentYearData = BHMS_CURRICULUM.find(y => y.year === activeYear);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">BHMS Curriculum</h1>
      
      <div className="flex border-b mb-6">
        {BHMS_CURRICULUM.map((year) => (
          <button
            key={year.year}
            onClick={() => setActiveYear(year.year)}
            className={`py-2 px-6 font-medium text-sm transition-colors ${
              activeYear === year.year
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Year {year.year}
          </button>
        ))}
      </div>

      {currentYearData && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">{currentYearData.title}</h2>
          <p className="text-gray-600 mb-6">{currentYearData.description}</p>

          <div className="space-y-6">
            {currentYearData.subjects.map((subject) => (
              <div key={subject.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Code: {subject.code} | Credits: {subject.creditHours}</p>
                <p className="mb-4">{subject.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subject.lessons.map((lesson) => (
                    <div key={lesson.id} className="border rounded p-4 bg-gray-50">
                      <h4 className="font-medium mb-1">{lesson.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">CCH Code: {lesson.cchCode}</p>
                      <p className="text-sm text-gray-700 mb-3">{lesson.description}</p>
                      <div className="flex flex-wrap gap-1 text-xs">
                        {lesson.has3DContent && <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">3D</span>}
                        {lesson.hasSimulation && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Sim</span>}
                        {lesson.isClinical && <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">Clinical</span>}
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
