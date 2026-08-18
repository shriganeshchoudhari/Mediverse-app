"use client";

import React, { useState } from "react";
import styles from "./ClinicalPg12LabViewer.module.css";

export const ClinicalPg12LabViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"psma" | "prrt" | "thyroid" | "cardiology" | "quiz">("psma");

  // Tab 1: PSMA Theranostics & Lu-177 Pluvicto States
  const [psmaSuvMax, setPsmaSuvMax] = useState<number>(18);
  const [liverSuvMean, setLiverSuvMean] = useState<number>(6.5);
  const [treatmentCycle, setTreatmentCycle] = useState<number>(1);
  const [plateletCount, setPlateletCount] = useState<number>(120);
  const [salivaryCoolingActive, setSalivaryCoolingActive] = useState<boolean>(true);
  const [alphaTatCandidate, setAlphaTatCandidate] = useState<boolean>(false);

  // Tab 2: PRRT Lu-177 DOTATATE & SSTR2 States
  const [krenningScore, setKrenningScore] = useState<number>(4);
  const [aminoAcidCoInfusion, setAminoAcidCoInfusion] = useState<boolean>(true);
  const [carcinoidCrisisActive, setCarcinoidCrisisActive] = useState<boolean>(false);

  // Tab 3: Thyroid Cancer I-131 Ablation States
  const [ataRisk, setAtaRisk] = useState<"Low" | "Intermediate" | "High">("Intermediate");
  const [tshStimulationMode, setTshStimulationMode] = useState<"Thyrogen" | "Withdrawal">("Thyrogen");
  const [administeredRaiMci, setAdministeredRaiMci] = useState<number>(100);
  const [hoursPostDose, setHoursPostDose] = useState<number>(24);

  // Tab 4: Nuclear Cardiology MPI & Regadenoson States
  const [stressModality, setStressModality] = useState<"Bruce" | "Regadenoson" | "Adenosine" | "Dobutamine">("Regadenoson");
  const [perfusionFinding, setPerfusionFinding] = useState<"Reversible" | "Fixed" | "Artifact">("Reversible");
  const [stressMbf, setStressMbf] = useState<number>(1.8);
  const [restMbf, setRestMbf] = useState<number>(0.9);
  const [bronchospasmTriggered, setBronchospasmTriggered] = useState<boolean>(false);

  // Tab 5: Diagnostic Challenge Quiz States
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const quizQuestions = [
    {
      q: "A 68-year-old male with mCRPC post-Enzalutamide and Docetaxel undergoes 68Ga-PSMA-11 PET/CT. Scan demonstrates widespread bone and retroperitoneal nodal metastases with SUVmax 24.5 (normal liver SUVmean 6.2). Platelets are 145,000/uL and eGFR is 58 mL/min. What is the standard therapeutic regimen?",
      options: [
        "177Lu-vipivotide tetraxetan (Pluvicto) 7.4 GBq (200 mCi) IV every 6 weeks for up to 6 cycles with salivary gland cooling",
        "177Lu-DOTATATE 3.7 GBq IV every 8 weeks for 2 cycles",
        "225Ac-PSMA 50 MBq IV bolus single dose",
        "I-131 Sodium Iodide 100 mCi oral capsule with levothyroxine withdrawal"
      ],
      correct: 0,
      exp: "Per the VISION trial and FDA guidelines, patients with progressive PSMA-positive mCRPC (SUVmax > liver) receive 177Lu-vipivotide tetraxetan 7.4 GBq (200 mCi) IV every 6 weeks for up to 6 cycles. Salivary gland cooling pads reduce xerostomia."
    },
    {
      q: "A 54-year-old female with progressive metastatic ileal neuroendocrine tumor (GEP-NET) is receiving her first cycle of 177Lu-DOTATATE (Lutathera). Which co-infusion is mandatory to prevent nephrotoxicity, and what is its molecular mechanism?",
      options: [
        "Positively charged amino acid solution (2.5% L-lysine and 2.5% L-arginine) infused over 4 hours to competitively inhibit renal proximal tubular megalin/cubilin radiopeptide reabsorption",
        "0.9% Normal Saline with Furosemide to force loop diuresis",
        "Intravenous sodium bicarbonate to alkalinize urine and precipitate lutetium",
        "Continuous 20% Mannitol infusion to induce osmotic diuresis"
      ],
      correct: 0,
      exp: "Positively charged basic amino acids (L-lysine and L-arginine) competitively block the megalin/cubilin receptor complex in the proximal tubule, decreasing renal radiopeptide reabsorption by 40-60% and sparing renal cortical absorbed dose."
    },
    {
      q: "A 42-year-old female undergoes total thyroidectomy for a 2.8 cm classical papillary thyroid carcinoma with microscopic extrathyroidal extension and 4 positive central compartment lymph nodes (ATA Intermediate Risk). What is the optimal pre-ablation preparation?",
      options: [
        "Recombinant human TSH (Thyrogen 0.9 mg IM on Days 1 and 2, 131-I on Day 3) combined with a 2-week Low-Iodine Diet (<50 ug/day)",
        "Stop levothyroxine for 6 weeks with no dietary restrictions",
        "Administer high-dose Potassium Iodide (Lugol's solution) 1 day before RAI",
        "Administer Methimazole 30 mg daily to increase NIS avidity"
      ],
      correct: 0,
      exp: "For ATA Intermediate Risk DTC, Thyrogen (rhTSH 0.9 mg IM D1 & D2) allows effective remnant ablation (30-100 mCi) without inducing debilitating hypothyroidism. A strict 2-week Low-Iodine Diet depletes the stable iodide pool to maximize 131-I uptake."
    },
    {
      q: "A 62-year-old male with a history of severe persistent asthma (FEV1 52%) presents for myocardial perfusion imaging. He has a left bundle branch block (LBBB) on ECG. Which stress modality is preferred?",
      options: [
        "Pharmacologic stress with selective A2A agonist Regadenoson (0.4 mg IV) or Dobutamine; note that adenosine is contraindicated due to non-selective A2B/A3 bronchospasm, and Bruce exercise produces false-positive septal defects in LBBB",
        "Standard maximal Bruce treadmill exercise protocol",
        "High-dose Dipyridamole without reversal backup",
        "Cold pressor test with hyperventilation"
      ],
      correct: 0,
      exp: "Patients with LBBB must avoid exercise stress because rate-related dyssynchrony causes false-positive septal perfusion defects. In severe asthma, selective A2A agonist Regadenoson is preferred over non-selective Adenosine (which activates A2B/A3 bronchoconstriction). Aminophylline is the antidote."
    }
  ];

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleGradeQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // Calculations
  const psmaToLiverRatio = psmaSuvMax / (liverSuvMean || 1);
  const isVisionEligible = psmaSuvMax > liverSuvMean && plateletCount >= 50;
  const coronaryFlowReserve = restMbf > 0 ? (stressMbf / restMbf).toFixed(2) : "0.00";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>
          ☢️ Postgraduate Advanced Nuclear Medicine, Theranostics &amp; Radioligand Oncology Lab (PG-612)
        </h2>
        <p className={styles.headerSubtitle}>
          Theranostics &bull; Ga-68/F-18 PSMA &amp; Lu-177 Pluvicto &bull; PRRT Lu-177 DOTATATE &bull; I-131 Thyroid Ablation &amp; rhTSH &bull; Nuclear Cardiology MPI &amp; ALARA Dosimetry
        </p>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabButton} ${activeTab === "psma" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("psma")}
        >
          🎯 PSMA Theranostics &amp; Lu-177 Pluvicto
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "prrt" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("prrt")}
        >
          🧬 PRRT Lu-177 DOTATATE &amp; NETs
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "thyroid" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("thyroid")}
        >
          🦋 Thyroid I-131 Ablation &amp; rhTSH
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "cardiology" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("cardiology")}
        >
          ❤️ Nuclear Cardiology MPI &amp; ALARA
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "quiz" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          📝 Diagnostic Challenge Quiz
        </button>
      </div>

      {activeTab === "psma" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🎯 PSMA PET Avidity &amp; Hematologic Reserve</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                PSMA Tumor SUVmax:
                <span className={styles.sliderVal}>{psmaSuvMax.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min={2}
                max={40}
                step={0.5}
                value={psmaSuvMax}
                onChange={(e) => setPsmaSuvMax(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Normal Liver Background SUVmean:
                <span className={styles.sliderVal}>{liverSuvMean.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min={3}
                max={12}
                step={0.5}
                value={liverSuvMean}
                onChange={(e) => setLiverSuvMean(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Platelet Count:
                <span className={styles.sliderVal}>{plateletCount} &times; 10^9/L</span>
              </label>
              <input
                type="range"
                min={25}
                max={300}
                value={plateletCount}
                onChange={(e) => setPlateletCount(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Pluvicto Treatment Cycle:</label>
              <select
                className={styles.select}
                value={treatmentCycle}
                onChange={(e) => setTreatmentCycle(Number(e.target.value))}
              >
                <option value={1}>Cycle 1 (7.4 GBq / 200 mCi IV)</option>
                <option value={2}>Cycle 2 (7.4 GBq / 200 mCi IV at 6 weeks)</option>
                <option value={3}>Cycle 3 (7.4 GBq / 200 mCi IV at 12 weeks)</option>
                <option value={4}>Cycle 4 (7.4 GBq / 200 mCi IV at 18 weeks)</option>
                <option value={5}>Cycle 5 (7.4 GBq / 200 mCi IV at 24 weeks)</option>
                <option value={6}>Cycle 6 (Final cycle: 44.4 GBq cumulative)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Salivary Gland Cryotherapy &amp; Alpha TAT:</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={styles.select}
                  style={{ flex: 1, background: salivaryCoolingActive ? "#065f46" : "#0f172a", cursor: "pointer" }}
                  onClick={() => setSalivaryCoolingActive(!salivaryCoolingActive)}
                >
                  {salivaryCoolingActive ? "❄️ Ice Packs Active (Vasoconstriction)" : "❌ No Salivary Cooling"}
                </button>
                <button
                  className={styles.select}
                  style={{ flex: 1, background: alphaTatCandidate ? "#7c2d12" : "#0f172a", cursor: "pointer" }}
                  onClick={() => setAlphaTatCandidate(!alphaTatCandidate)}
                >
                  {alphaTatCandidate ? "⚡ Ac-225 Targeted Alpha Therapy" : "🔬 Lu-177 Beta Therapy"}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 Theranostic Eligibility &amp; Dosimetry Protocol</h3>

            {isVisionEligible ? (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>✅ VISION CRITERIA MET (ELIGIBLE FOR PLUVICTO)</strong>
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>Ratio: {psmaToLiverRatio.toFixed(2)}x Liver</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Prescription:</strong> Lu-177-vipivotide tetraxetan <strong>7.4 GBq (200 mCi) IV</strong> over 10-30 minutes. Cycle {treatmentCycle} of 6 (every 6 weeks).
                  <br /><strong>Salivary Protection:</strong> {salivaryCoolingActive ? "Cooling pads in place (reduces xerostomia risk by 30-40%)." : "Warning: Patient at elevated risk for Grade 2+ dry mouth."}
                </p>
              </div>
            ) : psmaSuvMax <= liverSuvMean ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <strong>❌ INELIGIBLE: Insufficient PSMA Avidity (SUVmax &le; liver)</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Tumor uptake does not exceed normal liver parenchyma. Suggests dedifferentiated tumor clones or neuroendocrine prostate cancer. Check F-18-FDG PET/CT for discordant hypermetabolic lesions.
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <strong>⚠️ CAUTION: Thrombocytopenia (Platelets {plateletCount} &times; 10^9/L &lt; 50 &times; 10^9/L)</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Hold Lu-177-PSMA cycle until platelets recover &ge; 50,000/&mu;L. Consider dose reduction to 5.5 GBq upon cycle restart.
                </p>
              </div>
            )}

            {alphaTatCandidate && (
              <div style={{ background: "rgba(124, 45, 18, 0.3)", border: "1px solid #ea580c", padding: "0.75rem", borderRadius: "0.375rem", fontSize: "0.85rem" }}>
                <strong style={{ color: "#fdba74" }}>⚡ Ac-225-PSMA-617 Targeted Alpha Therapy (TAT):</strong>
                <p style={{ margin: "0.25rem 0 0 0", color: "#fed7aa" }}>
                  Linear Energy Transfer (LET) ~ 100 keV/&mu;m (vs 0.2 keV/&mu;m for beta). Delivers double-strand DNA cluster breaks across 40-100 &mu;m path length, overcoming beta-radiation resistance. Dose: 100 kBq/kg (5-8 MBq).
                </p>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>Radiation Characteristics:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1" }}>
                <li><strong>Lu-177 Half-life (t1/2):</strong> 6.65 days (159.5 hours).</li>
                <li><strong>Beta Energy (Emax):</strong> 0.498 MeV; tissue penetration depth 1-2 mm.</li>
                <li><strong>Kidney Biological Effective Dose (BED):</strong> Sparing limit &le; 23 Gy.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "prrt" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🧬 PRRT SSTR2 Staging &amp; Amino Acid Infusion</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Krenning Visual SSTR2 Avidity Score:</label>
              <select
                className={styles.select}
                value={krenningScore}
                onChange={(e) => setKrenningScore(Number(e.target.value))}
              >
                <option value={0}>Grade 0 - No tumor uptake</option>
                <option value={1}>Grade 1 - Uptake &lt; normal liver</option>
                <option value={2}>Grade 2 - Uptake = normal liver</option>
                <option value={3}>Grade 3 - Uptake &gt; normal liver (PRRT Candidate)</option>
                <option value={4}>Grade 4 - Uptake &gt; spleen / kidney (Ideal PRRT Target)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Renal Radioprotective Amino Acid Co-Infusion:</label>
              <button
                className={styles.select}
                style={{ background: aminoAcidCoInfusion ? "#065f46" : "#991b1b", cursor: "pointer", fontWeight: "600" }}
                onClick={() => setAminoAcidCoInfusion(!aminoAcidCoInfusion)}
              >
                {aminoAcidCoInfusion ? "✅ 2.5% L-Lysine + L-Arginine Co-Infusion Active" : "❌ No Amino Acid Protection (High Renal Dose!)"}
              </button>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Acute Carcinoid Crisis Simulator:</label>
              <button
                className={styles.select}
                style={{ background: carcinoidCrisisActive ? "#991b1b" : "#0f172a", cursor: "pointer", fontWeight: "600" }}
                onClick={() => setCarcinoidCrisisActive(!carcinoidCrisisActive)}
              >
                {carcinoidCrisisActive ? "🚨 CARCINOID CRISIS ACTIVE (Flushing &amp; Hypotension)" : "✅ Hemodynamically Stable"}
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 PRRT Treatment &amp; Megalin/Cubilin Status</h3>

            {carcinoidCrisisActive ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>🚨 ACUTE CARCINOID CRISIS TRIGGERED!</strong>
                  <span className={`${styles.badge} ${styles.badgeRed}`}>Medical Emergency</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Pathophysiology:</strong> Radiation-induced tumor lysis releasing massive serotonin, bradykinin, and histamine &rarr; profound hypotension, bronchospasm, and flush.
                  <br /><strong>Emergency Rescue:</strong> Immediately administer <strong>Octreotide 100-500 &mu;g IV bolus</strong> over 5-10 minutes, followed by continuous infusion (50-100 &mu;g/hour). Avoid epinephrine.
                </p>
              </div>
            ) : krenningScore >= 3 ? (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <strong>✅ PRRT Indicated (Krenning Grade {krenningScore}):</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Prescribe <strong>Lu-177-DOTATATE (Lutathera) 7.4 GBq (200 mCi) IV</strong> over 30 minutes every 8 weeks &times; 4 cycles.
                  <br />{aminoAcidCoInfusion ? "Megalin/cubilin receptors saturated by basic amino acids: renal cortex absorbed dose reduced by 50%." : "WARNING: Proximal tubule reabsorption active; severe risk of long-term radiation nephropathy!"}
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <strong>⚠️ Insufficient SSTR2 Density (Krenning Grade {krenningScore} &lt; 3):</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Tumor SSTR2 density is inadequate for therapeutic beta-particle delivery. Continue first-line somatostatin analogs or consider capecitabine/temozolomide chemotherapy.
                </p>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>Long-Term PRRT Pharmacovigilance:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1" }}>
                <li><strong>Secondary Myeloid Neoplasm (t-MDS / t-AML):</strong> 1.5-2.0% cumulative lifetime risk at 2-5 years.</li>
                <li><strong>Somatostatin Analog Washout:</strong> Stop Octreotide LAR 4-6 weeks prior to each cycle to prevent competitive receptor blockade.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "thyroid" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🦋 ATA Risk Category &amp; I-131 Ablation Dosing</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>ATA Recurrence Risk Category:</label>
              <select
                className={styles.select}
                value={ataRisk}
                onChange={(e) => {
                  const risk = e.target.value as "Low" | "Intermediate" | "High";
                  setAtaRisk(risk);
                  if (risk === "Low") setAdministeredRaiMci(30);
                  else if (risk === "Intermediate") setAdministeredRaiMci(100);
                  else setAdministeredRaiMci(150);
                }}
              >
                <option value="Low">Low Risk (Intrathyroidal &le; 4 cm, N0 / micro-N1, non-aggressive)</option>
                <option value="Intermediate">Intermediate Risk (Microscopic ETE, clinical N1, aggressive histology)</option>
                <option value="High">High Risk (Gross ETE T4, incomplete resection R2, distant M1)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>TSH Stimulation Protocol:</label>
              <select
                className={styles.select}
                value={tshStimulationMode}
                onChange={(e) => setTshStimulationMode(e.target.value as any)}
              >
                <option value="Thyrogen">rhTSH (Thyrogen 0.9 mg IM D1 &amp; D2; euthyroid throughout)</option>
                <option value="Withdrawal">Thyroid Hormone Withdrawal (Stop T4 x 4-6 wks; TSH &gt; 30 mIU/L)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Administered I-131 Activity:
                <span className={styles.sliderVal}>{administeredRaiMci} mCi ({Math.round(administeredRaiMci * 37)} MBq)</span>
              </label>
              <input
                type="range"
                min={30}
                max={200}
                step={10}
                value={administeredRaiMci}
                onChange={(e) => setAdministeredRaiMci(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Elapsed Time Post-Dose:
                <span className={styles.sliderVal}>{hoursPostDose} Hours</span>
              </label>
              <input
                type="range"
                min={0}
                max={72}
                value={hoursPostDose}
                onChange={(e) => setHoursPostDose(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 NRC Radiation Release &amp; Redifferentiation</h3>

            {administeredRaiMci > 33 && hoursPostDose < 12 ? (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>☢️ INPATIENT ISOLATION MANDATED</strong>
                  <span className={`${styles.badge} ${styles.badgeRed}`}>Retained &gt; 33 mCi</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Patient retained activity exceeds NRC 10 CFR 35.75 release criteria (&gt; 33 mCi / measured dose rate at 1m &gt; 7 mrem/hr). Maintain lead shielding and strict visitor restrictions.
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>✅ SAFE FOR OUTPATIENT RELEASE (NRC 10 CFR 35.75)</strong>
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>Dose Rate &le; 7 mrem/hr</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Instruct patient on home precautions (sleep alone &ge; 6 ft, double flush, separate dishes for 5 days). Start sour lemon candies at <strong>24 hours post-dose</strong> to protect salivary glands.
                </p>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>RAI-Refractory Thyroid Redifferentiation:</h4>
              <p style={{ color: "#cbd5e1", margin: 0 }}>
                Tumors with loss of NIS avidity secondary to <em>BRAF</em> V600E or <em>RAS</em> mutations can be redifferentiated with <strong>Dabrafenib + Trametinib</strong> or <strong>Selumetinib</strong> to restore basolateral NIS expression and I-131 therapeutic uptake.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cardiology" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>❤️ Nuclear Cardiology MPI &amp; Vasodilator Stress</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Stress Modality Selection:</label>
              <select
                className={styles.select}
                value={stressModality}
                onChange={(e) => setStressModality(e.target.value as any)}
              >
                <option value="Bruce">Maximal Exercise Bruce Protocol (&ge; 85% MPHR)</option>
                <option value="Regadenoson">Selective A2A Agonist Regadenoson (0.4 mg IV)</option>
                <option value="Adenosine">Non-Selective Adenosine (140 ug/kg/min x 6 min)</option>
                <option value="Dobutamine">Inotrope Dobutamine (5-40 ug/kg/min)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Perfusion Polar Map Pattern:</label>
              <select
                className={styles.select}
                value={perfusionFinding}
                onChange={(e) => setPerfusionFinding(e.target.value as any)}
              >
                <option value="Reversible">Reversible Ischemia (Stress Defect + Rest Normal)</option>
                <option value="Fixed">Fixed Infarction Scar (Stress Defect + Rest Defect)</option>
                <option value="Artifact">Soft Tissue Attenuation Artifact (Normal Gated Wall Motion)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Stress Myocardial Blood Flow (MBF):
                <span className={styles.sliderVal}>{stressMbf.toFixed(2)} mL/g/min</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={4.0}
                step={0.1}
                value={stressMbf}
                onChange={(e) => setStressMbf(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Rest Myocardial Blood Flow (MBF):
                <span className={styles.sliderVal}>{restMbf.toFixed(2)} mL/g/min</span>
              </label>
              <input
                type="range"
                min={0.4}
                max={1.5}
                step={0.05}
                value={restMbf}
                onChange={(e) => setRestMbf(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Vasodilator Bronchospasm Simulator:</label>
              <button
                className={styles.select}
                style={{ background: bronchospasmTriggered ? "#991b1b" : "#0f172a", cursor: "pointer", fontWeight: "600" }}
                onClick={() => setBronchospasmTriggered(!bronchospasmTriggered)}
              >
                {bronchospasmTriggered ? "🚨 BRONCHOSPASM / AV BLOCK (Need Aminophylline)" : "✅ Normal Vasodilation Response"}
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 Scintigraphy Interpretation &amp; ALARA Physics</h3>

            {bronchospasmTriggered ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <strong>🚨 ADVERSE VASODILATOR REACTION (A2B/A1 ACTIVATION):</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Immediately administer <strong>Aminophylline 100-200 mg IV</strong> slow push over 2-3 minutes. Competitively displaces adenosine from purinergic receptors, reversing bronchospasm, AV nodal conduction block, and hypotension.
                </p>
              </div>
            ) : perfusionFinding === "Reversible" ? (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <strong>⚠️ Inducible Reversible Myocardial Ischemia:</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Stress defect with complete resting fill-in indicates viable myocardium at risk for ischemic injury. Coronary Flow Reserve (CFR) = <strong>{coronaryFlowReserve}</strong> {Number(coronaryFlowReserve) < 2.0 ? "(Impaired < 2.0: Multivessel or microvascular disease)" : "(Normal > 2.0)"}. Recommend diagnostic coronary angiography / revascularization.
                </p>
              </div>
            ) : perfusionFinding === "Fixed" ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <strong>Fixed Perfusion Defect (Myocardial Infarction / Scar):</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Akinetic resting wall motion with persistent defect. Consider F-18-FDG PET myocardial viability imaging to assess for hibernating myocardium before CABG.
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <strong>✅ Soft Tissue Attenuation Artifact:</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Preserved regional wall thickening and normal ejection fraction on gated SPECT confirms absence of true obstructive CAD.
                </p>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>ALARA &amp; Radiation Safety Rules:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1" }}>
                <li><strong>Inverse Square Law (1/r^2):</strong> Doubling distance reduces radiation exposure by 75%.</li>
                <li><strong>NRC Occupational TEDE Limit:</strong> &le; 50 mSv/year (5 rem/year).</li>
                <li><strong>Beta Shielding:</strong> Acrylic/plastic primary shield to prevent Bremsstrahlung X-rays.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📝 Postgraduate Nuclear Medicine Diagnostic Challenge</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
            Assess your postgraduate clinical mastery of Lu-177-PSMA Pluvicto, PRRT amino acid radioprotection, I-131 ATA stratification, and MPI Regadenoson kinetics.
          </p>

          {quizQuestions.map((q, idx) => (
            <div key={idx} style={{ background: "#0f172a", padding: "1rem", borderRadius: "0.375rem", border: "1px solid #334155", marginBottom: "1rem" }}>
              <p style={{ color: "#f8fafc", fontWeight: "600", fontSize: "0.9rem", margin: "0 0 0.75rem 0" }}>
                {idx + 1}. {q.q}
              </p>
              <div>
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[idx] === optIdx;
                  const isCorrect = q.correct === optIdx;
                  let btnStyle = styles.quizOption;
                  if (quizSubmitted) {
                    if (isCorrect) btnStyle = `${styles.quizOption} ${styles.quizOptionCorrect}`;
                    else if (isSelected) btnStyle = `${styles.quizOption} ${styles.quizOptionIncorrect}`;
                  }
                  return (
                    <button
                      key={optIdx}
                      className={btnStyle}
                      onClick={() => handleSelectAnswer(idx, optIdx)}
                    >
                      <span style={{ fontWeight: "700", marginRight: "0.5rem" }}>
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.825rem", color: "#94a3b8", background: "rgba(0,0,0,0.2)", padding: "0.5rem", borderRadius: "0.25rem" }}>
                  <strong>Explanation:</strong> {q.exp}
                </div>
              )}
            </div>
          ))}

          {!quizSubmitted ? (
            <button
              style={{
                background: "#0284c7",
                color: "#ffffff",
                padding: "0.6rem 1.2rem",
                borderRadius: "0.375rem",
                border: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
              onClick={handleGradeQuiz}
            >
              Submit &amp; Calculate Mastery Score
            </button>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ color: "#38bdf8", fontWeight: "700", fontSize: "1.1rem" }}>
                Score: {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
              </div>
              <button
                style={{
                  background: "#334155",
                  color: "#f8fafc",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
                onClick={handleResetQuiz}
              >
                🔄 Retake Diagnostic Challenge
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
