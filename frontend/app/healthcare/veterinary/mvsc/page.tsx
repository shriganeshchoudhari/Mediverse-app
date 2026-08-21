'use client';

import React from 'react';
import { MVSC_CURRICULUM } from '../../../../lib/curriculum/mvscCurriculumScaffold';

export default function MVSCPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Master of Veterinary Science (MVSc)</h1>
        <p className="text-gray-600 mt-2">2-Year Postgraduate Specialties Portal</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MVSC_CURRICULUM.map((specialty) => (
          <div key={specialty.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">{specialty.name}</h2>
            <p className="text-gray-700 mb-4">{specialty.description}</p>
            <div className="text-sm text-gray-500 mb-4">Duration: {specialty.duration}</div>
            
            <h3 className="font-semibold text-gray-900 mb-2">Core Courses:</h3>
            <ul className="space-y-2">
              {specialty.courses.map(course => (
                <li key={course.id} className="flex justify-between items-center text-sm border-b pb-1 last:border-0">
                  <span className="text-gray-800">{course.title}</span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{course.creditHours} cr</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
