"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChapterRenderer from "@/components/lessons/ChapterRenderer";
import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, ShieldCheck } from "lucide-react";

export default function CanonicalChapterViewerPage() {
  const params = useParams();
  const router = useRouter();

  const domain = (params.domain as string) || "allopathic";
  const program = (params.program as string) || "mbbs";
  const subject = (params.subject as string) || "";
  const chapterId = (params.chapterId as string) || "";

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
    if (!chapterId) return;

    async function loadContent() {
      try {
        setLoading(true);
        setError(null);

        // Fetch from canonical local API / database proxy
        const res = await fetch(`/local-api/curriculum/${chapterId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Chapter not found");
            return;
          }
          throw new Error(`Failed to load chapter content (Status ${res.status})`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Error loading canonical chapter:", err);
        setError(err.message || "Failed to load chapter content");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Loading Canonical Curriculum...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            🏛️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Curriculum Module in Preparation</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              This module for <span className="text-blue-400 font-semibold">{chapterId}</span> is undergoing editorial review in the CMS repository.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/healthcare/${domain}/${program}`}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition text-sm text-center"
            >
              Return to {program.toUpperCase()} Syllabus
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href={`/healthcare/${domain}`} className="hover:text-white capitalize transition">{domain}</Link>
            <span>/</span>
            <Link href={`/healthcare/${domain}/${program}`} className="hover:text-white uppercase transition">{program}</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">{data.title}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <ShieldCheck size={13} /> Canonical DB Grounded
          </div>
        </div>
      </div>

      <ChapterRenderer
        title={data.title}
        markdownContent={data.markdownContent}
        chapterId={chapterId}
        topics={data.topics}
      />
    </div>
  );
}
