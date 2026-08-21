import React from 'react';
import { notFound } from 'next/navigation';
import { getMDAyurvedaSpecialtyById } from '@/lib/curriculum/mdAyurvedaCurriculumScaffold';

export default function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const specialtyData = getMDAyurvedaSpecialtyById(params.specialty);

  if (!specialtyData) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{specialtyData.name}</h1>
      <p className="text-lg text-gray-600 mb-8">{specialtyData.description}</p>
      
      <div className="space-y-8">
        {specialtyData.subjects.map((subject) => (
          <div key={subject.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">{subject.name} (Year {subject.year})</h2>
            <p className="text-sm text-gray-500 mb-4">Code: {subject.code} | Credits: {subject.creditHours}</p>
            <p className="mb-4">{subject.description}</p>
            
            <h3 className="text-xl font-medium mb-3">Lessons</h3>
            <ul className="space-y-3">
              {subject.lessons.map((lesson) => (
                <li key={lesson.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{lesson.title}</h4>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      {lesson.has3DContent && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">3D</span>}
                      {lesson.hasSimulation && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Sim</span>}
                      {lesson.isResearchBased && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Research</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
