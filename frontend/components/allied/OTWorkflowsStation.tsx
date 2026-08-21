'use client';

import React, { useState, useMemo } from 'react';
import styles from './OTWorkflowsStation.module.css';

interface ChecklistItem {
  id: string;
  text: string;
  responsible: string;
  checked: boolean;
}

interface ChecklistPhase {
  phase: string;
  timing: string;
  items: ChecklistItem[];
  trap: string;
}

const CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    phase: '1. Sign In (Before Induction of Anaesthesia)',
    timing: 'With at least nurse and anaesthetist present',
    items: [
      { id: 'si1', text: 'Patient has confirmed their identity, surgical site, and consent', responsible: 'Anaesthetist / Nurse', checked: false },
      { id: 'si2', text: 'Surgical site is marked / Not applicable', responsible: 'Nurse', checked: false },
      { id: 'si3', text: 'Anaesthesia machine & medication safety check completed', responsible: 'Anaesthetist', checked: false },
      { id: 'si4', text: 'Pulse oximeter on patient and functioning properly', responsible: 'Anaesthetist', checked: false },
      { id: 'si5', text: 'Does patient have known allergy? (Verified and tagged)', responsible: 'Anaesthetist', checked: false },
      { id: 'si6', text: 'Difficult airway / aspiration risk evaluated and equipment ready', responsible: 'Anaesthetist', checked: false }
    ],
    trap: 'Induction without confirming suction, difficult airway trolley, or blood crossmatch availability.'
  },
  {
    phase: '2. Time Out (Before Skin Incision)',
    timing: 'With all team members present (Surgeon, Anaesthetist, Scrub Nurse)',
    items: [
      { id: 'to1', text: 'Confirm all team members have introduced themselves by name and role', responsible: 'All Team Members', checked: false },
      { id: 'to2', text: 'Surgeon, anaesthetist & nurse verbally confirm patient name, site, and procedure', responsible: 'All Team Members', checked: false },
      { id: 'to3', text: 'Anticipated critical events: Surgeon reviews critical steps, duration & blood loss', responsible: 'Surgeon', checked: false },
      { id: 'to4', text: 'Anaesthetist reviews patient-specific concerns / hemodynamic stability', responsible: 'Anaesthetist', checked: false },
      { id: 'to5', text: 'Nursing team reviews sterility indicators and instrument availability', responsible: 'Scrub Nurse', checked: false },
      { id: 'to6', text: 'Prophylactic antibiotic administered within past 60 minutes', responsible: 'Anaesthetist', checked: false }
    ],
    trap: 'Incision made before verifying surgical site marking or before antibiotic has infused for 15+ minutes.'
  },
  {
    phase: '3. Sign Out (Before Patient Leaves Operating Room)',
    timing: 'With nurse, anaesthetist and surgeon present',
    items: [
      { id: 'so1', text: 'Nurse verbally confirms the exact name of the procedure recorded', responsible: 'Nurse', checked: false },
      { id: 'so2', text: 'Instrument, sponge, and needle counts are confirmed correct', responsible: 'Scrub Nurse', checked: false },
      { id: 'so3', text: 'Specimen labeling is read aloud (patient name, exact anatomical source)', responsible: 'Nurse', checked: false },
      { id: 'so4', text: 'Whether there are equipment problems to be addressed', responsible: 'All Team Members', checked: false },
      { id: 'so5', text: 'Surgeon, anaesthetist, and nurse review key concerns for post-op recovery', responsible: 'Surgeon / Anaesthetist', checked: false }
    ],
    trap: 'Closing fascia with an unresolved sponge/needle count discrepancy.'
  }
];

const STERILIZATION_METHODS = [
  { id: 'steam-134', name: 'Steam Autoclave (Porous Load)', temp: '134°C (273°F)', pressure: '2.1 bar (30 psi)', duration: '3.5 - 5 minutes', suitable: 'Stainless steel surgical instruments, metal trays, linen packs.' },
  { id: 'steam-121', name: 'Steam Autoclave (Standard Gravity)', temp: '121°C (250°F)', pressure: '1.1 bar (15 psi)', duration: '15 - 30 minutes', suitable: 'Rubber tubing, glassware, standard surgical supplies.' },
  { id: 'eto', name: 'Ethylene Oxide (ETO Gas)', temp: '37 - 55°C', pressure: 'Atmospheric', duration: '2 - 5 hours + 12h aeration', suitable: 'Heat-sensitive plastics, endoscopic optics, cardiac catheters, pacemakers.' },
  { id: 'plasma', name: 'Hydrogen Peroxide Gas Plasma', temp: '45 - 50°C', pressure: 'Deep Vacuum', duration: '45 - 75 minutes (No aeration needed)', suitable: 'Laparoscopic cameras, fiberoptic cables, battery-powered orthopedic drills.' }
];

export default function OTWorkflowsStation() {
  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(1);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [selectedSterilizationId, setSelectedSterilizationId] = useState<string>('steam-134');

  const currentPhase = CHECKLIST_PHASES[activePhaseIdx] || CHECKLIST_PHASES[0];
  const currentSterilization = STERILIZATION_METHODS.find(s => s.id === selectedSterilizationId) || STERILIZATION_METHODS[0];

  const handleToggleItem = (itemId: string) => {
    setChecklistState(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const phaseProgress = useMemo(() => {
    const total = currentPhase.items.length;
    const completed = currentPhase.items.filter(i => checklistState[i.id]).length;
    const pct = Math.round((completed / total) * 100);
    return { completed, total, pct };
  }, [currentPhase, checklistState]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Operation Theatre Technology & WHO Safety Checklist Station</h2>
        <p className={styles.subtitle}>
          Interactive 3-phase WHO Surgical Safety Checklist validator, sterilization cycle verification, and high-tech surgical suite workstation workflows.
        </p>
      </header>

      {/* Phase Tabs */}
      <div className={styles.phaseTabs}>
        {CHECKLIST_PHASES.map((p, idx) => (
          <button
            key={idx}
            className={`${styles.phaseTabBtn} ${activePhaseIdx === idx ? styles.activePhaseTab : ''}`}
            onClick={() => setActivePhaseIdx(idx)}
          >
            <strong>{p.phase.split('(')[0]}</strong>
            <small>{p.timing}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Interactive Checklist */}
        <div className={styles.checklistCol}>
          <div className={styles.card}>
            <div className={styles.checklistHeader}>
              <div>
                <h3 className={styles.phaseTitle}>{currentPhase.phase}</h3>
                <span className={styles.timingTag}>⏰ {currentPhase.timing}</span>
              </div>
              <div className={styles.progressCircle}>
                <strong>{phaseProgress.pct}%</strong>
                <small>{phaseProgress.completed}/{phaseProgress.total}</small>
              </div>
            </div>

            <div className={styles.itemsList}>
              {currentPhase.items.map(item => {
                const isChecked = !!checklistState[item.id];
                return (
                  <label key={item.id} className={`${styles.itemLabel} ${isChecked ? styles.checkedItem : ''}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleItem(item.id)}
                      className={styles.checkbox}
                    />
                    <div className={styles.itemText}>
                      <span>{item.text}</span>
                      <small className={styles.respTag}>Lead: {item.responsible}</small>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className={styles.trapBox}>
              ⚠️ <strong>Critical Safety Trap:</strong>
              <p>{currentPhase.trap}</p>
            </div>
          </div>
        </div>

        {/* Right: Sterilization Protocol Station */}
        <div className={styles.sterilizationCol}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Surgical Sterilization & Autoclave Protocol</h3>
            
            <div className={styles.sterilizationGrid}>
              {STERILIZATION_METHODS.map(s => (
                <button
                  key={s.id}
                  className={`${styles.sterBtn} ${selectedSterilizationId === s.id ? styles.activeSterBtn : ''}`}
                  onClick={() => setSelectedSterilizationId(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <div className={styles.sterDetails}>
              <h4 className={styles.sterTitle}>{currentSterilization.name}</h4>
              
              <div className={styles.sterItem}>
                <span className={styles.sterTag}>Parameters:</span>
                <p>{currentSterilization.temp} at {currentSterilization.pressure}</p>
              </div>

              <div className={styles.sterItem}>
                <span className={styles.sterTag}>Exposure Duration:</span>
                <p>{currentSterilization.duration}</p>
              </div>

              <div className={styles.sterItem}>
                <span className={styles.sterTag}>Suitable Instruments / Materials:</span>
                <p>{currentSterilization.suitable}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
