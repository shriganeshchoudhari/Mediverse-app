"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../config/AuthContext";

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/study-groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/study-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newGroupName, description: newGroupDesc })
      });
      if (res.ok) {
        setShowCreate(false);
        fetchGroups();
        setNewGroupName("");
        setNewGroupDesc("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoin = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/v1/study-groups/${id}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchGroups();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8">Loading study groups...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Study Cohorts</h1>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showCreate ? "Cancel" : "+ Create Cohort"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreateGroup} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Create a New Cohort</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input 
                required 
                value={newGroupName} 
                onChange={e => setNewGroupName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                value={newGroupDesc} 
                onChange={e => setNewGroupDesc(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                rows={3}
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div key={group.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{group.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">{group.description}</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="text-sm text-slate-500">{group.memberCount} members</span>
              {group.isMember ? (
                <Link href={`/study-groups/${group.id}`} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  Enter
                </Link>
              ) : (
                <button onClick={() => handleJoin(group.id)} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition">
                  Join Group
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
