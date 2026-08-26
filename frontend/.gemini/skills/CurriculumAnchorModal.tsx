"use client";

import React, { useState, useEffect } from "react";
import { X, Search, ChevronRight, FolderTree, BookOpen, Layers, Target, Loader2 } from "lucide-react";

interface CurriculumAnchorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept: (conceptId: string, breadcrumb: string) => void;
}

export default function CurriculumAnchorModal({ isOpen, onClose, onSelectConcept }: CurriculumAnchorModalProps) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [subjectTree, setSubjectTree] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load all subjects on mount
  useEffect(() => {
    if (isOpen && subjects.length === 0) {
      setLoading(true);
      fetch("/api/v1/curriculum/subjects/all")
        .then(res => res.json())
        .then(data => {
          setSubjects(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load subjects", err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  // Load specific subject tree when a subject is clicked
  useEffect(() => {
    if (selectedSubjectId) {
      setLoading(true);
      setSubjectTree(null);
      fetch(`/api/v1/curriculum/subjects/${selectedSubjectId}/tree`)
        .then(res => res.json())
        .then(data => {
          setSubjectTree(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load subject tree", err);
          setLoading(false);
        });
    }
  }, [selectedSubjectId]);

  if (!isOpen) return null;

  const filteredSubjects = subjects.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <FolderTree className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-white">Curriculum Anchor Selection</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Panel: Subject Selection */}
          <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-950/30">
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {loading && !selectedSubjectId && (
                <div className="flex justify-center p-6"><Loader2 className="animate-spin text-blue-500" /></div>
              )}
              {filteredSubjects.map(subj => (
                <button
                  key={subj.id}
                  onClick={() => setSelectedSubjectId(subj.id)}
                  className={`w-full text-left p-3 rounded-xl mb-1 flex items-center justify-between transition ${
                    selectedSubjectId === subj.id ? "bg-blue-600/20 border border-blue-500/40 text-blue-300" : "hover:bg-slate-800 text-slate-300 border border-transparent"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold font-mono text-slate-500">{subj.code}</div>
                    <div className="text-sm font-semibold">{subj.title}</div>
                  </div>
                  <ChevronRight size={16} className={selectedSubjectId === subj.id ? "text-blue-400" : "text-slate-600"} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Hierarchy Tree */}
          <div className="w-2/3 flex flex-col bg-slate-900/10">
            {!selectedSubjectId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <BookOpen size={48} className="mb-4 opacity-20" />
                <p>Select a Subject from the left panel to browse its hierarchy.</p>
              </div>
            ) : loading && !subjectTree ? (
              <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
            ) : subjectTree ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="pb-4 border-b border-slate-800">
                  <h3 className="text-xl font-bold text-white mb-1">{subjectTree.title}</h3>
                  <p className="text-sm text-slate-400">Select a leaf Concept node to anchor your lesson.</p>
                </div>
                
                {subjectTree.units?.map((unit: any) => (
                  <div key={unit.id} className="mb-4">
                    <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
                      <Layers size={14} className="text-blue-400" /> {unit.title}
                    </div>
                    <div className="pl-5 space-y-3 border-l border-slate-800 ml-2">
                      {unit.chapters?.map((chap: any) => (
                        <div key={chap.id}>
                          <div className="text-sm font-semibold text-slate-400 mb-1">{chap.title}</div>
                          <div className="pl-4 space-y-1.5 border-l border-slate-800/50 ml-1">
                            {chap.topics?.map((topic: any) => (
                              <div key={topic.id}>
                                <div className="text-xs text-slate-500 mb-1">{topic.title}</div>
                                <div className="pl-4 space-y-1">
                                  {topic.concepts?.map((concept: any) => (
                                    <button
                                      key={concept.id}
                                      onClick={() => {
                                        const breadcrumb = `${subjectTree.code} > ${unit.title.substring(0, 20)}... > ${chap.title.substring(0, 20)}... > ${concept.title}`;
                                        onSelectConcept(concept.id, breadcrumb);
                                      }}
                                      className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/50 transition flex items-center justify-between group"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Target size={12} className="text-emerald-500" />
                                        <span className="text-xs font-semibold text-slate-300 group-hover:text-blue-300">{concept.title}</span>
                                      </div>
                                      {concept.lesson ? (
                                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Has Lesson</span>
                                      ) : (
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Empty Node</span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">No tree data found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
