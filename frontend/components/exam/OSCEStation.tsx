"use client";
import React, { useState, useEffect } from 'react';
import styles from './OSCEStation.module.css';

interface ChecklistItem {
  id: string;
  text: string;
  marks: number;
}

interface OSCEStationProps {
  station: {
    id: string;
    title: string;
    domain: string;
    description: string;
    scenario_json: any;
    checklist_json: ChecklistItem[];
    time_limit_minutes: number;
    passing_score_pct: number;
    difficulty: string;
  };
}

export default function OSCEStation({ station }: OSCEStationProps) {
  const [timeLeft, setTimeLeft] = useState(station.time_limit_minutes * 60);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const toggleCheck = (id: string) => {
    if (submitted) return;
    const next = new Set(checkedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedItems(next);
  };

  const totalPossible = station.checklist_json.reduce((sum, item) => sum + item.marks, 0);
  const currentScore = station.checklist_json.reduce((sum, item) => {
    return checkedItems.has(item.id) ? sum + item.marks : sum;
  }, 0);
  const scorePct = totalPossible > 0 ? (currentScore / totalPossible) * 100 : 0;
  const passed = scorePct >= station.passing_score_pct;

  const handleSubmit = async () => {
    setSubmitted(true);
    // In real app, POST to /api/v1/exam/osce/submit
    console.log('Submitting OSCE result:', { stationId: station.id, scorePct, passed });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{station.title}</h2>
          <div className={styles.meta}>
            <span className={styles.badge}>{station.domain}</span>
            <span className={styles.badge}>{station.difficulty}</span>
          </div>
        </div>
        <div className={styles.timer}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.scenarioPanel}>
          <h3>Scenario</h3>
          <p>{station.description}</p>
          <div className={styles.scenarioDetails}>
            {station.scenario_json?.instructions || JSON.stringify(station.scenario_json)}
          </div>
        </div>

        <div className={styles.checklistPanel}>
          <div className={styles.checklistHeader}>
            <h3>Checklist</h3>
            <span className={styles.scoreTally}>Score: {currentScore} / {totalPossible}</span>
          </div>
          
          <ul className={styles.list}>
            {station.checklist_json.map(item => (
              <li key={item.id} className={styles.listItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={checkedItems.has(item.id)}
                    onChange={() => toggleCheck(item.id)}
                    disabled={submitted}
                    className={styles.checkbox}
                  />
                  <span className={styles.itemText}>{item.text}</span>
                  <span className={styles.itemMarks}>({item.marks} pts)</span>
                </label>
              </li>
            ))}
          </ul>

          {!submitted ? (
            <button className={styles.submitBtn} onClick={handleSubmit}>
              Submit Station
            </button>
          ) : (
            <div className={`${styles.result} ${passed ? styles.pass : styles.fail}`}>
              <h4>{passed ? 'Pass' : 'Fail'}</h4>
              <p>Final Score: {scorePct.toFixed(1)}% (Required: {station.passing_score_pct}%)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
