'use client';

import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Users, ArrowRight } from 'lucide-react';

interface ParsedStudent {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  domain: string;
  yearOfStudy: number;
}

export default function RosterImportModal({
  isOpen,
  onClose,
  tenantName = 'AIIMS New Delhi',
}: {
  isOpen: boolean;
  onClose: () => void;
  tenantName?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Sample mock parsing of university CSV roster
      setParsedStudents([
        { firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.s@aiims.edu', studentId: '2024-MBBS-001', domain: 'ALLOPATHIC_MBBS', yearOfStudy: 2 },
        { firstName: 'Diya', lastName: 'Patel', email: 'diya.p@aiims.edu', studentId: '2024-MBBS-002', domain: 'ALLOPATHIC_MBBS', yearOfStudy: 2 },
        { firstName: 'Rohan', lastName: 'Gupta', email: 'rohan.g@aiims.edu', studentId: '2024-BDS-015', domain: 'DENTAL_BDS', yearOfStudy: 3 },
        { firstName: 'Ananya', lastName: 'Nair', email: 'ananya.n@aiims.edu', studentId: '2024-NURS-042', domain: 'NURSING_BSC', yearOfStudy: 1 },
      ]);
    }
  };

  const handleConfirmImport = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setImportSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Batch Import Student Roster</h3>
              <p className="text-xs text-slate-400">Assign curriculum & licenses for <strong className="text-indigo-400">{tenantName}</strong></p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {!importSuccess ? (
            <>
              {/* File Dropzone */}
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <Upload size={36} className="text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors" />
                <div className="text-sm font-medium text-slate-200">
                  {file ? file.name : 'Click or drag university student CSV/XLSX file here'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Expected columns: firstName, lastName, email, studentId, domain, yearOfStudy</div>
                <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Preview Table */}
              {parsedStudents.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Parsed {parsedStudents.length} student records</span>
                    <span className="text-emerald-400">Ready for cohort assignment</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 sticky top-0 border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Student ID</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Email</th>
                          <th className="p-2.5">Domain</th>
                          <th className="p-2.5">Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {parsedStudents.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            <td className="p-2.5 font-mono text-indigo-300">{s.studentId}</td>
                            <td className="p-2.5 font-bold">{s.firstName} {s.lastName}</td>
                            <td className="p-2.5">{s.email}</td>
                            <td className="p-2.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">{s.domain}</span></td>
                            <td className="p-2.5 text-center">Yr {s.yearOfStudy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 size={48} className="text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-bold text-white">Roster Successfully Imported!</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {parsedStudents.length} students have been registered, assigned to <strong>{tenantName}</strong> workspaces, and issued domain-scoped login credentials.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200">
            {importSuccess ? 'Done' : 'Cancel'}
          </button>
          {!importSuccess && (
            <button
              onClick={handleConfirmImport}
              disabled={parsedStudents.length === 0 || isProcessing}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              {isProcessing ? 'Enrolling Students...' : 'Confirm & Enroll Cohort'} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
