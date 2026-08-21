'use client';

import React, { useState, useMemo } from 'react';
import styles from './AyushmanBharatSimulator.module.css';

interface BenefitPackage {
  id: string;
  code: string;
  specialty: string;
  name: string;
  rateInr: number;
  preAuth: boolean;
  los: number;
  docs: string;
}

const PACKAGES: BenefitPackage[] = [
  { id: 'cabg', code: 'CT001A', specialty: 'Cardiothoracic Surgery', name: 'Coronary Artery Bypass Grafting (CABG) with CPB', rateInr: 135000, preAuth: true, los: 8, docs: 'Coronary Angiography (CAG) DVD, Echo report, Clinical summary.' },
  { id: 'ptca', code: 'CT004B', specialty: 'Cardiology', name: 'PTCA with Single Drug-Eluting Stent (DES)', rateInr: 65000, preAuth: true, los: 3, docs: 'ECG, Trop-I, CAG film, Pre/Post stent angiographic images.' },
  { id: 'tkr', code: 'OR010A', specialty: 'Orthopedics', name: 'Total Knee Replacement (TKR — Unilateral)', rateInr: 80000, preAuth: true, los: 5, docs: 'Weight-bearing Bilateral Knee X-Rays (AP/Lateral), Pre-op consent.' },
  { id: 'dialysis', code: 'NE002A', specialty: 'Nephrology', name: 'Hemodialysis (Single Session Package)', rateInr: 1800, preAuth: false, los: 1, docs: 'Serum Creatinine, Blood Urea, Nephrologist prescription.' },
  { id: 'nicu', code: 'PD001C', specialty: 'Pediatrics / Neonatology', name: 'Neonatal Intensive Care (Level III Ventilation per day)', rateInr: 7000, preAuth: true, los: 7, docs: 'Birth weight record, ABG chart, Neonatologist daily clinical note.' }
];

export default function AyushmanBharatSimulator() {
  const [selectedPkgId, setSelectedPkgId] = useState<string>('cabg');
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [familyWalletClaimedInr, setFamilyWalletClaimedInr] = useState<number>(120000);

  const currentPkg = useMemo(() => {
    return PACKAGES.find(p => p.id === selectedPkgId) || PACKAGES[0];
  }, [selectedPkgId]);

  const totalSumInsuredInr = 500000;
  const remainingWalletInr = Math.max(0, totalSumInsuredInr - familyWalletClaimedInr - (stepIdx === 3 ? currentPkg.rateInr : 0));

  const steps = [
    { title: '1. Beneficiary Identification (BIS)', desc: 'Aadhaar / Ration Card eKYC verification and PM-JAY Golden Card authentication.' },
    { title: '2. Pre-Authorization Request', desc: `Submission of diagnostic evidence to State Health Agency (SHA) Trust/TPA (Package: ₹${currentPkg.rateInr.toLocaleString('en-IN')}).` },
    { title: '3. Clinical Treatment & Discharge', desc: `Hospitalization at empanelled healthcare provider (EHCP) for ${currentPkg.los} days length of stay.` },
    { title: '4. Claim Adjudication & Payout', desc: `Electronic claim settlement directly to hospital bank account via PFMS without out-of-pocket patient expense.` }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Ayushman Bharat (AB-PMJAY) Benefits & Claims Simulator</h2>
        <p className={styles.subtitle}>
          Interactive National Health Protection Scheme workflow: Beneficiary eKYC verification, Health Benefit Package (HBP 2.2) selection, Pre-Auth clearance, and electronic claim settlement.
        </p>
      </header>

      {/* Package Selector */}
      <div className={styles.packageTabs}>
        {PACKAGES.map(pkg => (
          <button
            key={pkg.id}
            className={`${styles.pkgBtn} ${selectedPkgId === pkg.id ? styles.activePkgBtn : ''}`}
            onClick={() => { setSelectedPkgId(pkg.id); setStepIdx(0); }}
          >
            <strong>{pkg.name.split('(')[0]}</strong>
            <small>₹{pkg.rateInr.toLocaleString('en-IN')} | {pkg.specialty}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: 4-Step Claim Adjudication Workflow */}
        <div className={styles.workflowCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>PM-JAY Claims Adjudication Pipeline</span>
              <span className={styles.pkgCodeBadge}>{currentPkg.code}</span>
            </div>

            <div className={styles.stepsTimeline}>
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className={`${styles.stepItem} ${stepIdx === idx ? styles.activeStep : stepIdx > idx ? styles.doneStep : ''}`}
                  onClick={() => setStepIdx(idx)}
                >
                  <div className={styles.stepCircle}>{stepIdx > idx ? '✓' : idx + 1}</div>
                  <div className={styles.stepText}>
                    <strong>{st.title}</strong>
                    <p>{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.workflowNav}>
              <button
                className={styles.navBtn}
                disabled={stepIdx === 0}
                onClick={() => setStepIdx(prev => Math.max(0, prev - 1))}
              >
                ← Previous Step
              </button>
              <button
                className={styles.nextNavBtn}
                disabled={stepIdx === steps.length - 1}
                onClick={() => setStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>

        {/* Right: ₹5 Lakh Family Wallet & Package Details */}
        <div className={styles.walletCol}>
          {/* Annual Family Wallet Tracker */}
          <div className={styles.card}>
            <span className={styles.label}>PM-JAY Annual Family Sum Insured Balance</span>
            <div className={styles.walletBox}>
              <span className={styles.walletVal}>₹{remainingWalletInr.toLocaleString('en-IN')}</span>
              <span className={styles.walletSub}>Remaining Balance (Out of ₹5,00,000 Total Cover)</span>
            </div>

            <div className={styles.walletBar}>
              <div
                className={styles.walletProgress}
                style={{ width: `${(remainingWalletInr / totalSumInsuredInr) * 100}%` }}
              />
            </div>
          </div>

          {/* Package Requirements Details */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Clinical Package Guidelines</h3>
            
            <div className={styles.guidelineItem}>
              <span>Package Code & Specialty:</span>
              <strong>{currentPkg.code} ({currentPkg.specialty})</strong>
            </div>

            <div className={styles.guidelineItem}>
              <span>National Package Rate:</span>
              <strong className={styles.rateHighlight}>₹{currentPkg.rateInr.toLocaleString('en-IN')} (Cashless)</strong>
            </div>

            <div className={styles.guidelineItem}>
              <span>Pre-Authorization:</span>
              <strong>{currentPkg.preAuth ? 'Mandatory Pre-Auth Required' : 'Auto-Approved Procedure'}</strong>
            </div>

            <div className={styles.guidelineItem}>
              <span>Mandatory Claim Documentation:</span>
              <p className={styles.docText}>{currentPkg.docs}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
