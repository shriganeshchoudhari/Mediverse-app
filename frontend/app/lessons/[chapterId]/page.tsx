"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../config/AuthContext";
import ChapterRenderer from "../../../components/lessons/ChapterRenderer";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  
  const chapterId = params.chapterId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    title: string;
    markdownContent: string;
    difficulty: string;
    estimatedMinutes: number;
    section: string;
    topics?: any[];
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;

    async function fetchContent() {
      try {
        setLoading(true);
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const res = await fetch(`/local-api/curriculum/${chapterId}`, { headers });
        if (!res.ok) {
          if (res.status === 404) {
            setError("Chapter not found");
            return;
          }
          throw new Error(`Failed to load chapter content. Status: ${res.status}`);
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        console.error("Failed to load chapter:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [chapterId, token, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Chapter Content...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full space-y-6">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-black text-white">Failed to Load Content</h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            {error || "We could not find the contents for this chapter."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-900/20"
          >
            Back to Syllabus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <ChapterRenderer
        title={data.title}
        markdownContent={data.markdownContent}
        chapterId={chapterId}
        topics={data.topics}
      />
    </div>
  );
}
