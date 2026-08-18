"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function StudyGroupDetail() {
  const params = useParams();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/v1/study-groups/${params.id}/members`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        } else {
          router.push("/study-groups");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchMembers();
    }
  }, [params.id, router]);

  if (loading) return <div className="p-8">Loading cohort details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/study-groups" className="text-blue-500 hover:underline mb-6 inline-block">&larr; Back to Cohorts</Link>
      
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
    </div>
  );
}
