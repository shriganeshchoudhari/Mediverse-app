'use client';

import React, { useState, useMemo } from 'react';
import styles from './GaitCycleAnalyzer.module.css';

interface GaitPhaseDef {
  id: string;
  name: string;
  percent: string;
  task: string;
  hipAngle: number;
  kneeAngle: number;
  ankleAngle: number;
  muscles: string[];
  criticalEvent: string;
}

const GAIT_PHASES: GaitPhaseDef[] = [
  { id: 'ic', name: '1. Initial Contact (Heel Strike)', percent: '0 - 2%', task: 'Weight Acceptance', hipAngle: 20, kneeAngle: 5, ankleAngle: 0, muscles: ['Tibialis Anterior (isometric)', 'Gluteus Maximus (eccentric)', 'Quadriceps'], criticalEvent: 'Heel first contact initiates loading response and shock absorption.' },
  { id: 'lr', name: '2. Loading Response (Foot Flat)', percent: '2 - 12%', task: 'Weight Acceptance', hipAngle: 20, kneeAngle: 15, ankleAngle: -5, muscles: ['Quadriceps (eccentric knee flexion shock)', 'Gluteus Medius', 'Tibialis Anterior'], criticalEvent: 'Controlled knee flexion for shock absorption and weight transfer.' },
  { id: 'mst', name: '3. Mid Stance (Single Limb Support)', percent: '12 - 31%', task: 'Single Limb Support', hipAngle: 0, kneeAngle: 5, ankleAngle: 5, muscles: ['Gastrocnemius-Soleus (eccentric tib control)', 'Gluteus Medius (coronal stability)'], criticalEvent: 'Body progresses over stationary foot; contralateral swing limb passes.' },
  { id: 'tst', name: '4. Terminal Stance (Heel Off)', percent: '31 - 50%', task: 'Single Limb Support', hipAngle: -20, kneeAngle: 0, ankleAngle: 10, muscles: ['Soleus / Gastrocnemius (concentric plantarflexion push)'], criticalEvent: 'Heel rises and body weight rolls over metatarsal heads.' },
  { id: 'psw', name: '5. Pre-Swing (Toe Off)', percent: '50 - 62%', task: 'Weight Acceptance (Transfer)', hipAngle: -10, kneeAngle: 40, ankleAngle: -15, muscles: ['Adductor Longus', 'Rectus Femoris (hip flexion initiation)'], criticalEvent: 'Rapid knee flexion and ankle plantarflexion for swing initiation.' },
  { id: 'isw', name: '6. Initial Swing (Acceleration)', percent: '62 - 75%', task: 'Limb Advancement', hipAngle: 15, kneeAngle: 60, ankleAngle: -5, muscles: ['Iliopsoas', 'Biceps Femoris (short head)', 'Tibialis Anterior'], criticalEvent: 'Foot clears floor and thigh advances forward.' },
  { id: 'msw', name: '7. Mid Swing', percent: '75 - 87%', task: 'Limb Advancement', hipAngle: 25, kneeAngle: 25, ankleAngle: 0, muscles: ['Tibialis Anterior (dorsiflexion for ground clearance)'], criticalEvent: 'Tibia reaches vertical position; maximal foot clearance achieved.' },
  { id: 'tsw', name: '8. Terminal Swing (Deceleration)', percent: '87 - 100%', task: 'Limb Advancement', hipAngle: 20, kneeAngle: 5, ankleAngle: 0, muscles: ['Hamstrings (eccentric hip/knee deceleration)', 'Quadriceps', 'Tibialis Anterior'], criticalEvent: 'Limb decelerates and knee extends fully in preparation for Initial Contact.' },
];

const PATHOLOGICAL_GAITS = [
  { id: 'trendelenburg', name: 'Trendelenburg Gait', etiology: 'Gluteus medius weakness / superior gluteal nerve lesion', description: 'Pelvis drops on contralateral unsupported side during stance phase.', compensation: 'Lateral trunk lean toward the affected stance limb (compensated).' },
  { id: 'hemiplegic', name: 'Hemiplegic / Circumduction Gait', etiology: 'Stroke / Upper Motor Neuron spasticity', description: 'Affected leg is extended and spastic; hip circumducts in arc during swing to clear dropped foot.', compensation: 'Pelvic hiking and trunk lean away from affected side.' },
  { id: 'steppage', name: 'Steppage Gait (Foot Drop)', etiology: 'Common peroneal (fibular) nerve injury or L5 radiculopathy', description: 'Loss of ankle dorsiflexion causes toes to scrape floor during swing.', compensation: 'Excessive hip and knee flexion (high-stepping) to clear foot.' },
  { id: 'ataxic', name: 'Cerebellar Ataxic Gait', etiology: 'Cerebellar vermis lesion / sensory ataxia', description: 'Wide-based unsteady gait with irregular step length and lateral lurching.', compensation: 'Fixing gaze on floor and extending arms for balance.' },
  { id: 'parkinsonian', name: 'Parkinsonian (Festinating) Gait', etiology: 'Basal ganglia dopamine depletion (Parkinson Disease)', description: 'Short shuffling steps, reduced arm swing, forward stooped posture, and difficulty initiating or stopping gait.', compensation: 'Center of gravity falls ahead of feet causing accelerated steps.' },
  { id: 'antalgic', name: 'Antalgic (Pain-Relieving) Gait', etiology: 'Joint or musculoskeletal pain (e.g. knee osteoarthritis)', description: 'Shortened stance phase on the painful limb to minimize weight-bearing time.', compensation: 'Quick transfer of weight to contralateral healthy limb.' }
];

export default function GaitCycleAnalyzer() {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(0);
  const [selectedPathologyId, setSelectedPathologyId] = useState<string>('trendelenburg');

  const currentPhase = GAIT_PHASES[selectedPhaseIdx] || GAIT_PHASES[0];
  const currentPathology = PATHOLOGICAL_GAITS.find(p => p.id === selectedPathologyId) || PATHOLOGICAL_GAITS[0];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Gait Cycle Kinematics & Pathological Gait Simulator</h2>
        <p className={styles.subtitle}>
          Standard 8-phase Rancho Los Amigos gait cycle analyzer with joint angles, muscle EMG activity, and clinical pathological gait simulator.
        </p>
      </header>

      {/* 8-Phase Gait Timeline Scrubber */}
      <div className={styles.timelineContainer}>
        <span className={styles.timelineLabel}>Rancho Los Amigos 8-Phase Gait Cycle:</span>
        <div className={styles.phasesGrid}>
          {GAIT_PHASES.map((phase, idx) => (
            <button
              key={phase.id}
              className={`${styles.phaseBtn} ${selectedPhaseIdx === idx ? styles.activePhaseBtn : ''}`}
              onClick={() => setSelectedPhaseIdx(idx)}
            >
              <span className={styles.phaseStep}>{idx + 1}</span>
              <span className={styles.phaseName}>{phase.name.split('(')[0]}</span>
              <small className={styles.phasePct}>{phase.percent}</small>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left: Animated Kinematic Visualizer */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.phaseHeader}>
              <h3 className={styles.phaseTitle}>{currentPhase.name}</h3>
              <span className={styles.taskBadge}>{currentPhase.task}</span>
            </div>

            <div className={styles.kinematicSvgWrapper}>
              <svg viewBox="0 0 360 260" className={styles.kinematicSvg}>
                {/* Floor Line */}
                <line x1="20" y1="220" x2="340" y2="220" stroke="#475569" strokeWidth="3" />
                
                {/* Stick Figure Stance Limb */}
                {/* Pelvis / Hip Joint */}
                <circle cx="180" cy="80" r="8" fill="#38bdf8" />
                <text x="180" y="65" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="600">Hip ({currentPhase.hipAngle}°)</text>

                {/* Thigh */}
                {(() => {
                  const kneeX = 180 + 50 * Math.sin(currentPhase.hipAngle * Math.PI / 180);
                  const kneeY = 80 + 50 * Math.cos(currentPhase.hipAngle * Math.PI / 180);
                  const ankleX = kneeX - 50 * Math.sin(currentPhase.kneeAngle * Math.PI / 180);
                  const ankleY = kneeY + 50 * Math.cos(currentPhase.kneeAngle * Math.PI / 180);

                  return (
                    <g>
                      <line x1="180" y1="80" x2={kneeX} y2={kneeY} stroke="#f472b6" strokeWidth="8" strokeLinecap="round" />
                      <circle cx={kneeX} cy={kneeY} r="6" fill="#f472b6" />
                      <text x={kneeX + 15} y={kneeY} fill="#f472b6" fontSize="10">Knee ({currentPhase.kneeAngle}°)</text>

                      {/* Shank */}
                      <line x1={kneeX} y1={kneeY} x2={ankleX} y2={ankleY} stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                      <circle cx={ankleX} cy={ankleY} r="5" fill="#38bdf8" />

                      {/* Foot */}
                      <line x1={ankleX} y1={ankleY} x2={ankleX + 25} y2={ankleY + 8} stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
                      <text x={ankleX} y={ankleY + 22} fill="#cbd5e1" fontSize="10">Ankle ({currentPhase.ankleAngle}°)</text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            <div className={styles.eventBox}>
              <strong>Critical Kinematic Event:</strong>
              <p>{currentPhase.criticalEvent}</p>
            </div>

            {/* Muscle Activation Heat Bars */}
            <div className={styles.musclesBox}>
              <h4>Active Muscle Groups (EMG):</h4>
              <div className={styles.muscleChips}>
                {currentPhase.muscles.map((m, i) => (
                  <span key={i} className={styles.muscleChip}>⚡ {m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pathological Gait Simulator */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Pathological Gait Deviations</h3>
            
            <div className={styles.pathologySelector}>
              {PATHOLOGICAL_GAITS.map(p => (
                <button
                  key={p.id}
                  className={`${styles.pathBtn} ${selectedPathologyId === p.id ? styles.activePathBtn : ''}`}
                  onClick={() => setSelectedPathologyId(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className={styles.pathologyDetails}>
              <h4 className={styles.pathTitle}>{currentPathology.name}</h4>
              
              <div className={styles.pathItem}>
                <span className={styles.pathTag}>Primary Etiology:</span>
                <p>{currentPathology.etiology}</p>
              </div>

              <div className={styles.pathItem}>
                <span className={styles.pathTag}>Kinematic Deviations:</span>
                <p>{currentPathology.description}</p>
              </div>

              <div className={styles.pathItem}>
                <span className={styles.pathTag}>Compensatory Mechanism:</span>
                <p>{currentPathology.compensation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
