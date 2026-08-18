"use client";

import React, { useState } from "react";
import styles from "./ClinicalPg11LabViewer.module.css";

export const ClinicalPg11LabViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"sci" | "tbi" | "spasticity" | "pediatric" | "quiz">("sci");

  // Tab 1: Spinal Cord Injury & Autonomic Dysreflexia States
  const [neurologicalLevel, setNeurologicalLevel] = useState<"C4" | "C6" | "T4" | "T10" | "L2">("T4");
  const [asiaGrade, setAsiaGrade] = useState<"A" | "B" | "C" | "D" | "E">("A");
  const [systolicBp, setSystolicBp] = useState<number>(185);
  const [heartRateBpm, setHeartRateBpm] = useState<number>(44);
  const [foleyKinked, setFoleyKinked] = useState<boolean>(true);
  const [seatedUpright, setSeatedUpright] = useState<boolean>(false);

  // Tab 2: TBI, Rancho Staging & Concussion States
  const [ranchoLevel, setRanchoLevel] = useState<number>(4);
  const [docState, setDocState] = useState<"Coma" | "VS" | "MCS" | "LockedIn">("MCS");
  const [concussionStage, setConcussionStage] = useState<number>(3);

  // Tab 3: Spasticity & Botulinum Toxin States
  const [masScore, setMasScore] = useState<string>("3");
  const [targetMuscle, setTargetMuscle] = useState<"Biceps" | "Gastrocnemius" | "Hamstrings" | "FlexorDigitorum">("Biceps");
  const [itbWithdrawalAlert, setItbWithdrawalAlert] = useState<boolean>(false);

  // Tab 4: Pediatric CP & Gait Kinematics States
  const [gmfcsLevel, setGmfcsLevel] = useState<"I" | "II" | "III" | "IV" | "V">("II");
  const [gaitPattern, setGaitPattern] = useState<"Crouch" | "Equinus" | "JumpKnee" | "StiffKnee">("Crouch");

  // Tab 5: Diagnostic Challenge Quiz State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const quizQuestions = [
    {
      q: "A 32-year-old male with a T4 complete spinal cord injury presents with severe pounding headache, blurred vision, profuse sweating above T4, BP 188/110 mmHg, and HR 44 bpm. What is the immediate, non-pharmacologic FIRST step in management?",
      options: [
        "Immediately sit the patient upright at 90 degrees with legs dangling over the bed to induce orthostatic venous pooling and lower central blood pressure",
        "Place the patient supine with legs elevated in Trendelenburg position",
        "Administer IV hydralazine bolus while keeping the patient lying flat",
        "Perform immediate lumbar puncture"
      ],
      correct: 0,
      exp: "The immediate first step in managing Autonomic Dysreflexia is sitting the patient upright (90 degrees) with legs dangling to pool blood in splanchnic and lower extremity vascular beds, rapidly reducing dangerous cerebral blood pressure. The next immediate steps are loosening tight clothing and relieving bladder/bowel distension."
    },
    {
      q: "A patient with severe TBI is awake, extremely restless, combative, pulls at medical lines, lacks short-term memory, and exhibits bizarre, non-purposeful behaviors. Which Rancho Los Amigos Level is this, and what is the environmental strategy?",
      options: [
        "Rancho Los Amigos Level IV (Confused-Agitated); provide a quiet, low-stimulation environment with dim lighting, consistent routine, and avoid physical restraints whenever possible",
        "Rancho Los Amigos Level II (Generalized Response); use high-intensity audio stimulation",
        "Rancho Los Amigos Level VI (Confused-Appropriate); discharge home immediately",
        "Rancho Los Amigos Level VIII (Purposeful-Appropriate); begin computerized cognitive training"
      ],
      correct: 0,
      exp: "Rancho Level IV is characterized by internal confusion, severe agitation, aggression, and lack of short-term recall. The management priority is minimizing external sensory over-stimulation (quiet room, low lighting) and avoiding physical restraints which paradoxically escalate panic and combative struggling."
    },
    {
      q: "A patient with an implanted Intrathecal Baclofen (ITB) pump presents with acute high fever of 40.1 C, severe rebound spasticity, hallucinations, and tachycardia due to an empty pump reservoir. What is the diagnosis and urgent medical stabilization?",
      options: [
        "Acute Intrathecal Baclofen (ITB) Withdrawal Emergency; immediately administer high-dose intravenous Benzodiazepines and urgently re-infuse intrathecal baclofen (or continuous IV propofol)",
        "Baclofen toxicity; administer Flumazenil and drain the pump",
        "Serotonin syndrome; administer Cyproheptadine only",
        "Neurogenic shock; administer high-dose Norepinephrine"
      ],
      correct: 0,
      exp: "Abrupt cessation of intrathecal baclofen causes severe, life-threatening withdrawal characterized by hyperthermia, extreme rebound spasticity, rhabdomyolysis, seizures, and death mimicking NMS. Immediate resuscitation requires high-dose IV benzodiazepines (GABA-A agonism) and urgent restoration of intrathecal baclofen."
    },
    {
      q: "An 8-year-old child with spastic diplegic cerebral palsy demonstrates excessive knee flexion and hip flexion during the entire stance phase (Crouch Gait) with 3+/5 quadriceps strength. Which orthosis is indicated?",
      options: [
        "Ground Reaction Ankle-Foot Orthosis (GRAFO), which directs the ground reaction force vector anterior to the knee joint center to generate an extension moment during stance",
        "Posterior Leaf Spring (PLS) AFO",
        "Flexible supramalleolar orthosis (SMO)",
        "High-top leather shoes with no ankle support"
      ],
      correct: 0,
      exp: "Ground Reaction AFOs (GRAFOs) rigidly restrict ankle dorsiflexion, positioning the ankle in slight plantarflexion/neutral so that during stance phase, the ground reaction force vector is directed anterior to the knee joint axis, generating an external knee extension moment that prevents crouch collapse."
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

  // Botulinum toxin dose estimations
  const botoxDoseMap: Record<string, number> = {
    Biceps: 100,
    Gastrocnemius: 150,
    Hamstrings: 150,
    FlexorDigitorum: 75
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>
          ♿ Postgraduate Advanced Physical Medicine, Rehabilitation &amp; Neurotrauma Lab (PG-611)
        </h2>
        <p className={styles.headerSubtitle}>
          Interactive Neuro-Rehabilitation &bull; ISNCSCI/ASIA Impairment Scale &bull; Autonomic Dysreflexia &bull; Rancho Cognitive Levels &bull; Spasticity Chemodenervation &bull; Pediatric Gait Kinematics
        </p>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabButton} ${activeTab === "sci" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("sci")}
        >
          ⚡ SCI &amp; Autonomic Dysreflexia
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "tbi" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("tbi")}
        >
          🧠 TBI Cognitive Staging &amp; Concussion
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "spasticity" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("spasticity")}
        >
          💉 Spasticity &amp; Chemodenervation
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "pediatric" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("pediatric")}
        >
          🚶 Pediatric CP, Gait &amp; Prosthetics
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "quiz" ? styles.activeTabButton : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          📝 Diagnostic Challenge Quiz
        </button>
      </div>

      {activeTab === "sci" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>⚡ ISNCSCI Classification &amp; Vital Signs</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Neurological Level of Injury (NLI):</label>
              <select
                className={styles.select}
                value={neurologicalLevel}
                onChange={(e) => setNeurologicalLevel(e.target.value as any)}
              >
                <option value="C4">C4 (Diaphragm intact; ventilator independent; tetraplegia)</option>
                <option value="C6">C6 (Wrist extensors intact; tenodesis grasp functional)</option>
                <option value="T4">T4 (High thoracic; high risk for Autonomic Dysreflexia &ge; T6)</option>
                <option value="T10">T10 (Low thoracic; intact abdominal muscles; AD risk low)</option>
                <option value="L2">L2 (Lumbar; hip flexors intact; paraplegia)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>ASIA Impairment Scale (AIS Grade):</label>
              <select
                className={styles.select}
                value={asiaGrade}
                onChange={(e) => setAsiaGrade(e.target.value as any)}
              >
                <option value="A">AIS A - Complete (No S4-S5 sacral sparing; no DAP/VAC)</option>
                <option value="B">AIS B - Sensory Incomplete (Sensory spared S4-S5; no motor &gt; 3 levels)</option>
                <option value="C">AIS C - Motor Incomplete (&gt; 50% key muscles below level &lt; Grade 3)</option>
                <option value="D">AIS D - Motor Incomplete (&ge; 50% key muscles below level &ge; Grade 3)</option>
                <option value="E">AIS E - Normal motor and sensory recovery</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Systolic Blood Pressure:
                <span className={styles.sliderVal}>{systolicBp} mmHg (Baseline 95 mmHg)</span>
              </label>
              <input
                type="range"
                min={80}
                max={220}
                value={systolicBp}
                onChange={(e) => setSystolicBp(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Heart Rate:
                <span className={styles.sliderVal}>{heartRateBpm} bpm (Vagal Bradycardia)</span>
              </label>
              <input
                type="range"
                min={35}
                max={110}
                value={heartRateBpm}
                onChange={(e) => setHeartRateBpm(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Patient Position &amp; Bladder Status:</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={styles.select}
                  style={{ flex: 1, background: seatedUpright ? "#065f46" : "#0f172a", cursor: "pointer" }}
                  onClick={() => setSeatedUpright(!seatedUpright)}
                >
                  {seatedUpright ? "✅ Seated Upright 90&deg;" : "🛏️ Supine in Bed"}
                </button>
                <button
                  className={styles.select}
                  style={{ flex: 1, background: foleyKinked ? "#991b1b" : "#065f46", cursor: "pointer" }}
                  onClick={() => setFoleyKinked(!foleyKinked)}
                >
                  {foleyKinked ? "⚠️ Foley Blocked (85% Trigger)" : "✅ Bladder Decompressed"}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 Autonomic Dysreflexia Emergency Status</h3>

            {(neurologicalLevel === "C4" || neurologicalLevel === "C6" || neurologicalLevel === "T4") && systolicBp >= 140 ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>🚨 AUTONOMIC DYSREFLEXIA (AD) ACTIVE!</strong>
                  <span className={`${styles.badge} ${styles.badgeRed}`}>Lesion &ge; T6 Crisis</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Pathophysiology:</strong> Uninhibited sympathetic discharge below T6 &rarr; massive vasoconstriction (SBP {systolicBp} mmHg) with compensatory vagal bradycardia ({heartRateBpm} bpm), facial flushing, and pounding headache.
                </p>
                <div style={{ marginTop: "0.5rem", background: "rgba(0,0,0,0.3)", padding: "0.5rem", borderRadius: "0.25rem" }}>
                  <strong>Stepwise Emergency Checklist:</strong>
                  <ol style={{ margin: "0.25rem 0 0 0", paddingLeft: "1.2rem" }}>
                    <li>
                      <strong>Sit patient upright (90&deg;)</strong> with legs dangling (induces orthostatic venous pooling).
                    </li>
                    <li>Loosen all tight clothing, abdominal binders, and elastic stockings.</li>
                    <li>
                      <strong>Check and relieve urinary blockage</strong> (unkink/irrigate Foley with lidocaine jelly).
                    </li>
                    <li>If SBP remains &gt; 150 mmHg: Apply <strong>1-2 inches of 2% Nitropaste</strong> above the lesion level.</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <strong>✅ Hemodynamically Stable:</strong> SBP {systolicBp} mmHg, HR {heartRateBpm} bpm. No active autonomic dysreflexia storming. Continue routine neurogenic bladder catheterization schedule.
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>Incomplete Spinal Cord Injury Syndromes:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1" }}>
                <li><strong>Central Cord Syndrome:</strong> Upper &gt; Lower extremity weakness; hyperextension cervical trauma.</li>
                <li><strong>Anterior Cord Syndrome:</strong> Loss of motor, pain, temperature; dorsal columns (vibration/proprioception) preserved.</li>
                <li><strong>Brown-S&eacute;quard Syndrome:</strong> Ipsilateral motor/proprioception loss; contralateral pain/temperature loss.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tbi" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🧠 Rancho Los Amigos Cognitive Staging (I-X)</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Rancho Los Amigos Level of Cognitive Functioning:
                <span className={styles.sliderVal}>Level {ranchoLevel}</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={ranchoLevel}
                onChange={(e) => setRanchoLevel(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Disorders of Consciousness (DoC) Phenotype:</label>
              <select
                className={styles.select}
                value={docState}
                onChange={(e) => setDocState(e.target.value as any)}
              >
                <option value="Coma">Coma (No wakefulness, no purposeful awareness)</option>
                <option value="VS">Vegetative State / UWS (Wakefulness/eye-opening without awareness)</option>
                <option value="MCS">Minimally Conscious State (Visual tracking, reproducible commands)</option>
                <option value="LockedIn">Locked-In Syndrome (Ventral pontine lesion; intact consciousness)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                SCAT-6 Concussion Return-to-Play Stage:
                <span className={styles.sliderVal}>Stage {concussionStage} of 6</span>
              </label>
              <input
                type="range"
                min={1}
                max={6}
                value={concussionStage}
                onChange={(e) => setConcussionStage(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 Cognitive State &amp; Neuro-Stimulation Protocol</h3>

            {ranchoLevel === 4 ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>⚠️ Rancho Level IV: Confused-Agitated</strong>
                  <span className={`${styles.badge} ${styles.badgeRed}`}>Maximal Assistance</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Key Behaviors:</strong> Heightened activity, aggression, bizarre/non-purposeful actions, absence of short-term memory.
                  <br /><strong>Management Strategy:</strong> Private quiet room, dim lighting, minimize visitors, consistent schedule, <strong>AVOID physical restraints</strong> (which provoke panic/struggling), and utilize simple, non-confrontational redirection.
                </p>
              </div>
            ) : ranchoLevel === 5 ? (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <strong>Rancho Level V: Confused-Inappropriate, Non-Agitated</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Alert, responds to simple commands; highly distractible, gross confabulation; requires structured redirection.
                </p>
              </div>
            ) : ranchoLevel === 6 ? (
              <div className={`${styles.alertBox} ${styles.alertInfo}`}>
                <strong>Rancho Level VI: Confused-Appropriate</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Goal-directed behavior with cues; emerging awareness of self and injury; follows rehabilitation schedule with moderate assistance.
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <strong>Rancho Level {ranchoLevel}: {ranchoLevel <= 3 ? "Low Response (Sensory Stimulation)" : "Automatic to Purposeful Independence"}</strong>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>Evidence-Based Neuro-Pharmacology for DoC Emergence:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1" }}>
                <li>
                  <strong>Amantadine (100-200 mg BID):</strong> Dopamine agonist / NMDA antagonist proven in NEJM multicenter RCT to significantly accelerate functional emergence in traumatic DoC.
                </li>
                <li>
                  <strong>Concussion Stage {concussionStage}:</strong>{" "}
                  {concussionStage === 1 && "Symptom-limited rest and light cognitive tasks."}
                  {concussionStage === 2 && "Light aerobic exercise (stationary cycling, no resistance)."}
                  {concussionStage === 3 && "Sport-specific running/skating drills; NO head impact."}
                  {concussionStage === 4 && "Non-contact training drills with passing; resistance training."}
                  {concussionStage === 5 && "Full-contact practice following mandatory medical clearance."}
                  {concussionStage === 6 && "Full, unrestricted return to game competition."}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "spasticity" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>💉 Spasticity Grading &amp; Chemodenervation</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Modified Ashworth Scale (MAS) Score:</label>
              <select
                className={styles.select}
                value={masScore}
                onChange={(e) => setMasScore(e.target.value)}
              >
                <option value="0">Grade 0 - No increase in muscle tone</option>
                <option value="1">Grade 1 - Catch and release / minimal resistance at end ROM</option>
                <option value="1+">Grade 1+ - Catch followed by minimal resistance through &lt; 50% ROM</option>
                <option value="2">Grade 2 - Marked increase in tone through most of ROM; easily flexed</option>
                <option value="3">Grade 3 - Considerable increase in tone; passive movement difficult</option>
                <option value="4">Grade 4 - Affected part rigid in flexion or extension</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Target Spastic Muscle Group:</label>
              <select
                className={styles.select}
                value={targetMuscle}
                onChange={(e) => setTargetMuscle(e.target.value as any)}
              >
                <option value="Biceps">Biceps Brachii / Brachialis (Elbow Flexor Spasticity)</option>
                <option value="Gastrocnemius">Gastrocnemius / Soleus (Equinus Foot Spasticity)</option>
                <option value="Hamstrings">Medial &amp; Lateral Hamstrings (Knee Flexor Spasticity)</option>
                <option value="FlexorDigitorum">Flexor Digitorum Profundus (Clenched Fist Deformity)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Intrathecal Baclofen (ITB) Pump Simulator:</label>
              <button
                className={styles.select}
                style={{ background: itbWithdrawalAlert ? "#991b1b" : "#0f172a", cursor: "pointer", fontWeight: "600" }}
                onClick={() => setItbWithdrawalAlert(!itbWithdrawalAlert)}
              >
                {itbWithdrawalAlert ? "🚨 ITB Pump Empty / Catheter Kinked (WITHDRAWAL)" : "✅ ITB Pump Infusing 400 &mu;g/day"}
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 Chemodenervation &amp; ITB Emergency Protocol</h3>

            {itbWithdrawalAlert ? (
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>🚨 INTRATHECAL BACLOFEN WITHDRAWAL CRISIS!</strong>
                  <span className={`${styles.badge} ${styles.badgeRed}`}>Medical Emergency</span>
                </div>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Clinical Presentation:</strong> High fever (&gt;39.5 &deg;C), extreme rebound spasticity, hallucinations, rhabdomyolysis, seizures, multisystem organ failure, and death mimicking NMS.
                  <br /><strong>Emergency Treatment:</strong> Immediate high-dose IV Benzodiazepines (Diazepam/Lorazepam), urgent ITB pump refilling/re-infusion, or continuous IV Propofol.
                </p>
              </div>
            ) : (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <strong>Targeted Botulinum Toxin A (Botox) Prescription:</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Target: <strong>{targetMuscle}</strong> &rarr; Recommended Dose:{" "}
                  <span style={{ color: "#38bdf8", fontWeight: "700" }}>{botoxDoseMap[targetMuscle]} Units</span> (Ultrasound / EMG guidance mandatory). Max adult total dose: &le; 400-600 Units per session. Peak effect at 4-6 weeks; duration 3-4 months.
                </p>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>Oral Antispasticity Pharmacotherapy Comparison:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1" }}>
                <li><strong>Baclofen:</strong> GABA-B agonist; causes sedation and weakness; never stop abruptly.</li>
                <li><strong>Tizanidine:</strong> Central alpha-2 agonist; causes dry mouth and hypotension; monitor LFTs.</li>
                <li><strong>Dantrolene:</strong> Ryanodine antagonist acting directly on muscle; black box warning for hepatotoxicity.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "pediatric" && (
        <div className={styles.gridTwo}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🚶 Pediatric CP &amp; Gait Kinematics</h3>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Gross Motor Function Classification (GMFCS):</label>
              <select
                className={styles.select}
                value={gmfcsLevel}
                onChange={(e) => setGmfcsLevel(e.target.value as any)}
              >
                <option value="I">GMFCS Level I - Walks without limitations; climbs stairs without rails</option>
                <option value="II">GMFCS Level II - Walks with limitations; holds railing for stairs</option>
                <option value="III">GMFCS Level III - Walks with handheld devices (crutches/walkers)</option>
                <option value="IV">GMFCS Level IV - Self-mobility with powered wheelchair / assist</option>
                <option value="V">GMFCS Level V - Transported in manual wheelchair; head/trunk limitations</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Pathological Gait Pattern Under Analysis:</label>
              <select
                className={styles.select}
                value={gaitPattern}
                onChange={(e) => setGaitPattern(e.target.value as any)}
              >
                <option value="Crouch">Crouch Gait (Excessive knee/hip flexion throughout stance)</option>
                <option value="Equinus">Equinus Gait (Toe-walking with premature heel-rise)</option>
                <option value="JumpKnee">Jump Knee Gait (Equinus + early stance flexion &rarr; late hyperextension)</option>
                <option value="StiffKnee">Stiff Knee Gait (Inadequate knee flexion during swing phase)</option>
              </select>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📋 Orthotic Prescription &amp; Prosthetic Biomechanics</h3>

            {gaitPattern === "Crouch" && (
              <div className={`${styles.alertBox} ${styles.alertInfo}`}>
                <strong>🦶 Orthotic Prescription: Ground Reaction AFO (GRAFO)</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  <strong>Biomechanical Mechanism:</strong> Restricts ankle dorsiflexion, positioning the ground reaction force vector anterior to the knee joint center to generate an external knee extension moment during midstance, preventing crouch collapse.
                </p>
              </div>
            )}

            {gaitPattern === "Equinus" && (
              <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                <strong>🦶 Orthotic Prescription: Solid or Hinged AFO with Plantarflexion Stop</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Controls excessive plantarflexion, prevents toe drag during swing phase, and facilitates heel-strike at initial contact.
                </p>
              </div>
            )}

            {gaitPattern === "StiffKnee" && (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <strong>🦴 Surgical Intervention: Rectus Femoris Transfer</strong>
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem" }}>
                  Transfers the distal rectus femoris tendon to gracilis or semitendinosus, converting a knee extensor into a knee flexor to clear the foot in swing.
                </p>
              </div>
            )}

            {gaitPattern === "JumpKnee" && (
              <div className={`${styles.alertBox} ${styles.alertInfo}`}>
                <strong>🦶 Orthotic Prescription: Articulated AFO with Plantarflexion Stop</strong>
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "0.875rem", borderRadius: "0.375rem", border: "1px solid #334155", fontSize: "0.85rem" }}>
              <h4 style={{ color: "#38bdf8", margin: "0 0 0.4rem 0" }}>Transtibial (BKA) Prosthetic Pressure Zones:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", color: "#cbd5e1" }}>
                <div>
                  <strong style={{ color: "#10b981" }}>Pressure-Tolerant (Load):</strong>
                  <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                    <li>Patellar Tendon (primary)</li>
                    <li>Medial Tibial Flare</li>
                    <li>Pretibial muscle belly</li>
                    <li>Gastrocnemius belly</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ color: "#ef4444" }}>Pressure-Sensitive (Relief):</strong>
                  <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                    <li>Tibial Tuberosity</li>
                    <li>Distal cut end of tibia/fibula</li>
                    <li>Fibular Head (Peroneal N.)</li>
                    <li>Anterior Tibial Crest</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📝 Postgraduate PM&amp;R Diagnostic Challenge</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
            Test your clinical mastery of Autonomic Dysreflexia, Rancho Los Amigos Level IV, ITB withdrawal, and Crouch gait GRAFO mechanics.
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
