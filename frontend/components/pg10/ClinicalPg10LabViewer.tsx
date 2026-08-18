"use client";

import React, { useState } from "react";
import styles from "./ClinicalPg10LabViewer.module.css";

export const ClinicalPg10LabViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"trd" | "catatonia" | "clozapine" | "lithium" | "quiz">("trd");

  // Tab 1: TRD & Neuromodulation States
  const [failedAntidepressants, setFailedAntidepressants] = useState<number>(2);
  const [psychoticFeatures, setPsychoticFeatures] = useState<boolean>(true);
  const [acuteSuicidality, setAcuteSuicidality] = useState<boolean>(true);
  const [ectPlacement, setEctPlacement] = useState<"RUL" | "Bitemporal" | "Bifrontal">("Bitemporal");
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);

  // Tab 2: Catatonia, NMS & Serotonin Syndrome States
  const [emergencyPresentation, setEmergencyPresentation] = useState<"NMS" | "SerotoninSyndrome" | "Catatonia">("NMS");
  const [ckLevel, setCkLevel] = useState<number>(28000);
  const [bodyTempC, setBodyTempC] = useState<number>(39.5);
  const [lorazepamGiven, setLorazepamGiven] = useState<boolean>(false);

  // Tab 3: Clozapine REMS & ANC States
  const [patientType, setPatientType] = useState<"General" | "BEN">("General");
  const [currentAnc, setCurrentAnc] = useState<number>(850);
  const [clozapineDoseMg, setClozapineDoseMg] = useState<number>(300);
  const [treatmentWeek, setTreatmentWeek] = useState<number>(4);

  // Tab 4: Bipolar & Lithium Toxicity States
  const [serumLithiumMeq, setSerumLithiumMeq] = useState<number>(3.2);
  const [thiazideCoPrescribed, setThiazideCoPrescribed] = useState<boolean>(true);
  const [postpartumPsychosisRisk, setPostpartumPsychosisRisk] = useState<boolean>(true);

  // Tab 5: Diagnostic Challenge Quiz State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const quizQuestions = [
    {
      q: "A 48-year-old patient with severe psychotic depression and acute food refusal is scheduled for emergency Electroconvulsive Therapy (ECT). Which anesthetic induction and neuromuscular blockade regimen represents the standard of care?",
      options: [
        "Methohexital (0.75-1.0 mg/kg IV) for minimal seizure threshold interference + Succinylcholine (0.5-1.0 mg/kg IV) for muscle relaxation",
        "Propofol (2.5 mg/kg) + Rocuronium with sugammadex reversal",
        "High-dose Diazepam + Pancuronium",
        "Ketamine monotherapy without muscle relaxants"
      ],
      correct: 0,
      exp: "Methohexital is the gold-standard barbiturate induction agent for ECT because it produces rapid anesthesia with minimal anticonvulsant activity (unlike propofol which elevates seizure threshold). Succinylcholine is the gold-standard depolarizing neuromuscular blocker that prevents seizure-induced bone fractures."
    },
    {
      q: "Which clinical and laboratory feature most reliably differentiates Neuroleptic Malignant Syndrome (NMS) from Serotonin Syndrome (SS)?",
      options: [
        "NMS presents with 'lead-pipe' rigidity, hyporeflexia, and massive CK elevation (>1,000-100,000 U/L), whereas Serotonin Syndrome presents with hyperreflexia, ocular/spontaneous clonus, and normal to mildly elevated CK",
        "Serotonin Syndrome causes severe lead-pipe rigidity with hyporeflexia",
        "NMS causes hyperactive bowel sounds and dilated pupils with normal CK",
        "Both syndromes require high-dose Flumazenil administration"
      ],
      correct: 0,
      exp: "Hunter Serotonin Toxicity Criteria emphasize neuromuscular excitation (spontaneous/ocular clonus and hyperreflexia) with acute onset. NMS features dopamine blockade-induced generalized 'lead-pipe' rigidity with hyporeflexia and massive rhabdomyolytic CK elevation."
    },
    {
      q: "Under FDA Clozapine REMS guidelines for the general population, what is the mandatory action if a patient's Absolute Neutrophil Count (ANC) falls to 850/uL during treatment?",
      options: [
        "Immediately suspend Clozapine, obtain daily CBC with differential, consult hematology, and withhold until ANC recovers >= 1,000/uL",
        "Continue Clozapine at the current dose and repeat CBC in 4 weeks",
        "Double the dose of Clozapine to stimulate bone marrow",
        "Switch immediately to Olanzapine without checking further blood counts"
      ],
      correct: 0,
      exp: "For ANC between 500-999/uL (moderate neutropenia), Clozapine must be immediately suspended with daily CBC monitoring. If ANC drops <500/uL (agranulocytosis), Clozapine must be permanently discontinued with future rechallenge strictly contraindicated."
    },
    {
      q: "A patient on chronic Lithium presents with severe confusion, ataxia, hyperreflexia, and a serum lithium level of 3.4 mEq/L with acute renal impairment. What is the definitive life-saving intervention?",
      options: [
        "Emergent Hemodialysis (indicated for serum lithium >2.5 mEq/L with severe neurotoxicity or >4.0 mEq/L)",
        "Oral activated charcoal and discharge home",
        "Forced diuresis with intravenous furosemide",
        "Administration of oral potassium chloride supplements"
      ],
      correct: 0,
      exp: "Lithium is a small monovalent cation with low protein binding and small volume of distribution, making it exceptionally dialyzable. Hemodialysis is the definitive treatment for severe toxicity (>2.5 mEq/L with symptoms or >4.0 mEq/L)."
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

  // Helper calculations
  const methohexitalDose = (patientWeightKg * 0.85).toFixed(1);
  const succinylcholineDose = (patientWeightKg * 0.75).toFixed(1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>
          🧠 Postgraduate Advanced Psychiatry, Neuropsychiatry &amp; Neuromodulation Lab (PG-610)
        </h2>
        <p className={styles.headerSubtitle}>
          Interactive Neuropsychiatric Resuscitation &bull; Treatment-Resistant Depression &bull; ECT/rTMS &bull; NMS &amp; Serotonin Syndrome &bull; Clozapine REMS &bull; Lithium Dialysis
        </p>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabButton} ${activeTab === "trd" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("trd")}
        >
          ⚡ TRD &amp; Interventional Neuromodulation
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "catatonia" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("catatonia")}
        >
          🚨 Catatonia, NMS &amp; Serotonin Syndrome
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "clozapine" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("clozapine")}
        >
          🔬 Clozapine Titration &amp; ANC REMS
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "lithium" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("lithium")}
        >
          🧪 Bipolar Mania &amp; Lithium Resuscitation
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "quiz" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          📝 Diagnostic Challenge Quiz
        </button>
      </div>

      {activeTab === "trd" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>⚡ Clinical Presentation &amp; Neuromodulation Selection</h3>
            
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Prior Failed Antidepressant Trials (Adequate Dose &amp; Duration &ge; 6-8 weeks):
              </label>
              <select
                className={styles.select}
                value={failedAntidepressants}
                onChange={(e) => setFailedAntidepressants(Number(e.target.value))}
              >
                <option value={0}>0 Trials (Treatment-Naive)</option>
                <option value={1}>1 Trial (Inadequate Response)</option>
                <option value={2}>2 Trials (Confirms Treatment-Resistant Depression TRD)</option>
                <option value={3}>&ge; 3 Trials (Highly Refractory Depression)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Psychotic Features (Delusions of Guilt/Poverty):</label>
              <select
                className={styles.select}
                value={psychoticFeatures ? "yes" : "no"}
                onChange={(e) => setPsychoticFeatures(e.target.value === "yes")}
              >
                <option value="yes">Yes - Psychotic Depression Present</option>
                <option value="no">No - Non-Psychotic Depression</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Life-Threatening Emergency (Acute Suicidality / Food Refusal):</label>
              <select
                className={styles.select}
                value={acuteSuicidality ? "yes" : "no"}
                onChange={(e) => setAcuteSuicidality(e.target.value === "yes")}
              >
                <option value="yes">Yes - Urgent Intervention Indicated</option>
                <option value="no">No - Outpatient Protocol Eligible</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>ECT Electrode Placement Strategy:</label>
              <select
                className={styles.select}
                value={ectPlacement}
                onChange={(e) => setEctPlacement(e.target.value as any)}
              >
                <option value="Bitemporal">Bitemporal (Bilateral) - Maximum Speed &amp; Emergency Efficacy</option>
                <option value="RUL">Right Unilateral (RUL d&apos;Elia) - Minimizes Retrograde Amnesia</option>
                <option value="Bifrontal">Bifrontal - Intermediate Cognitive Sparing</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Patient Body Weight:
                <span className={styles.sliderVal}>{patientWeightKg} kg</span>
              </label>
              <input
                type="range"
                min={40}
                max={120}
                value={patientWeightKg}
                onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 Anesthesia &amp; Neuromodulation Prescription</h3>

            {failedAntidepressants >= 2 && (psychoticFeatures || acuteSuicidality) ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <strong>🚨 Priority Intervention: Electroconvulsive Therapy (ECT)</strong>
                <p style={{ margin: "0.4rem 0 0 0" }}>
                  Patient meets criteria for severe Treatment-Resistant Depression with high-risk clinical features. ECT is the gold-standard, life-saving modality achieving &gt;80-90% rapid remission.
                </p>
              </div>
            ) : failedAntidepressants >= 2 ? (
              <div className={`${styles.alertBox} ${styles.alertInfo}`}>
                <strong>💡 Non-Urgent TRD Protocols:</strong>
                <p style={{ margin: "0.4rem 0 0 0" }}>
                  Options include: (1) rTMS (10 Hz over Left DLPFC, 36 sessions); (2) Intranasal Esketamine (Spravato 56/84 mg with 2-hour REMS monitoring); (3) Pharmacologic augmentation with Aripiprazole (2-5 mg) or Lithium (0.6-0.8 mEq/L).
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <strong>First-Line Antidepressant Optimization:</strong> Optimize SSRI/SNRI dose for a full 6-8 weeks prior to declaring treatment resistance.
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "1rem", borderRadius: "0.375rem", border: "1px solid #334155" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>
                💉 Standard ECT Anesthetic Regimen (Weight-Adjusted for {patientWeightKg} kg):
              </h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
                <li>
                  <strong>Induction Barbiturate:</strong> Methohexital (0.75-1.0 mg/kg) &rarr;{" "}
                  <span style={{ color: "#38bdf8", fontWeight: "700" }}>{methohexitalDose} mg IV</span> (avoids seizure threshold elevation).
                </li>
                <li>
                  <strong>Muscle Relaxant:</strong> Succinylcholine (0.5-1.0 mg/kg) &rarr;{" "}
                  <span style={{ color: "#38bdf8", fontWeight: "700" }}>{succinylcholineDose} mg IV</span> (prevents bone fractures).
                </li>
                <li>
                  <strong>Oxygenation:</strong> 100% O<sub>2</sub> positive-pressure hyperventilation prior to electrical stimulus (lowers seizure threshold and prolongs therapeutic seizure duration).
                </li>
                <li>
                  <strong>Seizure Duration Goals:</strong> Motor seizure &ge; 15-20s, EEG seizure &ge; 25-30s.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "catatonia" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🚨 Neuropsychiatric Emergency Simulator</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Emergency Syndrome Under Evaluation:</label>
              <select
                className={styles.select}
                value={emergencyPresentation}
                onChange={(e) => setEmergencyPresentation(e.target.value as any)}
              >
                <option value="NMS">Neuroleptic Malignant Syndrome (NMS)</option>
                <option value="SerotoninSyndrome">Serotonin Syndrome (SS)</option>
                <option value="Catatonia">Acute Catatonia (Bush-Francis Features)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Body Temperature:
                <span className={styles.sliderVal}>{bodyTempC} &deg;C ({((bodyTempC * 9)/5 + 32).toFixed(1)} &deg;F)</span>
              </label>
              <input
                type="range"
                min={36.5}
                max={42.0}
                step={0.1}
                value={bodyTempC}
                onChange={(e) => setBodyTempC(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Serum Creatine Kinase (CK):
                <span className={styles.sliderVal}>{ckLevel.toLocaleString()} U/L</span>
              </label>
              <input
                type="range"
                min={100}
                max={100000}
                step={500}
                value={ckLevel}
                onChange={(e) => setCkLevel(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Lorazepam 1-2 mg IV Challenge Executed:</label>
              <button
                className={styles.select}
                style={{ background: lorazepamGiven ? "#065f46" : "#0f172a", cursor: "pointer", fontWeight: "600" }}
                onClick={() => setLorazepamGiven(!lorazepamGiven)}
              >
                {lorazepamGiven ? "✅ Lorazepam Challenge Positive (>50% BFCRS Reduction)" : "🔘 Administer 2 mg IV Lorazepam Challenge"}
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🛡️ Diagnostic Differentiation &amp; Resuscitation Protocol</h3>

            {emergencyPresentation === "NMS" && (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>🚨 Neuroleptic Malignant Syndrome (NMS)</strong>
                  <span className={`${styles.badge} ${styles.badgeRed}`}>Rhabdomyolysis Alert</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Pathognomonic Signs:</strong> Severe &quot;lead-pipe&quot; rigidity, hyporeflexia, hyperthermia ({bodyTempC} &deg;C), and massive CK elevation ({ckLevel.toLocaleString()} U/L).
                </p>
                <div style={{ marginTop: "0.5rem", background: "rgba(0,0,0,0.3)", padding: "0.5rem", borderRadius: "0.25rem" }}>
                  <strong>Emergency Management Sequence:</strong>
                  <ol style={{ margin: "0.25rem 0 0 0", paddingLeft: "1.2rem" }}>
                    <li>Immediately DISCONTINUE all D2 receptor antagonist antipsychotics.</li>
                    <li>Aggressive IV isotonic saline hydration (target urine output &ge; 200 mL/hr) to prevent myoglobinuric acute renal failure.</li>
                    <li>
                      <strong>Dantrolene</strong> (1-2.5 mg/kg IV Q6H) to inhibit ryanodine receptor calcium release + <strong>Bromocriptine</strong> (2.5-5 mg PO/NG Q8H) or Amantadine to restore dopaminergic tone.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {emergencyPresentation === "SerotoninSyndrome" && (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>⚠️ Serotonin Syndrome (Hunter Toxicity Criteria)</strong>
                  <span className={`${styles.badge} ${styles.badgeYellow}`}>Neuromuscular Excitation</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Key Distinguishing Features:</strong> Hyperreflexia, spontaneous/ocular clonus, mydriasis, diaphoresis, hyperactive bowel sounds (diarrhea), and acute onset following serotonergic exposure.
                </p>
                <div style={{ marginTop: "0.5rem", background: "rgba(0,0,0,0.3)", padding: "0.5rem", borderRadius: "0.25rem" }}>
                  <strong>Targeted Antidote:</strong> Discontinue serotonergic agents, IV hydration, Benzodiazepines for agitation/rigidity, and <strong>Cyproheptadine</strong> (12 mg PO loading dose, then 2 mg Q2H) as a 5-HT<sub>2A</sub> antagonist.
                </div>
              </div>
            )}

            {emergencyPresentation === "Catatonia" && (
              <div className={`${styles.alertBox} ${styles.alertInfo}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>🩺 Catatonia &amp; Bush-Francis Protocol</strong>
                  <span className={`${styles.badge} ${styles.badgeBlue}`}>GABA-A Agonist Responsive</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Lorazepam Challenge:</strong> Administration of 1-2 mg IV Lorazepam provides rapid diagnostic confirmation and therapeutic relief. Scheduled dosing: 8-16 mg/day in divided doses. Emergency ECT indicated for Malignant Catatonia with autonomic instability.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "clozapine" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🔬 Clozapine REMS &amp; ANC Titration Protocol</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Patient Population Classification:</label>
              <select
                className={styles.select}
                value={patientType}
                onChange={(e) => setPatientType(e.target.value as any)}
              >
                <option value="General">General Population (Baseline ANC &ge; 1,500/&mu;L)</option>
                <option value="BEN">Benign Ethnic Neutropenia BEN (Baseline ANC &ge; 1,000/&mu;L)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Current Absolute Neutrophil Count (ANC):
                <span className={styles.sliderVal}>{currentAnc.toLocaleString()} /&mu;L</span>
              </label>
              <input
                type="range"
                min={100}
                max={4000}
                step={50}
                value={currentAnc}
                onChange={(e) => setCurrentAnc(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Clozapine Daily Dose:
                <span className={styles.sliderVal}>{clozapineDoseMg} mg/day</span>
              </label>
              <input
                type="range"
                min={25}
                max={900}
                step={25}
                value={clozapineDoseMg}
                onChange={(e) => setClozapineDoseMg(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Treatment Duration:
                <span className={styles.sliderVal}>Week {treatmentWeek} (Month {Math.ceil(treatmentWeek / 4)})</span>
              </label>
              <input
                type="range"
                min={1}
                max={52}
                value={treatmentWeek}
                onChange={(e) => setTreatmentWeek(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 FDA REMS Status &amp; Clinical Decision</h3>

            {currentAnc < 500 ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>🛑 AGRANULOCYTOSIS (ANC &lt; 500/&mu;L)</strong>
                  <span className={`${styles.badge} ${styles.badgeRed}`}>Permanent Contraindication</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Mandatory REMS Actions:</strong>
                  <br />&bull; <strong>PERMANENTLY DISCONTINUE CLOZAPINE IMMEDIATELY.</strong>
                  <br />&bull; Patient must NEVER be rechallenged with Clozapine.
                  <br />&bull; Reverse isolation, urgent hematology consultation, daily CBC, and administer G-CSF (Filgrastim) if febrile or symptomatic.
                </p>
              </div>
            ) : currentAnc < 1000 ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>⚠️ SEVERE NEUTROPENIA (ANC 500-999/&mu;L)</strong>
                  <span className={`${styles.badge} ${styles.badgeYellow}`}>Suspend Treatment</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Mandatory REMS Actions:</strong>
                  <br />&bull; Immediately SUSPEND Clozapine.
                  <br />&bull; Daily CBC with differential until ANC &ge; 1,000/&mu;L (or &ge; 500/&mu;L for BEN).
                  <br />&bull; Resume Clozapine only after hematology clearance and ANC recovery.
                </p>
              </div>
            ) : currentAnc < 1500 && patientType === "General" ? (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>⚡ MILD NEUTROPENIA (ANC 1,000-1,499/&mu;L)</strong>
                  <span className={`${styles.badge} ${styles.badgeYellow}`}>Increased Monitoring</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Continue Clozapine treatment; increase monitoring frequency to <strong>3 times weekly</strong> until ANC &ge; 1,500/&mu;L.
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>✅ ANC Normal &amp; REMS Compliant</strong>
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>
                    {treatmentWeek <= 26 ? "Weekly CBC" : treatmentWeek <= 52 ? "Biweekly CBC" : "Monthly CBC"}
                  </span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Therapeutic trough serum level target: <strong>350-600 ng/mL</strong>. Monitor for constipation (mandatory bowel regimen) and early myocarditis (troponin/CRP in first 4-6 weeks).
                </p>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>High-Yield Clozapine Adverse Effect Surveillance:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1" }}>
                <li><strong>Myocarditis (Weeks 1-6):</strong> Check baseline &amp; weekly Troponin + CRP. If elevated &rarr; STOP Clozapine.</li>
                <li><strong>Gastrointestinal Hypomotility:</strong> High mortality from toxic megacolon; prescribe prophylactic PEG / stool softeners.</li>
                <li><strong>Dose-Dependent Seizures:</strong> Risk increases at doses &gt; 600 mg/day; treat with Valproate.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lithium" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🧪 Lithium Concentration &amp; Resuscitation Suite</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Serum Lithium Concentration:
                <span className={styles.sliderVal}>{serumLithiumMeq.toFixed(1)} mEq/L</span>
              </label>
              <input
                type="range"
                min={0.2}
                max={5.0}
                step={0.1}
                value={serumLithiumMeq}
                onChange={(e) => setSerumLithiumMeq(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Precipitating Drug Interaction (Thiazide Diuretics / NSAIDs / ACEi):</label>
              <select
                className={styles.select}
                value={thiazideCoPrescribed ? "yes" : "no"}
                onChange={(e) => setThiazideCoPrescribed(e.target.value === "yes")}
              >
                <option value="yes">Yes - Thiazide / NSAID reduces renal lithium clearance</option>
                <option value="no">No - Single-agent therapy</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Perinatal / Pregnancy Teratology Evaluation:</label>
              <select
                className={styles.select}
                value={postpartumPsychosisRisk ? "yes" : "no"}
                onChange={(e) => setPostpartumPsychosisRisk(e.target.value === "yes")}
              >
                <option value="yes">Postpartum Patient (High Infanticide / Psychosis Risk)</option>
                <option value="no">First Trimester Pregnancy (Teratology Evaluation)</option>
              </select>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 Lithium Toxicity &amp; Perinatal Protocol</h3>

            {serumLithiumMeq > 2.5 ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>🚨 SEVERE LITHIUM TOXICITY ({serumLithiumMeq.toFixed(1)} mEq/L)</strong>
                  <span className={`${styles.badge} ${styles.badgeRed}`}>EMERGENT HEMODIALYSIS</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Pathology &amp; Indications:</strong> Seizures, coma, dysrhythmias, permanent cerebellar injury. Emergent hemodialysis is mandatory for levels &gt;2.5 mEq/L with severe neurotoxicity or &gt;4.0 mEq/L acute ingestion.
                </p>
              </div>
            ) : serumLithiumMeq >= 1.5 ? (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>⚠️ MILD TO MODERATE LITHIUM TOXICITY ({serumLithiumMeq.toFixed(1)} mEq/L)</strong>
                  <span className={`${styles.badge} ${styles.badgeYellow}`}>IV Normal Saline</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Hold Lithium; aggressive IV 0.9% Normal Saline hydration to promote renal excretion. Discontinue Thiazides/NSAIDs immediately.
                </p>
              </div>
            ) : serumLithiumMeq >= 0.8 ? (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <strong>✅ Acute Bipolar Mania Therapeutic Target (0.8-1.2 mEq/L)</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Optimal antimanic efficacy. Monitor 12-hour post-dose trough levels, renal panel, and TSH.
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertInfo}`}>
                <strong>Maintenance Mood Stabilization Target (0.6-0.8 mEq/L)</strong>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>Perinatal Mood Stabilizer &amp; Teratology Matrix:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1" }}>
                <li>
                  <strong>Postpartum Psychosis:</strong> High infanticide risk; requires immediate inpatient hospitalization, separation from infant under supervision, and rapid antipsychotic/ECT therapy.
                </li>
                <li>
                  <strong>Lithium Teratogenicity:</strong> Ebstein anomaly (tricuspid valve apical displacement, ~1/1000 absolute risk).
                </li>
                <li>
                  <strong>Valproate Teratogenicity:</strong> Neural tube defects (spina bifida 1-2%) &amp; 8-10 point IQ drop; strictly contraindicated in childbearing potential.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📝 Postgraduate Psychiatry Diagnostic Challenge</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
            Test your mastery of TRD neuromodulation, NMS vs SS differentiation, Clozapine REMS, and Lithium resuscitation protocols.
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
