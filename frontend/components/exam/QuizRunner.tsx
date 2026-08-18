'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './QuizRunner.module.css';
import { calculateCompetencyScores, getCompetencyByCode } from '../../lib/competencies/nmcMapping';
import { ExtendedQuizQuestion } from '../../lib/competencies/clinicalExamQuestions';

export interface QuizQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  competencyCode: string;
  patientVignette?: string;
  vitals?: {
    bp?: string;
    hr?: string;
    rr?: string;
    spo2?: string;
    temp?: string;
  };
  labValues?: Array<{ test: string; value: string; normal: string }>;
  clinicalPearl?: string;
}

export interface ExamSummaryData {
  score: number;
  total: number;
  percentage: number;
  timeElapsed: number;
  durationSeconds: number;
  competencyBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  userAnswers: Record<number, number>;
  flaggedQuestions: Record<number, boolean>;
  questions: (QuizQuestion | ExtendedQuizQuestion)[];
}

interface QuizRunnerProps {
  examTitle: string;
  durationSeconds?: number;
  questions: (QuizQuestion | ExtendedQuizQuestion)[];
  onFinishExam?: (
    score: number,
    total: number,
    competencyBreakdown: Record<string, { total: number; correct: number; percentage: number }>,
    summaryData?: ExamSummaryData
  ) => void;
  onExitExam?: () => void;
  initialQuestionIndex?: number;
}

export default function QuizRunner({
  examTitle,
  durationSeconds = 600,
  questions,
  onFinishExam,
  onExitExam,
  initialQuestionIndex = 0,
}: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialQuestionIndex);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [struckOptions, setStruckOptions] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [showNavGrid, setShowNavGrid] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const startTimeRef = useRef<number>(Date.now());

  const handleFinish = useCallback(() => {
    setIsSubmitted(true);
    let totalScore = 0;
    const answerRecords = questions.map((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correctIndex;
      if (isCorrect) totalScore += 1;
      return { competencyCode: q.competencyCode, isCorrect };
    });

    const breakdown = calculateCompetencyScores(answerRecords);
    const timeElapsed = Math.min(durationSeconds, Math.round((Date.now() - startTimeRef.current) / 1000));
    const percentage = questions.length > 0 ? Math.round((totalScore / questions.length) * 100) : 0;

    const summaryData: ExamSummaryData = {
      score: totalScore,
      total: questions.length,
      percentage,
      timeElapsed,
      durationSeconds,
      competencyBreakdown: breakdown,
      userAnswers: selectedAnswers,
      flaggedQuestions: flagged,
      questions,
    };

    if (onFinishExam) {
      onFinishExam(totalScore, questions.length, breakdown, summaryData);
    }
  }, [questions, selectedAnswers, flagged, durationSeconds, onFinishExam]);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft, handleFinish]);

  const currentQ = questions[currentIndex] as ExtendedQuizQuestion | undefined;

  const handleSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const toggleStrike = (e: React.MouseEvent, optionIdx: number) => {
    e.stopPropagation();
    const key = `${currentIndex}-${optionIdx}`;
    setStruckOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateFinalScore = () => {
    return questions.reduce((acc, q, idx) => {
      return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  };

  if (!currentQ) {
    return (
      <div className="text-white p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center">
        <p className="text-slate-300 font-medium">No questions available.</p>
        {onExitExam && (
          <button
            onClick={onExitExam}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
          >
            Return
          </button>
        )}
      </div>
    );
  }

  const competency = getCompetencyByCode(currentQ.competencyCode);
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const isTimeWarning = timeLeft < 180; // under 3 minutes

  return (
    <div className={styles.examContainer}>
      {/* Exam Header */}
      <div className={styles.examHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.examTitle}>{examTitle}</h2>
          <div className={styles.metaRow}>
            <span className={styles.questionBadge}>
              Question <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
            </span>
            {competency && (
              <span className={styles.competencyTag} title={competency.description}>
                <span>{competency.code}:</span> {competency.topic}
              </span>
            )}
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            onClick={toggleFlag}
            className={`${styles.flagButton} ${flagged[currentIndex] ? styles.flagButtonActive : ''}`}
            title="Bookmark this question to review later"
          >
            <span>{flagged[currentIndex] ? '★' : '☆'}</span>
            <span>{flagged[currentIndex] ? 'Flagged' : 'Flag for Review'}</span>
          </button>

          <button
            onClick={() => setShowNavGrid((prev) => !prev)}
            className={styles.flagButton}
            title="Toggle Question Navigator"
          >
            <span>☰</span>
            <span>Navigator ({answeredCount}/{questions.length})</span>
          </button>

          <div className={`${styles.timerBadge} ${isTimeWarning ? styles.timerWarning : ''}`}>
            <span>⏱️</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Collapsible Question Navigator Grid */}
      {showNavGrid && (
        <div className={styles.navDrawer}>
          <div className={styles.navDrawerTitle}>
            <span>Question Navigator</span>
            <span className="text-xs font-normal">
              {answeredCount} Answered • {questions.length - answeredCount} Unanswered • {flaggedCount} Flagged
            </span>
          </div>
          <div className={styles.navGrid}>
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCur = idx === currentIndex;
              const isFlg = flagged[idx];

              let pillClass = styles.navPill;
              if (isCur) pillClass += ` ${styles.navPillActive}`;
              else if (isAnswered) pillClass += ` ${styles.navPillAnswered}`;
              if (isFlg) pillClass += ` ${styles.navPillFlagged}`;

              return (
                <button
                  key={q.id || idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowNavGrid(false);
                  }}
                  className={pillClass}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clinical Vignette Details: Vitals & Lab findings if available */}
      {(currentQ.vitals || (currentQ.labValues && currentQ.labValues.length > 0)) && (
        <div className={styles.clinicalBox}>
          {currentQ.vitals && (
            <div className={styles.vitalsBar}>
              <span className="text-xs font-bold text-slate-400 self-center uppercase mr-1">Patient Vitals:</span>
              {currentQ.vitals.bp && (
                <span className={styles.vitalPill}>
                  <span className={styles.vitalLabel}>BP:</span> {currentQ.vitals.bp}
                </span>
              )}
              {currentQ.vitals.hr && (
                <span className={styles.vitalPill}>
                  <span className={styles.vitalLabel}>HR:</span> {currentQ.vitals.hr}
                </span>
              )}
              {currentQ.vitals.rr && (
                <span className={styles.vitalPill}>
                  <span className={styles.vitalLabel}>RR:</span> {currentQ.vitals.rr}
                </span>
              )}
              {currentQ.vitals.spo2 && (
                <span className={styles.vitalPill}>
                  <span className={styles.vitalLabel}>SpO₂:</span> {currentQ.vitals.spo2}
                </span>
              )}
              {currentQ.vitals.temp && (
                <span className={styles.vitalPill}>
                  <span className={styles.vitalLabel}>Temp:</span> {currentQ.vitals.temp}
                </span>
              )}
            </div>
          )}

          {currentQ.labValues && currentQ.labValues.length > 0 && (
            <div className={styles.labTableWrapper}>
              <table className={styles.labTable}>
                <thead>
                  <tr>
                    <th>Diagnostic Test</th>
                    <th>Patient Value</th>
                    <th>Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQ.labValues.map((lab, lIdx) => (
                    <tr key={lIdx}>
                      <td className="font-medium text-slate-200">{lab.test}</td>
                      <td className={styles.labValueHighlight}>{lab.value}</td>
                      <td className="text-slate-500 font-mono">{lab.normal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Question Stem */}
      <div className={styles.questionStem}>{currentQ.stem}</div>

      {/* Options List */}
      <div className={styles.optionsList}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedAnswers[currentIndex] === idx;
          const isStruck = !isSubmitted && struckOptions[`${currentIndex}-${idx}`];

          let btnClass = styles.optionButton;
          if (isSubmitted) {
            if (idx === currentQ.correctIndex) {
              btnClass += ` ${styles.correctOption}`;
            } else if (isSelected) {
              btnClass += ` ${styles.incorrectOption}`;
            }
          } else if (isSelected) {
            btnClass += ` ${styles.selectedOption}`;
          }

          if (isStruck) {
            btnClass += ` ${styles.struckOption}`;
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={btnClass}
              disabled={isSubmitted}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className={styles.optionText}>{opt}</span>

              {!isSubmitted && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => toggleStrike(e, idx)}
                  className={styles.strikeButton}
                  title="Strike through option"
                >
                  {isStruck ? '↩ Undo' : '— Strike'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Review Mode / Rationales */}
      {isSubmitted && (
        <div className={styles.rationaleCard}>
          <div className="font-semibold text-white mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>High-Yield Physiological Mechanism & Pathophysiology:</span>
          </div>
          <p className="text-slate-300 mb-3 leading-relaxed">{currentQ.rationale}</p>

          {currentQ.clinicalPearl && (
            <div className={styles.clinicalPearlCard}>
              <span className="text-amber-400 font-bold">⭐ High-Yield Pearl:</span>
              <span>{currentQ.clinicalPearl}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Row */}
      <div className={styles.actionRow}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={styles.navButton}
          >
            ← Previous
          </button>
          {onExitExam && (
            <button
              onClick={onExitExam}
              className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Exit Exam
            </button>
          )}
        </div>

        {isSubmitted ? (
          <div className="text-sm font-semibold text-white">
            Score: {calculateFinalScore()} / {questions.length} (
            {Math.round((calculateFinalScore() / questions.length) * 100)}%)
          </div>
        ) : null}

        {currentIndex === questions.length - 1 ? (
          !isSubmitted ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className={styles.submitButton}
            >
              Submit Exam ({answeredCount}/{questions.length})
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(0)}
              className={styles.primaryButton}
            >
              Review from Start
            </button>
          )
        ) : (
          <button
            onClick={() =>
              setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
            }
            className={styles.primaryButton}
          >
            Next Question →
          </button>
        )}
      </div>

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Ready to Submit Examination?</h3>
            <p className="text-sm text-slate-300 mb-4">
              You have answered <strong className="text-blue-400">{answeredCount}</strong> of{' '}
              <strong>{questions.length}</strong> questions.
              {questions.length - answeredCount > 0 && (
                <span className="block mt-1 text-amber-400">
                  ⚠️ You still have {questions.length - answeredCount} unanswered questions.
                </span>
              )}
              {flaggedCount > 0 && (
                <span className="block mt-1 text-slate-400">
                  🔖 {flaggedCount} questions marked for review.
                </span>
              )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
              >
                Back to Exam
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinish();
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-600/25 transition"
              >
                Confirm & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
