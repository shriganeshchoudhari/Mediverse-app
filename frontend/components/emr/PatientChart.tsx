'use client';
import React, { useEffect, useState } from 'react';
import SoapNoteWriter from './SoapNoteWriter';
import TelemetryVitalsFlowsheet from './TelemetryVitalsFlowsheet';
import CpoeOrderSystem from './CpoeOrderSystem';
import { Activity, FlaskConical, FileText, User, ShoppingCart } from 'lucide-react';

export default function PatientChart({ patientId }: { patientId: string }) {
  const [chartData, setChartData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cpoe' | 'labs' | 'notes' | 'write'>('overview');

  const fetchChart = () => {
    fetch(`/api/v1/emr/patients/${patientId}/chart`)
      .then(res => res.json())
      .then(setChartData)
      .catch(console.error);
  };

  useEffect(() => {
    fetchChart();
  }, [patientId]);

  if (!chartData) return <div className="p-8 text-slate-500">Loading chart data...</div>;

  const { patient, labs, notes } = chartData;

  return (
    <div className="flex flex-col h-full">
      {/* Chart Header (Demographics Banner) */}
      <div className="bg-slate-800 p-6 border-b border-slate-700 shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{patient.lastName}, {patient.firstName}</h1>
            <div className="flex gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-2"><User size={16}/> {patient.gender} | {patient.dateOfBirth}</span>
              <span className="font-mono text-indigo-300">MRN: {patient.mrn}</span>
              <span className="text-red-400 font-medium">Allergies: {patient.allergies}</span>
            </div>
          </div>
        </div>
      </div>

      {/* EMR Tabs Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 pt-3 flex gap-2">
        {['overview', 'cpoe', 'labs', 'notes', 'write'].map(tab => {
          let label = tab;
          if (tab === 'write') label = 'New SOAP Note';
          else if (tab === 'cpoe') label = 'Orders & eMAR';
          else if (tab === 'overview') label = 'Overview & Vitals';
          else if (tab === 'labs') label = 'Lab Results';
          else if (tab === 'notes') label = 'Clinical Notes';

          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 border-b-2 font-medium capitalize transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <TelemetryVitalsFlowsheet />
          </div>
        )}

        {activeTab === 'cpoe' && (
          <div className="space-y-6">
            <CpoeOrderSystem
              patientName={`${patient.lastName}, ${patient.firstName} (MRN: ${patient.mrn})`}
            />
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-4 font-medium">Panel</th>
                  <th className="p-4 font-medium">Test</th>
                  <th className="p-4 font-medium">Result</th>
                  <th className="p-4 font-medium">Ref Range</th>
                  <th className="p-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {labs.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="p-4 font-medium">{l.panelName}</td>
                    <td className="p-4">{l.testName}</td>
                    <td className="p-4 font-mono">
                      <span className={l.flag ? 'text-red-400 font-bold' : ''}>
                        {l.value} {l.unit} {l.flag && `(${l.flag})`}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{l.referenceRange}</td>
                    <td className="p-4 text-xs text-slate-500">{new Date(l.resultTime).toLocaleString()}</td>
                  </tr>
                ))}
                {labs.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-500">No lab results available.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            {notes.map((n: any) => (
              <div key={n.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                  <div className="font-bold text-slate-200">{n.noteType}</div>
                  <div className="text-xs text-slate-500">By: {n.authorId} on {new Date(n.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="space-y-4 text-sm">
                  <div><strong className="text-indigo-400 block mb-1">Subjective:</strong> <div className="text-slate-300 whitespace-pre-wrap">{n.subjective}</div></div>
                  <div><strong className="text-indigo-400 block mb-1">Objective:</strong> <div className="text-slate-300 whitespace-pre-wrap">{n.objective}</div></div>
                  <div><strong className="text-indigo-400 block mb-1">Assessment:</strong> <div className="text-slate-300 whitespace-pre-wrap">{n.assessment}</div></div>
                  <div><strong className="text-indigo-400 block mb-1">Plan:</strong> <div className="text-slate-300 whitespace-pre-wrap">{n.plan}</div></div>
                </div>
              </div>
            ))}
            {notes.length === 0 && <div className="text-slate-500 text-center p-8 border border-dashed border-slate-800 rounded-xl">No clinical notes found for this encounter.</div>}
          </div>
        )}

        {activeTab === 'write' && (
          <SoapNoteWriter patientId={patientId} onSave={() => { setActiveTab('notes'); fetchChart(); }} />
        )}
      </div>
    </div>
  );
}
