'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function SoapNoteWriter({ patientId, onSave }: { patientId: string, onSave: () => void }) {
  const [form, setForm] = useState({
    noteType: 'PROGRESS_NOTE',
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...form, authorId: 'Dr. Student' };
      const res = await fetch(`/api/v1/emr/patients/${patientId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) onSave();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-white">Write Clinical Note</h3>
        <select 
          value={form.noteType}
          onChange={e => setForm({...form, noteType: e.target.value})}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value="H&P">History & Physical</option>
          <option value="PROGRESS_NOTE">Progress Note</option>
          <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
        </select>
      </div>

      <div className="p-6 space-y-6">
        {['subjective', 'objective', 'assessment', 'plan'].map((field) => (
          <div key={field}>
            <label className="block text-indigo-400 font-bold capitalize mb-2">{field}</label>
            <textarea
              required
              rows={4}
              value={(form as any)[field]}
              onChange={e => setForm({...form, [field]: e.target.value})}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:border-indigo-500 outline-none resize-y"
              placeholder={`Enter ${field} details...`}
            />
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 p-4 border-t border-slate-800 flex justify-end">
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Signing...' : 'Sign & Submit Note'}
        </button>
      </div>
    </form>
  );
}
