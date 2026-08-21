'use client';

import React, { useState, useMemo } from 'react';
import styles from './JointBiomechanicsViewer.module.css';

interface JointOption {
  id: string;
  name: string;
  movement: string;
  minDeg: number;
  maxDeg: number;
  normalMaxDeg: number;
  defaultDeg: number;
  fulcrum: string;
  stationaryArm: string;
  movingArm: string;
  endFeel: string;
  clinicalNote: string;
}

const JOINT_OPTIONS: JointOption[] = [
  {
    id: 'shoulder-flex',
    name: 'Shoulder',
    movement: 'Flexion',
    minDeg: 0,
    maxDeg: 180,
    normalMaxDeg: 180,
    defaultDeg: 120,
    fulcrum: 'Lateral aspect of greater tubercle of humerus',
    stationaryArm: 'Midaxillary line of thorax',
    movingArm: 'Lateral midline of humerus (lateral epicondyle)',
    endFeel: 'Firm (posterior joint capsule, latissimus dorsi, teres major tension)',
    clinicalNote: 'Compensatory trunk extension or lumbar lordosis must be stabilized.'
  },
  {
    id: 'shoulder-abd',
    name: 'Shoulder',
    movement: 'Abduction',
    minDeg: 0,
    maxDeg: 180,
    normalMaxDeg: 180,
    defaultDeg: 90,
    fulcrum: 'Anterior/posterior aspect of acromion process',
    stationaryArm: 'Parallel to sternum / spine',
    movingArm: 'Anterior/posterior midline of humerus',
    endFeel: 'Firm (inferior capsule, glenohumeral ligaments)',
    clinicalNote: 'Requires 2:1 scapulohumeral rhythm above 30° abduction.'
  },
  {
    id: 'elbow-flex',
    name: 'Elbow',
    movement: 'Flexion',
    minDeg: 0,
    maxDeg: 150,
    normalMaxDeg: 145,
    defaultDeg: 90,
    fulcrum: 'Lateral epicondyle of humerus',
    stationaryArm: 'Lateral midline of humerus (acromion reference)',
    movingArm: 'Lateral midline of radius (radial styloid process)',
    endFeel: 'Soft (muscle approximation: biceps brachii & forearm flexors)',
    clinicalNote: 'Full passive flexion produces soft tissue contact in muscular individuals.'
  },
  {
    id: 'knee-flex',
    name: 'Knee',
    movement: 'Flexion',
    minDeg: 0,
    maxDeg: 145,
    normalMaxDeg: 135,
    defaultDeg: 100,
    fulcrum: 'Lateral epicondyle of femur',
    stationaryArm: 'Lateral midline of femur (greater trochanter)',
    movingArm: 'Lateral midline of fibula (lateral malleolus)',
    endFeel: 'Soft / Firm (soft tissue approximation or quad/capsular tension)',
    clinicalNote: 'Measure in supine with hip flexed to relax rectus femoris.'
  },
  {
    id: 'hip-flex',
    name: 'Hip',
    movement: 'Flexion',
    minDeg: 0,
    maxDeg: 130,
    normalMaxDeg: 120,
    defaultDeg: 80,
    fulcrum: 'Lateral aspect of greater trochanter of femur',
    stationaryArm: 'Lateral midline of pelvis / trunk',
    movingArm: 'Lateral midline of femur (lateral epicondyle)',
    endFeel: 'Soft (thigh against abdomen) or Firm (posterior capsule)',
    clinicalNote: 'Opposite limb must stay flat on table to prevent pelvic tilt.'
  },
  {
    id: 'ankle-df',
    name: 'Ankle',
    movement: 'Dorsiflexion',
    minDeg: 0,
    maxDeg: 30,
    normalMaxDeg: 20,
    defaultDeg: 10,
    fulcrum: 'Lateral malleolus',
    stationaryArm: 'Lateral midline of fibula (fibular head)',
    movingArm: 'Parallel to 5th metatarsal bone',
    endFeel: 'Firm (Achilles tendon / gastrocnemius-soleus tension)',
    clinicalNote: 'Measure with knee at 90° flexion to isolate soleus.'
  }
];

export default function JointBiomechanicsViewer() {
  const [selectedJointId, setSelectedJointId] = useState<string>('knee-flex');
  const [currentAngle, setCurrentAngle] = useState<number>(100);

  const selectedJoint = useMemo(() => {
    return JOINT_OPTIONS.find(j => j.id === selectedJointId) || JOINT_OPTIONS[0];
  }, [selectedJointId]);

  const mobilityStatus = useMemo(() => {
    if (currentAngle < selectedJoint.normalMaxDeg - 15) {
      return { status: 'Hypomobile (Restricted ROM)', color: 'amber', message: 'Indicates capsular tightness, muscle contracture, or intra-articular block.' };
    }
    if (currentAngle > selectedJoint.normalMaxDeg + 5) {
      return { status: 'Hypermobile (Excessive Laxity)', color: 'blue', message: 'Indicates ligamentous laxity or generalized joint hypermobility syndrome.' };
    }
    return { status: 'Normal Physiological ROM', color: 'green', message: 'Movement meets standard anatomical and functional criteria.' };
  }, [currentAngle, selectedJoint]);

  const handleSelectJoint = (joint: JointOption) => {
    setSelectedJointId(joint.id);
    setCurrentAngle(joint.defaultDeg);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>3D Joint Biomechanics & Goniometry Visualizer</h2>
        <p className={styles.subtitle}>
          Interactive joint kinematics simulator with standard goniometer landmark alignment and physiological end-feel assessment.
        </p>
      </header>

      {/* Joint Selector Buttons */}
      <div className={styles.jointButtonsRow}>
        {JOINT_OPTIONS.map(joint => (
          <button
            key={joint.id}
            className={`${styles.jointBtn} ${selectedJoint.id === joint.id ? styles.activeJointBtn : ''}`}
            onClick={() => handleSelectJoint(joint)}
          >
            <strong>{joint.name}</strong>
            <small>{joint.movement}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Kinematic SVG Diagram */}
        <div className={styles.visualizerPanel}>
          <div className={styles.canvasCard}>
            <div className={styles.canvasHeader}>
              <span className={styles.jointTitle}>{selectedJoint.name} — {selectedJoint.movement}</span>
              <span className={styles.angleTag}>{currentAngle}°</span>
            </div>

            <div className={styles.svgWrapper}>
              <svg viewBox="0 0 400 300" className={styles.jointSvg}>
                {/* Background Grid */}
                <circle cx="200" cy="200" r="140" fill="none" stroke="#1e293b" strokeDasharray="3 3" />
                <circle cx="200" cy="200" r="90" fill="none" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Normal ROM Arc (Green transparent wedge) */}
                <path
                  d={`M 200 200 L 340 200 A 140 140 0 0 0 ${200 + 140 * Math.cos(-selectedJoint.normalMaxDeg * Math.PI / 180)} ${200 + 140 * Math.sin(-selectedJoint.normalMaxDeg * Math.PI / 180)} Z`}
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke="#10b981"
                  strokeWidth="1"
                />

                {/* Stationary Bone Segment (Fixed Horizontal) */}
                <line x1="200" y1="200" x2="340" y2="200" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
                <text x="270" y="225" fill="#64748b" fontSize="11" textAnchor="middle">Stationary Arm</text>

                {/* Moving Bone Segment (Rotated by currentAngle) */}
                {(() => {
                  const rad = -currentAngle * (Math.PI / 180);
                  const movingX = 200 + 140 * Math.cos(rad);
                  const movingY = 200 + 140 * Math.sin(rad);
                  return (
                    <g>
                      <line x1="200" y1="200" x2={movingX} y2={movingY} stroke="#f472b6" strokeWidth="10" strokeLinecap="round" />
                      <circle cx={movingX} cy={movingY} r="6" fill="#f472b6" />
                      <text x={movingX + (movingX > 200 ? 10 : -10)} y={movingY - 10} fill="#f472b6" fontSize="12" fontWeight="700">
                        {currentAngle}°
                      </text>
                    </g>
                  );
                })()}

                {/* Goniometer Fulcrum (Center Pivot) */}
                <circle cx="200" cy="200" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
                <circle cx="200" cy="200" r="4" fill="#ffffff" />
                <text x="200" y="245" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="600">Fulcrum</text>
              </svg>
            </div>

            {/* Slider Control */}
            <div className={styles.sliderControl}>
              <div className={styles.sliderLabelRow}>
                <span>Joint Angle Control:</span>
                <strong>{currentAngle}° (Normal: 0° - {selectedJoint.normalMaxDeg}°)</strong>
              </div>
              <input
                type="range"
                min={selectedJoint.minDeg}
                max={selectedJoint.maxDeg}
                value={currentAngle}
                onChange={e => setCurrentAngle(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>
          </div>
        </div>

        {/* Right: Goniometer Alignment & Clinical Assessment */}
        <div className={styles.infoPanel}>
          {/* Status Badge */}
          <div className={styles.card}>
            <span className={styles.label}>Mobility Diagnostic Assessment</span>
            <div className={`${styles.statusBadge} ${styles[mobilityStatus.color]}`}>
              {mobilityStatus.status}
            </div>
            <p className={styles.statusMsg}>{mobilityStatus.message}</p>
          </div>

          {/* Goniometric Alignment Guide */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Standard Goniometer Alignment</h3>
            <div className={styles.alignmentList}>
              <div className={styles.alignItem}>
                <span className={styles.alignTag}>Fulcrum (Axis):</span>
                <p>{selectedJoint.fulcrum}</p>
              </div>
              <div className={styles.alignItem}>
                <span className={styles.alignTag}>Stationary Arm:</span>
                <p>{selectedJoint.stationaryArm}</p>
              </div>
              <div className={styles.alignItem}>
                <span className={styles.alignTag}>Moving Arm:</span>
                <p>{selectedJoint.movingArm}</p>
              </div>
            </div>
          </div>

          {/* End-Feel & Clinical Pearls */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Physiological End-Feel & Clinical Notes</h3>
            <div className={styles.endFeelBox}>
              <strong>Expected End-Feel:</strong>
              <p>{selectedJoint.endFeel}</p>
            </div>
            <p className={styles.clinicalPearlText}>
              💡 <strong>Clinician Tip:</strong> {selectedJoint.clinicalNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
