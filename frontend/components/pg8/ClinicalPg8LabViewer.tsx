"use client";

import React, { useState } from "react";
import styles from "./ClinicalPg8LabViewer.module.css";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PG8_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "According to Lincoff's rules, in a patient with an inferior rhegmatogenous retinal detachment where subretinal fluid is significantly higher on the temporal side compared to the nasal side, where is the primary retinal break expected to be found?",
    options: [
      "On the higher temporal side near the superior extent of the fluid",
      "Directly at 12 o'clock in the vertical meridian",
      "Near 6 o'clock at the lowest dependent point of the retina",
      "At the nasal optic disc margin"
    ],
    correctAnswer: 0,
    explanation: "Lincoff's rule for asymmetrical inferior RRD states that the primary break is located on the side where the subretinal fluid is higher, as fluid tracks down gravitationally from the offending break."
  },
  {
    id: "q2",
    question: "What is the molecular mechanism of action of Faricimab (Vabysmo) that provides extended durability up to every 16 weeks in patients with Neovascular AMD and Diabetic Macular Edema?",
    options: [
      "Dual bispecific inhibition of both Vascular Endothelial Growth Factor-A (VEGF-A) and Angiopoietin-2 (Ang-2), promoting endothelial stability and pericyte coverage",
      "Selective blockade of Complement Factor D only",
      "Inhibition of Platelet-Derived Growth Factor (PDGF) monotherapy",
      "Direct covalent cross-linking of the neurosensory retina to the RPE"
    ],
    correctAnswer: 0,
    explanation: "Faricimab is a bispecific antibody designed to bind and neutralize both VEGF-A and Angiopoietin-2 (Ang-2), stabilizing retinal microvasculature, suppressing vascular leakage, and extending treatment intervals up to 16 weeks."
  },
  {
    id: "q3",
    question: "In an acute attack of pupillary block angle-closure glaucoma with an IOP of 70 mmHg, why is topical Pilocarpine 1-2% initially ineffective until systemic hyperosmotics or CAIs lower the IOP below 40-50 mmHg?",
    options: [
      "The pupillary sphincter muscle is ischemic and paralyzed at severe intraocular pressures above 40-50 mmHg",
      "Pilocarpine is destroyed by acidic tears during pain",
      "Pilocarpine causes paradoxical lens expansion at high IOP",
      "The corneal endothelium blocks drug penetration permanently"
    ],
    correctAnswer: 0,
    explanation: "At high IOP (>40-50 mmHg), the iris sphincter muscle suffers ischemia and becomes unresponsive to parasympathomimetics. Systemic hyperosmotics (Mannitol) or CAIs (Acetazolamide) must first lower the pressure before Pilocarpine can constrict the pupil."
  },
  {
    id: "q4",
    question: "In a 28-year-old female presenting with acute typical demyelinating optic neuritis with pain on eye movements, what was the definitive finding of the Optic Neuritis Treatment Trial (ONTT) regarding oral Prednisone monotherapy?",
    options: [
      "Oral Prednisone monotherapy is strictly contraindicated because it doubles the rate of optic neuritis recurrence without improving long-term visual recovery",
      "Oral Prednisone is superior to IV Methylprednisolone in preventing Multiple Sclerosis",
      "Oral Prednisone causes acute retinal detachment in young adults",
      "Oral Prednisone should be given at 5 mg daily for 2 years"
    ],
    correctAnswer: 0,
    explanation: "The landmark ONTT trial established that standard-dose oral Prednisone monotherapy alone is strictly contraindicated in acute optic neuritis because it doubled the rate of new episodes of optic neuritis compared to placebo or IV methylprednisolone."
  }
];

export const ClinicalPg8LabViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"vitreoretinal" | "retina" | "glaucoma" | "neuro" | "quiz">("vitreoretinal");

  // Vitreoretinal State
  const [rrdType, setRrdType] = useState<string>("Inferior Asymmetric (Temporal High)");
  const [tamponadeAgent, setTamponadeAgent] = useState<string>("C3F8 14%");
  const [laserApplied, setLaserApplied] = useState<boolean>(false);
  const [vitrectomyDone, setVitrectomyDone] = useState<boolean>(false);

  // Medical Retina State
  const [retinalDisease, setRetinalDisease] = useState<string>("Type 2 Classic nAMD");
  const [cstThickness, setCstThickness] = useState<number>(450);
  const [hasSrf, setHasSrf] = useState<boolean>(true);
  const [hasIrf, setHasIrf] = useState<boolean>(true);
  const [antiVegfDrug, setAntiVegfDrug] = useState<string>("Faricimab (VEGF-A + Ang-2)");

  // Glaucoma State
  const [acDepth, setAcDepth] = useState<number>(1.8);
  const [pupilSize, setPupilSize] = useState<number>(4.5);
  const [mannitolGiven, setMannitolGiven] = useState<boolean>(false);
  const [lpiDone, setLpiDone] = useState<boolean>(false);

  // Neuro-Ophthalmology State
  const [neuroCondition, setNeuroCondition] = useState<string>("GCA (Arteritic A-AION)");
  const [esrValue, setEsrValue] = useState<number>(92);
  const [crpValue, setCrpValue] = useState<number>(4.2);
  const [steroidsStarted, setSteroidsStarted] = useState<boolean>(false);
  const [biopsyDone, setBiopsyDone] = useState<boolean>(false);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Dynamic calculations
  let calculatedIop = 16;
  if (acDepth < 2.2 && pupilSize >= 4.0 && pupilSize <= 5.5) {
    calculatedIop = 68;
    if (mannitolGiven) calculatedIop -= 32;
    if (lpiDone) calculatedIop = 14;
  }

  // Lincoff break location prediction
  let predictedBreak = "Within 1.5 clock hours of 12 o'clock";
  if (rrdType.includes("Temporal High")) {
    predictedBreak = "Superotemporal quadrant (near 8-9 o'clock)";
  } else if (rrdType.includes("Inferior Symmetrical")) {
    predictedBreak = "Near 6 o'clock vertical meridian";
  } else if (rrdType.includes("Superior Lateralized")) {
    predictedBreak = "Superior quadrant on the affected side";
  }

  const handleQuizAnswer = (index: number) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(index);
    if (index === PG8_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < PG8_QUIZ_QUESTIONS.length - 1) {
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
    <div className={styles.container} id="clinical-pg8-lab-viewer">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Virtual Postgraduate Ophthalmology, Vitreoretinal &amp; Neuro-Ophthalmic Lab (PG-608)</h2>
          <span className={styles.subtitle}>
            Lincoff's Rules &bull; Vitrectomy Endotamponades &bull; Anti-VEGF / Dual Ang-2 &bull; Pupillary Block LPI &bull; GCA vs ONTT
          </span>
        </div>
        <span className={styles.badge}>PG-608 &bull; Advanced Residency</span>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "vitreoretinal" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("vitreoretinal")}
        >
          👁️ Vitreoretinal &amp; Lincoff
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "retina" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("retina")}
        >
          🔬 Medical Retina &amp; Anti-VEGF
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "glaucoma" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("glaucoma")}
        >
          ⚡ Acute Glaucoma Crisis &amp; LPI
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "neuro" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("neuro")}
        >
          🧠 Neuro-Ophthalmology (GCA/ONTT)
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "quiz" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          📝 Diagnostic Challenge Quiz
        </button>
      </div>

      <div className={styles.workspace}>
        {activeTab === "vitreoretinal" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>👁️ Retinal Detachment &amp; Lincoff's Predictor</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Subretinal Fluid Distribution</span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{rrdType}</span>
                </label>
                <select
                  value={rrdType}
                  onChange={(e) => setRrdType(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Superior Crossing 12 o'clock">Superior RRD Crossing Midline</option>
                  <option value="Inferior Asymmetric (Temporal High)">Inferior Asymmetric RRD (Temporal Fluid Higher)</option>
                  <option value="Inferior Symmetrical">Inferior Symmetrical Bullous RRD</option>
                  <option value="Superior Lateralized">Superior Lateralized (Unilateral Descent)</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Endotamponade Agent</span>
                  <span style={{ color: "#a855f7", fontWeight: "bold" }}>{tamponadeAgent}</span>
                </label>
                <select
                  value={tamponadeAgent}
                  onChange={(e) => setTamponadeAgent(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="SF6 20%">SF6 20% Isovolumetric (10-14 days duration)</option>
                  <option value="C3F8 14%">C3F8 14% Isovolumetric (6-8 weeks duration - Inferior/PVR)</option>
                  <option value="Silicone Oil 1000 cSt">Silicone Oil 1000 cSt (Permanent / Air Travel)</option>
                  <option value="Silicone Oil 5000 cSt">Silicone Oil 5000 cSt (Severe PVR Grade C)</option>
                </select>
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setVitrectomyDone(!vitrectomyDone)}
                  style={{ background: vitrectomyDone ? "#059669" : "#0284c7" }}
                >
                  {vitrectomyDone ? "✓ 25G Vitrectomy Shaving Complete" : "Execute 25G Pars Plana Vitrectomy"}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setLaserApplied(!laserApplied)}
                  style={{ background: laserApplied ? "#059669" : "#334155" }}
                >
                  {laserApplied ? "✓ 360° Barrier Endolaser Applied" : "Apply 360° Barrier Endolaser"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Lincoff Localization &amp; Tamponade Dynamics</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Lincoff Predicted Break:</strong>{" "}
                  <span style={{ color: "#10b981", fontSize: "1.1rem", fontWeight: "bold" }}>
                    {predictedBreak}
                  </span>
                </div>
                <div>
                  <strong>Endotamponade Longevity:</strong>{" "}
                  <span>
                    {tamponadeAgent.includes("SF6")
                      ? "10 to 14 days intraocular resorption"
                      : tamponadeAgent.includes("C3F8")
                      ? "6 to 8 weeks intraocular resorption (Optimal for inferior tears & PVR)"
                      : "Non-absorbable long-term tamponade; requires secondary surgical oil removal"}
                  </span>
                </div>
                <div>
                  <strong>Postoperative Positioning:</strong> Strict prone / face-down positioning for 5-7 days to appose buoyant gas bubble against the treated retinal break.
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⚠️ FLIGHT &amp; ANESTHESIA SAFETY:</strong>
                <br />
                Patients with intraocular gas bubbles (SF6 or C3F8) must <strong>NEVER fly in an airplane</strong> or receive <strong>Nitrous Oxide (N2O) anesthesia</strong> due to rapid gas expansion and blinding intraocular pressure elevation!
              </div>
            </div>
          </div>
        )}

        {activeTab === "retina" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🔬 Exudative Maculopathy &amp; OCT Parameters</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Macular Pathology</span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{retinalDisease}</span>
                </label>
                <select
                  value={retinalDisease}
                  onChange={(e) => setRetinalDisease(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Type 1 Occult nAMD">Type 1 Occult nAMD (Sub-RPE Neovascularization)</option>
                  <option value="Type 2 Classic nAMD">Type 2 Classic nAMD (Subretinal Membrane / SHRM)</option>
                  <option value="Type 3 RAP">Type 3 Retinal Angiomatous Proliferation</option>
                  <option value="Diabetic Macular Edema (DME)">Diabetic Macular Edema (Cystoid Macular Edema)</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Central Subfield Thickness (CST)</span>
                  <span style={{ color: cstThickness > 320 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>{cstThickness} &mu;m</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={700}
                  value={cstThickness}
                  onChange={(e) => setCstThickness(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Anti-VEGF Pharmacotherapy</span>
                  <span style={{ color: "#a855f7", fontWeight: "bold" }}>{antiVegfDrug}</span>
                </label>
                <select
                  value={antiVegfDrug}
                  onChange={(e) => setAntiVegfDrug(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="Faricimab (VEGF-A + Ang-2)">Faricimab 6.0 mg (Dual VEGF-A + Angiopoietin-2)</option>
                  <option value="Aflibercept 8.0 mg HD">Aflibercept 8.0 mg High-Dose (VEGF-A/B, PlGF Decoy)</option>
                  <option value="Ranibizumab 0.5 mg">Ranibizumab 0.5 mg (VEGF-A Fab Fragment)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                  <input type="checkbox" checked={hasSrf} onChange={(e) => setHasSrf(e.target.checked)} />
                  Subretinal Fluid (SRF)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                  <input type="checkbox" checked={hasIrf} onChange={(e) => setHasIrf(e.target.checked)} />
                  Intraretinal Fluid (IRF Cysts)
                </label>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Treat-and-Extend Regimen &amp; Durability</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Target Interval:</strong>{" "}
                  <span style={{ color: "#10b981", fontSize: "1.1rem", fontWeight: "bold" }}>
                    {antiVegfDrug.includes("Faricimab")
                      ? "Up to Q16 Weeks (Every 4 Months via Ang-2 Pericyte Stabilization)"
                      : antiVegfDrug.includes("Aflibercept")
                      ? "Q12 to Q16 Weeks with High-Dose Formulation"
                      : "Q4 to Q8 Weeks (Standard Monthly / Treat-and-Extend)"}
                  </span>
                </div>
                <div>
                  <strong>Fluid Resolution Goal:</strong> Complete drying of intraretinal fluid (IRF) and stabilization of subretinal fluid (SRF) to prevent photoreceptor apoptosis and subretinal fibrosis.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "glaucoma" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>⚡ Anterior Chamber &amp; Pupillary Block</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Anterior Chamber Depth (ACD)</span>
                  <span style={{ color: acDepth < 2.2 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>{acDepth} mm</span>
                </label>
                <input
                  type="range"
                  min={1.2}
                  max={3.8}
                  step={0.1}
                  value={acDepth}
                  onChange={(e) => setAcDepth(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Pupil Diameter (Mid-Dilation Risk Zone: 4.0 - 5.5 mm)</span>
                  <span style={{ color: pupilSize >= 4.0 && pupilSize <= 5.5 ? "#ef4444" : "#38bdf8", fontWeight: "bold" }}>
                    {pupilSize} mm
                  </span>
                </label>
                <input
                  type="range"
                  min={2.0}
                  max={8.0}
                  step={0.5}
                  value={pupilSize}
                  onChange={(e) => setPupilSize(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setMannitolGiven(!mannitolGiven)}
                  style={{ background: mannitolGiven ? "#059669" : "#0284c7" }}
                >
                  {mannitolGiven ? "✓ IV 20% Mannitol & Acetazolamide Infused" : "Administer IV 20% Mannitol + Acetazolamide"}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setLpiDone(!lpiDone)}
                  style={{ background: lpiDone ? "#059669" : "#dc2626" }}
                >
                  {lpiDone ? "✓ Bilateral Nd:YAG Laser Iridotomies Complete" : "Perform Bilateral Nd:YAG Laser Iridotomies"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Intraocular Pressure &amp; Decompression Status</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Intraocular Pressure (IOP):</strong>{" "}
                  <span
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: calculatedIop > 30 ? "#ef4444" : "#10b981"
                    }}
                  >
                    {calculatedIop} mmHg {calculatedIop > 30 ? "(ACUTE CRISIS: Pupillary Block Iris Bombe)" : "(Controlled / Resolved)"}
                  </span>
                </div>
                <div>
                  <strong>Definitive Surgical Mechanism:</strong> Nd:YAG laser creates a full-thickness aperture in the superior peripheral iris (11 or 1 o'clock under eyelid), equalizing pressure between anterior and posterior chambers and flattening the iris bombe.
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⚠️ MANDATORY FELLOW EYE PROTOCOL:</strong>
                <br />
                The contralateral fellow eye has a <strong>50% risk</strong> of acute angle closure within 5 years. Prophylactic Nd:YAG LPI to the fellow eye is <strong>strictly mandatory</strong>.
              </div>
            </div>
          </div>
        )}

        {activeTab === "neuro" && (
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🧠 Neuro-Ophthalmic Condition &amp; Inflammatory Markers</h3>
              <div className={styles.controlGroup}>
                <label>
                  <span>Diagnostic Syndrome</span>
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>{neuroCondition}</span>
                </label>
                <select
                  value={neuroCondition}
                  onChange={(e) => setNeuroCondition(e.target.value)}
                  style={{ background: "#0f172a", color: "white", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #334155" }}
                >
                  <option value="GCA (Arteritic A-AION)">Giant Cell Arteritis (Arteritic AION - Vascular Emergency)</option>
                  <option value="Non-Arteritic AION (NAION)">Non-Arteritic AION (Crowded Disc at Risk)</option>
                  <option value="Optic Neuritis (ONTT)">Demyelinating Optic Neuritis (MS-Associated)</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>Erythrocyte Sedimentation Rate (ESR)</span>
                  <span style={{ color: esrValue > 50 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>{esrValue} mm/hr</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={130}
                  value={esrValue}
                  onChange={(e) => setEsrValue(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label>
                  <span>C-Reactive Protein (CRP)</span>
                  <span style={{ color: crpValue > 2.0 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>{crpValue} mg/dL</span>
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={10.0}
                  step={0.1}
                  value={crpValue}
                  onChange={(e) => setCrpValue(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.btnGroup}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setSteroidsStarted(!steroidsStarted)}
                  style={{ background: steroidsStarted ? "#059669" : "#dc2626" }}
                >
                  {steroidsStarted ? "✓ IV Methylprednisolone 1 g/day Active" : "Initiate High-Dose IV Methylprednisolone"}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setBiopsyDone(!biopsyDone)}
                  style={{ background: biopsyDone ? "#059669" : "#334155" }}
                >
                  {biopsyDone ? "✓ Temporal Artery Biopsy (>=2 cm) Performed" : "Perform Temporal Artery Biopsy (>=2 cm)"}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Management Protocol &amp; Critical Trial Rules</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Clinical Distinction:</strong>
                  {neuroCondition.includes("GCA") ? (
                    <p style={{ margin: "0.25rem 0" }}>
                      Arteritic A-AION presents with catastrophic vision loss, chalky white disc pallor, jaw claudication, and markedly elevated ESR/CRP. Immediate IV methylprednisolone prevents contralateral blindness.
                    </p>
                  ) : neuroCondition.includes("NAION") ? (
                    <p style={{ margin: "0.25rem 0" }}>
                      NAION presents with altitudinal field loss in a small, crowded optic disc (&apos;disc at risk&apos; with cup-to-disc ratio &lt;0.1) with normal inflammatory markers.
                    </p>
                  ) : (
                    <p style={{ margin: "0.25rem 0" }}>
                      Optic Neuritis presents with subacute loss of vision, painful eye movements (90%), and RAPD.
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.alertBox}>
                <strong>⚠️ ONTT TRIAL STRICT CONTRAINDICATION:</strong>
                <br />
                In acute demyelinating optic neuritis, <strong>Oral Prednisone monotherapy alone is strictly contraindicated</strong> because the ONTT demonstrated it <strong>doubles the rate of recurrent optic neuritis</strong>!
              </div>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className={styles.card}>
            {!quizCompleted ? (
              <>
                <h3 className={styles.cardTitle}>
                  Question {currentQuizIndex + 1} of {PG8_QUIZ_QUESTIONS.length}
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  {PG8_QUIZ_QUESTIONS[currentQuizIndex].question}
                </p>

                <div>
                  {PG8_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                    let className = styles.quizOption;
                    if (selectedQuizAnswer !== null) {
                      if (idx === PG8_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
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
                    <strong>Explanation:</strong> {PG8_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  </div>
                )}

                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  {selectedQuizAnswer !== null && (
                    <button className={styles.actionBtn} onClick={nextQuestion}>
                      {currentQuizIndex < PG8_QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Final Score"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <h3 style={{ color: "#38bdf8", fontSize: "1.5rem" }}>Diagnostic Challenge Completed!</h3>
                <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
                  Your Score: <strong style={{ color: "#10b981" }}>{quizScore}</strong> / {PG8_QUIZ_QUESTIONS.length}
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
