/**
 * Clinical Orthopedics Advanced: Musculoskeletal Oncology & Primary Bone Tumors
 * Authoritative musculoskeletal oncology content derived from Enneking, Campbell's (14th ed.), NCCN Guidelines.
 * Mapped to NMC CBME Competencies: OR7.1, OR7.2, MD45.4, SU43.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MUSCULOSKELETAL_ONCOLOGY_BONE_TUMORS_MODULE: PhysiologyLessonModule = {
  id: "orthopedics-adv-bone-tumors",
  unitCode: "OR7.1",
  title: "Musculoskeletal Oncology: Osteosarcoma, Ewing Sarcoma, Giant Cell Tumor & Chondrosarcoma",
  competencies: ["OR7.1", "OR7.2", "MD45.4", "SU43.4"],
  estimatedMinutes: 150,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Musculoskeletal Oncology: Primary Bone Tumors & Sarcomas

Primary bone tumors require anatomical compartmental staging, precise radiographic correlation, and multimodality limb-salvage surgical resection.

---

## 1. Major Primary Bone Tumors Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Bone Tumor} & \\textbf{Anatomical Location \u0026 Age} & \\textbf{Characteristic Radiographic Signs} & \\textbf{Histopathology \u0026 Genetics} & \\textbf{Standard Management Paradigm} \\\\
\\hline
\\textbf{Osteosarcoma} & \\mathbf{\\text{Metaphysis of long bones}} & \\mathbf{\\text{\"Sunburst\" periosteal reaction,}} & \\mathbf{\\text{Malignant osteoblasts producing}} & \\mathbf{\\text{Neoadjuvant chemotherapy +}} \\\\
& (\\text{distal femur, prox tibia; } 10 - 20\\text{y}) & \\mathbf{\\text{Codman triangle, osteoid matrix}} & \\mathbf{\\text{unmineralized osteoid matrix}} & \\mathbf{\\text{Limb-salvage wide resection}} \\\\
\\textbf{Ewing} & \\mathbf{\\text{Diaphysis of long bones}} & \\mathbf{\\text{\"Onion skinning\" (multi-layered}} & \\mathbf{\\text{Small round blue cells (CD99+);}} & \\mathbf{\\text{Multi-agent chemotherapy +}} \\\\
\\textbf{Sarcoma} & (\\text{femur, tibia, pelvis; } 5 - 15\\text{y}) & \\mathbf{\\text{concentric periosteal lamellation)}} & \\mathbf{t(11;22)(q24;q12) \\text{ [EWS-FLI1]}} & \\text{Surgical resection } \\pm \\text{ Radiotherapy} \\\\
\\textbf{Giant Cell} & \\mathbf{\\text{Epiphysis of long bones}} & \\mathbf{\\text{\"Soap-bubble\" expansile lytic lesion,}} & \\text{Multinucleated osteoclast giant cells;} & \\text{Extended intralesional curettage +} \\\\
\\textbf{Tumor (GCT)} & (\\text{distal femur, prox tibia; } 20 - 40\\text{y}) & \\text{subchondral abutment, no sclerosis} & \\text{stromal cells express RANKL} & \\text{cryo/cement } \\pm \\mathbf{\\text{Denosumab (RANKLi)}} \\\\
\\textbf{Chondro-} & \\mathbf{\\text{Axial skeleton \u0026 pelvis}} & \\mathbf{\\text{\"Ring-and-arc\" / \"Popcorn\" chondroid}} & \\text{Malignant chondrocytes in lobules;} & \\mathbf{\\text{Wide surgical excision}} \\\\
\\textbf{sarcoma} & (\\text{pelvis, proximal femur; } > 40\\text{y}) & \\text{calcifications, endosteal scalloping} & \\mathbf{\\text{Chemo- and Radiation-RESISTANT}} & (\\text{chemo/radiation ineffective}) \\\\
\\hline
\\end{array}$$

---

## 2. Molecular Genetics & Orthopedic Oncologic Principles

- **Osteosarcoma (Osteogenic Sarcoma)**:
  - Bimodal age distribution: Peak 1 in adolescents ($10-20\text{ years}$), Peak 2 in elderly ($>60\text{ years}$) with **Paget disease of bone** or prior radiation.
  - Classic radiographic features: Destructive mixed lytic/blastic lesion in metaphysis with **Codman's triangle** (elevation of periosteum by expanding tumor) and **"sunburst" spiculation**.
  - Standard regimen: **MAP neoadjuvant chemotherapy** (Methotrexate, Adriamycin/Doxorubicin, Cisplatin) $\rightarrow$ wide en bloc limb-sparing surgical resection $\rightarrow$ adjuvant chemotherapy.
- **Ewing Sarcoma**:
  - Neuroectodermal origin characterized by **translocation $t(11;22)(q24;q12)$** fusing the *EWSR1* gene on chromosome 22 with the *FLI1* gene on chromosome 11.
  - Histology shows sheets of uniform **small round blue cells** with glycogen-rich cytoplasm (PAS positive) and strong cell-surface staining for **CD99 (MIC2)**.
- **Giant Cell Tumor of Bone (Osteoclastoma)**:
  - Benign but locally aggressive tumor occurring at the **epiphysis/subarticular region** of skeletally mature individuals after physeal closure.
  - Neoplastic mononuclear stromal cells overexpress **RANK Ligand (RANKL)**, which recruits multinucleated osteoclasts that mediate bone destruction.
  - Targeted therapy: **Denosumab** (monoclonal antibody against RANKL) inhibits osteoclastic bone resorption.
`,
  clinicalVignettes: [
    {
      scenario: "A 16-year-old male athlete presents with a 2-month history of worsening left distal thigh pain and localized swelling that wakes him from sleep at night. On physical examination, there is a warm, firm, tender mass palpable over the distal lateral femur. Knee range of motion is mildly limited by pain. An AP and lateral radiograph of the left femur reveals a mixed radiolucent and osteosclerotic lesion in the distal femoral metaphysis with soft tissue extension, an irregular 'sunburst' periosteal reaction, and a Codman triangle along the cortical margin. Biopsy confirms malignant spindle-shaped cells producing unmineralized osteoid matrix.",
      question: "What is the diagnosis, and what is the standard multimodal treatment strategy?",
      options: [
        "Osteosarcoma; initiate neoadjuvant chemotherapy (e.g., MAP regimen: Methotrexate, Doxorubicin, Cisplatin), followed by wide limb-sparing surgical resection with clear margins, and postoperative adjuvant chemotherapy",
        "Ewing Sarcoma; administer primary radiotherapy alone without surgery",
        "Osteomyelitis; perform incision and drainage with 6 weeks of intravenous Cefazolin",
        "Chondrosarcoma; administer high-dose radiation therapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This adolescent patient presents with the quintessential clinical, radiographic, and histological features of Conventional High-Grade Osteosarcoma: (1) Demographics & Location: Osteosarcoma is the most common primary malignant bone tumor in adolescents, occurring predominantly at the metaphysis of rapidly growing long bones around the knee (distal femur ~50%, proximal tibia); (2) Radiography: Classic signs include metaphyseal cortical destruction with Codman's triangle (triangular periosteal elevation) and a 'sunburst' radial spiculation extending into surrounding soft tissue; (3) Histology: Pathognomonic presence of malignant osteoblasts synthesizing unmineralized pink osteoid matrix; (4) Treatment Paradigm: Standard treatment is trimodal: Neoadjuvant (preoperative) multi-agent chemotherapy (Methotrexate, Doxorubicin, Cisplatin) to eradicate micro-metastases and shrink the primary tumor, followed by wide surgical resection with limb salvage (in >90% of cases), followed by adjuvant postoperative chemotherapy."
    }
  ]
};
