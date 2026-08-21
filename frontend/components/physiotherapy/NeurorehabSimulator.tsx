'use client';

import React, { useState } from 'react';
import styles from './NeurorehabSimulator.module.css';

const BRUNNSTROM_STAGES = [
  { stage: 1, name: 'Stage 1: Flaccidity', desc: 'Complete absence of voluntary movement and muscle tone. No reflex response on affected side.', goals: 'Passive ROM to prevent contractures, positioning to prevent shoulder subluxation, sensory stimulation.' },
  { stage: 2, name: 'Stage 2: Spasticity Develops', desc: 'Basic movement synergies begin to appear as weak associated reactions. Minimal spasticity begins.', goals: 'Facilitate active-assisted movement within synergy, weight-bearing through hemiplegic limb.' },
  { stage: 3, name: 'Stage 3: Severe Spasticity & Voluntary Synergies', desc: 'Spasticity reaches its peak. Patient can voluntarily initiate basic mass flexion/extension synergy.', goals: 'Break synergy dominance, introduce early isolated components, inhibit excessive muscle tone.' },
  { stage: 4, name: 'Stage 4: Spasticity Declines (Out of Synergy)', desc: 'Spasticity begins to decrease. Patient can perform movement combinations that deviate from basic synergy.', goals: 'Place hand behind back, elevate arm to 90° with elbow extended, pronation/supination with elbow flexed.' },
  { stage: 5, name: 'Stage 5: Synergies Lose Dominance', desc: 'Spasticity is waning. Complex movement combinations are possible with increasing independence from mass synergies.', goals: 'Arm abduction to 90° with elbow straight, overhead hand raising, isolated ankle dorsiflexion with knee extended.' },
  { stage: 6, name: 'Stage 6: Isolated Joint Movement & Normal Coordination', desc: 'Spasticity is absent. Individual joint movements are possible and coordination approaches normal speed.', goals: 'High-speed coordination drills, functional gait re-education, fine motor dexterity tasks.' }
];

const PNF_PATTERNS = [
  { id: 'ue-d1-flex', extremity: 'Upper Extremity', pattern: 'D1 Flexion (Eat Apple)', movements: 'Flexion - Adduction - External Rotation', functional: 'Hand-to-mouth feeding, brushing opposite side of hair.', cue: 'Pull up and across to your opposite ear.' },
  { id: 'ue-d1-ext', extremity: 'Upper Extremity', pattern: 'D1 Extension (Throw Apple Away)', movements: 'Extension - Abduction - Internal Rotation', functional: 'Pushing off chair to stand, putting on a seatbelt.', cue: 'Push down and out to your hip.' },
  { id: 'ue-d2-flex', extremity: 'Upper Extremity', pattern: 'D2 Flexion (Draw Sword & Lift)', movements: 'Flexion - Abduction - External Rotation', functional: 'Reaching into high cupboard on same side, throwing a ball.', cue: 'Open hand, look up and out.' },
  { id: 'ue-d2-ext', extremity: 'Upper Extremity', pattern: 'D2 Extension (Sheathe Sword)', movements: 'Extension - Adduction - Internal Rotation', functional: 'Fastening seatbelt, buttoning opposite side of shirt.', cue: 'Close hand, squeeze down and in across your body.' },
  { id: 'le-d1-flex', extremity: 'Lower Extremity', pattern: 'D1 Flexion', movements: 'Flexion - Adduction - External Rotation', functional: 'Crossing legs while sitting, kicking soccer ball.', cue: 'Pull your foot up and in across your knee.' },
  { id: 'le-d2-flex', extremity: 'Lower Extremity', pattern: 'D2 Flexion', movements: 'Flexion - Abduction - Internal Rotation', functional: 'Stepping over an obstacle, getting into a car.', cue: 'Pull your foot up and out.' },
];

const ASHWORTH_SCORES = [
  { score: '0', tone: 'No increase in muscle tone.', resistance: 'Normal passive movement.' },
  { score: '1', tone: 'Slight increase in muscle tone (catch and release).', resistance: 'Minimal resistance at the end of the range of motion.' },
  { score: '1+', tone: 'Slight increase in tone (catch followed by minimal resistance).', resistance: 'Felt through less than half of the remaining ROM.' },
  { score: '2', tone: 'More marked increase in muscle tone through most of ROM.', resistance: 'Affected part is still easily moved passively.' },
  { score: '3', tone: 'Considerable increase in muscle tone.', resistance: 'Passive movement is difficult throughout range.' },
  { score: '4', tone: 'Affected part is rigid in flexion or extension.', resistance: 'Unable to move joint passively (ankylosis/rigidity).' }
];

export default function NeurorehabSimulator() {
  const [selectedStage, setSelectedStage] = useState<number>(3);
  const [selectedPnfId, setSelectedPnfId] = useState<string>('ue-d1-flex');
  const [selectedAshworth, setSelectedAshworth] = useState<string>('2');

  const currentStage = BRUNNSTROM_STAGES.find(s => s.stage === selectedStage) || BRUNNSTROM_STAGES[2];
  const currentPnf = PNF_PATTERNS.find(p => p.id === selectedPnfId) || PNF_PATTERNS[0];
  const currentAshworth = ASHWORTH_SCORES.find(a => a.score === selectedAshworth) || ASHWORTH_SCORES[3];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Neurorehabilitation & PNF / Stroke Recovery Protocol Simulator</h2>
        <p className={styles.subtitle}>
          Brunnstrom 6-stage motor recovery assessment, Proprioceptive Neuromuscular Facilitation (PNF) diagonal patterns, and Modified Ashworth Scale evaluator.
        </p>
      </header>

      <div className={styles.layout}>
        {/* Left: Braden / Brunnstrom Stages */}
        <div className={styles.sectionCol}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Brunnstrom 6 Stages of Stroke Motor Recovery</h3>
            
            <div className={styles.stagesLadder}>
              {BRUNNSTROM_STAGES.map(stg => (
                <button
                  key={stg.stage}
                  className={`${styles.stageLadderBtn} ${selectedStage === stg.stage ? styles.activeStageLadder : ''}`}
                  onClick={() => setSelectedStage(stg.stage)}
                >
                  <span className={styles.stgNum}>Stage {stg.stage}</span>
                  <span className={styles.stgLabel}>{stg.name.split(':')[1]}</span>
                </button>
              ))}
            </div>

            <div className={styles.stageDetails}>
              <h4 className={styles.detailTitle}>{currentStage.name}</h4>
              <p className={styles.detailDesc}>{currentStage.desc}</p>
              
              <div className={styles.goalBox}>
                <strong>Target Physical Therapy Goals:</strong>
                <p>{currentStage.goals}</p>
              </div>
            </div>
          </div>

          {/* Modified Ashworth Scale Evaluator */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Modified Ashworth Scale (MAS) Spasticity Evaluator</h3>
            
            <div className={styles.ashworthGrid}>
              {ASHWORTH_SCORES.map(a => (
                <button
                  key={a.score}
                  className={`${styles.ashworthBtn} ${selectedAshworth === a.score ? styles.activeAshworth : ''}`}
                  onClick={() => setSelectedAshworth(a.score)}
                >
                  <strong>Score {a.score}</strong>
                </button>
              ))}
            </div>

            <div className={styles.ashworthOutput}>
              <div><strong>Muscle Tone:</strong> {currentAshworth.tone}</div>
              <div><strong>Clinical Resistance:</strong> {currentAshworth.resistance}</div>
            </div>
          </div>
        </div>

        {/* Right: PNF Diagonal Patterns Visualizer */}
        <div className={styles.sectionCol}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>PNF Diagonal Movement Patterns</h3>
            
            <div className={styles.pnfSelector}>
              {PNF_PATTERNS.map(p => (
                <button
                  key={p.id}
                  className={`${styles.pnfBtn} ${selectedPnfId === p.id ? styles.activePnfBtn : ''}`}
                  onClick={() => setSelectedPnfId(p.id)}
                >
                  <span className={styles.pnfExtremity}>{p.extremity}</span>
                  <span className={styles.pnfPatternName}>{p.pattern}</span>
                </button>
              ))}
            </div>

            <div className={styles.pnfDetailsCard}>
              <h4 className={styles.pnfTitle}>{currentPnf.pattern} ({currentPnf.extremity})</h4>
              
              <div className={styles.pnfItem}>
                <span className={styles.pnfTag}>Kinematic Components:</span>
                <p>{currentPnf.movements}</p>
              </div>

              <div className={styles.pnfItem}>
                <span className={styles.pnfTag}>Functional Everyday Activity:</span>
                <p>{currentPnf.functional}</p>
              </div>

              <div className={styles.cueBox}>
                <strong>Verbal Cue Command:</strong>
                <p>"{currentPnf.cue}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
