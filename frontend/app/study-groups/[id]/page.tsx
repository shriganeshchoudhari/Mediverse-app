"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../config/AuthContext";
import { CollaborativeStudyRoom } from "../../../components/study-group/CollaborativeStudyRoom";

export default function StudyGroupDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'room' | 'roster'>('room');

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

  if (loading) return <div className="p-8">Loading cohort details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/study-groups" className="text-blue-500 hover:underline inline-block">&larr; Back to Cohorts</Link>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveView('room')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${activeView === 'room' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
          >
            🔴 Live Study Room
          </button>
          <button 
            onClick={() => setActiveView('roster')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${activeView === 'roster' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
          >
            👥 Roster ({members.length})
          </button>
        </div>
      </div>

      {activeView === 'room' ? (
        <CollaborativeStudyRoom 
          roomId={roomId}
          roomName={`Cohort Live Study Room`}
          userId={userId}
          userName={userName}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cohort Roster</h2>
            <p className="text-sm text-slate-500 mt-1">{members.length} member(s)</p>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {members.map(member => (
              <li key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold mr-4">
                    {member.firstName?.[0]}{member.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{member.firstName} {member.lastName}</p>
                    <p className="text-sm text-slate-500">{member.role === 'ADMIN' ? 'Admin' : 'Student'}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
