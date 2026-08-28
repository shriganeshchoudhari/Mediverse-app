"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../config/AuthContext";
import { CollaborativeStudyRoom } from "../../../components/study-group/CollaborativeStudyRoom";
import { GroupPomodoroSync } from "../../../components/study-group/GroupPomodoroSync";
import { PeerQuizChallenge } from "../../../components/study-group/PeerQuizChallenge";

type StudyGroupTab = 'room' | 'pomodoro' | 'duel' | 'roster';

export default function StudyGroupDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<StudyGroupTab>('room');

  const roomId = String(params.id || 'general-cohort');
  const userId = user?.userId || 'guest-user';
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Student';

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/v1/study-groups/${params.id}/members`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchGroupData();
    }
  }, [params.id, router]);

  if (loading) return <div className="p-8 text-slate-600 dark:text-slate-300">Loading cohort details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link href="/study-groups" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium text-sm">
          &larr; Back to Cohorts
        </Link>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveView('room')}
            className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 ${
              activeView === 'room' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🔴 Live Study Room
          </button>
          <button 
            onClick={() => setActiveView('pomodoro')}
            className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 ${
              activeView === 'pomodoro' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⏱️ Group Pomodoro
          </button>
          <button 
            onClick={() => setActiveView('duel')}
            className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 ${
              activeView === 'duel' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚔️ Peer Quiz Duel
          </button>
          <button 
            onClick={() => setActiveView('roster')}
            className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 ${
              activeView === 'roster' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👥 Cohort Roster ({members.length})
          </button>
        </div>
      </div>

      {/* Tab Views */}
      {activeView === 'room' && (
        <CollaborativeStudyRoom 
          roomId={roomId}
          roomName={`Cohort Live Study Room`}
          userId={userId}
          userName={userName}
        />
      )}

      {activeView === 'pomodoro' && (
        <GroupPomodoroSync 
          roomId={roomId}
          roomName={`Cohort Live Study Room`}
          userId={userId}
          userName={userName}
        />
      )}

      {activeView === 'duel' && (
        <PeerQuizChallenge 
          roomId={roomId}
          roomName={`Cohort Live Study Room`}
          userId={userId}
          userName={userName}
        />
      )}

      {activeView === 'roster' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cohort Roster</h2>
              <p className="text-sm text-slate-500 mt-1">{members.length} registered scholar(s)</p>
            </div>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Active Cohort
            </span>
          </div>
          {members.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No members listed in this cohort yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {members.map(member => (
                <li key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold mr-4">
                      {member.firstName?.[0] || 'S'}{member.lastName?.[0] || 'M'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {member.role === 'ADMIN' ? 'Cohort Lead / Admin' : 'Medical Scholar'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Available</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
