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
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            🏛️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Curriculum Module In Preparation</h2>
            <p className="text-sm text-slate-400 font-normal leading-relaxed">
              {error === "Chapter not found"
                ? "This lesson is currently undergoing regulatory alignment and editorial peer review in the Mediverse CMS workflow."
                : error || "We could not find the verified contents for this module."}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition text-sm shadow-lg shadow-blue-900/20"
            >
              Browse Active Syllabus
            </button>
            <button
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition text-sm border border-slate-700"
            >
              Go Back
            </button>
          </div>
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
