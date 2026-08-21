'use client';

import React, { useState, useMemo } from 'react';
import styles from './ADRAssessor.module.css';
import {
  NARANJO_QUESTIONS,
  calculateNaranjoScore,
  ADR_CASE_STUDIES
} from '@/lib/pharmacy/PharmacovigilancePresets';

type AnswerType = 'yes' | 'no' | 'unknown';

export default function ADRAssessor() {
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({});
  const [selectedCaseId, setSelectedCaseId] = useState<string>('custom');

  const handleAnswerChange = (questionId: number, value: AnswerType) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    if (caseId === 'custom') {
      setAnswers({});
    } else {
      const found = ADR_CASE_STUDIES.find(c => c.id === caseId);
      if (found) {
        setAnswers(found.expectedNaranjoAnswers);
      }
    }
  };

  const currentCase = useMemo(() => {
    return ADR_CASE_STUDIES.find(c => c.id === selectedCaseId);
  }, [selectedCaseId]);

  const scoreResult = useMemo(() => {
    return calculateNaranjoScore(answers);
  }, [answers]);

  const categoryColor = useMemo(() => {
    switch (scoreResult.probabilityCategory) {
      case 'Definite': return 'red';
      case 'Probable': return 'orange';
      case 'Possible': return 'amber';
      default: return 'blue';
    }
  }, [scoreResult]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Pharmacovigilance & ADR Causality Assessor</h2>
        <p className={styles.subtitle}>
          Standardized Naranjo Adverse Drug Reaction Probability Scale and WHO-UMC causality algorithm for pharmacovigilance reporting.
        </p>
      </header>

      {/* Case Study Bar */}
      <div className={styles.caseStudyBar}>
        <span className={styles.barLabel}>Clinical Case Studies:</span>
        <button
          className={`${styles.caseBtn} ${selectedCaseId === 'custom' ? styles.activeCase : ''}`}
          onClick={() => handleCaseSelect('custom')}
        >
          Blank Form (Custom Patient)
        </button>
        {ADR_CASE_STUDIES.map(c => (
          <button
            key={c.id}
            className={`${styles.caseBtn} ${selectedCaseId === c.id ? styles.activeCase : ''}`}
            onClick={() => handleCaseSelect(c.id)}
          >
            {c.title}
          </button>
        ))}
      </div>

      {currentCase && (
        <div className={styles.caseDetailsCard}>
          <div className={styles.caseHeader}>
            <span className={styles.caseTitle}>{currentCase.title}</span>
            <span className={styles.meddraBadge}>MedDRA: {currentCase.medDRATerm}</span>
          </div>
          <p className={styles.caseNarrative}>
            <strong>Patient Narrative:</strong> {currentCase.clinicalNarrative}
          </p>
          <div className={styles.caseTags}>
            <span><strong>Suspect Drug:</strong> {currentCase.suspectDrug}</span>
            <span><strong>Adverse Event:</strong> {currentCase.adverseEvent}</span>
            <span><strong>Age/Sex:</strong> {currentCase.patientAge}yo / {currentCase.gender}</span>
          </div>
        </div>
      )}

      <div className={styles.layout}>
        {/* Naranjo Questionnaire */}
        <div className={styles.formSection}>
          <div className={styles.questionsList}>
            {NARANJO_QUESTIONS.map(q => (
              <div key={q.id} className={styles.questionCard}>
                <div className={styles.questionText}>
                  <span className={styles.qNumber}>Q{q.id}.</span>
                  <span>{q.question}</span>
                </div>
                <div className={styles.options}>
                  <button
                    className={`${styles.optionBtn} ${answers[q.id] === 'yes' ? styles.activeYes : ''}`}
                    onClick={() => handleAnswerChange(q.id, 'yes')}
                  >
                    Yes ({q.yesScore > 0 ? `+${q.yesScore}` : q.yesScore})
                  </button>
                  <button
                    className={`${styles.optionBtn} ${answers[q.id] === 'no' ? styles.activeNo : ''}`}
                    onClick={() => handleAnswerChange(q.id, 'no')}
                  >
                    No ({q.noScore > 0 ? `+${q.noScore}` : q.noScore})
                  </button>
                  <button
                    className={`${styles.optionBtn} ${answers[q.id] === 'unknown' ? styles.activeUnknown : ''}`}
                    onClick={() => handleAnswerChange(q.id, 'unknown')}
                  >
                    Do Not Know (0)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results & Pharmacovigilance Panel */}
        <div className={styles.resultSection}>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>Naranjo Probability Score</span>
            <div className={styles.scoreVal}>{scoreResult.totalScore}</div>
            <div className={`${styles.categoryBadge} ${styles[categoryColor]}`}>
              {scoreResult.probabilityCategory} ADR
            </div>
            <p className={styles.scoreExplanation}>
              {scoreResult.probabilityCategory === 'Definite' && 'Strong causal link (Score ≥ 9). De-challenge and re-challenge or objective verification confirm drug causality.'}
              {scoreResult.probabilityCategory === 'Probable' && 'Likely causal link (Score 5-8). Event followed reasonable temporal sequence and improved on de-challenge.'}
              {scoreResult.probabilityCategory === 'Possible' && 'Possible causal link (Score 1-4). Event followed temporal sequence but could also be explained by disease.'}
              {scoreResult.probabilityCategory === 'Doubtful' && 'Doubtful causal link (Score ≤ 0). Unlikely to be related to the suspected medication.'}
            </p>
          </div>

          <div className={styles.infoCard}>
            <h4 className={styles.cardHeading}>WHO-UMC Causality Scale Equivalent</h4>
            <div className={styles.whoScale}>
              <div className={styles.whoRow}>
                <span>Definite (≥9):</span> <strong>Certain</strong>
              </div>
              <div className={styles.whoRow}>
                <span>Probable (5-8):</span> <strong>Probable / Likely</strong>
              </div>
              <div className={styles.whoRow}>
                <span>Possible (1-4):</span> <strong>Possible</strong>
              </div>
              <div className={styles.whoRow}>
                <span>Doubtful (≤0):</span> <strong>Unlikely</strong>
              </div>
            </div>
          </div>

          <div className={styles.pvActionCard}>
            <h4 className={styles.cardHeading}>Pharmacovigilance (PvPI) Action Protocol</h4>
            <ul className={styles.actionList}>
              <li>Submit Individual Case Safety Report (ICSR) to Pharmacovigilance Programme of India (PvPI).</li>
              <li>Document exact lot number, expiry date, dose regimen, and concomitant medications.</li>
              <li>Perform therapeutic de-challenge monitoring where clinically indicated.</li>
              <li>Notify hospital Drug Safety & Therapeutics Committee (DTC).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
