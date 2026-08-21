'use client';

import React, { useState, useMemo } from 'react';
import styles from './PrakritiAssessmentViewer.module.css';
import { PRAKRITI_QUESTIONS } from '@/lib/ayush/PrakritiAnalysisPresets';

type DoshaType = 'vata' | 'pitta' | 'kapha';

export default function PrakritiAssessmentViewer() {
  const [answers, setAnswers] = useState<Record<string, DoshaType>>({});
  const [activeTab, setActiveTab] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'All' },
    { id: 'physical', label: 'Physical Structure' },
    { id: 'physiological', label: 'Physiological Function' },
    { id: 'psychological', label: 'Psychological Traits' }
  ];

  const filteredQuestions = useMemo(() => {
    if (activeTab === 'All') return PRAKRITI_QUESTIONS;
    return PRAKRITI_QUESTIONS.filter(q => q.category === activeTab);
  }, [activeTab]);

  const handleAnswer = (qId: string, dosha: DoshaType) => {
    setAnswers(prev => ({ ...prev, [qId]: dosha }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = PRAKRITI_QUESTIONS.length;
  const progress = (answeredCount / totalCount) * 100;

  const results = useMemo(() => {
    let v = 0, p = 0, k = 0;
    Object.values(answers).forEach(ans => {
      if (ans === 'vata') v++;
      if (ans === 'pitta') p++;
      if (ans === 'kapha') k++;
    });
    
    const total = v + p + k || 1;
    return {
      vata: (v / total) * 100,
      pitta: (p / total) * 100,
      kapha: (k / total) * 100
    };
  }, [answers]);

  const getDominantPrakriti = () => {
    if (answeredCount === 0) return 'Take Assessment';
    
    const max = Math.max(results.vata, results.pitta, results.kapha);
    let dominant: string[] = [];
    if (results.vata >= max - 10) dominant.push('Vata');
    if (results.pitta >= max - 10) dominant.push('Pitta');
    if (results.kapha >= max - 10) dominant.push('Kapha');

    if (dominant.length === 3) return 'Sama Prakriti (Balanced)';
    if (dominant.length === 2) return `${dominant[0]}-${dominant[1]} Dvandvaja Prakriti`;
    return `${dominant[0]} Pradhana`;
  };

  const handlePreset = (type: string) => {
    const newAnswers: Record<string, DoshaType> = {};
    PRAKRITI_QUESTIONS.forEach((q, idx) => {
      if (type === 'vata') newAnswers[q.id] = 'vata';
      if (type === 'pitta') newAnswers[q.id] = 'pitta';
      if (type === 'kapha') newAnswers[q.id] = 'kapha';
      if (type === 'sama') {
        const d = ['vata', 'pitta', 'kapha'][idx % 3] as DoshaType;
        newAnswers[q.id] = d;
      }
    });
    setAnswers(newAnswers);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Prakriti Assessment Viewer</h2>

      {/* Progress */}
      <div className={styles.progressSection}>
        <div className={styles.progressText}>{answeredCount} / {totalCount} answered</div>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Questionnaire */}
        <div className={styles.questionnaire}>
          <div className={styles.tabs}>
            {categories.map(cat => (
              <button 
                key={cat.id} 
                className={`${styles.tabBtn} ${activeTab === cat.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.questionList}>
            {filteredQuestions.map((q, idx) => (
              <div key={q.id} className={styles.questionCard}>
                <div className={styles.qHeader}>
                  <span className={styles.qIndex}>Q{idx + 1}</span>
                  <p className={styles.qText}>{q.questionText}</p>
                </div>
                <div className={styles.optionsGrid}>
                  {(['vata', 'pitta', 'kapha'] as DoshaType[]).map(dosha => (
                    <button
                      key={dosha}
                      className={`${styles.optionBtn} ${styles[dosha]} ${answers[q.id] === dosha ? styles.selectedOption : ''}`}
                      onClick={() => handleAnswer(q.id, dosha)}
                    >
                      <span className={styles.doshaTag}>{dosha.toUpperCase()}</span>
                      <p>{q.options[dosha]}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results / Inspector Panel */}
        <div className={styles.inspector}>
          <h3>Constitution Results</h3>
          <div className={styles.dominantBadge}>{getDominantPrakriti()}</div>

          <div className={styles.dialsSection}>
            <div className={styles.dialItem}>
              <span className={styles.vataText}>Vata:</span>
              <div className={styles.dialBar}>
                <div className={styles.vataFill} style={{ width: `${results.vata}%` }}></div>
              </div>
              <span>{results.vata.toFixed(1)}%</span>
            </div>

            <div className={styles.dialItem}>
              <span className={styles.pittaText}>Pitta:</span>
              <div className={styles.dialBar}>
                <div className={styles.pittaFill} style={{ width: `${results.pitta}%` }}></div>
              </div>
              <span>{results.pitta.toFixed(1)}%</span>
            </div>

            <div className={styles.dialItem}>
              <span className={styles.kaphaText}>Kapha:</span>
              <div className={styles.dialBar}>
                <div className={styles.kaphaFill} style={{ width: `${results.kapha}%` }}></div>
              </div>
              <span>{results.kapha.toFixed(1)}%</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className={styles.presetsSection}>
            <h4>Quick Presets</h4>
            <div className={styles.presetButtons}>
              <button onClick={() => handlePreset('vata')} className={styles.presetBtn}>Vata Dominant</button>
              <button onClick={() => handlePreset('pitta')} className={styles.presetBtn}>Pitta Dominant</button>
              <button onClick={() => handlePreset('kapha')} className={styles.presetBtn}>Kapha Dominant</button>
              <button onClick={() => handlePreset('sama')} className={styles.presetBtn}>Sama (Balanced)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
