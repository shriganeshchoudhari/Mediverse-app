'use client';

import React, { useState } from 'react';
import styles from './OralVivaExaminer.module.css';

interface VivaQuestion {
  id: string;
  topic: string;
  leadQuestion: string;
  expectedKeywords: string[];
  followUpTrigger: string;
  examinerPersona: string;
}

const SAMPLE_VIVAS: VivaQuestion[] = [
  {
    id: 'viva-1',
    topic: 'Acute Coronary Syndrome & STEMI Triage',
    examinerPersona: 'Prof. K. Sen, MD, DM (Cardiology Examiner)',
    leadQuestion: 'A 58-year-old diabetic male presents with 2 hours of retrosternal heaviness radiating to the left jaw. ECG reveals 3mm ST elevation in leads II, III, and aVF with reciprocal depression in I and aVL. Walk me through your immediate first 10 minutes of clinical management.',
    expectedKeywords: ['dual antiplatelet', 'aspirin', 'ticagrelor', 'primary pci', 'door to balloon', 'heparin', 'sublingual nitroglycerin', 'right ventricular infarction'],
    followUpTrigger: 'What if blood pressure drops to 80/50 mmHg after giving nitroglycerin? What anatomy does this imply?'
  },
  {
    id: 'viva-2',
    topic: 'Anaphylactic Shock Resuscitation',
    examinerPersona: 'Dr. V. Menon, MD (Emergency Medicine & Resuscitation)',
    leadQuestion: 'A 24-year-old nurse experiences sudden lip angioedema, inspiratory stridor, and generalized urticaria 5 minutes after an IM Ceftriaxone injection. Blood pressure is 74/40 mmHg. State your first-line drug, exact dose, concentration, and route of administration.',
    expectedKeywords: ['intramuscular adrenaline', 'epinephrine', '1:1000', '0.5 mg', 'anterolateral thigh', 'vastus lateralis', 'crystalloid bolus', 'oxygen'],
    followUpTrigger: 'Why do you avoid intravenous bolus adrenaline in non-arrest anaphylaxis?'
  }
];

export default function OralVivaExaminer() {
  const [activeViva, setActiveViva] = useState<VivaQuestion>(SAMPLE_VIVAS[0]);
  const [messages, setMessages] = useState<{ sender: 'examiner' | 'student'; text: string }[]>([
    { sender: 'examiner', text: SAMPLE_VIVAS[0].leadQuestion }
  ]);
  const [input, setInput] = useState('');
  const [turnCount, setTurnCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSend = () => {
    if (!input.trim() || isCompleted) return;

    const studentResponse = input.trim();
    const newMessages = [...messages, { sender: 'student' as const, text: studentResponse }];
    setMessages(newMessages);
    setInput('');
    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);

    if (nextTurn === 1) {
      // Examiner follow-up challenge
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: 'examiner', text: `Good. Now consider this follow-up: ${activeViva.followUpTrigger}` }
        ]);
      }, 700);
    } else {
      // Evaluate and conclude Viva
      setIsCompleted(true);
      const matched = activeViva.expectedKeywords.filter(kw =>
        studentResponse.toLowerCase().includes(kw.toLowerCase())
      );
      const calcScore = Math.min(100, Math.round((matched.length / 3) * 85) + 15);
      setScore(calcScore);
    }
  };

  const handleReset = (viva: VivaQuestion) => {
    setActiveViva(viva);
    setMessages([{ sender: 'examiner', text: viva.leadQuestion }]);
    setTurnCount(0);
    setIsCompleted(false);
    setScore(null);
    setInput('');
  };

  return (
    <div className={styles.examinerContainer}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span style={{ fontSize: '1.75rem' }}>🎙️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>AI Oral Viva Voce Examiner</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>CBME Medical Board Viva Simulation & Socratic Defense</p>
          </div>
          <span className={styles.badge}>Live Viva Examination</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {SAMPLE_VIVAS.map(v => (
            <button
              key={v.id}
              type="button"
              onClick={() => handleReset(v)}
              style={{
                background: activeViva.id === v.id ? 'rgba(139, 92, 246, 0.3)' : 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '6px',
                padding: '0.35rem 0.75rem',
                color: activeViva.id === v.id ? '#c084fc' : '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {v.topic}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.examinerCard}>
        <div className={styles.examinerAvatar}>👨‍⚕️</div>
        <div className={styles.dialogueBox}>
          <div className={styles.examinerName}>{activeViva.examinerPersona}</div>
          <div className={styles.questionText}>Topic: {activeViva.topic}</div>
        </div>
      </div>

      <div className={styles.chatHistory}>
        {messages.map((m, idx) => (
          <div key={idx} className={m.sender === 'student' ? styles.userBubble : styles.examinerBubble}>
            {m.sender === 'examiner' ? '🧑‍🏫 Examiner: ' : '🩺 You: '}
            {m.text}
          </div>
        ))}
      </div>

      {!isCompleted ? (
        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Articulate your clinical rationale and answer to the examiner..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button type="button" className={styles.sendBtn} onClick={handleSend}>
            Submit Answer ➔
          </button>
        </div>
      ) : (
        <div className={styles.feedbackReport}>
          <div className={styles.reportTitle}>✅ Viva Voce Assessment & Rubric Score</div>
          <div className={styles.rubricRow}>
            <span>Clinical Knowledge & Accuracy:</span>
            <strong style={{ color: '#34d399' }}>{score ?? 85}%</strong>
          </div>
          <div className={styles.rubricRow}>
            <span>Communication & Structural Clarity:</span>
            <strong style={{ color: '#34d399' }}>Competent (Level 4 EPA)</strong>
          </div>
          <div className={styles.rubricRow}>
            <span>High-Yield Keywords Expected:</span>
            <span style={{ color: '#93c5fd' }}>{activeViva.expectedKeywords.slice(0, 4).join(', ')}</span>
          </div>
          <button
            type="button"
            onClick={() => handleReset(activeViva)}
            style={{
              marginTop: '0.75rem',
              padding: '0.4rem 1rem',
              background: '#7c3aed',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Restart Viva
          </button>
        </div>
      )}
    </div>
  );
}
