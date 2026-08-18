/**
 * Bone Tumors, Osteomyelitis & Septic Arthritis Learning Content
 * Authoritative medical content derived from Apley & Solomon, Maheshwari, Campbell, and USMLE Step 2 CK Orthopedics.
 * Mapped to NMC CBME Competencies: OR7.1, OR7.2, OR8.1, OR8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BONE_TUMORS_INFECTIONS_MODULE: PhysiologyLessonModule = {
  id: "orth-tumors-osteomyelitis",
  unitCode: "OR7.1",
  title: "Orthopedics: Bone Tumors (Osteosarcoma, Ewing, Nidus), Osteomyelitis & Septic Arthritis",
  competencies: ["OR7.1", "OR7.2", "OR8.1", "OR8.2"],
  estimatedMinutes: 135,
  organ3dTarget: "SKELETAL",
  markdownContent: `
# Orthopedics: Bone Tumors (Osteosarcoma, Ewing, Nidus), Osteomyelitis & Septic Arthritis

Accurate localization of bone lesions across epiphysis, metaphysis, and diaphysis combined with pathognomonic radiographic signatures enables rapid triage between benign lesions, aggressive sarcomas, and infectious osteomyelitis.

---

## 1. Primary Malignant & Benign Bone Tumors

| Tumor Type | Typical Age & Anatomical Location | Radiographic Hallmark & Pathology | Clinical Behavior & Management |
| :--- | :--- | :--- | :--- |
| **Osteosarcoma** | **$10\\text{ to } 20\\text{ years}$** (adolescents); **Metaphysis** of long bones (distal femur $40\\%$, proximal tibia $20\\%$ — *"around the knee"*). | **"Sunburst" Spiculated Periosteal Reaction**; **Codman\'s Triangle** (periosteal elevation). Biopsy: malignant spindle cells producing osteoid bone. | Highly malignant; hematogenous micrometastases to **Lungs** common. Multi-agent neoadjuvant chemotherapy $+$ Limb-salvage wide en-bloc resection. |
| **Ewing Sarcoma** | **$5\\text{ to } 15\\text{ years}$** (children); **Diaphysis** of long bones (femur, tibia, humerus) and pelvis. | **"Onion-Skin" Multilayered Lamellated Periosteal Reaction**. Translocation **$t(11;22)(q24;q12)$** (*EWS-FLI1*); Biopsy: **Small Round Blue Cells** with strong CD99 positivity. | Mimics acute osteomyelitis (fever, leukocytosis, elevated ESR/CRP). Multi-agent chemotherapy $+$ surgical resection and/or radiotherapy. |
| **Osteoid Osteoma** | **$10\\text{ to } 25\\text{ years}$**; Cortex of proximal femur / diaphysis. | **Radiolucent Nidus ($< 1.5\\text{ cm}$)** surrounded by dense reactive cortical sclerosis. | **Severe Nocturnal Bone Pain DRAMATICALLY RELIEVED BY ASPIRIN / NSAIDs** (prostaglandin E2 mediated). CT-guided radiofrequency ablation. |
| **Giant Cell Tumor (Osteoclastoma)** | **$20\\text{ to } 40\\text{ years}$** (skeletally mature with closed physes); **Epiphysis** of distal femur / proximal tibia. | **"Soap-Bubble" Expansile Osteolytic Lesion** extending to subchondral articular plate. Biopsy: Multinucleated giant cells. | Locally aggressive benign tumor. Extensive curettage with liquid nitrogen/phenol adjuvant and bone grafting / PMMA cement. |

---

## 2. Acute Hematogenous Osteomyelitis

- **Pathogenesis**: Hematogenous seeding of the richly vascularized, slow-flowing capillary loops in the **Metaphysis** of growing long bones in children.
- **Etiological Pathogens**:
  - **Most Common Overall ($>80\\%$)**: ***Staphylococcus aureus*** (MSSA/MRSA).
  - **Sickle Cell Disease**: ***Salmonella enteritidis*** (encapsulated bacteria escaping hyposplenic clearance) and *S. aureus*.
  - **Puncture Wound through Rubber Shoe**: ***Pseudomonas aeruginosa***.
  - **Sexually Active Adolescents / Young Adults**: ***Neisseria gonorrhoeae*** (disseminated gonococcal tenosynovitis/dermatitis).
  - **Infants / Neonates**: *Group B Streptococcus* (*S. agalactiae*) and *E. coli*.
- **Radiographic Changes**: Normal during first $10-14\\text{ days}$; **MRI is the gold standard imaging modality** for early diagnosis (demonstrates bone marrow edema within 24–48 hours).
- **Subacute/Chronic Osteomyelitis**:
  - **Sequestrum**: Dead, devascularized bone fragment acting as an avascular nidus for bacterial biofilm.
  - **Involucrum**: New reactive periosteal bone shell encasing the sequestrum.
  - **Cloaca**: Sinus tract opening in the involucrum draining pus through the skin.
  - **Brodie Abscess**: Subacute osteomyelitis appearing as a well-circumscribed radiolucent lesion with a sclerotic rim in the metaphysis.

---

## 3. Septic Arthritis & The Kocher Diagnostic Criteria

Pediatric septic arthritis is an orthopedic surgical emergency requiring immediate joint aspiration and arthrotomy to prevent chondrolysis from proteolytic enzymes:

| Kocher Diagnostic Criterion | Clinical & Laboratory Finding |
| :--- | :--- |
| **1. Inability to Bear Weight** | Refusal to walk / severe antalgic limp. |
| **2. Temperature $> 38.5^\\circ\\text{C}$** | Fever on presentation. |
| **3. Erythrocyte Sedimentation Rate (ESR)** | **$\\text{ESR} > 40\\text{ mm/hr}$** (or CRP $>20\\text{ mg/L}$). |
| **4. White Blood Cell Count (WBC)** | **$\\text{WBC} > 12,000 / \\mu\\text{L}$**. |

- **Risk of Septic Hip**:
  - 1 criterion: $3\\%$ probability.
  - 2 criteria: $40\\%$ probability.
  - 3 criteria: $93\\%$ probability.
  - **4 criteria: $99\\%$ probability $\\implies$ Emergency Joint Aspiration and Surgical Arthrotomy / Washout**.
`,
  clinicalVignettes: [
    {
      scenario: "A 15-year-old adolescent boy presents with a 2-month history of worsening right distal thigh pain and localized swelling. Physical examination reveals a firm, non-tender, fixed mass over the distal lateral femur with reduced knee flexion. Radiographs of the right femur show a destructive osteolytic and blastic lesion in the metaphysis with a 'sunburst' pattern of delicate bone spicules radiating into the soft tissues and a triangular elevation of the periosteum (Codman's triangle). Serum alkaline phosphatase (ALP) and lactate dehydrogenase (LDH) are markedly elevated.",
      question: "Which of the following is the most likely diagnosis, and what is the most common organ of distant metastasis?",
      options: [
        "Osteosarcoma; Lungs",
        "Ewing Sarcoma; Liver",
        "Osteoid Osteoma; Brain",
        "Giant Cell Tumor; Spleen"
      ],
      correctAnswerIndex: 0,
      explanation: "A high-grade metaphyseal bone lesion in an adolescent exhibiting a classic 'sunburst' periosteal reaction, Codman's triangle, and elevated ALP/LDH is diagnostic of Osteosarcoma. Osteosarcoma arises in the metaphysis of long bones around the knee (distal femur and proximal tibia) and characteristically spreads via the hematogenous route to the lungs. A staging CT scan of the chest is mandatory in all patients at presentation."
    }
  ]
};
