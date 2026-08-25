'use client';

import React, { useEffect, useState } from 'react';
import PatientChart from '@/components/emr/PatientChart';

export default function EmrSandboxPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/emr/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        if (data.length > 0) setSelectedPatientId(data[0].id);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar: Patient List */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white font-mono tracking-tight">Mock EMR</h2>
          <p className="text-xs text-slate-400">Student Sandbox Environment</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {patients.map(p => (
            <button 
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${selectedPatientId === p.id ? 'bg-blue-900/40 border-blue-500' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}`}
            >
              <div className="font-bold text-slate-100">{p.lastName}, {p.firstName}</div>
              <div className="text-xs text-slate-400 mt-1">MRN: {p.mrn} | {p.gender} | DOB: {p.dateOfBirth}</div>
            </button>
          ))}
          {patients.length === 0 && <div className="text-slate-500 text-sm p-4 text-center">Loading patients...</div>}
        </div>
      </div>

      {/* Main Area: Patient Chart */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {selectedPatientId ? (
          <PatientChart patientId={selectedPatientId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a patient from the roster to view their chart.
          </div>
        )}
      </div>
    </div>
  );
}
