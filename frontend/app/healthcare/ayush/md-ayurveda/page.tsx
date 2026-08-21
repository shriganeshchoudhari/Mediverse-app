import React from 'react';
import Link from 'next/link';
import { MD_AYURVEDA_CURRICULUM } from '@/lib/curriculum/mdAyurvedaCurriculumScaffold';

export default function MDAyurvedaPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">MD/MS Ayurveda Specialties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MD_AYURVEDA_CURRICULUM.map((specialty) => (
          <Link href={`/healthcare/ayush/md-ayurveda/${specialty.id}`} key={specialty.id}>
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white">
              <h2 className="text-xl font-semibold mb-2">{specialty.name}</h2>
              <div className="text-sm text-gray-600 mb-4">
                <p>AIAPGET Code: <span className="font-mono">{specialty.aiapgetMdsCode}</span></p>
                <p>Subjects: {specialty.subjects.length}</p>
                <p>Duration: {specialty.duration}</p>
              </div>
              <p className="text-sm text-gray-700">{specialty.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
