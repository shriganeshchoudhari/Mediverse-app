'use client';

import React, { useState, useMemo } from 'react';
import styles from './VeterinarySurgeryStation.module.css';

interface SurgeryCase {
  id: string;
  name: string;
  species: string;
  tier: string;
  presentation: string;
  anesthesiaRules: string;
  vitals: { hr: string; rr: string; map: string };
  steps: Array<{ stepNumber: number; title: string; instruction: string; trap: string }>;
}

const SURGERY_CASES: SurgeryCase[] = [
  {
    id: 'canine-gdv',
    name: 'Canine Gastric Dilatation-Volvulus (GDV)',
    species: 'Canine (Large/Giant Breeds — Great Dane, German Shepherd)',
    tier: 'Immediate Surgical Emergency',
    presentation: 'Non-productive retching, progressive abdominal distension, severe hypovolemic/obstructive shock, tachycardia, splenic congestion.',
    anesthesiaRules: 'Preoxygenation, rapid sequence induction with Fentanyl/Ketamine/Midazolam (avoid pure mu-opioid high dose with bradycardia; avoid nitrous oxide N2O which diffuses into gas-distended stomach).',
    vitals: { hr: '120 - 180 bpm (Watch for VPC arrhythmias)', rr: '20 - 40 bpm', map: '60 - 80 mmHg' },
    steps: [
      { stepNumber: 1, title: 'Emergency Decompression & Fluid Resuscitation', instruction: 'Place large-bore IV catheters in cephalic/jugular veins (not saphenous due to caudal vena cava compression). Percutaneous 14G catheter gastrocentesis on right paracostal wall.', trap: 'Inducing general anesthesia before fluid resuscitation and decompression leads to cardiovascular collapse.' },
      { stepNumber: 2, title: 'Surgical Derotation of Clockwise Volvulus', instruction: 'Cranial-to-pubic midline celiotomy. Locate greater omentum covering stomach (pathognomonic of clockwise rotation). Push fundus dorsal while pulling pylorus ventral and to the right.', trap: 'Rough manipulation can rupture ischemic gastric wall or splenic vessels.' },
      { stepNumber: 3, title: 'Gastric & Splenic Viability Assessment', instruction: 'Inspect stomach wall for full-thickness necrosis (palpate wall thickness, assess bleeding on incision, check serosal color). Perform partial gastrectomy if non-viable. Evaluate spleen for thrombosis.', trap: 'Failing to resect necrotic gastric fundus leads to postoperative perforation and septic peritonitis.' },
      { stepNumber: 4, title: 'Incisional Right-Side Gastropexy', instruction: 'Create a 4-5cm incision through seromuscular layer of pyloric antrum and corresponding transversus abdominis muscle on right body wall. Suture antral edges to abdominal wall with 2-0 PDS continuous pattern.', trap: 'Suturing to diaphragm or creating pexy under excessive tension.' }
    ]
  },
  {
    id: 'bovine-rumenotomy',
    name: 'Bovine Rumenotomy (Hardware Disease / Traumatic Reticuloperitonitis)',
    species: 'Bovine (Dairy & Beef Cattle)',
    tier: 'Urgent Farm Surgery',
    presentation: 'Anorexia, arched back stance, reluctance to move, positive grunt test on withers pinch, low-grade fever, reduced milk yield.',
    anesthesiaRules: 'Standing surgery: Left paralumbar fossa infiltration (Distal/Proximal paravertebral nerve block T13, L1, L2 or inverted L-block) with 2% Lignocaine.',
    vitals: { hr: '60 - 80 bpm', rr: '15 - 30 bpm', map: '70 - 90 mmHg' },
    steps: [
      { stepNumber: 1, title: 'Left Paralumbar Fossa Laparotomy', instruction: 'Vertical 20-25cm incision centered in left paralumbar fossa, 5cm caudal to last rib. Incise skin, external abdominal oblique, internal abdominal oblique, transversus abdominis, and peritoneum.', trap: 'Inadvertently cutting into rumen before placing fixation drape or ring.' },
      { stepNumber: 2, title: 'Rumen Fixation & Sealing (Weingart Frame / Skin Suture)', instruction: 'Exteriorize visceral wall of rumen and secure to skin using continuous Cushing suture or Weingart rumenotomy ring to create liquid-tight seal preventing peritoneal contamination.', trap: 'Rumen liquid leakage into peritoneal cavity causes severe diffuse chemical peritonitis.' },
      { stepNumber: 3, title: 'Forestomach Exploration & Foreign Body Retrieval', instruction: 'Vertical incision in rumen. Siphon gas and evacuate fibrous mat. Insert arm cranio-ventrally into reticulum, feeling honeycomb cells for penetrating wire/nails; remove reticular magnet and replace.', trap: 'Missing a foreign body buried deep inside mucosal folds.' },
      { stepNumber: 4, title: 'Two-Layer Rumen Closure & Wall Decontamination', instruction: 'Invert rumen mucosa using two inverting continuous suture lines (Cushing followed by Lembert with #2 Chromic catgut or PDS). Wash exteriorized rumen wall before releasing into abdomen.', trap: 'Leaving un-inverted mucosal edges prone to leakage.' }
    ]
  }
];

export default function VeterinarySurgeryStation() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('canine-gdv');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const currentCase = useMemo(() => {
    return SURGERY_CASES.find(c => c.id === selectedCaseId) || SURGERY_CASES[0];
  }, [selectedCaseId]);

  const handleToggleStep = (stepIdx: number) => {
    const key = `${selectedCaseId}-${stepIdx}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const progress = useMemo(() => {
    const total = currentCase.steps.length;
    const completed = currentCase.steps.filter((_, idx) => completedSteps[`${selectedCaseId}-${idx}`]).length;
    const pct = Math.round((completed / total) * 100);
    return { completed, total, pct };
  }, [currentCase, completedSteps, selectedCaseId]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Veterinary Emergency Surgery & GDV / Colic Station</h2>
        <p className={styles.subtitle}>
          Interactive high-stakes small and large animal surgical emergency workflows: step-by-step procedure checks, anesthetic considerations, and intraoperative safety traps.
        </p>
      </header>

      {/* Case Selector Tabs */}
      <div className={styles.caseTabs}>
        {SURGERY_CASES.map(c => (
          <button
            key={c.id}
            className={`${styles.caseBtn} ${selectedCaseId === c.id ? styles.activeCaseBtn : ''}`}
            onClick={() => setSelectedCaseId(c.id)}
          >
            <strong>{c.name}</strong>
            <small>{c.species.split('(')[0]}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Surgical Workflow Checklist */}
        <div className={styles.stepsCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.caseHeading}>{currentCase.name}</h3>
                <span className={styles.speciesTag}>🐾 {currentCase.species}</span>
              </div>
              <div className={styles.progressBox}>
                <strong>{progress.pct}%</strong>
                <small>{progress.completed}/{progress.total} Steps</small>
              </div>
            </div>

            <div className={styles.stepsList}>
              {currentCase.steps.map((step, idx) => {
                const isDone = !!completedSteps[`${selectedCaseId}-${idx}`];
                return (
                  <div key={idx} className={`${styles.stepCard} ${isDone ? styles.stepDone : ''}`}>
                    <div className={styles.stepTop}>
                      <label className={styles.stepCheckboxLabel}>
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => handleToggleStep(idx)}
                          className={styles.checkbox}
                        />
                        <span className={styles.stepTitle}>Step {step.stepNumber}: {step.title}</span>
                      </label>
                    </div>
                    <p className={styles.stepInstruction}>{step.instruction}</p>
                    <div className={styles.trapAlert}>
                      ⚠️ <strong>Surgical Trap:</strong> {step.trap}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Anesthesia & Telemetry Dashboard */}
        <div className={styles.telemetryCol}>
          {/* Anesthetic Management */}
          <div className={styles.card}>
            <h4 className={styles.cardSubheading}>Anesthetic Protocol & Rules</h4>
            <p className={styles.anesthesiaText}>{currentCase.anesthesiaRules}</p>
          </div>

          {/* Species-Specific Telemetry Targets */}
          <div className={styles.card}>
            <h4 className={styles.cardSubheading}>Intraoperative Target Telemetry</h4>
            <div className={styles.vitalGrid}>
              <div className={styles.vitalBox}>
                <span className={styles.vitalVal}>{currentCase.vitals.hr}</span>
                <span className={styles.vitalLabel}>Heart Rate</span>
              </div>
              <div className={styles.vitalBox}>
                <span className={styles.vitalVal}>{currentCase.vitals.rr}</span>
                <span className={styles.vitalLabel}>Respiratory Rate</span>
              </div>
              <div className={styles.vitalBox}>
                <span className={styles.vitalVal}>{currentCase.vitals.map}</span>
                <span className={styles.vitalLabel}>Mean Arterial Pressure</span>
              </div>
            </div>
          </div>

          {/* Presentation summary */}
          <div className={styles.presentationCard}>
            🩺 <strong>Clinical Presentation:</strong>
            <p>{currentCase.presentation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
