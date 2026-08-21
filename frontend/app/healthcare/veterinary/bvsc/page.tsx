'use client';

import React, { useState } from 'react';
import { VCICompetencyMap } from '../../../../components/veterinary/VCICompetencyMap';
import { useVeterinaryCurriculum } from '../../../../hooks/useVeterinaryCurriculum';

export default function BVSCPage() {
  const { curriculum, isLoading } = useVeterinaryCurriculum();
  const [activeYear, setActiveYear] = useState<number>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState(false);

  if (isLoading) {
    return <div className="p-8">Loading curriculum...</div>;
  }

  const activeYearData = curriculum.find((y: any) => y.year === activeYear);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bachelor of Veterinary Science & Animal Husbandry (BVSc & AH)</h1>
        <p className="text-gray-600 mt-2">Comprehensive 5.5-year VCI-compliant curriculum.</p>
      </header>

      {/* Simulators Quick Launcher */}
      <section className="bg-green-50 p-6 rounded-xl border border-green-200">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Clinical Simulators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Comparative Anatomy 3D', 'Rumen Fermentation Sim', 'Zoonotic Outbreak Tracker', 'Surgical Maneuvers VR'].map((sim) => (
            <div key={sim} className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex flex-col justify-between">
              <span className="font-medium text-gray-800">{sim}</span>
              <button className="mt-4 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition">
                Launch
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Competency Map Toggle */}
      <section>
        <button 
          onClick={() => setShowCompetencyMap(!showCompetencyMap)}
          className="flex items-center text-indigo-600 font-medium hover:text-indigo-800"
        >
          {showCompetencyMap ? 'Hide VCI Competency Map' : 'Show VCI Competency Map'}
          <svg className={`ml-2 w-5 h-5 transition-transform ${showCompetencyMap ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {showCompetencyMap && (
          <div className="mt-4">
            <VCICompetencyMap />
          </div>
        )}
      </section>

      {/* Curriculum Viewer */}
      <section>
        <div className="flex border-b mb-6 overflow-x-auto">
          {curriculum.map((y: any) => (
            <button
              key={y.year}
              onClick={() => setActiveYear(y.year)}
              className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap ${activeYear === y.year ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Year {y.year}
            </button>
          ))}
        </div>

        {activeYearData && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">{activeYearData.title}</h3>
            <div className="grid grid-cols-1 gap-6">
              {activeYearData.subjects.map((subject: any) => (
                <div key={subject.id} className="bg-white border rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{subject.name}</h4>
                      <p className="text-sm text-gray-500">{subject.code} • {subject.creditHours} Credits</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{subject.description}</p>
                  
                  <div className="bg-gray-50 rounded p-4">
                    <h5 className="font-semibold text-gray-700 mb-2">Key Lessons</h5>
                    <ul className="space-y-2">
                      {subject.lessons.map((lesson: any) => (
                        <li key={lesson.id} className="flex items-start justify-between bg-white p-3 rounded border text-sm">
                          <div>
                            <span className="font-medium block">{lesson.vciCode}: {lesson.title}</span>
                            <span className="text-gray-500">{lesson.description}</span>
                          </div>
                          <div className="flex gap-2">
                            {lesson.hasSimulation && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">Sim</span>}
                            {lesson.isHighTech && <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">Hi-Tech</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
