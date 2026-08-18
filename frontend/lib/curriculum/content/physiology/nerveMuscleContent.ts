/**
 * Nerve-Muscle & Electrophysiology Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.) and Kandel's Principles of Neural Science.
 * Mapped to NMC CBME Competencies: PY1.3, PY1.4, PY3.1, PY3.2
 */

import { PhysiologyLessonModule } from "./cardiacCycleContent";

export const NERVE_MUSCLE_MODULE: PhysiologyLessonModule = {
  id: "phys-nerve-muscle",
  unitCode: "PY3.1",
  title: "Membrane Biophysics, Goldman-Hodgkin-Katz Potential & NMJ Mechanics",
  competencies: ["PY1.3", "PY3.1", "PY3.2"],
  estimatedMinutes: 110,
  simulatorRoute: "/simulators/nerve-muscle",
  simulatorParams: {
    kOut: 4.5,
    kIn: 140,
    naOut: 142,
    naIn: 14,
    clOut: 105,
    clIn: 10,
    pNa: 0.04,
    pCl: 0.45
  },
  organ3dTarget: "NEUROLOGY",
  markdownContent: `
# Membrane Biophysics, Goldman-Hodgkin-Katz Potential & NMJ Mechanics

Cellular resting membrane potentials ($V_m$) and excitable action potentials form the bioelectrical foundation for neuromuscular transmission and muscular contraction.

---

## 1. The Nernst Equation (Single Ion Equilibrium)

The Nernst potential ($E_{\\text{ion}}$) is the membrane voltage at which the electrical force exactly balances the chemical concentration gradient for a single permeant ion:

$$E_{\\text{ion}} = \\frac{RT}{zF} \\cdot \\ln\\left( \\frac{[\\text{ion}]_{\\text{out}}}{[\\text{ion}]_{\\text{in}}} \\right) = \\frac{61.5}{z} \\cdot \\log_{10}\\left( \\frac{[\\text{ion}]_{\\text{out}}}{[\\text{ion}]_{\\text{in}}} \\right) \\quad \\text{at } 37^\\circ\\text{C}$$

### Standard Mammalian Equilibrium Potentials:
- **Potassium ($K^+$)**: $E_K = 61.5 \\cdot \\log_{10}(4.5 / 140) = 61.5 \\cdot (-1.49) = -91.8\\text{ mV}$.
- **Sodium ($Na^+$)**: $E_{Na} = 61.5 \\cdot \\log_{10}(142 / 14) = 61.5 \\cdot (+1.006) = +61.9\\text{ mV}$.
- **Chloride ($Cl^-$)**: $E_{Cl} = \\frac{61.5}{-1} \\cdot \\log_{10}(105 / 10) = -61.5 \\cdot (+1.02) = -62.8\\text{ mV}$.
- **Calcium ($Ca^{2+}$)**: $E_{Ca} = \\frac{61.5}{2} \\cdot \\log_{10}(2.4 / 0.0001) = 30.75 \\cdot 4.38 = +134.7\\text{ mV}$.

---

## 2. The Goldman-Hodgkin-Katz (GHK) Voltage Equation

Because living membranes are permeable to multiple ions simultaneously, the true Resting Membrane Potential ($V_m$) is calculated by the GHK equation, which weights each ion by its relative membrane permeability ($P$):

$$V_m = \\frac{RT}{F} \\cdot \\ln\\left( \\frac{P_K [K^+]_o + P_{Na} [Na^+]_o + P_{Cl} [Cl^-]_i}{P_K [K^+]_i + P_{Na} [Na^+]_i + P_{Cl} [Cl^-]_o} \\right)$$

- At rest, resting $K^+$ leak channels (KIR and K2P) make $P_K$ approximately **25 to 100 times greater than $P_{Na}$** ($P_K : P_{Na} : P_{Cl} = 1.0 : 0.04 : 0.45$).
- Consequently, resting $V_m$ ($-70\\text{ to }-90\\text{ mV}$) lies close to $E_K$.
- **Hyperkalemia** (e.g. $[K^+]_o \\uparrow$ to 7.0 mEq/L): Shifts $E_K$ less negative, depolarizing resting $V_m$. This inactivates voltage-gated $Na^+$ channels, reducing cardiac excitability and widening QRS on ECG (risk of ventricular fibrillation/asystole).

---

## 3. Voltage-Gated Sodium Channel Kinetics & Action Potential

Hodgkin-Huxley voltage-gated $Na^+$ channel structure features two gates:
1. **Activation ($m$) Gate**: Closed at resting potential, opens rapidly upon threshold depolarization ($-55\\text{ mV}$).
2. **Inactivation ($h$) Gate**: Open at rest, closes slowly after depolarization.

> **Action Potential Phase Sequence**:
> - **Phase 0 (Rapid Depolarization)**: $m$-gates open $\rightarrow$ massive $Na^+$ influx toward $E_{Na}$ (+60 mV).
> - **Phase 1 (Overshoot & Early Repolarization)**: $h$-gates close ($Na^+$ channels inactivate); transient outward $K^+$ ($I_{to}$).
> - **Phase 2 (Plateau in Cardiac / Repolarization in Nerve)**: Voltage-gated delayed rectifier $K^+$ channels open ($K^+$ efflux).
> - **Phase 3 (Hyperpolarization)**: High $P_K$ brings $V_m$ closer to $E_K$ (-90 mV) than resting potential.
> - **Phase 4 (Resting State)**: $Na^+/K^+$ ATPase restores ionic gradients (3 $Na^+$ out, 2 $K^+$ in).

### Refractory Periods
- **Absolute Refractory Period (ARP)**: From Phase 0 through late Phase 2. $Na^+$ channels are closed in the **inactivated state**. No stimulus, regardless of strength, can elicit another action potential.
- **Relative Refractory Period (RRP)**: Most $Na^+$ channels have recovered from inactivation to the closed-resting state, but delayed rectifier $K^+$ channels remain open ($V_m$ is hyperpolarized). A suprathreshold stimulus can generate a secondary action potential.

---

## 4. Neuromuscular Junction (NMJ) Transmission

1. Action potential invades motor neuron terminal $\\implies$ activates Voltage-Gated P/Q-Type $Ca^{2+}$ Channels.
2. $Ca^{2+}$ influx triggers synaptotagmin-SNARE complex (Syntaxin, SNAP-25, Synaptobrevin) fusion, releasing **Acetylcholine (ACh)**.
3. ACh binds **Nicotinic Receptors ($N_M$)** on the post-synaptic motor endplate $\\implies$ non-selective cation channel opening ($Na^+$ in, $K^+$ out) $\\implies$ **End-Plate Potential (EPP)**.
4. **Myasthenia Gravis**: Autoantibodies against post-synaptic $N_M$ ACh receptors $\\implies$ receptor internalization, flattened post-synaptic folds, muscle fatiguability worsening with use.
5. **Lambert-Eaton Myasthenic Syndrome (LEMS)**: Autoantibodies against pre-synaptic P/Q-type $Ca^{2+}$ channels (associated with Small Cell Lung Cancer) $\\implies$ impaired ACh release, muscle weakness improving with repetitive exercise.
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old female presents with fluctuating ptosis, diplopia, and proximal upper limb weakness that progressively worsens toward the evening. Repetitive nerve stimulation testing shows a decremental compound muscle action potential response. Edrophonium administration produces rapid transient improvement.",
      question: "Which of the following cellular mechanisms is the primary pathophysiology in this patient?",
      options: [
        "Antibody-mediated blockade and internalization of post-synaptic nicotinic ACh receptors with decreased end-plate potential amplitude",
        "Autoimmune destruction of pre-synaptic voltage-gated P/Q-type calcium channels impairing vesicular exocytosis",
        "Defective vesicular acetylcholine transporter (VAChT) leading to empty synaptic vesicles",
        "Irreversible phosphorylation and inhibition of acetylcholinesterase in the synaptic cleft"
      ],
      correctAnswerIndex: 0,
      explanation: "Myasthenia Gravis is characterized by autoantibodies against post-synaptic nicotinic acetylcholine receptors (AChR) on the motor end-plate. This reduces functional receptor density and decreases the safety factor of neuromuscular transmission, generating subthreshold end-plate potentials that fail to trigger muscle action potentials during repetitive activity."
    }
  ]
};
