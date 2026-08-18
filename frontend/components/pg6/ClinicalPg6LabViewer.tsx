"use client";

import React, { useState } from "react";
import styles from "./ClinicalPg6LabViewer.module.css";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PG6_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "During a general anesthetic with Sevoflurane and Succinylcholine, what is the earliest and most reliable clinical indicator of an impending Malignant Hyperthermia crisis?",
    options: [
      "A sudden, unexplained, and refractory elevation in End-Tidal CO2 (EtCO2 >55-60 mmHg) despite doubling minute ventilation",
      "Fulminant hyperthermia with core temperature >41°C",
      "Profound bradycardia and hypotension",
      "Gross hematuria and acute renal failure"
    ],
    correctAnswer: 0,
    explanation: "The earliest, most sensitive and reliable clinical sign of MH is a sudden, unexplained rise in End-Tidal CO2 refractory to hyperventilation, driven by explosive aerobic cellular respiration before temperature rises."
  },
  {
    id: "q2",
    question: "According to MHAUS protocols, what is the initial loading dose of Dantrolene Sodium, and which cardiac medication is strictly contraindicated during an MH crisis?",
    options: [
      "2.5 mg/kg IV push rapidly (repeated up to 10 mg/kg); Calcium Channel Blockers (e.g. Verapamil/Diltiazem) are strictly contraindicated due to fatal hyperkalemic myocardial arrest",
      "10 mg/kg IV push; Beta-blockers are contraindicated",
      "0.5 mg/kg IV infusion over 1 hour; Adenosine is contraindicated",
      "1.0 mg/kg IV push; Digoxin is contraindicated"
    ],
    correctAnswer: 0,
    explanation: "MHAUS mandates Dantrolene 2.5 mg/kg IV push rapidly through large-bore IVs. Concomitant administration of Calcium Channel Blockers with Dantrolene causes severe hyperkalemia, profound myocardial depression, and fatal asystolic arrest."
  },
  {
    id: "q3",
    question: "For an adult presenting with Bupivacaine-induced Local Anesthetic Systemic Toxicity (LAST) and refractory ventricular fibrillation, what is the recommended ASRA 20% Lipid Emulsion initial bolus and maintenance infusion?",
    options: [
      "1.5 mL/kg IV bolus over 2-3 minutes (~100 mL for 70 kg) followed by a 0.25 mL/kg/min continuous infusion",
      "0.1 mL/kg IV bolus followed by 0.01 mL/kg/min infusion",
      "5.0 mL/kg IV rapid push followed by 2.0 mL/kg/min infusion",
      "10 mL total bolus only with high-dose vasopressin 40 units"
    ],
    correctAnswer: 0,
    explanation: "ASRA guidelines recommend a 1.5 mL/kg IV bolus of 20% Lipid Emulsion (Intralipid) over 2-3 minutes, followed by a continuous infusion of 0.25 mL/kg/min, with repeat boluses and rate doubling if cardiac instability persists."
  },
  {
    id: "q4",
    question: "Why does Remifentanil maintain an ultra-short context-sensitive half-time (CSHT) of 3-4 minutes even after an 8-hour continuous TCI infusion?",
    options: [
      "Rapid hydrolysis by non-specific blood and tissue esterases prevents drug accumulation in peripheral compartments",
      "High hepatic clearance via Cytochrome P450 3A4 enzymes",
      "Rapid renal filtration and complete absence of protein binding",
      "Selective redistribution into adipose tissue without metabolism"
    ],
    correctAnswer: 0,
    explanation: "Remifentanil is uniquely metabolized by ubiquitous, non-specific blood and tissue esterases, yielding a flat context-sensitive half-time of 3-4 minutes independent of infusion duration."
  }
];

export const ClinicalPg6LabViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"mh" | "last" | "tiva" | "eras" | "quiz">("mh");

  // MH State
  const [patientWeight, setPatientWeight] = useState<number>(70);
  const [etco2, setEtco2] = useState<number>(65);
  const [coreTemp, setCoreTemp] = useState<number>(39.5);
  const [heartRate, setHeartRate] = useState<number>(142);
  const [arterialPh, setArterialPh] = useState<number>(7.10);
  const [serumK, setSerumK] = useState<number>(6.6);
  const [dantroleneGiven, setDantroleneGiven] = useState<boolean>(false);
  const [coolingActive, setCoolingActive] = useState<boolean>(false);

  // LAST State
  const [lastWeight, setLastWeight] = useState<number>(70);
  const [selectedLA, setSelectedLA] = useState<string>("Bupivacaine");
  const [lastStage, setLastStage] = useState<"cns" | "arrest">("arrest");
  const [lipidBolusGiven, setLipidBolusGiven] = useState<boolean>(false);
  const [infusionDoubled, setInfusionDoubled] = useState<boolean>(false);

  // TIVA State
  const [propofolCe, setPropofolCe] = useState<number>(3.2);
  const [remiCe, setRemiCe] = useState<number>(3.5);
  const [tivaDuration, setTivaDuration] = useState<number>(3.0);

  // ERAS State
  const [svv, setSvv] = useState<number>(11);
  const [lidocaineActive, setLidocaineActive] = useState<boolean>(true);
  const [ketamineActive, setKetamineActive] = useState<boolean>(true);
  const [espBlockActive, setEspBlockActive] = useState<boolean>(true);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Calculations
  const dantroleneDoseMg = Math.round(patientWeight * 2.5);
  const ryanodexVials = Math.ceil(dantroleneDoseMg / 250);
  const dantriumVials = Math.ceil(dantroleneDoseMg / 20);

  const lipidBolusVolumeMl = Math.round(lastWeight * 1.5);
  const lipidInfusionRateMlHr = Math.round(lastWeight * (infusionDoubled ? 0.50 : 0.25) * 60);

  // BIS estimation
  const estimatedBis = Math.max(10, Math.min(98, Math.round(95 - (propofolCe * 10.5) - (remiCe * 4.2))));
  const bsr = estimatedBis < 30 ? Math.round((30 - estimatedBis) * 2.5) : 0;
  const propofolCsht = Math.round(15 + (tivaDuration * 4.5));

  // ERAS Opioid Sparing Score
  let opioidReductionPct = 10;
  if (lidocaineActive) opioidReductionPct += 25;
  if (ketamineActive) opioidReductionPct += 20;
  if (espBlockActive) opioidReductionPct += 30;

  const handleQuizAnswer = (index: number) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(index);
    if (index === PG6_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < PG6_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedQuizAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedQuizAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className={styles.container} id="clinical-pg6-lab-viewer">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Virtual Postgraduate Anesthesiology, Perioperative Medicine & Pain Critical Care Lab (PG-606)</h2>
          <span className={styles.subtitle}>
            Tertiary Anesthesia Resuscitation &bull; MHAUS Dantrolene &bull; ASRA LAST Lipid Rescue &bull; TIVA/TCI PK/PD &bull; ERAS Pathways
          </span>
        </div>
        <span className={styles.badge}>PG-606 &bull; Advanced Residency</span>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "mh" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("mh")}
        >
          🔥 Malignant Hyperthermia & Dantrolene
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "last" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("last")}
        >
          💉 LAST & 20% Lipid Emulsion Rescue
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "tiva" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("tiva")}
        >
          🧠 TIVA / TCI & BIS Neuromonitoring
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "eras" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("eras")}
        >
          ⚡ ERAS & Multimodal Analgesia
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "quiz" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          📝 Diagnostic Challenge Quiz
        </button>
      </div>

      <div className={styles.workspace}>
        {activeTab === "mh" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🔥 MH Crisis Parameters & Patient Profile</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Patient Weight</span>
                  <span>{patientWeight} kg</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={130}
                  value={patientWeight}
                  onChange={(e) => setPatientWeight(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>End-Tidal CO2 (EtCO2)</span>
                  <span style={{ color: etco2 > 55 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>
                    {etco2} mmHg {etco2 > 55 ? "(Severe Hypermetabolism)" : "(Normal)"}
                  </span>
                </label>
                <input
                  type="range"
                  min={30}
                  max={90}
                  value={etco2}
                  onChange={(e) => setEtco2(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Core Body Temperature</span>
                  <span style={{ color: coreTemp > 38.5 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>
                    {coreTemp.toFixed(1)} &deg;C
                  </span>
                </label>
                <input
                  type="range"
                  min={36.0}
                  max={42.5}
                  step={0.1}
                  value={coreTemp}
                  onChange={(e) => setCoreTemp(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Arterial pH &amp; Serum K+</span>
                  <span style={{ color: arterialPh < 7.20 || serumK > 5.5 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>
                    pH {arterialPh.toFixed(2)} | K+ {serumK.toFixed(1)} mEq/L
                  </span>
                </label>
                <input
                  type="range"
                  min={6.90}
                  max={7.45}
                  step={0.01}
                  value={arterialPh}
                  onChange={(e) => setArterialPh(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setDantroleneGiven(true)}
                  style={{ background: dantroleneGiven ? "#059669" : "#dc2626" }}
                >
                  {dantroleneGiven ? "✓ Dantrolene Administered" : "Administer Dantrolene 2.5 mg/kg IV"}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setCoolingActive(!coolingActive)}
                  style={{ background: coolingActive ? "#0284c7" : "#475569" }}
                >
                  {coolingActive ? "✓ Active Cooling Active" : "Initiate Iced Saline / Lavage"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🛡️ MHAUS Resuscitation Dosage & Protocols</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Calculated Initial Dantrolene Load:</strong>{" "}
                  <span style={{ color: "#38bdf8", fontSize: "1.1rem", fontWeight: "bold" }}>
                    {dantroleneDoseMg} mg IV push (2.5 mg/kg)
                  </span>
                </div>
                <div>
                  <strong>Vial Requirements:</strong>
                  <ul>
                    <li>
                      <strong>Ryanodex (250 mg/vial):</strong> {ryanodexVials} vial(s) reconstituted in {ryanodexVials * 5} mL sterile water
                    </li>
                    <li>
                      <strong>Dantrium (20 mg/vial):</strong> {dantriumVials} vials reconstituted in {dantriumVials * 60} mL sterile water
                    </li>
                  </ul>
                </div>
                <div>
                  <strong>Post-Resuscitation Maintenance:</strong> 1.0 mg/kg IV Q4-6H for 24-48 hours (prevents 25% recrudescence risk)
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⚠️ CRITICAL SAFETY CONTRAINDICATION:</strong>
                <br />
                Do NOT administer Calcium Channel Blockers (Verapamil, Diltiazem) with Dantrolene. Concomitant use causes severe hyperkalemia, profound negative inotropy, and fatal asystolic cardiac arrest.
              </div>
            </div>
          </div>
        )}

        {activeTab === "last" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>💉 LAST Severity & Drug Configuration</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Patient Weight</span>
                  <span>{lastWeight} kg</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={120}
                  value={lastWeight}
                  onChange={(e) => setLastWeight(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Local Anesthetic Agent</span>
                  <span style={{ color: "#f59e0b", fontWeight: "bold" }}>{selectedLA}</span>
                </label>
                <select
                  value={selectedLA}
                  onChange={(e) => setSelectedLA(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Bupivacaine">Bupivacaine (Highest Cardiotoxicity)</option>
                  <option value="Levobupivacaine">Levobupivacaine (Intermediate)</option>
                  <option value="Ropivacaine">Ropivacaine (Lower Cardiotoxicity)</option>
                  <option value="Lidocaine">Lidocaine (Lowest)</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Clinical Presentation</span>
                  <span style={{ color: lastStage === "arrest" ? "#ef4444" : "#f59e0b", fontWeight: "bold" }}>
                    {lastStage === "arrest" ? "Refractory VT / VF / Asystolic Arrest" : "Early CNS Prodrome (Tinnitus/Seizures)"}
                  </span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className={styles.actionBtn}
                    style={{ background: lastStage === "cns" ? "#f59e0b" : "#334155" }}
                    onClick={() => setLastStage("cns")}
                  >
                    CNS Prodrome
                  </button>
                  <button
                    className={styles.actionBtn}
                    style={{ background: lastStage === "arrest" ? "#dc2626" : "#334155" }}
                    onClick={() => setLastStage("arrest")}
                  >
                    Cardiac Arrest
                  </button>
                </div>
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setLipidBolusGiven(true)}
                  style={{ background: lipidBolusGiven ? "#059669" : "#0284c7" }}
                >
                  {lipidBolusGiven ? "✓ 20% Lipid Bolus Administered" : `Administer 20% Lipid Bolus (${lipidBolusVolumeMl} mL)`}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setInfusionDoubled(!infusionDoubled)}
                  style={{ background: infusionDoubled ? "#f59e0b" : "#475569" }}
                >
                  {infusionDoubled ? "✓ Infusion Doubled (0.50 mL/kg/min)" : "Double Infusion (0.50 mL/kg/min)"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 ASRA 2025/2026 Lipid Emulsion Resuscitation Protocol</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Initial 20% Lipid Bolus:</strong>{" "}
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>
                    {lipidBolusVolumeMl} mL IV push over 2-3 minutes (1.5 mL/kg)
                  </span>
                </div>
                <div>
                  <strong>Maintenance Infusion Rate:</strong>{" "}
                  <span style={{ color: "#10b981", fontWeight: "bold" }}>
                    {lipidInfusionRateMlHr} mL/hr ({infusionDoubled ? "0.50" : "0.25"} mL/kg/min)
                  </span>
                </div>
                <div>
                  <strong>Maximum Cumulative Dose:</strong> {Math.round(lastWeight * 12)} mL over first 30 minutes (12 mL/kg limit)
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⚡ ACLS MODIFICATIONS IN LAST:</strong>
                <br />
                &bull; Epinephrine: Use LOW DOSES (&le;1 &mu;g/kg or 10-100 &mu;g increments) to avoid impairing lipid resuscitation and worsening arrhythmias.
                <br />
                &bull; STRICTLY AVOID: Vasopressin, Propofol (causes myocardial depression), Calcium Channel Blockers, and Lidocaine.
              </div>
            </div>
          </div>
        )}

        {activeTab === "tiva" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🧠 TCI Pharmacokinetic Model Parameters</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Propofol Effect-Site Ce (Schnider Model)</span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{propofolCe.toFixed(1)} &mu;g/mL</span>
                </label>
                <input
                  type="range"
                  min={1.0}
                  max={7.0}
                  step={0.1}
                  value={propofolCe}
                  onChange={(e) => setPropofolCe(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Remifentanil Effect-Site Ce (Minto Model)</span>
                  <span style={{ color: "#a855f7", fontWeight: "bold" }}>{remiCe.toFixed(1)} ng/mL</span>
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={8.0}
                  step={0.1}
                  value={remiCe}
                  onChange={(e) => setRemiCe(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Total Infusion Duration</span>
                  <span>{tivaDuration.toFixed(1)} hours</span>
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={8.0}
                  step={0.5}
                  value={tivaDuration}
                  onChange={(e) => setTivaDuration(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📈 Processed EEG & Context-Sensitive Half-Time</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Estimated Bispectral Index (BIS):</strong>{" "}
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: estimatedBis >= 40 && estimatedBis <= 60 ? "#10b981" : estimatedBis < 40 ? "#ef4444" : "#f59e0b"
                    }}
                  >
                    {estimatedBis} {estimatedBis >= 40 && estimatedBis <= 60 ? "(Target Surgical Hypnosis)" : estimatedBis < 40 ? "(Excessive Depth / POCD Risk)" : "(Risk of Awareness)"}
                  </span>
                </div>
                <div>
                  <strong>Burst Suppression Ratio (BSR):</strong> {bsr}%
                </div>
                <div>
                  <strong>Context-Sensitive Half-Time (CSHT):</strong>
                  <ul>
                    <li>
                      <strong>Remifentanil:</strong> <span style={{ color: "#10b981" }}>Constant 3-4 minutes</span> (esterase clearance)
                    </li>
                    <li>
                      <strong>Propofol:</strong> <span style={{ color: "#38bdf8" }}>{propofolCsht} minutes</span> (increases with duration)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "eras" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>⚡ ERAS Pathway & GDFT Configuration</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Stroke Volume Variation (SVV via Arterial Line)</span>
                  <span style={{ color: svv <= 12 ? "#10b981" : "#f59e0b", fontWeight: "bold" }}>
                    {svv}% {svv <= 12 ? "(Euvolumic Target)" : "(Fluid Responsive / Hypovolemic)"}
                  </span>
                </label>
                <input
                  type="range"
                  min={4}
                  max={24}
                  value={svv}
                  onChange={(e) => setSvv(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={lidocaineActive}
                    onChange={(e) => setLidocaineActive(e.target.checked)}
                  />
                  <span>Systemic IV Lidocaine Infusion (1.5 mg/kg/hr)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={ketamineActive}
                    onChange={(e) => setKetamineActive(e.target.checked)}
                  />
                  <span>Subanesthetic Ketamine Infusion (0.15 mg/kg/hr)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={espBlockActive}
                    onChange={(e) => setEspBlockActive(e.target.checked)}
                  />
                  <span>Ultrasound-Guided Regional ESP / Fascial Plane Block</span>
                </label>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Perioperative Outcomes & Opioid Sparing</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Predicted Opioid Requirement Reduction:</strong>{" "}
                  <span style={{ color: "#10b981", fontSize: "1.2rem", fontWeight: "bold" }}>
                    {opioidReductionPct}%
                  </span>
                </div>
                <div>
                  <strong>Postoperative Ileus Risk:</strong>{" "}
                  <span style={{ color: lidocaineActive ? "#10b981" : "#f59e0b", fontWeight: "bold" }}>
                    {lidocaineActive ? "Low (Accelerated Bowel Recovery)" : "Moderate / High"}
                  </span>
                </div>
                <div>
                  <strong>Fluid Strategy:</strong> Maintain SVV &lt;10-12% while avoiding fluid overload (&lt;2-3 L total) to protect bowel anastomoses.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className={styles.card}>
            {!quizCompleted ? (
              <>
                <h3 className={styles.cardTitle}>
                  Question {currentQuizIndex + 1} of {PG6_QUIZ_QUESTIONS.length}
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  {PG6_QUIZ_QUESTIONS[currentQuizIndex].question}
                </p>

                <div>
                  {PG6_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                    let className = styles.quizOption;
                    if (selectedQuizAnswer !== null) {
                      if (idx === PG6_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
                        className += ` ${styles.quizOptionSelected}`;
                      }
                    }
                    return (
                      <button
                        key={idx}
                        className={className}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedQuizAnswer !== null}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedQuizAnswer !== null && (
                  <div className={styles.quizFeedback}>
                    <strong>Explanation:</strong> {PG6_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  </div>
                )}

                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  {selectedQuizAnswer !== null && (
                    <button className={styles.actionBtn} onClick={nextQuestion}>
                      {currentQuizIndex < PG6_QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Final Score"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <h3 style={{ color: "#38bdf8", fontSize: "1.5rem" }}>Diagnostic Challenge Completed!</h3>
                <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
                  Your Score: <strong style={{ color: "#10b981" }}>{quizScore}</strong> / {PG6_QUIZ_QUESTIONS.length}
                </p>
                <button className={styles.actionBtn} onClick={resetQuiz}>
                  Retake Diagnostic Challenge
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
