'use client';

import React, { useState } from 'react';
import { usePublicHealthCurriculum } from '../../../../hooks/usePublicHealthCurriculum';
import { MHASubject } from '../../../../lib/curriculum/mhaCurriculumScaffold';

export default function MHAPage() {
  const { curriculum, isLoading, isError } = usePublicHealthCurriculum('mha');
  const [activeYear, setActiveYear] = useState<1 | 2>(1);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading MHA curriculum</div>;

  const mhaCurriculum = curriculum as MHASubject[];
  const subjectsForYear = mhaCurriculum?.filter(subject => subject.year === activeYear) || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Master of Hospital Administration (MHA)</h1>

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
                  {lesson.title} - <span className="text-gray-500 text-sm">{lesson.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
