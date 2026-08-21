'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './OSCENursingStation.module.css';

interface OSCEStationDef {
  id: string;
  stationNumber: number;
  title: string;
  durationMinutes: number;
  scenario: string;
  checklist: Array<{ id: string; step: string; isCritical: boolean; maxScore: number }>;
}

const OSCE_STATIONS: OSCEStationDef[] = [
  {
    id: 'med-safety',
    stationNumber: 1,
    title: 'High-Alert Medication Safety & 10 Rights Check',
    durationMinutes: 7,
    scenario: 'You are assigned to administer IV Regular Insulin 10 Units to a patient with Diabetic Ketoacidosis (DKA). Perform complete safety verification.',
    checklist: [
      { id: 'ms1', step: 'Perform hand hygiene and identify patient using 2 unique identifiers (Name, MRN/DOB)', isCritical: true, maxScore: 2 },
      { id: 'ms2', step: 'Verify Physician order against Medication Administration Record (MAR)', isCritical: false, maxScore: 2 },
      { id: 'ms3', step: 'Verify "10 Rights of Medication Administration" (Patient, Drug, Dose, Route, Time, etc.)', isCritical: true, maxScore: 2 },
      { id: 'ms4', step: 'Identify Insulin as PINCH High-Alert medication & obtain independent 2nd-nurse double check', isCritical: true, maxScore: 2 },
      { id: 'ms5', step: 'Verify current blood glucose level before administration and calculate correct syringe units', isCritical: true, maxScore: 2 },
      { id: 'ms6', step: 'Educate patient on signs of hypoglycemia (sweating, tremors) and document time & site', isCritical: false, maxScore: 2 }
    ]
  },
  {
    id: 'trach-care',
    stationNumber: 2,
    title: 'Aseptic Tracheostomy Care & Suctioning',
    durationMinutes: 7,
    scenario: 'Patient with cuffed tracheostomy tube exhibits copious secretions and desaturation (SpO2 88%). Perform closed/open sterile suctioning.',
    checklist: [
      { id: 'tc1', step: 'Assess lung sounds, respiratory rate, and pre-oxygenate with 100% O2 for 1-2 mins', isCritical: true, maxScore: 2 },
      { id: 'tc2', step: 'Maintain strict sterile technique (sterile gloves, dominant hand sterile)', isCritical: true, maxScore: 2 },
      { id: 'tc3', step: 'Insert catheter without suction until resistance/carina is reached, then withdraw 1 cm', isCritical: false, maxScore: 2 },
      { id: 'tc4', step: 'Apply intermittent suction for MAXIMUM 10-15 seconds while rotating catheter outward', isCritical: true, maxScore: 2 },
      { id: 'tc5', step: 'Re-oxygenate patient and auscultate breath sounds to confirm airway clearance', isCritical: true, maxScore: 2 },
      { id: 'tc6', step: 'Clean inner cannula and stoma with normal saline and replace sterile dressing', isCritical: false, maxScore: 2 }
    ]
  },
  {
    id: 'foley-cath',
    stationNumber: 3,
    title: 'Aseptic Urinary (Foley) Catheterization',
    durationMinutes: 7,
    scenario: 'Post-operative patient with acute urinary retention (bladder scan >600 mL). Perform sterile urinary catheter insertion following CAUTI prevention guidelines.',
    checklist: [
      { id: 'fc1', step: 'Confirm physician order, position patient, and perform perineal hygiene', isCritical: false, maxScore: 2 },
      { id: 'fc2', step: 'Open sterile tray without contaminating sterile field and don sterile gloves', isCritical: true, maxScore: 2 },
      { id: 'fc3', step: 'Cleanse urethral meatus using povidone-iodine/chlorhexidine with front-to-back/circular technique', isCritical: true, maxScore: 2 },
      { id: 'fc4', step: 'Lubricate catheter tip (water-soluble) and advance until urine flashback + 2 cm further', isCritical: true, maxScore: 2 },
      { id: 'fc5', step: 'Inflate retention balloon with sterile water (NOT saline) and gently pull to seat at bladder neck', isCritical: true, maxScore: 2 },
      { id: 'fc6', step: 'Secure catheter to thigh with statlock and place drainage bag below bladder level without floor contact', isCritical: true, maxScore: 2 }
    ]
  },
  {
    id: 'blood-transfusion',
    stationNumber: 4,
    title: 'Blood Component Transfusion & Reaction Protocol',
    durationMinutes: 7,
    scenario: 'Administer 1 unit of Packed Red Blood Cells (PRBC) to a patient with severe anemia (Hb 6.2 g/dL). Monitor for transfusion reactions.',
    checklist: [
      { id: 'bt1', step: 'Verify informed consent and confirm dedicated 18-20G IV access with 0.9% Normal Saline', isCritical: true, maxScore: 2 },
      { id: 'bt2', step: 'Perform two-nurse bedside verification: Patient name, MRN, ABO/Rh type, donor unit number, expiration date', isCritical: true, maxScore: 2 },
      { id: 'bt3', step: 'Record baseline pre-transfusion vital signs immediately prior to starting infusion', isCritical: false, maxScore: 2 },
      { id: 'bt4', step: 'Start infusion slowly at 2 mL/min (approx 20-30 drops/min) and remain at bedside for first 15 mins', isCritical: true, maxScore: 2 },
      { id: 'bt5', step: 'Complete unit infusion within 4 hours maximum to prevent bacterial proliferation', isCritical: true, maxScore: 2 },
      { id: 'bt6', step: 'If reaction occurs (fever, chills, dyspnea): STOP infusion immediately, flush line with fresh NS, notify blood bank and doctor', isCritical: true, maxScore: 2 }
    ]
  }
];

export default function OSCENursingStation() {
  const [selectedStationId, setSelectedStationId] = useState<string>('med-safety');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(420); // 7 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const currentStation = useMemo(() => {
    return OSCE_STATIONS.find(s => s.id === selectedStationId) || OSCE_STATIONS[0];
  }, [selectedStationId]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStationChange = (id: string) => {
    setSelectedStationId(id);
    setCheckedSteps({});
    setTimerSeconds(420);
    setIsTimerRunning(false);
  };

  const handleToggleStep = (stepId: string) => {
    setCheckedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const scoreResults = useMemo(() => {
    let score = 0;
    let maxScore = 0;
    let failedCritical = false;

    currentStation.checklist.forEach(item => {
      maxScore += item.maxScore;
      if (checkedSteps[item.id]) {
        score += item.maxScore;
      } else if (item.isCritical) {
        failedCritical = true;
      }
    });

    const percentage = Math.round((score / (maxScore || 1)) * 100);
    const isPass = percentage >= 80 && !failedCritical;

    return { score, maxScore, percentage, failedCritical, isPass };
  }, [currentStation, checkedSteps]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>OSCE Nursing Skill Stations & Clinical Safety Checklists</h2>
        <p className={styles.subtitle}>
          Interactive Objective Structured Clinical Examination (OSCE) simulator with timer, critical safety trap alerts, and automated scoring rubric.
        </p>
      </header>

      {/* Station Selector Tabs */}
      <div className={styles.stationTabs}>
        {OSCE_STATIONS.map(s => (
          <button
            key={s.id}
            className={`${styles.stationTabBtn} ${selectedStationId === s.id ? styles.activeStation : ''}`}
            onClick={() => handleStationChange(s.id)}
          >
            <strong>Station {s.stationNumber}:</strong> {s.title}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Station Scenario & Checklist */}
        <div className={styles.leftSection}>
          {/* Scenario Banner */}
          <div className={styles.scenarioCard}>
            <div className={styles.scenarioTop}>
              <span className={styles.stationBadge}>STATION {currentStation.stationNumber} SCENARIO</span>
              <span className={styles.timeBadge}>⏱️ {currentStation.durationMinutes} Minutes</span>
            </div>
            <p className={styles.scenarioText}>{currentStation.scenario}</p>
          </div>

          {/* Checklist */}
          <div className={styles.checklistCard}>
            <h3 className={styles.cardHeading}>Procedural Step Checklist & Safety Actions</h3>
            <div className={styles.stepsList}>
              {currentStation.checklist.map((item, idx) => (
                <div
                  key={item.id}
                  className={`${styles.stepRow} ${checkedSteps[item.id] ? styles.stepChecked : ''}`}
                  onClick={() => handleToggleStep(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedSteps[item.id]}
                    onChange={() => {}}
                    className={styles.stepCheckbox}
                  />
                  <div className={styles.stepContent}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNum}>Step {idx + 1}</span>
                      {item.isCritical && <span className={styles.criticalBadge}>CRITICAL SAFETY STEP</span>}
                      <span className={styles.stepScore}>[{item.maxScore} pts]</span>
                    </div>
                    <p className={styles.stepDesc}>{item.step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Timer & Examiner Scoring */}
        <div className={styles.rightSection}>
          {/* Timer Card */}
          <div className={styles.timerCard}>
            <span className={styles.timerLabel}>OSCE Station Countdown Timer</span>
            <div className={`${styles.timerDisplay} ${timerSeconds < 60 ? styles.timerAlert : ''}`}>
              {formatTimer(timerSeconds)}
            </div>
            <div className={styles.timerControls}>
              <button
                className={styles.timerBtn}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? '⏸️ Pause' : '▶️ Start Station'}
              </button>
              <button
                className={styles.timerResetBtn}
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(420);
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Score Card */}
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>Examiner Rubric Score</span>
            <div className={styles.scoreNumber}>
              {scoreResults.score} <small>/ {scoreResults.maxScore}</small>
            </div>
            <div className={styles.percentText}>{scoreResults.percentage}% Competency Achieved</div>

            <div className={`${styles.resultBadge} ${scoreResults.isPass ? styles.passBadge : styles.failBadge}`}>
              {scoreResults.isPass ? '✅ PASS (Competent)' : '❌ NOT YET COMPETENT'}
            </div>

            {scoreResults.failedCritical && (
              <div className={styles.criticalAlert}>
                ⚠️ <strong>Automatic Fail:</strong> One or more mandatory critical safety steps were omitted.
              </div>
            )}

            <button
              className={styles.resetChecklistBtn}
              onClick={() => setCheckedSteps({})}
            >
              Clear Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
