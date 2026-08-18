/**
 * Upper Limb & Brachial Plexus Anatomy Learning Content
 * Authoritative medical content derived from Gray's Anatomy (42nd ed.), Netter, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: AN1.1, AN2.1, AN3.1, AN4.1, AN10.1, AN12.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BRACHIAL_PLEXUS_MODULE: PhysiologyLessonModule = {
  id: "anat-brachial-plexus",
  unitCode: "AN1.1",
  title: "Upper Limb Osteology, Brachial Plexus & Peripheral Nerve Palsies",
  competencies: ["AN1.1", "AN2.1", "AN3.1", "AN10.1", "AN12.1"],
  estimatedMinutes: 120,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Upper Limb Osteology, Brachial Plexus & Peripheral Nerve Palsies

The upper extremity is engineered for high-precision tactile manipulation and multidirectional spatial mobility through coordinated action of the pectoral girdle, glenohumeral joint, and the brachial plexus.

---

## 1. Brachial Plexus Architecture ($C5 - T1$)

The brachial plexus is formed by the ventral primary rami of spinal nerves $C5, C6, C7, C8, \\text{ and } T1$:

> **Brachial Plexus Hierarchical Subdivisions**:
> - **Roots (5)**: $C5, C6, C7, C8, T1$ (Emerge between Anterior and Middle Scalene muscles alongside Subclavian Artery).
>   - *Key Root Branch*: **Long Thoracic Nerve ($C5, C6, C7$)** $\\rightarrow$ Serratus Anterior. (*Injury causes Winged Scapula; inability to abduct arm above 90°*).
> - **Trunks (3)**:
>   - **Upper Trunk**: $C5 + C6$ union. (*Gives off Suprascapular Nerve $\\rightarrow$ Supraspinatus & Infraspinatus*).
>   - **Middle Trunk**: Continuation of $C7$.
>   - **Lower Trunk**: $C8 + T1$ union. (*Crosses over 1st rib posterior to subclavian artery*).
> - **Divisions (6)**: Each trunk divides into an **Anterior** (flexor compartment) and **Posterior** (extensor compartment) division behind the clavicle.
> - **Cords (3)**: Named by anatomical relation to the 2nd part of the **Axillary Artery** behind Pectoralis Minor:
>   - **Lateral Cord**: Anterior divisions of Upper and Middle trunks ($C5, C6, C7$).
>   - **Posterior Cord**: Posterior divisions of all three trunks ($C5 - T1$).
>   - **Medial Cord**: Anterior division of Lower trunk ($C8, T1$).
> - **Terminal Branches (5)**:
>   - **Musculocutaneous** ($C5, C6, C7$ from Lateral Cord): Coracobrachialis, Biceps Brachii, Brachialis; lateral forearm sensation.
>   - **Axillary** ($C5, C6$ from Posterior Cord): Deltoid, Teres Minor; regimental badge sensory area over lateral deltoid.
>   - **Radial** ($C5 - T1$ from Posterior Cord): All extensor muscles (Triceps, Brachioradialis, Wrist/finger extensors).
>   - **Median** ($C5 - T1$ from Lateral & Medial Cords): Forearm flexors, thenar muscles, lumbricals 1-2.
>   - **Ulnar** ($C8 - T1$ from Medial Cord): Flexor carpi ulnaris, medial 1/2 of FDP, hypothenar muscles, all interossei, lumbricals 3-4, adductor pollicis.

---

## 2. Classic Brachial Plexus & Peripheral Nerve Palsies

| Nerve / Lesion | Etiology & Mechanism | Motor Deficit | Sensory Deficit & Classic Posture |
| :--- | :--- | :--- | :--- |
| **Erb-Duchenne Palsy**<br>(Upper Trunk $C5-C6$) | Shoulder dystocia during delivery, motorcycle accident landing on shoulder | Deltoid, Supraspinatus, Infraspinatus, Biceps brachii | **'Waiter\'s Tip' posture**: Arm hangs adducted, internally rotated, elbow extended, forearm pronated |
| **Klumpke Palsy**<br>(Lower Trunk $C8-T1$) | Upward traction on arm (grabbing branch while falling, breech delivery) | Intrinsic hand muscles (interossei, lumbricals, thenar, hypothenar) | **Total Claw Hand**: MCP extension + PIP/DIP flexion of all digits; concurrent Horner syndrome if T1 sympathetic root involved |
| **Radial Nerve**<br>(Spiral Groove / Midshaft Humerus) | Midshaft humeral shaft fracture, 'Saturday Night Palsy' (compression against chair) | Loss of wrist and finger extension; weakened grip strength (cannot stabilize wrist) | **'Wrist Drop'**; numbness over posterior arm/forearm and dorsal web space of thumb |
| **Median Nerve**<br>(Carpal Tunnel / Supracondylar Humerus) | Repetitive wrist flexion, hypothyroidism, pregnancy, supracondylar fracture | Loss of thumb opposition (thenar atrophy); weakness in lateral finger flexion | **'Ape Hand'** (thenar flattening) & **'Hand of Benediction'** when attempting to make a fist |
| **Ulnar Nerve**<br>(Medial Epicondyle / Hook of Hamate) | Medial epicondyle fracture, cycling (Guyon canal compression), fall on outstretched hand | Interossei paralysis (loss of abduction/adduction - DAB/PAD); Froment sign positive (compensatory FPL flexion) | **'Ulnar Claw'** (4th and 5th digits hyperextended at MCP, flexed at PIP/DIP at rest); numbness over medial 1.5 digits |

---

## 3. Shoulder Girdle & Rotator Cuff (SITS)

The glenohumeral joint achieves immense range of motion at the expense of intrinsic bony stability, relying dynamically on the **Rotator Cuff (SITS)** tendons:

1. **Supraspinatus** (*Suprascapular nerve, $C5-C6$*): Initiates arm abduction ($0^\circ - 15^\circ$); most common rotator cuff tear (Empty Can / Jobe test positive).
2. **Infraspinatus** (*Suprascapular nerve, $C5-C6$*): Lateral (external) rotation of the humerus.
3. **Teres Minor** (*Axillary nerve, $C5-C6$*): Lateral (external) rotation and adduction.
4. **Subscapularis** (*Upper and Lower Subscapular nerves, $C5-C6$*): Medial (internal) rotation and adduction.
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male is brought to the emergency department following a motorcycle collision in which he was thrown over the handlebars and landed forcefully on his right shoulder and the side of his neck. Physical examination demonstrates an adducted right arm held in internal rotation with the elbow fully extended and the forearm fully pronated. Sensation is decreased over the lateral aspect of the arm and deltoid region.",
      question: "Which of the following neural structures was primarily injured in this patient?",
      options: [
        "Upper trunk of the brachial plexus (C5-C6 ventral rami)",
        "Lower trunk of the brachial plexus (C8-T1 ventral rami)",
        "Posterior cord of the brachial plexus in the axilla",
        "Medial cord of the brachial plexus behind pectoralis minor"
      ],
      correctAnswerIndex: 0,
      explanation: "Erb-Duchenne palsy results from traction or avulsion of the upper trunk of the brachial plexus (C5-C6 roots) caused by an excessive increase in the angle between the neck and shoulder. Loss of abductors (deltoid, supraspinatus), lateral rotators (infraspinatus, teres minor), and flexors/supinators (biceps brachii) produces the classic 'waiter\'s tip' deformity."
    }
  ]
};
