'use client';

import React, { useState } from 'react';
import QuizRunner, { ExamSummaryData } from '@/components/exam/QuizRunner';
import ExamSummaryView from '@/components/exam/ExamSummaryView';
import {
  EXAM_PRESETS,
  getQuestionsForPreset,
  ExtendedQuizQuestion,
} from '@/lib/competencies/clinicalExamQuestions';
import { NMC_COMPETENCIES } from '@/lib/competencies/nmcMapping';
import styles from './ExamPage.module.css';

export default function ClinicalExamPage() {
  const [examState, setExamState] = useState<'setup' | 'running' | 'summary'>('setup');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('full-simulation');
  const [summaryData, setSummaryData] = useState<ExamSummaryData | null>(null);

  const currentPreset = EXAM_PRESETS.find((p) => p.id === selectedPresetId) || EXAM_PRESETS[0];
  const questions: ExtendedQuizQuestion[] = getQuestionsForPreset(selectedPresetId);

  const handleStartExam = () => {
    setSummaryData(null);
    setExamState('running');
  };

  const handleFinishExam = (
    _score: number,
    _total: number,
    _breakdown: any,
    fullData?: ExamSummaryData
  ) => {
    if (fullData) {
      setSummaryData(fullData);
    }
    setExamState('summary');
  };

  const handleRetakeExam = () => {
    setExamState('running');
  };

  const handleChoosePreset = () => {
    setExamState('setup');
  };

  const allCompetencyCodes = ['PY1.1', 'PY1.3', 'PY3.1', 'PY5.1', 'PY5.2', 'PY6.1', 'PY6.2', 'PY7.1'];

  return (
    <div className={styles.pageContainer}>
      <main className={styles.contentWrapper}>
        {examState === 'setup' && (
          <div>
            {/* Header Hero */}
            <div className={styles.heroHeader}>
              <div className={styles.heroBadge}>
                <span>🩺</span>
                <span>NMC CBME & USMLE Step 1 Clinical Assessment Suite</span>
              </div>
              <h1 className={styles.heroTitle}>Clinical Physiology Examination</h1>
              <p className={styles.heroSubtitle}>
                Master high-yield clinical vignettes, complex hemodynamic loops, and membrane dynamics under timed board examination conditions with instant CBME competency mastery analytics.
              </p>
            </div>

            {/* Exam Preset Selection */}
            <div className={styles.presetGrid}>
              {EXAM_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`${styles.presetCard} ${isSelected ? styles.presetCardSelected : ''}`}
                  >
                    <div>
                      <span className={styles.presetBadge}>{preset.badge}</span>
                      <h2 className={styles.presetTitle}>{preset.title}</h2>
                      <p className={styles.presetDescription}>{preset.description}</p>
                    </div>

                    <div className={styles.presetMeta}>
                      <span>⏱️ {Math.round(preset.durationSeconds / 60)} Minutes</span>
                      <span>📝 {preset.questionCount} Vignettes</span>
                    </div>
                  </div>
                );
              })}
              
              {/* Custom Exam Builder Card */}
              <a
                href="/exam/builder"
                className={`${styles.presetCard} hover:bg-slate-800/80 transition`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <span className={styles.presetBadge} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.2)' }}>🛠️ Build Custom Exam</span>
                  <h2 className={styles.presetTitle}>Custom Exam Builder</h2>
                  <p className={styles.presetDescription}>Tailor a clinical examination session to your specific study goals, topics, and difficulty.</p>
                </div>
                <div className={styles.presetMeta} style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  <span>Build Exam →</span>
                </div>
              </a>
            </div>

            {/* NMC CBME Competencies Covered */}
            <div className={styles.competencySection}>
              <h2 className={styles.sectionHeading}>Target NMC CBME Competencies (MBBS Curriculum)</h2>
              <p className={styles.sectionSubheading}>
                Every question is mapped to National Medical Commission physiology competency standards with clinical validation:
              </p>

              <div className={styles.competencyGrid}>
                {allCompetencyCodes.map((code) => {
                  const comp = NMC_COMPETENCIES[code];
                  return (
                    <div key={code} className={styles.competencyItem}>
                      <span className={styles.compCode}>{code}</span>
                      <h3 className={styles.compTopic}>{comp ? comp.topic : code}</h3>
                      <span className={styles.compSystem}>{comp ? comp.system : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Action */}
            <div className={styles.launchBar}>
              <button onClick={handleStartExam} className={styles.launchButton}>
                <span>🚀 Launch {currentPreset.title}</span>
              </button>
            </div>
          </div>
        )}

        {examState === 'running' && (
          <QuizRunner
            examTitle={currentPreset.title}
            durationSeconds={currentPreset.durationSeconds}
            questions={questions}
            onFinishExam={handleFinishExam}
            onExitExam={() => setExamState('setup')}
          />
        )}

        {examState === 'summary' && summaryData && (
          <ExamSummaryView
            summaryData={summaryData}
            onRetakeExam={handleRetakeExam}
            onChoosePreset={handleChoosePreset}
          />
        )}
      </main>
    </div>
  );
}
