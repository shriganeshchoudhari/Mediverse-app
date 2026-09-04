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

  const [apiResults, setApiResults] = useState<Array<{id:string, title:string, code:string, type:string, domain:string, result_type:string, path:string}>>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length >= 2) {
        fetch('/api/v1/search?q=' + encodeURIComponent(query) + '&limit=10')
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setApiResults(data);
            } else if (data && Array.isArray(data.results)) {
              setApiResults(data.results);
            } else {
              setApiResults([]);
            }
          })
          .catch(() => setApiResults([]));
      } else {
        setApiResults([]);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

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

  const ORGAN_QUICK_LINKS = [
    { id: 'cardiovascular', name: 'Heart & Cardiovascular System (3D)', icon: '🫀', route: '/dissection', presetId: 'cardiovascular' },
    { id: 'respiratory', name: 'Lungs & Respiratory Mechanics (3D)', icon: '🫁', route: '/dissection', presetId: 'respiratory' },
    { id: 'renal', name: 'Kidney & Glomerular Filtration (3D)', icon: '🫘', route: '/dissection', presetId: 'renal' },
    { id: 'neurophysiology', name: 'Neuron & Action Potentials (3D)', icon: '🧠', route: '/dissection', presetId: 'neurophysiology' },
    { id: 'special-senses-vision', name: 'Eye, Cornea & Visual Pathway (3D)', icon: '👁️', route: '/dissection', presetId: 'special-senses-vision' },
    { id: 'gastrointestinal', name: 'GI Tract, Stomach & Peristalsis (3D)', icon: '🫃', route: '/dissection', presetId: 'gastrointestinal' },
    { id: 'endocrine', name: 'Thyroid, Adrenals & Endocrine (3D)', icon: '⚗️', route: '/dissection', presetId: 'endocrine' },
    { id: 'blood-composition', name: 'Blood Cells, RBCs & Hemostasis (3D)', icon: '🩸', route: '/dissection', presetId: 'blood-composition' },
    { id: 'reproductive-cycles', name: 'Uterus, Ovary & Ovarian Cycle (3D)', icon: '🔬', route: '/dissection', presetId: 'reproductive-cycles' },
    { id: 'homeostasis', name: 'Lipid Bilayer & Fluid Mosaic Membrane (3D)', icon: '🫧', route: '/dissection', presetId: 'homeostasis' },
    { id: 'integrated-exercise', name: 'Sarcomere & Huxley Sliding Filament (3D)', icon: '💪', route: '/dissection', presetId: 'integrated-exercise' },
  ];

  const SIMULATOR_QUICK_LINKS = [
    { id: 'pharmacokinetics', name: 'Pharmacokinetics PK/PD & TDM Solver', icon: '💊', route: '/simulators/pharmacokinetics' },
    { id: 'ecg-rhythm', name: '12-Lead ECG Rhythm Synthesizer', icon: '📈', route: '/simulators/ecg-rhythm' },
    { id: 'hemodynamics-shock', name: 'Hemodynamic Shock & Swan-Ganz Classifier', icon: '🩺', route: '/simulators/hemodynamics-shock' },
    { id: 'cardiac-cycle', name: 'Cardiac Cycle & Suga-Sagawa PV Loop', icon: '⚡', route: '/simulators/cardiac-cycle' },
    { id: 'renal-filtration', name: 'Renal Clearance & GFR Solver', icon: '💧', route: '/simulators/renal-filtration' },
    { id: 'respiratory-vq', name: 'V/Q Mismatch & Alveolar Gas Exchange', icon: '💨', route: '/simulators/respiratory-vq' },
    { id: 'spirometry', name: 'Spirometry & Airway Flow-Volume Loop', icon: '📊', route: '/simulators/spirometry' },
    { id: 'nerve-muscle', name: 'Nerve-Muscle Electrophysiology & GHK', icon: '⚡', route: '/simulators/nerve-muscle' },
  ];

  const matchedOrgans = query
    ? ORGAN_QUICK_LINKS.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const matchedSimulators = query
    ? SIMULATOR_QUICK_LINKS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : [];

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
            {apiResults.length > 0 ? (
              <ul className="space-y-1">
                {apiResults.map((res) => (
                  <li key={res.id}>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        router.push(res.path || `/lessons/${res.id}`);
                      }}
                      className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <div>
                        <h4 className="text-white font-medium">{res.title}</h4>
                        <span className="text-xs text-slate-500 uppercase">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 mr-2 text-[10px]">{res.domain || 'Allopathic'}</span>
                          {res.result_type || 'Chapter'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                        Jump to {res.result_type === 'subject' ? 'Subject' : 'Result'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (filteredChapters.length > 0 || matchedOrgans.length > 0 || matchedSimulators.length > 0) ? (
              <div className="space-y-4">
                {/* 3D Organ Models Category */}
                {matchedOrgans.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 flex items-center gap-1.5">
                      🫀 3D Anatomical Organ Models
                    </h5>
                    <ul className="space-y-1 mt-1">
                      {matchedOrgans.map((org) => (
                        <li key={org.id}>
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              router.push(`${org.route}?preset=${org.presetId}`);
                            }}
                            className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{org.icon}</span>
                              <div>
                                <h4 className="text-white font-medium text-sm">{org.name}</h4>
                                <span className="text-[10px] text-cyan-400/80 font-mono">Photorealistic 3D Living Model</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                              View 3D Model
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Physiology Simulators Category */}
                {matchedSimulators.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 flex items-center gap-1.5">
                      ⚡ Physiology Simulation Engines
                    </h5>
                    <ul className="space-y-1 mt-1">
                      {matchedSimulators.map((sim) => (
                        <li key={sim.id}>
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              router.push(sim.route);
                            }}
                            className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{sim.icon}</span>
                              <div>
                                <h4 className="text-white font-medium text-sm">{sim.name}</h4>
                                <span className="text-[10px] text-emerald-400/80 font-mono">Interactive Solver Lab</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                              Launch Lab
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chapters Category */}
                {filteredChapters.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                      📖 Curriculum Chapters
                    </h5>
                    <ul className="space-y-1 mt-1">
                      {filteredChapters.map((chapter) => (
                        <li key={chapter.id}>
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              router.push(`/lessons/${chapter.id}`);
                            }}
                            className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            <div>
                              <h4 className="text-white font-medium text-sm">{chapter.title}</h4>
                              <span className="text-xs text-slate-500 uppercase">
                                <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 mr-2 text-[10px]">Allopathic</span>
                                {chapter.subjectTitle} • {chapter.section}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                              Jump to Chapter
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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
