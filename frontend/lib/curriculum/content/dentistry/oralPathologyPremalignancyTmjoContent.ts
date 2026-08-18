/**
 * Dentistry & Maxillofacial Surgery: Odontogenic Tumors, Cysts, Oral Premalignant Lesions & TMJ Disorders
 * Authoritative medical content derived from Neville's Oral and Maxillofacial Pathology (5th ed.), Regezi, and USMLE/INBDE.
 * Mapped to NMC CBME Competencies: DE7.1, DE7.2, DE8.1, DE8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ORAL_PATHOLOGY_PREMALIGNANCY_TMJ_MODULE: PhysiologyLessonModule = {
  id: "dentistry-oral-pathology-premalignancy-tmj",
  unitCode: "DE7.1",
  title: "Oral Pathology, Odontogenic Tumors (Ameloblastoma), Premalignancy & TMJ Disorders",
  competencies: ["DE7.1", "DE7.2", "DE8.1", "DE8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Oral Pathology, Odontogenic Tumors (Ameloblastoma), Premalignancy & TMJ Disorders

Recognition of odontogenic cysts and neoplasms, screening for oral potentially malignant disorders (OPMD), and diagnosis of temporomandibular joint biomechanical dysfunction form critical dental and surgical competencies.

---

## 1. Odontogenic Cysts & Neoplasms

| Lesion | Cell Origin & Pathogenesis | Characteristic Radiographic (X-Ray / CT) Appearance | Histopathology & Gold Standard Surgical Management |
| :--- | :--- | :--- | :--- |
| **Ameloblastoma** | **Odontogenic Epithelium** (Dental lamina rests / enamel organ). Benign but **locally aggressive, destructive, infiltrative**. | **Multilocular "Soap Bubble" or "Honeycomb" Radiolucency** with scalloped margins, cortical expansion, tooth displacement, and **knife-cut root resorption**. Most common in mandibular molar-ramus ($80\\%$). | Islands of odontogenic epithelium with **peripheral palisading columnar cells showing reversed nuclear polarity (Vickers-Gorlin criteria)** and central stellate reticulum-like cells. **Management**: Wide segmental / marginal mandibulectomy with **$1.0 - 1.5\\text{ cm}$ bony margins $+$ reconstruction (Vascularized Free Fibula Flap)**. Simple curettage results in $>50 - 90\\%$ recurrence! |
| **Odontogenic Keratocyst (OKC)** | Dental lamina rests. Arises from mutations in the **$PTCH1$ tumor suppressor gene** (Sonic Hedgehog pathway). | Well-defined unilocular or multilocular radiolucency with smooth corticated borders; grows anteroposteriorly along medullary cavity with **minimal cortical expansion**. | Parakeratinized stratified squamous epithelium (6–8 cells thick) with a **wavy, corrugated keratin surface** and prominent hyperchromatic basal cell layer. Satellite daughter cysts in fibrous wall $\\implies$ high recurrence ($30 - 60\\%$). Associated with **Gorlin-Goltz Syndrome (Nevoid Basal Cell Carcinoma Syndrome)**. |
| **Dentigerous Cyst (Follicular Cyst)** | Reduced enamel epithelium. Fluid accumulates between crown and dental follicle. | **Unilocular pericoronal radiolucency attached precisely at the Cementoenamel Junction (CEJ)** of an unerupted impacted tooth (mandibular 3rd molar or maxillary canine). | Thin non-keratinized stratified squamous epithelium. **Management**: Enucleation of cyst along with surgical extraction of impacted tooth. Excellent prognosis. |
| **Radicular Cyst (Periapical Cyst)** | **Rests of Malassez** in PDL stimulated by chronic pulpal necrosis. | Well-circumscribed periapical radiolucency at the apex of a **non-vital tooth** with loss of lamina dura. | Hyperplastic stratified squamous epithelium with cholesterol clefts, Rushton bodies, and inflammatory infiltrate. Most common odontogenic cyst ($>65\\%$). |

---

## 2. Oral Potentially Malignant Disorders (OPMD)

1. **Oral Leukoplakia**:
   - A predominantly white patch or plaque of the oral mucosa that cannot be wiped off and cannot be characterized clinically as any other disease.
   - **Malignant Transformation Rate**: $1 - 5\\%$ overall (Homogeneous) to $>15 - 30\\%$ (Non-homogeneous / Speckled / Erythroleukoplakia).
   - High-risk anatomic sites: **Lateral/ventral tongue, floor of mouth, and soft palate**.
2. **Erythroplakia**:
   - A fiery red velvety patch or plaque that cannot be characterized as any other inflammatory condition.
   - **Highest Malignant Potential**: **$>90\\%$ show severe epithelial dysplasia, carcinoma in situ (CIS), or invasive squamous cell carcinoma** at initial biopsy! Mandatory incisional biopsy.
3. **Oral Submucous Fibrosis (OSMF)**:
   - Chronic progressive scarring disease of the oral cavity caused by **chewing Areca Nut (Betel Quid)**.
   - *Pathogenesis*: Arecoline alkaloid stimulates fibroblast collagen synthesis while flavonoids inhibit collagenase; elevated copper acts as a cofactor for lysyl oxidase cross-linking.
   - *Clinical Triad*: Burning sensation in mouth on eating spicy food (stomatopyrosis) $\\rightarrow$ Pale, marble-like, blanched, leathery mucosa with palpable vertical fibrous bands $\\rightarrow$ **Progressive, severe trismus (inter-incisal opening $<20\\text{ mm}$)**. Malignant transformation rate: **$7 - 10\\%$**.

---

## 3. Temporomandibular Joint (TMJ) Disorders & Acute Dislocation

$$\\begin{array}{lcc}
\\hline
\\textbf{TMJ Condition} & \\textbf{Articular Disc Kinematics} & \\textbf{Clinical Hallmarks & Physical Exam} \\\\
\\hline
\\text{Disc Displacement WITH Reduction} & \\text{Disc displaced anteriorly at rest; pops back onto condyle} & \\text{Reciprocal Click/Pop on opening and closing; normal range of opening} \\\\
\\text{Disc Displacement WITHOUT Reduction} & \\text{Disc remains anteriorly displaced; acts as mechanical barrier} & \\mathbf{\\text{"Closed Lock": Severe limited opening } (<30\\text{ mm}); \\text{Jaw deviates TOWARD affected side}} \\\\
\\mathbf{\\text{Acute TMJ Dislocation}} & \\mathbf{\\text{Condyle displaces anterior to Articular Eminence}} & \\mathbf{\\text{Inability to close mouth (Open Lock); severe pain; depression preauricular}} \\\\
\\hline
\\end{array}$$

### Manual Reduction of Acute TMJ Dislocation: The Nélaton Maneuver
- **Technique**:
  1. Position patient in a low-seated chair with head firmly supported against a wall or headrest.
  2. Examiner wraps thumbs with gauze (to prevent bite injury upon sudden closure).
  3. Place thumbs on the **occlusal surfaces of the mandibular molars bilaterally**, with fingers grasping the external inferior border of the mandible.
  4. Apply firm, steady **DOWNWARD pressure on the molars** (to distract the condyle below the articular eminence), followed by **BACKWARD and UPWARD guidance** (to seat the condyle back into the Glenoid fossa).
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old male presents with a painless, slowly enlarging swelling on the left side of his lower jaw over the past two years. A panoramic radiograph (OPG) reveals a large, well-demarcated multilocular radiolucency with a classic 'soap bubble' appearance extending from the left mandibular first molar through the angle and ramus, causing extensive cortical bone expansion and knife-edge root resorption of adjacent teeth. Incisional biopsy reveals islands of odontogenic epithelium with peripheral palisaded columnar cells exhibiting reversed nuclear polarity.",
      question: "Which of the following represents the correct diagnosis and the gold standard surgical management for this lesion?",
      options: [
        "Ameloblastoma; Wide segmental mandibulectomy with 1.0 to 1.5 cm bony margins and vascularized free fibula flap reconstruction",
        "Ameloblastoma; Simple enucleation and curettage under local anesthesia",
        "Radicular Cyst; Marsupialization and root canal treatment",
        "Dentigerous Cyst; Complete enucleation with tooth extraction only"
      ],
      correctAnswerIndex: 0,
      explanation: "The clinical presentation (multilocular 'soap bubble' radiolucency at the mandibular molar-angle with cortical expansion and root resorption) and histological findings (peripheral columnar palisading with reversed nuclear polarity, Vickers-Gorlin criteria) are diagnostic of Ameloblastoma. Because ameloblastoma is a locally aggressive, infiltrative neoplasm that extends beyond visible radiographic borders, simple curettage carries an unacceptable recurrence rate of >50-90%. The gold standard treatment is wide segmental mandibulectomy with 1.0 to 1.5 cm margins followed by reconstruction with a vascularized free fibula flap."
    }
  ]
};
