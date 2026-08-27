'use client';

import React, { useState, useMemo } from 'react';
import styles from './BradenWoundSimulator.module.css';

interface SubscaleDef {
  id: string;
  name: string;
  options: Array<{ score: number; label: string; desc: string }>;
}

const BRADEN_SUBSCALES: SubscaleDef[] = [
  {
    id: 'sensory',
    name: '1. Sensory Perception',
    options: [
      { score: 1, label: 'Completely Limited', desc: 'Unresponsive to painful stimuli or limited over most of body' },
      { score: 2, label: 'Very Limited', desc: 'Responds only to painful stimuli; cannot communicate discomfort' },
      { score: 3, label: 'Slightly Limited', desc: 'Responds to verbal commands but cannot always communicate' },
      { score: 4, label: 'No Impairment', desc: 'Responds to verbal commands; no sensory deficit' },
    ]
  },
  {
    id: 'moisture',
    name: '2. Moisture Exposure',
    options: [
      { score: 1, label: 'Constantly Moist', desc: 'Skin kept moist almost constantly by perspiration, urine, etc.' },
      { score: 2, label: 'Very Moist', desc: 'Skin is often but not always moist; linen changed at least once a shift' },
      { score: 3, label: 'Occasionally Moist', desc: 'Skin is occasionally moist, requiring an extra linen change once a day' },
      { score: 4, label: 'Rarely Moist', desc: 'Skin is usually dry; linen only requires changing at routine intervals' },
    ]
  },
  {
    id: 'activity',
    name: '3. Physical Activity',
    options: [
      { score: 1, label: 'Bedfast', desc: 'Confined to bed' },
      { score: 2, label: 'Chairfast', desc: 'Ability to walk severely limited or non-existent; cannot bear own weight' },
      { score: 3, label: 'Walks Occasionally', desc: 'Walks occasionally during day, but for very short distances' },
      { score: 4, label: 'Walks Frequently', desc: 'Walks outside room at least twice a day and inside room at least once every 2 hours' },
    ]
  },
  {
    id: 'mobility',
    name: '4. Mobility',
    options: [
      { score: 1, label: 'Completely Immobile', desc: 'Does not make even slight changes in body position without assistance' },
      { score: 2, label: 'Very Limited', desc: 'Makes occasional slight changes in body position, unable to make frequent changes' },
      { score: 3, label: 'Slightly Limited', desc: 'Makes frequent though slight changes in body or extremity position independently' },
      { score: 4, label: 'No Limitation', desc: 'Makes major and frequent changes in position without assistance' },
    ]
  },
  {
    id: 'nutrition',
    name: '5. Nutrition',
    options: [
      { score: 1, label: 'Very Poor', desc: 'Never eats a complete meal; rarely eats more than 1/3 of food offered' },
      { score: 2, label: 'Probably Inadequate', desc: 'Rarely eats a complete meal and generally eats only about 1/2 of food offered' },
      { score: 3, label: 'Adequate', desc: 'Eats over half of most meals; eats a total of 4 servings of protein per day' },
      { score: 4, label: 'Excellent', desc: 'Eats most of every meal; never refuses a meal; usually eats 4+ servings of meat/protein' },
    ]
  },
  {
    id: 'friction',
    name: '6. Friction & Shear',
    options: [
      { score: 1, label: 'Problem', desc: 'Requires moderate to maximum assistance in moving; sliding down in bed is frequent' },
      { score: 2, label: 'Potential Problem', desc: 'Moves feebly or requires minimum assistance; occasionally slides down' },
      { score: 3, label: 'No Apparent Problem', desc: 'Moves in bed and in chair independently and has sufficient muscle strength' },
    ]
  },
];

const WOUND_STAGES = [
  { id: 'stage1', name: 'Stage I: Non-Blanchable Erythema', desc: 'Intact skin with localized non-blanchable erythema, usually over bony prominence.', dressing: 'Barrier cream, transparent film (Tegaderm), hydrocolloid for protection.' },
  { id: 'stage2', name: 'Stage II: Partial-Thickness Loss', desc: 'Loss of dermis presenting as shallow open ulcer with red-pink wound bed or intact/ruptured serum blister.', dressing: 'Hydrocolloid (Duoderm) or hydrogel; thin foam dressing.' },
  { id: 'stage3', name: 'Stage III: Full-Thickness Skin Loss', desc: 'Subcutaneous fat visible, but bone/tendon/muscle not exposed. Slough may be present.', dressing: 'Hydrocellular foam (Mepilex), calcium alginate for high exudate, hydrogel for dry slough.' },
  { id: 'stage4', name: 'Stage IV: Full-Thickness Tissue Loss', desc: 'Exposed bone, tendon, or muscle. Slough or eschar may be present on some parts.', dressing: 'Negative pressure wound therapy (NPWT/VAC), silver antimicrobial foam, alginate cavity filler.' },
  { id: 'unstageable', name: 'Unstageable: Obscured Full-Thickness', desc: 'Full thickness tissue loss in which base of ulcer is covered by slough (yellow, tan, gray) or eschar (brown/black).', dressing: 'Sharp debridement or enzymatic debrider (collagenase); avoid unroofing dry stable heel eschar.' },
  { id: 'dti', name: 'Deep Tissue Injury (DTI)', desc: 'Purple or maroon localized area of discolored intact skin or blood-filled blister due to pressure damage.', dressing: 'Pressure offloading immediately, silicone foam dressing for shear reduction.' },
];

export default function BradenWoundSimulator() {
  const [subscaleScores, setSubscaleScores] = useState<Record<string, number>>({
    sensory: 3,
    moisture: 3,
    activity: 2,
    mobility: 2,
    nutrition: 3,
    friction: 2
  });

  const [selectedWoundStage, setSelectedWoundStage] = useState<string>('stage2');

  const totalScore = useMemo(() => {
    return Object.values(subscaleScores).reduce((a, b) => a + b, 0);
  }, [subscaleScores]);

  const riskAssessment = useMemo(() => {
    if (totalScore <= 9) return { level: 'Severe Risk', color: 'red', q2hTurn: true, airMattress: true, barrierCream: true };
    if (totalScore <= 12) return { level: 'High Risk', color: 'orange', q2hTurn: true, airMattress: true, barrierCream: true };
    if (totalScore <= 14) return { level: 'Moderate Risk', color: 'amber', q2hTurn: true, airMattress: true, barrierCream: false };
    if (totalScore <= 18) return { level: 'Mild Risk', color: 'blue', q2hTurn: false, airMattress: false, barrierCream: false };
    return { level: 'No Apparent Risk', color: 'green', q2hTurn: false, airMattress: false, barrierCream: false };
  }, [totalScore]);

  const currentWound = useMemo(() => {
    return WOUND_STAGES.find(w => w.id === selectedWoundStage) || WOUND_STAGES[0];
  }, [selectedWoundStage]);

  const handleScoreChange = (subscaleId: string, score: number) => {
    setSubscaleScores(prev => ({ ...prev, [subscaleId]: score }));
  };

  const handleApplyPreset = (preset: 'severe' | 'moderate' | 'healthy') => {
    if (preset === 'severe') {
      setSubscaleScores({ sensory: 1, moisture: 1, activity: 1, mobility: 1, nutrition: 1, friction: 1 });
    } else if (preset === 'moderate') {
      setSubscaleScores({ sensory: 2, moisture: 2, activity: 2, mobility: 2, nutrition: 2, friction: 2 });
    } else {
      setSubscaleScores({ sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 3 });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Braden Scale & Wound Care Dressing Protocol Simulator</h2>
        <p className={styles.subtitle}>
          Standardized pressure injury risk stratification tool and NPUAP/EPUAP staging and dressing selection protocol.
        </p>
      </header>

      {/* Preset Quick Buttons */}
      <div className={styles.presetRow}>
        <span className={styles.presetLabel}>Quick Patient Presets:</span>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset('severe')}>
          ICU Comatose Patient (Severe Risk ≤ 9)
        </button>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset('moderate')}>
          Elderly Post-Op Orthopedic (Moderate Risk 13-14)
        </button>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset('healthy')}>
          Ambulatory Healthy Patient (No Risk 23)
        </button>
      </div>

      <div className={styles.layout}>
        {/* Left Column: Braden 6 Subscales */}
        <div className={styles.subscalesSection}>
          <h3 className={styles.sectionHeading}>Braden Scale Assessment Subscales</h3>
          
          <div className={styles.subscaleList}>
            {BRADEN_SUBSCALES.map(sub => (
              <div key={sub.id} className={styles.subscaleCard}>
                <div className={styles.subscaleHeader}>
                  <span className={styles.subscaleName}>{sub.name}</span>
                  <span className={styles.currentScoreBadge}>
                    Score: {subscaleScores[sub.id] || 1}
                  </span>
                </div>
                
                <div className={styles.optionsGrid}>
                  {sub.options.map(opt => (
                    <button
                      key={opt.score}
                      className={`${styles.optBtn} ${subscaleScores[sub.id] === opt.score ? styles.activeOpt : ''}`}
                      onClick={() => handleScoreChange(sub.id, opt.score)}
                    >
                      <div className={styles.optTop}>
                        <span className={styles.optScore}>[{opt.score} pt]</span>
                        <span className={styles.optLabel}>{opt.label}</span>
                      </div>
                      <p className={styles.optDesc}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Score Gauge & Wound Care Protocols */}
        <div className={styles.resultsSection}>
          {/* Braden Total Score Gauge */}
          <div className={styles.card}>
            <span className={styles.label}>Braden Scale Total Score</span>
            <div className={styles.scoreVal}>{totalScore} <small>/ 23</small></div>
            <div className={`${styles.riskBadge} ${styles[riskAssessment.color]}`}>
              {riskAssessment.level}
            </div>

            <div className={styles.interventionsList}>
              <h4>Mandatory Nursing Interventions:</h4>
              <ul>
                <li>Position change schedule: {riskAssessment.q2hTurn ? 'Strict Q2H turn with 30° lateral tilt' : 'Routine ambulation encouragement'}</li>
                <li>Support surface: {riskAssessment.airMattress ? 'Dynamic alternating air pressure mattress' : 'Standard hospital mattress'}</li>
                <li>Moisture barrier: {riskAssessment.barrierCream ? 'Zinc oxide / dimethicone barrier film apply after each cleansing' : 'Keep skin clean and dry'}</li>
                <li>Heel elevation: Place pillow under calves to float heels completely</li>
              </ul>
            </div>
          </div>

          {/* Wound Stage Inspector */}
          <div className={styles.card}>
            <h3 className={styles.sectionHeading}>Wound Staging & Dressing Protocol</h3>
            
            <div className={styles.woundTabs}>
              {WOUND_STAGES.map(w => (
                <button
                  key={w.id}
                  className={`${styles.woundTabBtn} ${selectedWoundStage === w.id ? styles.activeWoundTab : ''}`}
                  onClick={() => setSelectedWoundStage(w.id)}
                >
                  {w.id.toUpperCase()}
                </button>
              ))}
            </div>

            <div className={styles.woundDetails}>
              <h4 className={styles.woundTitle}>{currentWound.name}</h4>
              <p className={styles.woundDesc}>{currentWound.desc}</p>
              
              <div className={styles.dressingBox}>
                <strong>Recommended Dressing Protocol:</strong>
                <p>{currentWound.dressing}</p>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={async () => {
                    const { recordSimulationRun } = await import('@/lib/simulations/simulationPersistence');
                    const success = await recordSimulationRun(
                      'BRADEN_WOUND_ASSESSMENT',
                      { scores: subscaleScores, selectedWoundStage },
                      { totalScore, riskCategory: riskAssessment.level, recommendations: riskAssessment }
                    );
                    if (success) {

                      alert('Braden Assessment logged to Clinical Portfolio!');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.625rem 1rem',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Log Assessment to Clinical Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
