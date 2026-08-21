'use client';

import React, { useState } from 'react';
import styles from './OrthopedicSpecialTestsViewer.module.css';

interface SpecialTestDef {
  id: string;
  name: string;
  joint: string;
  pathology: string;
  position: string;
  maneuver: string;
  positive: string;
  sensitivity: number;
  specificity: number;
  pearl: string;
}

const SPECIAL_TESTS: SpecialTestDef[] = [
  {
    id: 'lachman',
    name: 'Lachman Test',
    joint: 'Knee',
    pathology: 'Anterior Cruciate Ligament (ACL) Tear',
    position: 'Supine with knee flexed 20-30° and hip relaxed.',
    maneuver: 'Stabilize distal femur with one hand, apply brisk anterior translation force to proximal tibia with the other.',
    positive: 'Increased anterior translation of tibia with a soft/mushy end-feel compared to uninjured contralateral side.',
    sensitivity: 85,
    specificity: 94,
    pearl: 'Gold standard clinical test for ACL integrity; more reliable than Anterior Drawer because hamstring guarding is minimized at 20-30°.'
  },
  {
    id: 'mcmurray',
    name: 'McMurray Test',
    joint: 'Knee',
    pathology: 'Meniscal Tear (Medial / Lateral)',
    position: 'Supine with knee fully flexed.',
    maneuver: 'For medial meniscus: externally rotate tibia and apply valgus stress while extending knee. For lateral: internally rotate and varus stress.',
    positive: 'Painful click, clunk, or thud along the joint line during extension.',
    sensitivity: 70,
    specificity: 71,
    pearl: 'Most specific when combined with joint line tenderness and Thessaly test.'
  },
  {
    id: 'hawkins',
    name: 'Hawkins-Kennedy Test',
    joint: 'Shoulder',
    pathology: 'Subacromial Impingement Syndrome',
    position: 'Seated or standing with arm in 90° forward flexion and elbow flexed 90°.',
    maneuver: 'Examiner stabilizes superior shoulder and forcefully internally rotates the humerus.',
    positive: 'Reproduction of anterior/lateral shoulder pain as supraspinatus tendon is compressed against coracoacromial ligament.',
    sensitivity: 92,
    specificity: 60,
    pearl: 'High sensitivity makes it an exceptional rule-out test for subacromial pathology.'
  },
  {
    id: 'empty-can',
    name: 'Empty Can (Jobe) Test',
    joint: 'Shoulder',
    pathology: 'Supraspinatus Tendinopathy / Full-Thickness Tear',
    position: 'Arm elevated 90° in scapular plane (30° anterior to frontal plane) with full internal rotation (thumb down).',
    maneuver: 'Examiner applies downward resistance at distal forearm while patient attempts to resist.',
    positive: 'Pain and/or significant muscle weakness indicates supraspinatus pathology.',
    sensitivity: 89,
    specificity: 68,
    pearl: 'Full Can test (thumb up) produces equal EMG activation with less subacromial compression.'
  },
  {
    id: 'faber',
    name: 'FABER (Patrick) Test',
    joint: 'Hip',
    pathology: 'Sacroiliac Joint Dysfunction / Hip Intra-articular Pathology',
    position: 'Supine with test leg in Flexion, ABduction, and External Rotation (foot placed on opposite knee).',
    maneuver: 'Examiner stabilizes contralateral ASIS and presses downward on ipsilateral medial knee.',
    positive: 'Anterior groin pain indicates hip pathology; posterior/buttock pain indicates sacroiliac joint lesion.',
    sensitivity: 82,
    specificity: 86,
    pearl: 'Distinguish between anterior hip impingement and posterior SIJ pathology by pain localization.'
  },
  {
    id: 'slr',
    name: 'Straight Leg Raise (Lasegue) Test',
    joint: 'Spine',
    pathology: 'Lumbar Radiculopathy / Sciatic Nerve Tension (L4-S1)',
    position: 'Supine with legs extended and head relaxed.',
    maneuver: 'Examiner passively elevates the straight symptomatic leg by the heel until pain is reproduced.',
    positive: 'Sharp radiating dermatomal pain down the posterior leg below the knee between 35° and 70°.',
    sensitivity: 91,
    specificity: 42,
    pearl: 'Crossed SLR (pain in affected leg when asymptomatic leg is raised) is highly specific (90%) for disk herniation.'
  }
];

export default function OrthopedicSpecialTestsViewer() {
  const [selectedJointFilter, setSelectedJointFilter] = useState<string>('All');
  const [selectedTestId, setSelectedTestId] = useState<string>('lachman');

  const filteredTests = selectedJointFilter === 'All'
    ? SPECIAL_TESTS
    : SPECIAL_TESTS.filter(t => t.joint === selectedJointFilter);

  const currentTest = SPECIAL_TESTS.find(t => t.id === selectedTestId) || SPECIAL_TESTS[0];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Orthopedic Special Diagnostic Tests & Sports Rehab Station</h2>
        <p className={styles.subtitle}>
          Standard physical therapy orthopedic diagnostic maneuvers with sensitivity, specificity metrics, execution techniques, and clinical interpretations.
        </p>
      </header>

      {/* Joint Category Filter Tabs */}
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Joint Filter:</span>
        {['All', 'Knee', 'Shoulder', 'Hip', 'Spine'].map(j => (
          <button
            key={j}
            className={`${styles.filterBtn} ${selectedJointFilter === j ? styles.activeFilter : ''}`}
            onClick={() => {
              setSelectedJointFilter(j);
              const firstMatching = j === 'All' ? SPECIAL_TESTS[0] : SPECIAL_TESTS.find(t => t.joint === j);
              if (firstMatching) setSelectedTestId(firstMatching.id);
            }}
          >
            {j}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Test Selector List */}
        <div className={styles.testsList}>
          {filteredTests.map(test => (
            <button
              key={test.id}
              className={`${styles.testCardBtn} ${selectedTestId === test.id ? styles.activeTestCard : ''}`}
              onClick={() => setSelectedTestId(test.id)}
            >
              <div className={styles.testCardTop}>
                <span className={styles.testName}>{test.name}</span>
                <span className={styles.jointBadge}>{test.joint}</span>
              </div>
              <p className={styles.pathologySummary}>{test.pathology}</p>
            </button>
          ))}
        </div>

        {/* Right: Detailed Test Protocol & Statistics */}
        <div className={styles.detailsPanel}>
          <div className={styles.card}>
            <div className={styles.testHeader}>
              <div>
                <h3 className={styles.testTitle}>{currentTest.name}</h3>
                <span className={styles.pathologyTag}>🎯 Target: {currentTest.pathology}</span>
              </div>
              
              {/* Statistical Metrics */}
              <div className={styles.statsMetrics}>
                <div className={styles.statBox}>
                  <span className={styles.statVal}>{currentTest.sensitivity}%</span>
                  <span className={styles.statLabel}>Sensitivity (Sn)</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statVal}>{currentTest.specificity}%</span>
                  <span className={styles.statLabel}>Specificity (Sp)</span>
                </div>
              </div>
            </div>

            <div className={styles.protocolSection}>
              <div className={styles.protocolItem}>
                <span className={styles.protocolTag}>1. Patient Starting Position:</span>
                <p>{currentTest.position}</p>
              </div>

              <div className={styles.protocolItem}>
                <span className={styles.protocolTag}>2. Examiner Maneuver Technique:</span>
                <p>{currentTest.maneuver}</p>
              </div>

              <div className={styles.positiveBox}>
                <strong>✅ Positive Test Indicator:</strong>
                <p>{currentTest.positive}</p>
              </div>

              <div className={styles.pearlBox}>
                💡 <strong>Clinical Diagnostic Pearl:</strong>
                <p>{currentTest.pearl}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
