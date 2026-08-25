'use client';

import React, { useState } from 'react';
import { Building, Users, BookOpen, Settings, BarChart2 } from 'lucide-react';

export default function InstitutionalDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'curriculum'>('overview');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Building className="text-indigo-500" />
            <h1 className="font-bold text-white text-lg leading-tight">Global Medical University</h1>
          </div>
          <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">Enterprise Tenant</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <BarChart2 size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Users size={18} /> Enrolled Students
          </button>
          <button 
            onClick={() => setActiveTab('curriculum')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'curriculum' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <BookOpen size={18} /> Custom Curriculum
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-2xl font-bold text-white mb-2">Institutional Admin Dashboard</h2>
          <p className="text-slate-400 text-sm">Manage your isolated tenant workspace, user roster, and curriculum assignments.</p>
        </div>
        
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-slate-400 text-sm mb-2">Active Students</div>
                <div className="text-3xl font-bold text-white">1,248</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-slate-400 text-sm mb-2">Faculty Members</div>
                <div className="text-3xl font-bold text-white">86</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-slate-400 text-sm mb-2">Assigned Curricula</div>
                <div className="text-3xl font-bold text-white">4</div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email Domain</th>
                    <th className="p-4 font-medium">Year</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-4">Alice Johnson</td>
                    <td className="p-4">@gmu.edu</td>
                    <td className="p-4">MS2</td>
                    <td className="p-4"><span className="text-green-400 font-medium">Active</span></td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-4">Bob Smith</td>
                    <td className="p-4">@gmu.edu</td>
                    <td className="p-4">MS1</td>
                    <td className="p-4"><span className="text-green-400 font-medium">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
              Custom Institutional Curriculum Builder (Coming Soon)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
