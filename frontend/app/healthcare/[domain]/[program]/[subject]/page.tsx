"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowLeft, ArrowRight, Loader2, AlertTriangle, List } from "lucide-react";
import { getUnifiedDomainCatalog } from "@/lib/curriculum/unifiedDomainCatalog";

export default function CanonicalSubjectViewerPage() {
  const params = useParams();
  const router = useRouter();

  const domain = (params.domain as string) || "allopathic";
  const program = (params.program as string) || "mbbs";
  const subjectId = (params.subject as string) || "";

  // Lookup domain catalog just for breadcrumbs
  const domainInfo = getUnifiedDomainCatalog(domain);

  const [subjectTree, setSubjectTree] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTree() {
      try {
        const response = await fetch(`/api/v1/curriculum/subjects/by-code/${subjectId}/tree`);
        if (!response.ok) {
           if(response.status === 404) {
             throw new Error("Subject not found in database.");
           }
           throw new Error("Failed to fetch curriculum tree from backend API");
        }
        const data = await response.json();
        setSubjectTree(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTree();
  }, [subjectId]);

  const subjectTitle = subjectTree ? subjectTree.title : subjectId.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  // Flatten chapters for easy viewing
  const flatChapters = [];
  if (subjectTree && subjectTree.units) {
     for (const unit of subjectTree.units) {
        if (unit.chapters) {
           for (const chap of unit.chapters) {
              flatChapters.push({ ...chap, parentUnit: unit.title });
           }
        }
     }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <Link
            href={`/healthcare/${domain}/${program}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft size={14} /> Back to {domainInfo.domainName} ({program.toUpperCase()})
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest mb-3">
                <Sparkles size={12} /> Canonical Curriculum Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {subjectTitle}
              </h1>
              {subjectTree?.code && (
                <p className="text-slate-400 font-mono text-sm mt-2">
                  Code: {subjectTree.code} | Category: {subjectTree.category || 'Core'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-800">
             <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
             <p className="text-slate-400 font-medium">Loading {subjectTitle} syllabus from Mediverse Database...</p>
          </div>
        ) : error ? (
          <div className="p-16 flex flex-col items-center justify-center rounded-2xl bg-red-950/20 border border-red-900/40 text-center">
             <AlertTriangle className="text-red-500 mb-4" size={32} />
             <p className="text-red-400 font-bold mb-2">Subject Missing or Offline</p>
             <p className="text-red-300/70 text-sm max-w-md">{error}</p>
             <Link href={`/healthcare/${domain}/${program}`} className="mt-6 px-4 py-2 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition">
               Go Back
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: Units & Chapters List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <List size={20} className="text-blue-400" /> Syllabus Content
                </h2>
                <div className="text-sm font-semibold text-slate-400">
                  {subjectTree.units?.length || 0} Units &bull; {flatChapters.length} Chapters
                </div>
              </div>
              
              {subjectTree.units?.length === 0 ? (
                <div className="p-10 text-center rounded-xl bg-slate-900/50 border border-slate-800">
                  <p className="text-slate-400">No curriculum units defined for this subject yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {subjectTree.units?.map((unit: any, idx: number) => (
                    <div key={unit.id} className="relative">
                      {/* Unit Header */}
                      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-sm z-10 py-3 mb-3 border-b border-slate-800/60">
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <h3 className="text-lg font-bold text-slate-100">{unit.title}</h3>
                        </div>
                      </div>
                      
                      {/* Chapters in Unit */}
                      <div className="flex flex-col gap-3 pl-11">
                        {unit.chapters?.length === 0 ? (
                          <p className="text-sm text-slate-500 italic">No chapters in this unit.</p>
                        ) : (
                          unit.chapters?.map((chap: any, cIdx: number) => (
                            <Link 
                              key={chap.id}
                              href={`/healthcare/${domain}/${program}/${subjectId}/${chap.id}`}
                              className="group p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div>
                                <div className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest mb-1">
                                  Chapter {cIdx + 1}
                                </div>
                                <h4 className="font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                                  {chap.title}
                                </h4>
                                <div className="mt-2 flex gap-3 text-xs text-slate-500 font-medium">
                                  <span className="flex items-center gap-1">
                                    <BookOpen size={12} /> {chap.topics?.length || 0} Topics
                                  </span>
                                </div>
                              </div>
                              <div className="flex-shrink-0 self-start sm:self-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                  Study <ArrowRight size={14} />
                                </span>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right Col: Stats/Info */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                 <h3 className="text-sm font-bold text-white mb-4">Subject Metadata</h3>
                 <div className="space-y-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Total Chapters</div>
                      <div className="text-2xl font-bold text-blue-400">{flatChapters.length}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Subject UUID</div>
                      <div className="text-xs font-mono text-slate-400 break-all bg-slate-950 p-2 rounded">{subjectTree.id}</div>
                    </div>
                    {subjectTree.semesterId && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Semester UUID</div>
                        <div className="text-xs font-mono text-slate-400 break-all bg-slate-950 p-2 rounded">{subjectTree.semesterId}</div>
                      </div>
                    )}
                 </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
