"use client";

import React, { useState } from "react";
import styles from "./ClinicalPg9LabViewer.module.css";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PG9_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "A 64-year-old male with locally advanced glottic squamous cell carcinoma demonstrates gross destruction and through-and-through invasion of the thyroid cartilage into the strap muscles (T4a). What is the standard-of-care primary oncologic treatment?",
    options: [
      "Total Laryngectomy with Bilateral Selective Neck Dissection followed by adjuvant radiation or chemoradiotherapy",
      "Concurrent Chemoradiotherapy alone with organ preservation intent",
      "Transoral laser cordectomy monotherapy",
      "Observation and voice therapy only"
    ],
    correctAnswer: 0,
    explanation: "T4a laryngeal cancer with gross extralaryngeal cartilage invasion and strap muscle involvement has a very poor response to primary chemoradiation and high rates of chondroradionecrosis, making Total Laryngectomy with bilateral neck dissection the gold standard."
  },
  {
    id: "q2",
    question: "According to the Keros classification of the anterior skull base, which anatomic configuration has the deepest olfactory fossa (8-16 mm) and represents the highest risk for iatrogenic cribriform plate perforation and CSF rhinorrhea during FESS?",
    options: [
      "Keros Type III (depth 8-16 mm with a paper-thin, elongated lateral lamella)",
      "Keros Type I (depth 1-3 mm with a flat horizontal ethmoid roof)",
      "Keros Type II (depth 4-7 mm)",
      "Onodi cell variant only"
    ],
    correctAnswer: 0,
    explanation: "Keros Type III has the greatest depth (8-16 mm) of the olfactory fossa, creating an elongated, paper-thin (0.1 mm) lateral lamella of the cribriform plate that is highly susceptible to intracranial breach during ethmoidectomy."
  },
  {
    id: "q3",
    question: "A patient with attic cholesteatoma complains of true rotational vertigo when pressing on their tragus (positive Hennebert sign) or when exposed to loud sounds (Tullio phenomenon). High-resolution CT confirms erosion of the dome of which structure?",
    options: [
      "Lateral (Horizontal) Semicircular Canal (LSCC)",
      "Superior Semicircular Canal",
      "Basal turn of the cochlea only",
      "Carotid canal cortex"
    ],
    correctAnswer: 0,
    explanation: "The Lateral (Horizontal) Semicircular Canal (LSCC) is the most common site of a labyrinthine fistula from cholesteatoma due to its prominent location on the medial wall of the mastoid antrum, causing pressure- and sound-induced vertigo."
  },
  {
    id: "q4",
    question: "A 35-year-old male presents with Ludwig's angina following an infected mandibular molar extraction with massive 'woody' submandibular induration, superior tongue elevation, and severe stridor. What is the safest emergency airway securing technique?",
    options: [
      "Awake Flexible Fiberoptic Intubation or Awake Tracheostomy under local anesthesia, strictly avoiding neuromuscular paralytics",
      "Rapid Sequence Intubation (RSI) with high-dose Succinylcholine and blind oral direct laryngoscopy",
      "Placement of a supraglottic Laryngeal Mask Airway (LMA) in the emergency room",
      "Immediate oral endotracheal intubation with a rigid curved blade without sedation"
    ],
    correctAnswer: 0,
    explanation: "In Ludwig's angina, muscle relaxants and sedation can abolish spontaneous airway tone, causing catastrophic complete airway collapse. Awake flexible fiberoptic intubation or awake tracheostomy under local anesthesia is mandatory."
  }
];

export const ClinicalPg9LabViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"larynx" | "fess" | "otology" | "deepneck" | "quiz">("larynx");

  // Larynx State
  const [tStage, setTStage] = useState<string>("T4a");
  const [flapType, setFlapType] = useState<string>("PMMC (Pectoralis Major)");
  const [tepDone, setTepDone] = useState<boolean>(true);
  const [laryngectomyDone, setLaryngectomyDone] = useState<boolean>(false);

  // FESS State
  const [kerosType, setKerosType] = useState<string>("Keros Type III (8-16 mm)");
  const [uncinectomyDone, setUncinectomyDone] = useState<boolean>(true);
  const [ethmoidectomyDone, setEthmoidectomyDone] = useState<boolean>(true);
  const [hadadFlapPlaced, setHadadFlapPlaced] = useState<boolean>(false);

  // Otology State
  const [cholesteatomaExtent, setCholesteatomaExtent] = useState<string>("Epitympanum + LSCC Fistula");
  const [mastoidApproach, setMastoidApproach] = useState<string>("Canal Wall Down (CWD)");
  const [nimMonitoring, setNimMonitoring] = useState<boolean>(true);

  // Deep Neck State
  const [deepSpace, setDeepSpace] = useState<string>("Ludwig's Angina (Submandibular)");
  const [airwaySecured, setAirwaySecured] = useState<boolean>(false);
  const [drainageDone, setDrainageDone] = useState<boolean>(false);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const handleQuizAnswer = (index: number) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(index);
    if (index === PG9_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < PG9_QUIZ_QUESTIONS.length - 1) {
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
    <div className={styles.container} id="clinical-pg9-lab-viewer">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Virtual Postgraduate Otorhinolaryngology &amp; Skull Base Lab (PG-609)</h2>
          <span className={styles.subtitle}>
            Total Laryngectomy &bull; Keros Skull Base &bull; Hadad Nasoseptal Flap &bull; Cholesteatoma LSCC Fistula &bull; Ludwig&apos;s Airway
          </span>
        </div>
        <span className={styles.badge}>PG-609 &bull; Advanced Residency</span>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "larynx" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("larynx")}
        >
          🗣️ Larynx &amp; Flap Reconstruction
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "fess" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("fess")}
        >
          👃 FESS &amp; Hadad Nasoseptal Flap
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "otology" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("otology")}
        >
          👂 Cholesteatoma &amp; Mastoidectomy
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "deepneck" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("deepneck")}
        >
          🚨 Deep Neck Infections &amp; Airway
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "quiz" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          📝 Diagnostic Challenge Quiz
        </button>
      </div>

      <div className={styles.workspace}>
        {activeTab === "larynx" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🗣️ Laryngeal TNM Staging &amp; Surgical Resection</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Laryngeal T Stage</span>
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>{tStage}</span>
                </label>
                <select
                  value={tStage}
                  onChange={(e) => setTStage(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="T1/T2">T1/T2 (Cord Mobile; Primary RT or TLM)</option>
                  <option value="T3">T3 (Vocal Cord Fixed / Paraglottic - Organ Preservation CRT)</option>
                  <option value="T4a">T4a (Cartilage Destruction / Strap Muscles - Total Laryngectomy)</option>
                  <option value="T4b">T4b (Prevertebral / Carotid &gt;270° - Unresectable)</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Reconstructive Flap</span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{flapType}</span>
                </label>
                <select
                  value={flapType}
                  onChange={(e) => setFlapType(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Primary Closure">Primary Mucosal Closure (Linear Defect)</option>
                  <option value="PMMC (Pectoralis Major)">Pectoralis Major Myocutaneous Flap (PMMC Patch)</option>
                  <option value="Free ALT Flap">Free Anterolateral Thigh Flap (Tubed Circumferential)</option>
                </select>
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setLaryngectomyDone(!laryngectomyDone)}
                  style={{ background: laryngectomyDone ? "#059669" : "#0284c7" }}
                >
                  {laryngectomyDone ? "✓ Total Laryngectomy & Neck Dissection Done" : "Execute Total Laryngectomy & Neck Dissection"}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setTepDone(!tepDone)}
                  style={{ background: tepDone ? "#059669" : "#334155" }}
                >
                  {tepDone ? "✓ Primary TEP with Blom-Singer Valve Active" : "Create Primary Tracheoesophageal Puncture"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Oncologic Strategy &amp; Alaryngeal Speech</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Primary Standard Paradigm:</strong>{" "}
                  <span style={{ color: tStage === "T4a" ? "#ef4444" : "#10b981", fontWeight: "bold" }}>
                    {tStage === "T4a"
                      ? "Definitive Total Laryngectomy + Bilateral Neck Dissection (RTOG 91-11 standard due to cartilage destruction)"
                      : tStage === "T3"
                      ? "Concurrent Chemoradiotherapy (Cisplatin + RT organ preservation)"
                      : "Definitive RT or Transoral Laser Microsurgery (TLM)"}
                  </span>
                </div>
                <div>
                  <strong>Speech Rehabilitation:</strong> Primary Tracheoesophageal Puncture (TEP) with Blom-Singer valve placement provides fluent, pulmonary-driven mucosal wave phonation.
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⚠️ CARTILAGE EROSION RULE:</strong>
                <br />
                Gross extralaryngeal through-and-through cartilage invasion (T4a) responds poorly to chemoradiation, carrying severe risks of radionecrosis and non-functional larynx. <strong>Total Laryngectomy</strong> is the standard of care.
              </div>
            </div>
          </div>
        )}

        {activeTab === "fess" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>👃 Keros Skull Base Height &amp; FESS Stepwise</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Keros Cribriform Classification</span>
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>{kerosType}</span>
                </label>
                <select
                  value={kerosType}
                  onChange={(e) => setKerosType(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Keros Type I (1-3 mm)">Keros Type I (1-3 mm Depth, Flat Roof, Lowest Risk)</option>
                  <option value="Keros Type II (4-7 mm)">Keros Type II (4-7 mm Depth, 70% Population)</option>
                  <option value="Keros Type III (8-16 mm)">Keros Type III (8-16 mm Depth, Deepest &amp; Highest CSF Risk)</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                  <input type="checkbox" checked={uncinectomyDone} onChange={(e) => setUncinectomyDone(e.target.checked)} />
                  1. Uncinectomy &amp; Maxillary Antrostomy
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                  <input type="checkbox" checked={ethmoidectomyDone} onChange={(e) => setEthmoidectomyDone(e.target.checked)} />
                  2. Anterior/Posterior Ethmoidectomy &amp; Sphenoidotomy
                </label>
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setHadadFlapPlaced(!hadadFlapPlaced)}
                  style={{ background: hadadFlapPlaced ? "#059669" : "#0284c7" }}
                >
                  {hadadFlapPlaced ? "✓ Hadad Nasoseptal Flap Harvested & Placed" : "Mobilize Hadad Nasoseptal Flap for CSF Repair"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Skull Base Danger Zones &amp; Dural Seal</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Lateral Lamella Fragility:</strong> In Keros Type III, the lateral lamella is paper-thin (0.1 mm) and extends up to 16 mm below the fovea ethmoidalis.
                </div>
                <div>
                  <strong>Biomarker Confirmation:</strong> Beta-2 Transferrin (or Beta-trace protein) confirms CSF rhinorrhea with 100% specificity.
                </div>
                <div>
                  <strong>Hadad-Bassagasteguy Flap:</strong> Pedicled on the posterior septal branch of the sphenopalatine artery (SPA); provides &gt;95% primary closure of skull base defects.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "otology" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>👂 Cholesteatoma Extent &amp; Mastoidectomy</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Disease Extent / Complication</span>
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>{cholesteatomaExtent}</span>
                </label>
                <select
                  value={cholesteatomaExtent}
                  onChange={(e) => setCholesteatomaExtent(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Epitympanic (Scutum Erosion)">Epitympanum (Scutum &amp; Incus Erosion)</option>
                  <option value="Epitympanum + LSCC Fistula">Epitympanum + Lateral Semicircular Canal (LSCC) Fistula</option>
                  <option value="Tegmen & Sigmoid Plate Erosion">Extensive Mastoid with Tegmen &amp; Sigmoid Plate Erosion</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Mastoidectomy Approach</span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{mastoidApproach}</span>
                </label>
                <select
                  value={mastoidApproach}
                  onChange={(e) => setMastoidApproach(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Canal Wall Up (CWU)">Canal Wall Up (Intact Canal Wall - Requires Surveillance)</option>
                  <option value="Canal Wall Down (CWD)">Canal Wall Down (Modified Radical - Exteriorized Bowl)</option>
                </select>
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setNimMonitoring(!nimMonitoring)}
                  style={{ background: nimMonitoring ? "#059669" : "#334155" }}
                >
                  {nimMonitoring ? "✓ Facial Nerve NIM Monitoring Active" : "Activate Facial Nerve NIM Monitoring"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Labyrinthine Fistula &amp; Facial Recess</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>LSCC Fistula Signs:</strong> Positive Hennebert sign (vertigo on pneumatic otoscopy) and Tullio phenomenon (sound-induced vertigo).
                </div>
                <div>
                  <strong>Surgical Management of Fistula:</strong> Matrix is dissected last; defect is sealed immediately with temporalis fascia, perichondrium, or bone patte to prevent sensorineural hearing loss.
                </div>
                <div>
                  <strong>Facial Recess Boundaries:</strong> Facial nerve (medially), chorda tympani (laterally), incudal buttress (superiorly) &mdash; the standard surgical corridor for cochlear implant electrode insertion.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "deepneck" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🚨 Deep Neck Space Infection &amp; Airway Priority</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Involved Cervical Compartment</span>
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>{deepSpace}</span>
                </label>
                <select
                  value={deepSpace}
                  onChange={(e) => setDeepSpace(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Ludwig's Angina (Submandibular)">Ludwig&apos;s Angina (Bilateral Submandibular / Sublingual)</option>
                  <option value="Danger Space (Space 4 Mediastinitis)">Danger Space (Space 4 - Tracks to Diaphragm)</option>
                  <option value="Parapharyngeal Space (PPS)">Parapharyngeal Space (Post-styloid / Carotid Sheath)</option>
                  <option value="Retropharyngeal Space">Retropharyngeal Space (T1-T2 Extension)</option>
                </select>
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setAirwaySecured(!airwaySecured)}
                  style={{ background: airwaySecured ? "#059669" : "#dc2626" }}
                >
                  {airwaySecured ? "✓ Awake Fiberoptic Airway Secured" : "Perform Awake Flexible Fiberoptic Intubation"}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setDrainageDone(!drainageDone)}
                  style={{ background: drainageDone ? "#059669" : "#0284c7" }}
                >
                  {drainageDone ? "✓ Transcervical I&D Complete" : "Execute Transcervical Incision & Drainage"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Danger Space Mechanics &amp; Emergency Protocols</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Danger Space (Space 4):</strong> Lies between alar and prevertebral fascia, extending from the skull base all the way to the <strong>diaphragm</strong>, providing an open conduit for rapidly fatal Descending Necrotizing Mediastinitis.
                </div>
                <div>
                  <strong>Antimicrobial Bundle:</strong> Ampicillin-Sulbactam 3 g IV Q6H + Metronidazole &plusmn; Vancomycin.
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⚠️ CRITICAL AIRWAY CONTRAINDICATION:</strong>
                <br />
                In Ludwig&apos;s angina, <strong>NEVER administer paralytics or attempt blind oral intubation</strong>. Loss of pharyngeal dilator muscle tone causes instant, irreversible upper airway obstruction.
              </div>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className={styles.card}>
            {!quizCompleted ? (
              <>
                <h3 className={styles.cardTitle}>
                  Question {currentQuizIndex + 1} of {PG9_QUIZ_QUESTIONS.length}
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  {PG9_QUIZ_QUESTIONS[currentQuizIndex].question}
                </p>

                <div>
                  {PG9_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                    let className = styles.quizOption;
                    if (selectedQuizAnswer !== null) {
                      if (idx === PG9_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
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
                    <strong>Explanation:</strong> {PG9_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  </div>
                )}

                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  {selectedQuizAnswer !== null && (
                    <button className={styles.actionBtn} onClick={nextQuestion}>
                      {currentQuizIndex < PG9_QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Final Score"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <h3 style={{ color: "#38bdf8", fontSize: "1.5rem" }}>Diagnostic Challenge Completed!</h3>
                <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
                  Your Score: <strong style={{ color: "#10b981" }}>{quizScore}</strong> / {PG9_QUIZ_QUESTIONS.length}
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
