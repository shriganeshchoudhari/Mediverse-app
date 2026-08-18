/**
 * Internship Core Clinical Postings: Point-of-Care Ultrasound (POCUS: Cardiac, Lung & Vascular)
 * Authoritative ultrasound content derived from Ma and Mateer, Lichtenstein BLUE-Protocol.
 * Mapped to NMC CBME Competencies: IN2.4, EM2.4, IM2.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const POCUS_CARDIAC_LUNG_VASCULAR_MODULE: PhysiologyLessonModule = {
  id: "int2-pocus-cardiac-lung-vascular",
  unitCode: "IN2.4",
  title: "Point-of-Care Ultrasound (POCUS): Focused Cardiac Echo (PLAX/PSAX/A4C/IVC), Lung BLUE Protocol & Vascular Assessment",
  competencies: ["IN2.4", "EM2.4", "IM2.4"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Point-of-Care Ultrasound (POCUS): Focused Cardiac Echo & Lung Ultrasound

Bedside ultrasound delivers rapid, non-invasive hemodynamic assessments, identifying acute ventricular failure, tamponade, pulmonary edema, and pneumothorax in real time.

---

## 1. Focused Cardiac Ultrasound (FoCUS) Standard Acoustic Windows

$$\\begin{array}{lcccc}
\\hline
\\textbf{Acoustic Window} & \\textbf{Transducer Position \u0026 Indicator} & \\textbf{Key Structures Visualized} & \\textbf{Critical Pathological Findings} \\\\
\\hline
\\textbf{Parasternal Long-Axis} & \\text{3rd-4th left intercostal space parasternal;} & \\text{Left Atrium, Mitral Valve, Left Ventricle,} & \\mathbf{\\text{Pericardial effusion (fluid posterior to LA/LV),}} \\\\
(\\textbf{PLAX}) & \\text{indicator toward RIGHT shoulder} & \\text{Aortic Valve, LV Outflow Tract, Pericardium} & \\text{severe LV systolic dysfunction} \\\\
\\textbf{Parasternal Short-Axis} & \\text{Rotate probe } 90^{\\circ} \\text{ clockwise from PLAX;} & \\text{\"Fish-mouth\" mitral valve or circular} & \\mathbf{\\text{\"D-shaped\" LV in diastole/systole indicating}} \\\\
(\\textbf{PSAX}) & \\text{indicator toward LEFT shoulder} & \\text{\"doughnut\" LV with papillary muscles} & \\mathbf{\\text{Right Ventricular pressure/volume overload (PE)}} \\\\
\\textbf{Apical 4-Chamber} & \\text{5th intercostal space left midclavicular / apex;} & \\text{Left/Right Ventricles, Left/Right Atria,} & \\text{RV dilation (RV > LV diameter), McConnell sign} \\\\
(\\textbf{A4C}) & \\text{indicator toward patient LEFT} & \\text{Mitral and Tricuspid Valves} & (\\text{RV free-wall akinesis with spared apex in PE}) \\\\
\\textbf{Subxiphoid IVC} & \\text{Inferior to xiphoid, sagittal plane;} & \\text{Inferior Vena Cava entering Right Atrium} & \\mathbf{\\text{Diameter } > 2.1\\text{ cm with } < 50\\% \\text{ collapse indicates}} \\\\
& \\text{indicator toward patient head (cephalad)} & & \\mathbf{\\text{elevated CVP (10-20 mmHg); plethoric in tamponade}} \\\\
\\hline
\\end{array}$$

---

## 2. Lung Ultrasound (LUS - BLUE Protocol Profiles)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Sonographic Feature} & \\textbf{Acoustic Artifact Description} & \\textbf{Physiological / Diagnostic Significance} \\\\
\\hline
\\textbf{A-Lines} & \\text{Horizontal, parallel, equidistant hyperechoic lines} & \\mathbf{\\text{Normal aerated lung artifact (reverberation of pleural line)}} \\\\
\\textbf{Lung Sliding} & \\text{Dynamic shimmering movement at pleural interface} & \\mathbf{\\text{Visceral pleura gliding against parietal pleura (rules OUT pneumothorax)}} \\\\
\\textbf{B-Lines (\"Lung Rockets\")} & \\mathbf{\\text{Vertical, laser-like, hyperechoic lines extending to screen bottom}} & \\mathbf{\\ge 3\\text{ B-lines per intercostal space confirms alveolar-interstitial edema (CHF/ARDS)}} \\\\
\\textbf{Seashore Sign (M-Mode)} & \\text{Linear waves above pleural line, granular sand pattern below} & \\text{Normal lung with intact pleural sliding} \\\\
\\textbf{Barcode / Stratosphere} & \\mathbf{\\text{Solid parallel horizontal lines across the entire M-mode depth}} & \\mathbf{\\text{Absence of lung sliding; pathognomonic for PNEUMOTHORAX}} \\\\
\\textbf{Lung Point Sign} & \\mathbf{\\text{Transition point between normal sliding and pneumothorax pattern}} & \\mathbf{100\\% \\text{ specificity for confirming pneumothorax boundary}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 67-year-old male with a history of heart failure with reduced ejection fraction (HFrEF, EF 25%) presents with acute severe dyspnea, orthopnea, and bilateral crackles. Bedside point-of-care lung ultrasound (LUS) is performed. In both anterior and lateral lung zones bilaterally, the ultrasound demonstrates multiple vertical, hyperechoic, laser-like artifacts originating from the pleural line that erase A-lines and extend all the way to the bottom of the screen (>5 B-lines per intercostal space).",
      question: "What is this sonographic lung profile, and what is the underlying pathophysiology?",
      options: [
        "B-profile (B-lines / 'lung rockets'); indicates acute alveolar-interstitial syndrome caused by elevated pulmonary capillary hydrostatic pressure and extravasation of fluid into the interlobular septa and alveoli (cardiogenic pulmonary edema)",
        "A-profile with lung sliding; indicates normal dry lung parenchyma",
        "Stratosphere sign; confirms tension pneumothorax requiring needle decompression",
        "Hepatization sign; indicates severe multi-lobar lobar pneumonia"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic lung point-of-care ultrasound (BLUE protocol): (1) B-Lines Definition: B-lines are discrete, laser-like vertical hyperechoic reverberation artifacts arising from the pleural line, moving synchronously with lung sliding, erasing A-lines, and extending without fading to the bottom of the screen; (2) Pathophysiological Basis: When pulmonary capillary wedge pressure rises above ~18 mmHg, fluid transudates into the pulmonary interlobular septa and alveoli, creating liquid-air acoustic interfaces that produce multiple B-lines; (3) Clinical Significance: Bilateral anterior B-lines (B-profile) have >90% sensitivity and specificity for Acute Cardiogenic Pulmonary Edema."
    }
  ]
};
