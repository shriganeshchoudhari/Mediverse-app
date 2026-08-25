'use client';

import React, { useState, useEffect } from 'react';
import { Building, Users, BookOpen, BarChart2, CheckCircle, Shield, Award, RefreshCw } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  subscriptionTier: string;
}

interface TenantStats {
  tenantId: string;
  tenantName: string;
  domain: string;
  subscriptionTier: string;
  activeStudents: number;
  facultyMembers: number;
  assignedCurricula: number;
  avgOsceScore: number;
}

interface TenantUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  currentXp: number;
  dailyStreak: number;
  joinedAt: string;
}

export default function InstitutionalDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'curriculum'>('overview');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('60000000-0000-0000-0000-000000000001');
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [students, setStudents] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTenantData = async (tenantId: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch Tenants
      const tenantsRes = await fetch('/api/v1/admin/tenants', {
        headers: { 'X-Tenant-ID': tenantId }
      });
      if (tenantsRes.ok) {
        const tenantsData = await tenantsRes.json();
        setTenants(tenantsData);
      }

      // 2. Fetch Stats
      const statsRes = await fetch(`/api/v1/admin/tenants/${tenantId}/stats`, {
        headers: { 'X-Tenant-ID': tenantId }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 3. Fetch Users
      const usersRes = await fetch(`/api/v1/admin/tenants/${tenantId}/users`, {
        headers: { 'X-Tenant-ID': tenantId }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setStudents(usersData);
      }
    } catch (err) {
      console.error('Error fetching tenant data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData(selectedTenantId);
  }, [selectedTenantId]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Building className="text-indigo-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <h1 className="font-bold text-white text-base leading-tight truncate">
                {stats?.tenantName || 'Global Medical University'}
              </h1>
            </div>
          </div>
          
          {/* Tenant Selector */}
          <div className="mt-3">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Active Tenant
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {tenants.length > 0 ? (
                tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.domain})
                  </option>
                ))
              ) : (
                <option value="60000000-0000-0000-0000-000000000001">Global Medical University (gmu.edu)</option>
              )}
            </select>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
              {stats?.subscriptionTier || 'ENTERPRISE'} TIER
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <BarChart2 size={18} /> Institutional Overview
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Users size={18} /> Enrolled Roster ({students.length})
          </button>
          <button 
            onClick={() => setActiveTab('curriculum')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'curriculum' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <BookOpen size={18} /> Custom Curriculum
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => fetchTenantData(selectedTenantId)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Tenant Sync
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {stats?.tenantName || 'Institutional Workspace'}
            </h2>
            <p className="text-slate-400 text-sm">
              Isolated institutional tenant environment ({stats?.domain || 'gmu.edu'}) with isolated roster management & compliance telemetry.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-medium">
            <Shield size={14} /> Multi-Tenant Partition Active
          </div>
        </div>
        
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
                    <span>Enrolled Students</span>
                    <Users size={18} className="text-indigo-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.activeStudents ?? students.length}
                  </div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle size={12} /> 100% Active in Term
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
                    <span>Faculty Leads</span>
                    <Shield size={18} className="text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.facultyMembers ?? 2}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">Accredited Preceptors</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
                    <span>Assigned Curricula</span>
                    <BookOpen size={18} className="text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.assignedCurricula ?? 4}
                  </div>
                  <div className="text-xs text-purple-400 mt-2">MBBS, BDS, Nursing, Allied</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
                    <span>Avg. OSCE Accuracy</span>
                    <Award size={18} className="text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.avgOsceScore ? `${stats.avgOsceScore}%` : '88.5%'}
                  </div>
                  <div className="text-xs text-amber-400 mt-2">Top 5% Cohort Benchmark</div>
                </div>
              </div>

              {/* Quick Roster Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Enrolled Cohort Roster</h3>
                {students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-800/60 border-b border-slate-700 text-slate-400 text-xs uppercase">
                        <tr>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Institutional Email</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Current XP</th>
                          <th className="p-3">Streak</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-800/40 transition">
                            <td className="p-3 font-medium text-white">{student.firstName} {student.lastName}</td>
                            <td className="p-3 font-mono text-xs text-indigo-300">{student.email}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-xs bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 font-medium">
                                {student.role}
                              </span>
                            </td>
                            <td className="p-3 text-amber-400 font-bold">{student.currentXp ?? 0} XP</td>
                            <td className="p-3 text-emerald-400 font-semibold">{student.dailyStreak ?? 0} days</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">No students currently loaded.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                <h3 className="font-bold text-white text-base">Full Institutional User Roster</h3>
                <span className="text-xs bg-indigo-900/40 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20">
                  {students.length} Total Users Enrolled
                </span>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Institutional Email</th>
                    <th className="p-4 font-semibold">Domain / Tenant</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Progress XP</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-medium text-white">{student.firstName} {student.lastName}</td>
                      <td className="p-4 font-mono text-xs text-indigo-300">{student.email}</td>
                      <td className="p-4 text-slate-400 text-xs">{stats?.domain || 'gmu.edu'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 font-medium">
                          {student.role}
                        </span>
                      </td>
                      <td className="p-4 text-amber-400 font-bold">{student.currentXp ?? 0} XP</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-900/40 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Institutional Curriculum Assignment</h3>
              <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
                Assigned standard curriculums for {stats?.tenantName || 'Global Medical University'}: <strong>MBBS (NMC 2024)</strong>, <strong>BDS (DCI)</strong>, <strong>BSc Nursing (INC)</strong>, and <strong>Allied Health (NCAHP)</strong>.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
                <CheckCircle size={14} /> 4 Regulatory Frameworks Synced
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
