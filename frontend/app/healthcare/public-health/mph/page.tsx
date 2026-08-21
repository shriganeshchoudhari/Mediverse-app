'use client';

import React, { useState } from 'react';
import { usePublicHealthCurriculum } from '../../../../hooks/usePublicHealthCurriculum';
import { PublicHealthCompetencyMap } from '../../../../components/public-health/PublicHealthCompetencyMap';
import { MPHSubject } from '../../../../lib/curriculum/mphCurriculumScaffold';

export default function MPHPage() {
  const { curriculum, isLoading, isError } = usePublicHealthCurriculum('mph');
  const [activeYear, setActiveYear] = useState<1 | 2>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading MPH curriculum</div>;

  const mphCurriculum = curriculum as MPHSubject[];
  const subjectsForYear = mphCurriculum?.filter(subject => subject.year === activeYear) || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Master of Public Health (MPH)</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Simulators Quick Launch</h2>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Outbreak Simulator</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Health Policy Simulator</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Epi Data Analyzer</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Disaster Response Sim</button>
        </div>
      </div>

      <div className="mb-8">
        <button 
          onClick={() => setShowCompetencyMap(!showCompetencyMap)}
          className="bg-gray-200 px-4 py-2 rounded mb-4"
        >
          {showCompetencyMap ? 'Hide' : 'Show'} Public Health Competency Map
        </button>
        {showCompetencyMap && <PublicHealthCompetencyMap />}
      </div>

      <div className="mb-4 border-b">
        <button 
          className={`px-4 py-2 ${activeYear === 1 ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          onClick={() => setActiveYear(1)}
        >
          Year 1
        </button>
        <button 
          className={`px-4 py-2 ${activeYear === 2 ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          onClick={() => setActiveYear(2)}
        >
          Year 2
        </button>
      </div>

      <div className="grid gap-6">
        {subjectsForYear.map(subject => (
          <div key={subject.id} className="border p-4 rounded shadow-sm">
            <h3 className="text-xl font-semibold">{subject.name} ({subject.code})</h3>
            <p className="text-gray-600 mb-2">{subject.description}</p>
            <p className="text-sm font-medium mb-2">Credits: {subject.creditHours}</p>
            <ul className="list-disc pl-5">
              {subject.lessons.map(lesson => (
                <li key={lesson.id} className="mb-1">
                  {lesson.title} {lesson.hasSimulation && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">Simulation</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
