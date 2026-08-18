"use client";

import React, { useState } from "react";
import styles from "./ClinicalPg7LabViewer.module.css";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PG7_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "When applying a pelvic circumferential compression device (pelvic binder) for an unstable 'open book' APC-II/III pelvic fracture, where should the device be centered to achieve maximal biomechanical reduction?",
    options: [
      "Centered directly over the Greater Trochanters bilaterally",
      "Centered high over the Iliac Crests",
      "Wrapped around the mid-thighs only",
      "Placed across the lower ribs and epigastrium"
    ],
    correctAnswer: 0,
    explanation: "Pelvic binders must be centered directly over the Greater Trochanters. Placement over the iliac crests fails to close the pelvic ring and can worsen rotational displacement."
  },
  {
    id: "q2",
    question: "In a patient with a high-energy open tibia fracture, what defining feature distinguishes a Gustilo-Anderson Type IIIC fracture from Types IIIA and IIIB?",
    options: [
      "The presence of an arterial injury requiring vascular repair for limb salvage, regardless of wound size",
      "A wound size greater than 10 cm without vascular injury",
      "Complete bone loss requiring a free fibular graft",
      "The presence of Clostridium perfringens soil contamination"
    ],
    correctAnswer: 0,
    explanation: "Gustilo-Anderson Type IIIC is defined by any open fracture associated with an arterial injury requiring vascular repair for limb viability, irrespective of the soft-tissue wound dimensions."
  },
  {
    id: "q3",
    question: "What is the definitive compartment pressure threshold (Delta Pressure, Delta P) that mandates emergent operative fasciotomy for Acute Compartment Syndrome?",
    options: [
      "Delta P (Diastolic Blood Pressure minus Intracompartmental Pressure) <= 30 mmHg",
      "Absolute compartment pressure >10 mmHg regardless of blood pressure",
      "Delta P (Systolic BP minus Diastolic BP) >= 50 mmHg",
      "Venous pressure equal to zero"
    ],
    correctAnswer: 0,
    explanation: "The definitive surgical threshold is a Delta Pressure (Delta P = Diastolic BP - Intracompartmental Pressure) <= 30 mmHg, which marks the critical threshold of capillary microvascular collapse and irreversible muscle ischemia."
  },
  {
    id: "q4",
    question: "A 15-year-old male is diagnosed with Ewing Sarcoma of the diaphyseal femur. Which classic chromosomal translocation and histologic finding are characteristic of this tumor?",
    options: [
      "t(11;22)(q24;q12) producing the EWSR1-FLI1 fusion transcript; small round blue cell histology with 'onion-skin' periosteal reaction",
      "t(9;22) BCR-ABL fusion; giant cell histology",
      "t(12;16) DDIT3 fusion; chondroid matrix",
      "t(13;17) RB1 deletion; mature osteoid only"
    ],
    correctAnswer: 0,
    explanation: "Ewing Sarcoma is characterized by the t(11;22)(q24;q12) translocation generating the EWSR1-FLI1 chimeric transcription factor, uniform small round blue cell histology, and concentric 'onion-skin' periosteal laminations."
  }
];

export const ClinicalPg7LabViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pelvis" | "openfx" | "acs" | "onco" | "quiz">("pelvis");

  // Pelvis State
  const [fracturePattern, setFracturePattern] = useState<string>("APC-III");
  const [binderPlaced, setBinderPlaced] = useState<boolean>(false);
  const [pppDone, setPppDone] = useState<boolean>(false);
  const [angioDone, setAngioDone] = useState<boolean>(false);

  // Open Fracture State
  const [gustiloType, setGustiloType] = useState<string>("IIIB");
  const [messSkeletal, setMessSkeletal] = useState<number>(3);
  const [messIschemia, setMessIschemia] = useState<number>(2);
  const [messShock, setMessShock] = useState<number>(1);
  const [messAge, setMessAge] = useState<number>(0);

  // ACS State
  const [diastolicBp, setDiastolicBp] = useState<number>(65);
  const [icp, setIcp] = useState<number>(42);
  const [fasciotomyDone, setFasciotomyDone] = useState<boolean>(false);

  // Oncology State
  const [tumorType, setTumorType] = useState<string>("Osteosarcoma");
  const [ennekingGrade, setEnnekingGrade] = useState<string>("G2");
  const [ennekingSite, setEnnekingSite] = useState<string>("T2");
  const [ennekingMet, setEnnekingMet] = useState<string>("M0");

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Calculations
  const deltaP = diastolicBp - icp;
  const isAcsCritical = deltaP <= 30;

  const totalMess = messSkeletal + messIschemia + messShock + messAge;
  const isMangledHighRisk = totalMess >= 7;

  // Enneking Stage determination
  let computedStage = "Stage IA";
  if (ennekingMet === "M1") {
    computedStage = "Stage III (Distant Metastatic)";
  } else if (ennekingGrade === "G2") {
    computedStage = ennekingSite === "T2" ? "Stage IIB (High-Grade Extracompartmental)" : "Stage IIA (High-Grade Intracompartmental)";
  } else {
    computedStage = ennekingSite === "T2" ? "Stage IB (Low-Grade Extracompartmental)" : "Stage IA (Low-Grade Intracompartmental)";
  }

  const handleQuizAnswer = (index: number) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(index);
    if (index === PG7_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < PG7_QUIZ_QUESTIONS.length - 1) {
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
    <div className={styles.container} id="clinical-pg7-lab-viewer">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Virtual Postgraduate Orthopedics, Trauma &amp; Musculoskeletal Oncology Lab (PG-607)</h2>
          <span className={styles.subtitle}>
            Pelvic Ring Hemorrhage &bull; Mangled Extremity (MESS) &bull; Compartment Delta Pressure &bull; Bone Sarcomas
          </span>
        </div>
        <span className={styles.badge}>PG-607 &bull; Advanced Residency</span>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "pelvis" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("pelvis")}
        >
          🦴 Pelvic Ring &amp; Hemorrhage
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "openfx" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("openfx")}
        >
          🩹 Open Fractures &amp; MESS
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "acs" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("acs")}
        >
          ⚡ Acute Compartment &amp; Fasciotomy
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "onco" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("onco")}
        >
          🔬 Musculoskeletal Oncology
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "quiz" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          📝 Diagnostic Challenge Quiz
        </button>
      </div>

      <div className={styles.workspace}>
        {activeTab === "pelvis" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🦴 Young-Burgess Pattern &amp; Hemodynamics</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Young-Burgess Fracture Pattern</span>
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>{fracturePattern}</span>
                </label>
                <select
                  value={fracturePattern}
                  onChange={(e) => setFracturePattern(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="APC-I">APC-I (Symphysis &lt;2.5 cm, Mechanically Stable)</option>
                  <option value="APC-II">APC-II (Symphysis &gt;2.5 cm, Rotationally Unstable)</option>
                  <option value="APC-III">APC-III (Complete Disruption, Vertically/Rotationally Unstable)</option>
                  <option value="LC-I">LC-I (Sacral Compression, Stable)</option>
                  <option value="LC-II">LC-II (Iliac Crescent Fx, Rotationally Unstable)</option>
                  <option value="LC-III">LC-III (Windswept Pelvis, High Hemorrhage Risk)</option>
                  <option value="VS">Vertical Shear (Complete Ligamentous Dissociation)</option>
                </select>
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setBinderPlaced(!binderPlaced)}
                  style={{ background: binderPlaced ? "#059669" : "#0284c7" }}
                >
                  {binderPlaced ? "✓ Pelvic Binder Over Trochanters Active" : "Apply Pelvic Binder (Greater Trochanters)"}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setPppDone(!pppDone)}
                  style={{ background: pppDone ? "#059669" : "#dc2626" }}
                >
                  {pppDone ? "✓ Preperitoneal Packing (PPP) Performed" : "Perform Preperitoneal Pelvic Packing"}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setAngioDone(!angioDone)}
                  style={{ background: angioDone ? "#059669" : "#475569" }}
                >
                  {angioDone ? "✓ Angioembolization Complete" : "Mobilize Angioembolization"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🛡️ Hemorrhage Control Protocol Status</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Pelvic Ring Volume:</strong>{" "}
                  <span style={{ color: binderPlaced ? "#10b981" : "#ef4444", fontWeight: "bold" }}>
                    {binderPlaced ? "Reduced & Tamponaded" : "Expanded (High-Volume Bleeding Risk)"}
                  </span>
                </div>
                <div>
                  <strong>Primary Hemorrhage Source:</strong> Presacral venous plexus (85%) &amp; internal iliac branches (15%)
                </div>
                <div>
                  <strong>Surgical Damage Control:</strong> Retzius space preperitoneal packing provides rapid direct retroperitoneal venous tamponade within &lt;15 minutes.
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⚠️ ANATOMICAL LANDMARK RULE:</strong>
                <br />
                Always center the pelvic binder over the <strong>Greater Trochanters</strong>. Placing the binder higher over the iliac crests fails to close the pelvic ring and can worsen hemorrhage.
              </div>
            </div>
          </div>
        )}

        {activeTab === "openfx" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🩹 Gustilo-Anderson &amp; MESS Variables</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Gustilo-Anderson Grade</span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>Type {gustiloType}</span>
                </label>
                <select
                  value={gustiloType}
                  onChange={(e) => setGustiloType(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="I">Type I (&lt;1 cm, Clean Puncture)</option>
                  <option value="II">Type II (1-10 cm, Moderate Crush)</option>
                  <option value="IIIA">Type IIIA (&gt;10 cm, Adequate Soft Tissue Coverage)</option>
                  <option value="IIIB">Type IIIB (Extensive Periosteal Stripping, Bone Exposed - Needs Flap)</option>
                  <option value="IIIC">Type IIIC (Arterial Injury Requiring Vascular Repair)</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Skeletal / Soft Tissue Injury (1-4)</span>
                  <span>{messSkeletal} pts</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={messSkeletal}
                  onChange={(e) => setMessSkeletal(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Limb Ischemia Score (1-3, doubled if &gt;6h)</span>
                  <span>{messIschemia} pts</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={messIschemia}
                  onChange={(e) => setMessIschemia(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Shock / Hypotension (0-2)</span>
                  <span>{messShock} pts</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={2}
                  value={messShock}
                  onChange={(e) => setMessShock(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 MESS Score &amp; Salvage Recommendation</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Total MESS Score:</strong>{" "}
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: isMangledHighRisk ? "#ef4444" : "#10b981"
                    }}
                  >
                    {totalMess} / 14 {isMangledHighRisk ? "(MESS >= 7: High Amputation Predictor)" : "(MESS < 7: Limb Salvage Candidate)"}
                  </span>
                </div>
                <div>
                  <strong>Empiric Antibiotic Protocol:</strong>
                  <ul>
                    {gustiloType === "I" || gustiloType === "II" ? (
                      <li>Cefazolin 2 g IV Q8H (Gram-positive coverage)</li>
                    ) : (
                      <>
                        <li>Cefazolin 2 g IV Q8H (Gram-positive)</li>
                        <li>Gentamicin 5 mg/kg daily (Gram-negative coverage)</li>
                        <li>Add Penicillin G 4 million units Q4H if soil/barnyard contamination</li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <strong>Surgical Timing:</strong> Urgent radical operative debridement within 12-24 hours with temporary spanning external fixation.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "acs" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>⚡ Acute Compartment Manometry</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Patient Diastolic Blood Pressure (DBP)</span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{diastolicBp} mmHg</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Intracompartmental Pressure (ICP via Stryker)</span>
                  <span style={{ color: icp > 30 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>{icp} mmHg</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={70}
                  value={icp}
                  onChange={(e) => setIcp(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setFasciotomyDone(true)}
                  style={{ background: fasciotomyDone ? "#059669" : "#dc2626" }}
                >
                  {fasciotomyDone ? "✓ 4-Compartment Dual-Incision Fasciotomy Complete" : "Execute Emergent Dual-Incision Fasciotomy"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Delta Pressure (&Delta;P) &amp; Surgical Threshold</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Calculated Delta Pressure (&Delta;P = DBP - ICP):</strong>{" "}
                  <span
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: isAcsCritical ? "#ef4444" : "#10b981"
                    }}
                  >
                    {deltaP} mmHg {isAcsCritical ? "(CRITICAL ISCHEMIA: <=30 mmHg)" : "(Adequate Perfusion: >30 mmHg)"}
                  </span>
                </div>
                <div>
                  <strong>Dual-Incision Anatomical Release:</strong>
                  <ul>
                    <li>
                      <strong>Anterolateral Incision:</strong> Decompresses Anterior &amp; Lateral compartments (protects Deep &amp; Superficial Peroneal nerves).
                    </li>
                    <li>
                      <strong>Posteromedial Incision:</strong> Decompresses Superficial &amp; Deep Posterior compartments (releases soleus bridge, protects Tibial nerve &amp; posterior tibial vessels).
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⏱️ ISCHEMIA TIME LIMIT:</strong>
                <br />
                Muscle necrosis becomes irreversible after <strong>6-8 hours</strong> of unyielding compartment hypertension. Do NOT wait for pulselessness (a late, irreversible sign).
              </div>
            </div>
          </div>
        )}

        {activeTab === "onco" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🔬 Primary Bone Sarcoma &amp; Enneking Parameters</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Tumor Histopathology</span>
                  <span style={{ color: "#a855f7", fontWeight: "bold" }}>{tumorType}</span>
                </label>
                <select
                  value={tumorType}
                  onChange={(e) => setTumorType(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Osteosarcoma">Osteosarcoma (Metaphyseal, Codman Triangle, Sunburst)</option>
                  <option value="Ewing Sarcoma">Ewing Sarcoma (Diaphyseal, Onion-Skin, t(11;22))</option>
                  <option value="Chondrosarcoma">Chondrosarcoma (Rings &amp; Arcs, Chemoresistant)</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Histologic Grade</span>
                  <span>{ennekingGrade === "G2" ? "High Grade (G2)" : "Low Grade (G1)"}</span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className={styles.actionBtn}
                    style={{ background: ennekingGrade === "G1" ? "#0284c7" : "#334155" }}
                    onClick={() => setEnnekingGrade("G1")}
                  >
                    G1 (Low)
                  </button>
                  <button
                    className={styles.actionBtn}
                    style={{ background: ennekingGrade === "G2" ? "#ef4444" : "#334155" }}
                    onClick={() => setEnnekingGrade("G2")}
                  >
                    G2 (High)
                  </button>
                </div>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Anatomic Site</span>
                  <span>{ennekingSite === "T2" ? "Extracompartmental (T2)" : "Intracompartmental (T1)"}</span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className={styles.actionBtn}
                    style={{ background: ennekingSite === "T1" ? "#0284c7" : "#334155" }}
                    onClick={() => setEnnekingSite("T1")}
                  >
                    T1 (Intra)
                  </button>
                  <button
                    className={styles.actionBtn}
                    style={{ background: ennekingSite === "T2" ? "#ef4444" : "#334155" }}
                    onClick={() => setEnnekingSite("T2")}
                  >
                    T2 (Extra)
                  </button>
                </div>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Distant Metastases</span>
                  <span>{ennekingMet === "M1" ? "Metastatic (M1)" : "Non-Metastatic (M0)"}</span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className={styles.actionBtn}
                    style={{ background: ennekingMet === "M0" ? "#0284c7" : "#334155" }}
                    onClick={() => setEnnekingMet("M0")}
                  >
                    M0 (None)
                  </button>
                  <button
                    className={styles.actionBtn}
                    style={{ background: ennekingMet === "M1" ? "#ef4444" : "#334155" }}
                    onClick={() => setEnnekingMet("M1")}
                  >
                    M1 (Mets)
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Enneking Staging &amp; Multimodal Treatment</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Calculated Enneking Stage:</strong>{" "}
                  <span style={{ color: "#38bdf8", fontSize: "1.1rem", fontWeight: "bold" }}>
                    {computedStage}
                  </span>
                </div>
                <div>
                  <strong>Treatment Sequence:</strong>
                  <ul>
                    {tumorType === "Osteosarcoma" && (
                      <>
                        <li>Neoadjuvant MAP Chemotherapy (Methotrexate, Doxorubicin, Cisplatin)</li>
                        <li>Definitive Wide Resection &amp; Endoprosthetic Reconstruction</li>
                        <li>Postoperative Adjuvant Chemotherapy</li>
                      </>
                    )}
                    {tumorType === "Ewing Sarcoma" && (
                      <>
                        <li>Multiagent VDC/IE Chemotherapy (Vincristine, Doxorubicin, Cyclophosphamide / Ifosfamide, Etoposide)</li>
                        <li>Definitive Wide Resection &plusmn; Radiotherapy</li>
                      </>
                    )}
                    {tumorType === "Chondrosarcoma" && (
                      <>
                        <li>Primary Wide Surgical Resection (Chemoresistant &amp; Radioresistant!)</li>
                      </>
                    )}
                  </ul>
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
                  Question {currentQuizIndex + 1} of {PG7_QUIZ_QUESTIONS.length}
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  {PG7_QUIZ_QUESTIONS[currentQuizIndex].question}
                </p>

                <div>
                  {PG7_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                    let className = styles.quizOption;
                    if (selectedQuizAnswer !== null) {
                      if (idx === PG7_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
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
                    <strong>Explanation:</strong> {PG7_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  </div>
                )}

                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  {selectedQuizAnswer !== null && (
                    <button className={styles.actionBtn} onClick={nextQuestion}>
                      {currentQuizIndex < PG7_QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Final Score"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <h3 style={{ color: "#38bdf8", fontSize: "1.5rem" }}>Diagnostic Challenge Completed!</h3>
                <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
                  Your Score: <strong style={{ color: "#10b981" }}>{quizScore}</strong> / {PG7_QUIZ_QUESTIONS.length}
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
