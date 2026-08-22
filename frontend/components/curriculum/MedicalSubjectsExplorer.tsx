"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MEDICAL_CURRICULUM_SCAFFOLD,
  MedicalPhase,
  MedicalSubject
} from "../../lib/curriculum/medicalCurriculumScaffold";
import styles from "./MedicalSubjectsExplorer.module.css";

export default function MedicalSubjectsExplorer() {
  const [selectedPhase, setSelectedPhase] = useState<MedicalPhase | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  const filteredSubjects = useMemo(() => {
    return MEDICAL_CURRICULUM_SCAFFOLD.filter(subj => {
      const matchesPhase = selectedPhase === "ALL" || subj.phase === selectedPhase;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        subj.title.toLowerCase().includes(q) ||
        subj.code.toLowerCase().includes(q) ||
        subj.shortDescription.toLowerCase().includes(q) ||
        subj.units.some(u => u.title.toLowerCase().includes(q) || u.chapters.some(c => c.title.toLowerCase().includes(q)));
      return matchesPhase && matchesSearch;
    });
  }, [selectedPhase, searchQuery]);

  const totalChapters = useMemo(() => {
    return MEDICAL_CURRICULUM_SCAFFOLD.reduce(
      (sum, s) => sum + s.units.reduce((uSum, u) => uSum + u.chapters.length, 0),
      0
    );
  }, []);

  const totalCompetencies = useMemo(() => {
    return MEDICAL_CURRICULUM_SCAFFOLD.reduce((sum, s) => sum + s.keyCompetencies.length, 0);
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.badge}>
          <span>🧬</span> Mediverse Curriculum Framework
        </div>
        <h1 className={styles.title}>Undergraduate Medical Subject Scaffold</h1>
        <p className={styles.subtitle}>
          Comprehensive curriculum architecture covering all 19 subjects across Pre-Clinical,
          Para-Clinical, Clinical, and Transversal AETCOM tiers mapped to NMC CBME &amp; USMLE standards.
        </p>
      </header>

      {/* Global Curriculum Stats */}
      <div className={styles.statsBar}>
        <div>
          <div className={styles.statNumber}>19</div>
          <div className={styles.statLabel}>Medical Subjects</div>
        </div>
        <div>
          <div className={styles.statNumber}>4</div>
          <div className={styles.statLabel}>Curriculum Tiers</div>
        </div>
        <div>
          <div className={styles.statNumber}>{totalChapters}</div>
          <div className={styles.statLabel}>Scaffold Chapters</div>
        </div>
        <div>
          <div className={styles.statNumber}>{totalCompetencies}+</div>
          <div className={styles.statLabel}>CBME Competencies</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.phaseTabs}>
          <button
            className={`${styles.phaseTab} ${selectedPhase === "ALL" ? styles.phaseTabActive : ""}`}
            onClick={() => setSelectedPhase("ALL")}
          >
            All Subjects (19)
          </button>
          <button
            className={`${styles.phaseTab} ${selectedPhase === "PRE_CLINICAL" ? styles.phaseTabActive : ""}`}
            onClick={() => setSelectedPhase("PRE_CLINICAL")}
          >
            Pre-Clinical (1st Year)
          </button>
          <button
            className={`${styles.phaseTab} ${selectedPhase === "PARA_CLINICAL" ? styles.phaseTabActive : ""}`}
            onClick={() => setSelectedPhase("PARA_CLINICAL")}
          >
            Para-Clinical (2nd Year)
          </button>
          <button
            className={`${styles.phaseTab} ${selectedPhase === "CLINICAL" ? styles.phaseTabActive : ""}`}
            onClick={() => setSelectedPhase("CLINICAL")}
          >
            Clinical (3rd &amp; Final)
          </button>
          <button
            className={`${styles.phaseTab} ${selectedPhase === "TRANSVERSAL" ? styles.phaseTabActive : ""}`}
            onClick={() => setSelectedPhase("TRANSVERSAL")}
          >
            AETCOM &amp; Ethics
          </button>
        </div>

        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search subjects, units, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className={styles.grid}>
        {filteredSubjects.map((subject: MedicalSubject) => (
          <div key={subject.id} className={styles.card}>
            <div>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{subject.icon}</span>
                <span
                  className={styles.codeBadge}
                  style={{
                    backgroundColor: subject.colorTheme.badgeBg,
                    color: subject.colorTheme.badgeText,
                    border: `1px solid ${subject.colorTheme.border}`
                  }}
                >
                  {subject.code}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{subject.title}</h3>
              <div className={styles.cardYear}>
                {subject.professionalYear} • {subject.phase.replace("_", " ")}
              </div>
              <p className={styles.cardDesc}>{subject.shortDescription}</p>

              {/* Units & Chapters Preview */}
              <div className={styles.unitList}>
                <div className="flex justify-between items-center mb-2">
                  <span className={styles.unitListHeader}>Core Units ({subject.units.length}) • Chapters ({subject.units.reduce((a, b) => a + b.chapters.length, 0)})</span>
                  <button
                    onClick={() => setExpandedSubjectId(expandedSubjectId === subject.id ? null : subject.id)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition py-0.5 px-2 rounded bg-blue-500/10 border border-blue-500/20"
                  >
                    {expandedSubjectId === subject.id ? 'Hide Chapters ▲' : 'View Chapters ▼'}
                  </button>
                </div>

                {subject.units.map(unit => (
                  <div key={unit.id} className="mb-2">
                    <div className={styles.unitItem}>
                      <span className={styles.dot} style={{ backgroundColor: subject.colorTheme.accent }} />
                      <span className="font-semibold text-slate-200">{unit.title} ({unit.chapters.length} chap)</span>
                    </div>

                    {/* Expandable Chapters List */}
                    {expandedSubjectId === subject.id && (
                      <div className="mt-2 ml-4 space-y-2 border-l-2 border-slate-800 pl-3">
                        {unit.chapters.map((chap, chapIdx) => (
                          <div
                            key={chap.id}
                            className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                  Chap {chapIdx + 1}
                                </span>
                                <strong className="text-xs text-white font-semibold">{chap.title}</strong>
                              </div>
                              <p className="text-[11px] text-slate-400">{chap.description}</p>
                              <div className="flex gap-2 text-[10px] text-slate-500">
                                <span>⏱️ {chap.estimatedMinutes} mins</span>
                                <span>•</span>
                                <span>{chap.highYieldTopics.length} high-yield topics</span>
                              </div>
                            </div>

                            <Link
                              href={subject.defaultSimulatorRoute || `/lessons/${chap.id}`}
                              className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold self-start sm:self-center transition flex-shrink-0"
                            >
                              Study Chapter →
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className={styles.tagsRow}>
                {subject.has3DCanvas && <span className={styles.tag}>🫀 3D Anatomical Canvas</span>}
                {subject.hasSimulators && <span className={styles.tag}>⚡ Numerical Simulators</span>}
                <span className={styles.tag}>{subject.keyCompetencies.length} Competencies</span>
              </div>
            </div>

            {/* Action Footer */}
            <div className={styles.cardFooter}>
              {subject.defaultSimulatorRoute ? (
                <Link href={subject.defaultSimulatorRoute} className={styles.actionBtn}>
                  Launch Simulation Lab →
                </Link>
              ) : (
                <Link href={`/exam?subject=${subject.code}`} className={styles.actionBtn}>
                  Explore Clinical MCQs →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
