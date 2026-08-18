/**
 * Postgraduate Advanced Orthopedics: Musculoskeletal Oncology & Limb Salvage
 * Authoritative orthopedic oncology content derived from Enneking Surgical Staging System, NCCN Bone Cancer Guidelines, EURAMOS Protocols.
 * Mapped to NMC PG CBME Competencies: PG7.4, OR4.1, OR4.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE: PhysiologyLessonModule = {
  id: "pg7-musculoskeletal-oncology-limb-salvage",
  unitCode: "PG7.4",
  title: "Musculoskeletal Oncology: Enneking Staging, Bone Sarcomas (Osteosarcoma/Ewing) & Limb Salvage",
  competencies: ["PG7.4", "OR4.1", "OR4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Musculoskeletal Oncology, Enneking Staging & Limb Salvage Surgery

Primary bone sarcomas require multi-modality oncologic care combining surgical biopsy principles, neoadjuvant chemotherapy, and wide margin limb-salvage reconstruction.

---

## 1. Enneking Surgical Staging System (MSTS)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Enneking Stage} & \\textbf{Histologic Grade (G)} & \\textbf{Anatomic Site (T)} & \\textbf{Metastasis (M)} & \\textbf{Clinical Behavior} \\\\
\\hline
\\textbf{Stage IA} & \\text{G1 (Low Grade)} & \\text{T1 (Intracompartmental)} & \\text{M0 (No mets)} & \\text{Low metastatic risk; wide resection} \\\\
\\textbf{Stage IB} & \\text{G1 (Low Grade)} & \\text{T2 (Extracompartmental)} & \\text{M0} & \\text{Extends across fascial plane / cortex} \\\\
\\textbf{Stage IIA} & \\text{G2 (High Grade)} & \\text{T1 (Intracompartmental)} & \\text{M0} & \\text{High metastatic potential} \\\\
\\textbf{Stage IIB} & \\mathbf{\\text{G2 (High Grade)}} & \\mathbf{\\text{T2 (Extracompartmental)}} & \\mathbf{\\text{M0}} & \\mathbf{\\text{Most common presentation (Osteosarcoma)}} \\\\
\\textbf{Stage III} & \\mathbf{\\text{Any G (High/Low)}} & \\mathbf{\\text{Any T (T1/T2)}} & \\mathbf{\\text{M1 (Distant Mets)}} & \\mathbf{\\text{Lung/bone metastases; poor prognosis}} \\\\
\\hline
\\end{array}$$

---

## 2. High-Yield Primary Bone Sarcomas & Management Paradigms

$$\\begin{array}{lcccc}
\\hline
\\textbf{Tumor Entity} & \\textbf{Peak Age \\& Location} & \\textbf{Radiographic Sign} & \\textbf{Genetics / Histology} & \\textbf{Gold-Standard Treatment} \\\\
\\hline
\\textbf{Osteosarcoma} & 10-20\\text{ yrs; metaphysis of} & \\mathbf{\\text{Codman triangle,}} & \\text{Malignant osteoid matrix;} & \\mathbf{\\text{Neoadjuvant MAP chemo}} \\\\
& \\text{distal femur / proximal tibia} & \\mathbf{\\text{''sunburst'' spiculation}} & RB1, TP53\\text{ mutations} & \\mathbf{\\rightarrow \\text{Wide resection } \\rightarrow \\text{ Chemo}} \\\\
\\textbf{Ewing Sarcoma} & 5-15\\text{ yrs; diaphysis of} & \\mathbf{\\text{Concentric ''onion-skin''}} & \\mathbf{t(11;22)(q24;q12)} & \\mathbf{\\text{VDC/IE multiagent chemo}} \\\\
& \\text{femur, tibia, pelvis} & \\mathbf{\\text{periosteal reaction}} & EWSR1-FLI1\\text{ fusion; small blue cells} & \\mathbf{+ \\text{ wide resection / RT}} \\\\
\\textbf{Chondrosarcoma} & 40-70\\text{ yrs; pelvis,} & \\mathbf{\\text{''Rings and arcs'' /}} & \\text{Atypical chondrocytes} & \\mathbf{\\text{Primary wide surgical resection}} \\\\
& \\text{proximal femur/humerus} & \\mathbf{\\text{''popcorn'' calcification}} & \\text{in hyaline cartilage matrix} & (\\mathbf{\\text{Chemo- \\& radio-resistant!}}) \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 16-year-old male presents with a 3-month history of worsening, deep-seated right distal thigh pain that awakens him at night and a tender, firm swelling above the knee. Plain radiographs reveal an aggressive, mixed lytic and blastic lesion in the metaphysis of the distal femur extending into the surrounding soft tissues, with cortical destruction, a Codman triangle, and a 'sunburst' periosteal reaction. MRI confirms extension beyond the femur into the anterior compartment without involvement of the neurovascular bundle. Chest CT reveals no pulmonary metastases. Biopsy demonstrates malignant spindle cells producing unmineralized osteoid matrix.",
      question: "What is the diagnosis, Enneking surgical stage, and standard multidisciplinary treatment sequence?",
      options: [
        "High-Grade Conventional Osteosarcoma, Enneking Stage IIB (High-grade G2, Extracompartmental T2, Non-metastatic M0); management requires neoadjuvant multiagent chemotherapy (MAP regimen: Methotrexate, Doxorubicin [Adriamycin], Cisplatin) followed by definitive wide surgical resection with limb-salvage endoprosthetic reconstruction, and postoperative adjuvant chemotherapy based on histologic tumor necrosis percentage",
        "Ewing Sarcoma, Stage IA; treat with radiation therapy alone without chemotherapy",
        "Chondrosarcoma, Stage I; curettage and bone grafting without resection",
        "Osteochondroma; reassurance and physical therapy only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic high-grade Osteosarcoma: (1) Radiographic & Histologic Features: Metaphyseal location, Codman triangle, sunburst periosteal reaction, and malignant osteoid production; (2) Enneking Staging: High grade (G2), extracompartmental soft tissue extension (T2), M0 = Stage IIB; (3) Management: Multi-agent neoadjuvant chemotherapy (MAP) improves limb salvage rates and overall survival, followed by wide surgical resection and adjuvant chemotherapy."
    }
  ]
};
