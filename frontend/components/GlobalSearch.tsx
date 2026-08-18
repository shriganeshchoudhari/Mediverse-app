"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurriculumCatalog } from "../hooks/useCurriculumCatalog";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { subjects } = useCurriculumCatalog();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const allChapters = subjects.flatMap((subject) =>
    subject.chapters.map((ch) => ({ ...ch, subjectTitle: subject.title }))
  );

  const filteredChapters = query
    ? allChapters.filter((chapter) =>
        chapter.title.toLowerCase().includes(query.toLowerCase()) ||
        chapter.section.toLowerCase().includes(query.toLowerCase()) ||
        chapter.subjectTitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-slate-950/80 backdrop-blur-sm px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-slate-800 px-4">
          <span className="text-slate-500 mr-3">🔍</span>
          <input
            id="global-search-input"
            aria-label="Search chapters, topics, sections"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters, topics, sections..."
            className="w-full bg-transparent border-none outline-none py-4 text-white placeholder:text-slate-500 text-lg"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-800 rounded"
          >
            ESC
          </button>
        </div>

        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredChapters.length > 0 ? (
              <ul className="space-y-1">
                {filteredChapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        router.push(`/lessons/${chapter.id}`);
                      }}
                      className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <div>
                        <h4 className="text-white font-medium">{chapter.title}</h4>
                        <span className="text-xs text-slate-500 uppercase">{chapter.subjectTitle} • {chapter.section}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                        Jump to Chapter
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p>No chapters found matching &quot;{query}&quot;.</p>
              </div>
            )}
          </div>
        )}
        
        {!query && (
          <div className="p-4 bg-slate-950/50">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Popular Searches</h5>
            <div className="flex flex-wrap gap-2">
              {["Action Potentials", "Cardiac Cycle", "Acid-Base Balance", "Homeostasis"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-700 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setIsOpen(false)} 
        aria-hidden="true" 
      />
    </div>
  );
}
