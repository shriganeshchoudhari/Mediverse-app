'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import styles from './ExamSummaryView.module.css';
import { getCompetencyByCode, NMC_COMPETENCIES } from '../../lib/competencies/nmcMapping';
import { ExamSummaryData, QuizQuestion } from './QuizRunner';
import { ExtendedQuizQuestion } from '../../lib/competencies/clinicalExamQuestions';

interface ExamSummaryViewProps {
  summaryData: ExamSummaryData;
  onRetakeExam: () => void;
  onChoosePreset: () => void;
}

export default function ExamSummaryView({
  summaryData,
  onRetakeExam,
  onChoosePreset,
}: ExamSummaryViewProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'correct' | 'incorrect' | 'flagged'>('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    score,
    total,
    percentage,
    timeElapsed,
    competencyBreakdown,
    userAnswers,
    flaggedQuestions,
    questions,
  } = summaryData;

  const correctCount = score;
  const incorrectCount = total - score;
  const flaggedCount = Object.values(flaggedQuestions || {}).filter(Boolean).length;
  const avgTimePerQuestion = total > 0 ? (timeElapsed / total).toFixed(1) : '0';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  // Performance classification
  let distinctionBadge = {
    label: 'Mastered • Honors Distinction',
    className: styles.distinctionMastered,
    desc: 'Outstanding clinical mastery across core physiological mechanisms. Estimated USMLE Step 1 equivalent: 245+ / NMC CBME Level III Mastery.',
  };
  if (percentage < 50) {
    distinctionBadge = {
      label: 'Remediation Recommended',
      className: styles.distinctionReview,
      desc: 'Critical gaps detected in core physiological competencies. Review targeted clinical vignettes and interactive simulators.',
    };
  } else if (percentage < 70) {
    distinctionBadge = {
      label: 'Borderline Pass',
      className: styles.distinctionBorderline,
      desc: 'Demonstrated foundational concepts, but requires targeted review of high-yield mechanisms before clinical rotations.',
    };
  } else if (percentage < 85) {
    distinctionBadge = {
      label: 'Proficient • Solid Competency',
      className: styles.distinctionProficient,
      desc: 'Solid diagnostic and physiological reasoning. Meets NMC CBME Core Standards for clinical application.',
    };
  }

  // Prepare radar chart data for all 8 competencies
  const competencyCodes = ['PY1.1', 'PY1.3', 'PY3.1', 'PY5.1', 'PY5.2', 'PY6.1', 'PY6.2', 'PY7.1'];
  const radarData = competencyCodes.map((code) => {
    const comp = getCompetencyByCode(code);
    const stat = competencyBreakdown[code] || { total: 0, correct: 0, percentage: 0 };
    return {
      code,
      subject: code,
      fullTopic: comp ? comp.topic : code,
      mastery: stat.percentage,
      total: stat.total,
      correct: stat.correct,
    };
  });

  // Filter questions for review
  const filteredQuestions = questions.map((q, idx) => ({
    q: q as ExtendedQuizQuestion,
    idx,
    isCorrect: userAnswers[idx] === q.correctIndex,
    isFlagged: !!flaggedQuestions[idx],
    userChoice: userAnswers[idx],
  })).filter((item) => {
    if (filterTab === 'correct') return item.isCorrect;
    if (filterTab === 'incorrect') return !item.isCorrect;
    if (filterTab === 'flagged') return item.isFlagged;
    return true;
  });

  return (
    <div className={styles.summaryContainer}>
      {/* Score Hero Section */}
      <section className={styles.scoreHero}>
        <div className={styles.heroHeader}>
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
              Assessment Report
            </span>
            <h1 className={styles.heroTitle}>Clinical Examination Summary</h1>
            <p className={styles.heroSubtitle}>{distinctionBadge.desc}</p>
          </div>

          <div className={`${styles.distinctionBadge} ${distinctionBadge.className}`}>
            <span>🏆</span>
            <span>{distinctionBadge.label}</span>
          </div>
        </div>

        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Score</span>
            <div className="flex items-baseline gap-2">
              <span className={styles.statValue}>{score}</span>
              <span className="text-sm text-slate-500 font-mono">/ {total}</span>
            </div>
            <span className="text-xs text-blue-400 font-semibold">{percentage}% Accuracy</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Time Elapsed</span>
            <span className={styles.statValue}>{formatTime(timeElapsed)}</span>
            <span className="text-xs text-slate-400 font-mono">{avgTimePerQuestion}s / question</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Outcome Breakdown</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-bold text-emerald-400">✓ {correctCount} Correct</span>
              <span className="text-sm font-bold text-rose-400">✗ {incorrectCount} Incorrect</span>
            </div>
            <span className="text-xs text-slate-400">{flaggedCount} marked for review</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>CBME Competency</span>
            <span className="text-xl font-black text-amber-400 mt-1">
              {Object.keys(competencyBreakdown).length} Domains
            </span>
            <span className="text-xs text-slate-400">NMC Medical Curriculum</span>
          </div>
        </div>
      </section>

      {/* NMC CBME Competency Mastery Breakdown (Radar & Bar Grid) */}
      <section className={styles.masterySection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>NMC CBME Competency Mastery Matrix</h2>
            <p className={styles.sectionSubtitle}>
              Granular breakdown across General, Nerve-Muscle, Cardiovascular, Respiratory, and Renal competencies
            </p>
          </div>
        </div>

        <div className={styles.analyticsGrid}>
          {/* Radar Chart */}
          <div className={styles.radarCard}>
            <h3 className={styles.radarTitle}>Competency Radar Profile (% Mastery)</h3>
            {isClient ? (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <PolarGrid stroke="hsl(222, 30%, 25%)" />
                    <PolarAngleAxis
                      dataKey="code"
                      tick={{ fill: 'hsl(215, 20%, 75%)', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: 'hsl(215, 16%, 50%)', fontSize: 10 }}
                    />
                    <Radar
                      name="Mastery %"
                      dataKey="mastery"
                      stroke="hsl(212, 100%, 55%)"
                      fill="hsl(212, 100%, 48%)"
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Mastery']}
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 11%)',
                        borderColor: 'hsl(222, 30%, 20%)',
                        color: '#fff',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
                Rendering radar matrix...
              </div>
            )}
          </div>

          {/* Bar Mastery Breakdown */}
          <div className={styles.competencyList}>
            {competencyCodes.map((code) => {
              const comp = getCompetencyByCode(code);
              const data = competencyBreakdown[code] || { total: 0, correct: 0, percentage: 0 };
              const percent = data.total > 0 ? data.percentage : 0;

              let statusBadge = { label: 'Mastered', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' };
              let barColor = 'bg-emerald-500';
              if (percent < 50) {
                statusBadge = { label: 'Review Needed', color: 'text-rose-400 bg-rose-950/40 border-rose-800' };
                barColor = 'bg-rose-500';
              } else if (percent < 80) {
                statusBadge = { label: 'Competent', color: 'text-amber-400 bg-amber-950/40 border-amber-800' };
                barColor = 'bg-amber-500';
              }

              return (
                <div key={code} className={styles.competencyCard}>
                  <div className={styles.competencyCardHeader}>
                    <span className={styles.competencyCodeTag}>{code}</span>
                    <span className={styles.competencyTopic}>{comp ? comp.topic : code}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                    <span className={styles.competencyScoreText}>
                      {data.correct}/{data.total} ({percent}%)
                    </span>
                  </div>

                  <div className={styles.progressBarTrack}>
                    <div
                      className={`${styles.progressBarFill} ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className={styles.competencyFooter}>
                    <span className="text-slate-400">{comp ? comp.system : ''}</span>
                    <span className="font-semibold text-slate-500">Core: Must Know</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive Question-by-Question Review Section */}
      <section className={styles.reviewSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Detailed Clinical Vignette Review</h2>
            <p className={styles.sectionSubtitle}>
              Analyze patient cases, physiological mechanisms, lab findings, and high-yield USMLE/NMC clinical pearls
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            onClick={() => setFilterTab('all')}
            className={`${styles.tabButton} ${filterTab === 'all' ? styles.tabButtonActive : ''}`}
          >
            All Questions ({total})
          </button>
          <button
            onClick={() => setFilterTab('correct')}
            className={`${styles.tabButton} ${filterTab === 'correct' ? styles.tabButtonActive : ''}`}
          >
            Correct ({correctCount})
          </button>
          <button
            onClick={() => setFilterTab('incorrect')}
            className={`${styles.tabButton} ${filterTab === 'incorrect' ? styles.tabButtonActive : ''}`}
          >
            Incorrect ({incorrectCount})
          </button>
          <button
            onClick={() => setFilterTab('flagged')}
            className={`${styles.tabButton} ${filterTab === 'flagged' ? styles.tabButtonActive : ''}`}
          >
            Flagged ({flaggedCount})
          </button>
        </div>

        {/* Question Cards */}
        <div className={styles.reviewQuestionsList}>
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-sm">
              No questions in this filter category.
            </div>
          ) : (
            filteredQuestions.map(({ q, idx, isCorrect, isFlagged, userChoice }) => {
              const comp = getCompetencyByCode(q.competencyCode);
              return (
                <div
                  key={q.id || idx}
                  className={`${styles.reviewCard} ${
                    isCorrect ? styles.reviewCardCorrect : styles.reviewCardIncorrect
                  }`}
                >
                  <div className={styles.reviewCardHeader}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">Question {idx + 1}</span>
                      {comp && (
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                          {comp.code}: {comp.topic}
                        </span>
                      )}
                      {isFlagged && (
                        <span className="text-xs text-amber-400 font-semibold">★ Flagged</span>
                      )}
                    </div>

                    <div
                      className={`${styles.resultBadge} ${
                        isCorrect ? styles.resultBadgeCorrect : styles.resultBadgeIncorrect
                      }`}
                    >
                      <span>{isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                    </div>
                  </div>

                  {/* Vitals / Labs if present */}
                  {q.vitals && (
                    <div className="flex flex-wrap gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-slate-400 font-bold uppercase mr-1">Vitals:</span>
                      {q.vitals.bp && <span className="text-slate-200">BP: {q.vitals.bp}</span>}
                      {q.vitals.hr && <span className="text-slate-200">HR: {q.vitals.hr}</span>}
                      {q.vitals.rr && <span className="text-slate-200">RR: {q.vitals.rr}</span>}
                      {q.vitals.spo2 && <span className="text-slate-200">SpO₂: {q.vitals.spo2}</span>}
                    </div>
                  )}

                  {/* Question Stem */}
                  <p className="text-slate-200 text-sm leading-relaxed font-medium">{q.stem}</p>

                  {/* Options with selection and correct indication */}
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = userChoice === optIdx;
                      const isCorrectAnswer = q.correctIndex === optIdx;

                      let optBorder = 'border-slate-800 bg-slate-950/40 text-slate-400';
                      if (isCorrectAnswer) {
                        optBorder = 'border-emerald-500 bg-emerald-950/30 text-emerald-100 font-semibold';
                      } else if (isUserChoice && !isCorrect) {
                        optBorder = 'border-rose-500 bg-rose-950/30 text-rose-200';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${optBorder}`}
                        >
                          <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-slate-900 border border-slate-700">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-normal">{opt}</span>
                          {isCorrectAnswer && (
                            <span className="text-emerald-400 font-bold">✓ Correct Answer</span>
                          )}
                          {isUserChoice && !isCorrectAnswer && (
                            <span className="text-rose-400 font-bold">✗ Your Selection</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* High Yield Explanation */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border-l-4 border-blue-500 border border-slate-800 text-xs leading-relaxed text-slate-300">
                    <div className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Physiological Mechanism & Explanation:</span>
                    </div>
                    <p className="mb-2">{q.rationale}</p>
                    {q.clinicalPearl && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-amber-300 font-medium flex items-start gap-1.5">
                        <span>⭐</span>
                        <span>
                          <strong>High-Yield Pearl:</strong> {q.clinicalPearl}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Bottom Actions */}
      <div className={styles.summaryActions}>
        <div className="flex items-center gap-3">
          <button onClick={onRetakeExam} className={styles.actionButtonSecondary}>
            <span>🔄</span>
            <span>Retake This Exam</span>
          </button>
          <button onClick={onChoosePreset} className={styles.actionButtonSecondary}>
            <span>📋</span>
            <span>Choose Another Exam Mode</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/simulators" className={styles.actionButtonSecondary}>
            <span>🔬</span>
            <span>Explore 3D Simulators</span>
          </Link>
          <Link href="/dashboard" className={styles.actionButtonPrimary}>
            <span>📊</span>
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
