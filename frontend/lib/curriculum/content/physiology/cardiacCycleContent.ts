/**
 * Cardiovascular Physiology & Cardiac Cycle Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.) and Costanzo Physiology (7th ed.).
 * Mapped to NMC CBME Competencies: PY5.1, PY5.2, PY5.3, PY5.4
 */

export interface PhysiologyLessonModule {
  id: string;
  unitCode: string;
  title: string;
  competencies: string[];
  estimatedMinutes: number;
  simulatorRoute?: string;
  simulatorParams?: Record<string, number | string>;
  organ3dTarget?: string;
  markdownContent: string;
  clinicalVignettes: Array<{
    scenario: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }>;
}

export const CARDIAC_CYCLE_MODULE: PhysiologyLessonModule = {
  id: "phys-cardiac-cycle",
  unitCode: "PY5.2",
  title: "Cardiac Cycle, Suga-Sagawa PV-Loops & Wiggers Mechanics",
  competencies: ["PY5.1", "PY5.2", "PY5.3"],
  estimatedMinutes: 120,
  simulatorRoute: "/simulators/cardiac-cycle",
  simulatorParams: {
    heartRate: 72,
    contractility: 1.0,
    preload: 120,
    afterload: 80
  },
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Cardiac Cycle, Suga-Sagawa PV-Loops & Wiggers Mechanics

The cardiac cycle describes the coordinated electrical, mechanical, and valvular events occurring in the heart during a single heartbeat. At a resting heart rate of **72 bpm**, each cardiac cycle lasts **0.83 seconds** (Systole ~0.3s, Diastole ~0.5s).

---

## 1. The 7 Phases of the Cardiac Cycle (Wiggers Sequence)

1. **Atrial Systole (0.1s)**:
   - Initiated by the P-wave on ECG.
   - Responsible for the final **15–20% of ventricular filling** ("atrial kick"). In patients with atrial fibrillation or stiff non-compliant ventricles (LV hypertrophy), loss of atrial kick can lead to acute heart failure.
   - Generates the atrial **a-wave** on central venous pressure (CVP) tracing.

2. **Isovolumetric Contraction (0.05s)**:
   - Ventricular depolarization (QRS complex) triggers myocyte contraction.
   - Ventricular pressure rises above atrial pressure, causing **Mitral/Tricuspid Valve Closure ($S_1$)**.
   - Ventricular volume remains constant because all 4 valves are closed.
   - The bulging of the mitral valve into the left atrium creates the **c-wave** on CVP.

3. **Rapid Ventricular Ejection (0.15s)**:
   - Ventricular pressure exceeds aortic pressure (80 mmHg) and pulmonary artery pressure (10 mmHg), opening the semilunar valves.
   - Approximately **70% of stroke volume** is rapidly ejected into the aorta. Peak systolic pressure is reached (~120 mmHg).

4. **Reduced Ventricular Ejection (0.15s)**:
   - Ventricular repolarization begins (T-wave on ECG).
   - Rate of ejection decreases as myocyte tension wanes, though aortic pressure remains high due to arterial elastic recoil.

5. **Isovolumetric Relaxation (0.05s)**:
   - Ventricular pressure drops below aortic pressure, causing **Aortic/Pulmonary Valve Closure ($S_2$)**.
   - Backflow of blood against the closed aortic valve generates the **dicrotic notch (incisura)** on aortic pressure tracing.
   - Volume remains constant at End-Systolic Volume (ESV ~50 mL) while pressure plunges toward zero.

6. **Rapid Ventricular Filling (0.1s)**:
   - Ventricular pressure falls below atrial pressure, causing Mitral/Tricuspid valves to open.
   - Rapid influx of blood into the relaxed ventricle accounts for **~70% of ventricular filling**.
   - Rapid filling against a stiff or dilated ventricle produces a third heart sound (**$S_3$**), hallmark of volume overload and systolic heart failure.

7. **Reduced Filling / Diastasis (0.2s)**:
   - Blood flows continuously from the venae cavae and pulmonary veins through the atria directly into the ventricles.
   - Duration is markedly shortened during tachycardia, which compromises end-diastolic filling.

---

## 2. Left Ventricular Pressure-Volume (PV) Loop Analysis

The PV loop provides an exact graphical representation of ventricular work, contractility, and compliance during one cycle:

$$\\text{Stroke Volume (SV)} = \\text{EDV} - \\text{ESV} = 120\\text{ mL} - 50\\text{ mL} = 70\\text{ mL}$$

$$\\text{Ejection Fraction (EF)} = \\frac{\\text{SV}}{\\text{EDV}} \\times 100\\% = \\frac{70}{120} \\times 100\\% \\approx 58.3\\% \\quad (\\text{Normal: } 55\\% - 70\\%)$$

$$\\text{Stroke Work (SW)} = \\oint P \\cdot dV \\approx \\text{Mean Arterial Pressure (MAP)} \\times \\text{SV}$$

### Key Boundaries of the PV Loop
- **End-Systolic Pressure-Volume Relationship (ESPVR)**: Slope represents **End-Systolic Elastance ($E_{es}$)**, a load-independent index of myocyte contractility (inotropy).
- **End-Diastolic Pressure-Volume Relationship (EDPVR)**: Inverse slope reflects ventricular compliance. A leftward/upward shift indicates ventricular stiffness (e.g. cardiac amyloidosis, hypertensive concentric hypertrophy).

### Hemodynamic Shifts
- **Increased Preload** (e.g. IV Saline Bolus): Loop widens rightward. EDV increases $\\rightarrow$ SV increases (Frank-Starling law).
- **Increased Afterload** (e.g. Aortic Stenosis, Hypertension): Loop narrows and rises taller. ESV increases $\\rightarrow$ SV decreases.
- **Increased Inotropy** (e.g. Dobutamine, Digoxin, Exercise): ESPVR shifts left/steepens. ESV decreases $\\rightarrow$ SV and EF increase.

---

## 3. Suga-Sagawa Time-Varying Elastance Formulation

Suga and Sagawa established that the ventricle can be mathematically modeled as a time-varying elastic chamber:

$$P_{LV}(t) = E(t) \\cdot (V_{LV}(t) - V_0)$$

Where:
- $E(t)$ is instantaneous ventricular elastance.
- $V_0$ is the theoretical unstressed volume at zero pressure.
- During systole, $E(t)$ rises to a maximum $E_{max} = E_{es}$, governing peak contractile force.
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old male with a history of long-standing uncontrolled hypertension presents with progressive exertional dyspnea. Echocardiography demonstrates a Left Ventricular Ejection Fraction of 62%, severe concentric left ventricular hypertrophy, and impaired early diastolic filling with an elevated E/e' ratio.",
      question: "Which of the following changes in the Left Ventricular Pressure-Volume loop is most characteristic of this patient's underlying condition?",
      options: [
        "Steep upward and leftward shift of the End-Diastolic Pressure-Volume Relationship (EDPVR)",
        "Downward and rightward displacement of the End-Systolic Pressure-Volume Relationship (ESPVR)",
        "Widening of the PV loop with marked increase in Stroke Volume",
        "Decreased End-Systolic Pressure with marked reduction in End-Systolic Volume"
      ],
      correctAnswerIndex: 0,
      explanation: "Concentric left ventricular hypertrophy secondary to chronic hypertension causes reduced ventricular compliance and impaired diastolic relaxation (HFpEF). This shifts the End-Diastolic Pressure-Volume Relationship (EDPVR) upward and to the left, causing higher filling pressures for any given ventricular volume."
    }
  ]
};
