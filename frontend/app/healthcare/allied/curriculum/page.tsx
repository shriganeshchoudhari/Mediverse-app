'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAlliedHealthCurriculum } from '../../../../hooks/useAlliedHealthCurriculum';
import { NCAHPCompetencyMap } from '../../../../components/allied/NCAHPCompetencyMap';

export default function AlliedCurriculumPage() {
  const { majors, isLoading } = useAlliedHealthCurriculum();
  const searchParams = useSearchParams();
  const majorCodeParam = searchParams.get('major');
  
  const [activeTab, setActiveTab] = useState(majorCodeParam || 'BSCPERF');
  const [showCompetencyMap, setShowCompetencyMap] = useState(false);

  if (isLoading) return <div>Loading curriculum...</div>;

  const activeMajor = majors.find(m => m.code === activeTab) || majors[0];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Allied Health Curriculum Viewer</h1>
      
      <div className="flex gap-4 mb-6">
        {majors.map(m => (
          <button 
            key={m.code}
            className={`px-4 py-2 rounded ${activeTab === m.code ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(m.code)}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <button 
          onClick={() => setShowCompetencyMap(!showCompetencyMap)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showCompetencyMap ? 'Hide Competency Map' : 'Show NCAHP Competency Map'}
        </button>
      </div>

      {showCompetencyMap && (
        <div className="mb-8">
          <NCAHPCompetencyMap />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">{activeMajor.name} ({activeMajor.code}) - 3 Year Program</h2>
        <p className="mb-4">{activeMajor.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeMajor.subjects.map(subject => (
            <div key={subject.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-bold">{subject.name} (Year {subject.year})</h3>
              <p className="text-gray-600 text-sm mb-2">{subject.description}</p>
              <ul className="list-disc pl-5">
                {subject.lessons.map(lesson => (
                  <li key={lesson.id} className="mb-1">
                    {lesson.title} 
                    {lesson.hasSimulation && <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-1 rounded">SIM</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-12 bg-gray-50 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Quick Launcher: Simulators</h2>
        <div className="flex gap-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded shadow">Launch ECMO/CPB Sim</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded shadow">Launch CT/MRI 3D Explorer</button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded shadow">Launch OT Workflow Sim</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Launch Dialysis Setup Sim</button>
        </div>
      </div>
    </div>
  );
}
