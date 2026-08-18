"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../config/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCards: 0,
    dueToday: 0,
    averageRetention: 0,
  });

  // Initial mock data, will be replaced by API
  const [retentionData, setRetentionData] = useState<any[]>([
    { date: "Mon", rate: 85 },
    { date: "Tue", rate: 88 },
    { date: "Wed", rate: 82 },
    { date: "Thu", rate: 91 },
    { date: "Fri", rate: 94 },
    { date: "Sat", rate: 89 },
    { date: "Sun", rate: 93 },
  ]);

  const [futureDueData, setFutureDueData] = useState<any[]>([
    { day: "Today", count: 42 },
    { day: "Tmrw", count: 18 },
    { day: "Wed", count: 12 },
    { day: "Thu", count: 25 },
    { day: "Fri", count: 30 },
    { day: "Sat", count: 15 },
    { day: "Sun", count: 8 },
  ]);

  useEffect(() => {
    if (token) {
      fetch("/api/v1/analytics/spaced-repetition", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStats({
            totalCards: data.totalCards || 0,
            dueToday: data.dueToday || 0,
            averageRetention: data.averageRetention || 0,
          });
          if (data.retentionData) setRetentionData(data.retentionData);
          if (data.futureDueData) setFutureDueData(data.futureDueData);
        }
      })
      .catch(err => console.error("Error fetching analytics", err))
      .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-slate-400 animate-pulse uppercase tracking-widest text-xs font-bold">
          Crunching spaced repetition data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-3xl font-bold text-white mb-2">Spaced Repetition Analytics</h1>
          <p className="text-slate-400">Track your memory retention and upcoming flashcard reviews.</p>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Cards Studied</span>
            <div className="text-4xl font-black text-white mt-2">{stats.totalCards}</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cards Due Today</span>
            <div className="text-4xl font-black text-orange-400 mt-2">{stats.dueToday}</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average Retention Rate</span>
            <div className="text-4xl font-black text-emerald-400 mt-2">{stats.averageRetention}%</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Retention Trend */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <span>🧠</span> 7-Day Retention Trend
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Future Workload */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <span>📅</span> Projected Review Workload
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={futureDueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#f97316' }}
                    cursor={{ fill: '#1e293b' }}
                  />
                  <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
