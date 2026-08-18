/**
 * Human Anatomy II: Clinical Embryology, Branchial Apparatus & Congenital Craniofacial Anomalies
 * Authoritative embryology content derived from Langman's Medical Embryology (14th ed.), Moore's.
 * Mapped to NMC CBME Competencies: AN64.1, AN64.2, SU18.4, ENT1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CLINICAL_EMBRYOLOGY_BRANCHIAL_APPARATUS_MODULE: PhysiologyLessonModule = {
  id: "anatomy2-clinical-embryology-branchial-apparatus",
  unitCode: "AN64.1",
  title: "Clinical Embryology: Pharyngeal Arches (1-6), Pouches (1-4), Clefts & Craniofacial Anomalies (DiGeorge / Branchial Cysts)",
  competencies: ["AN64.1", "AN64.2", "SU18.4", "ENT1.4"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Clinical Embryology: Pharyngeal Arches, Pouches, Clefts & Craniofacial Anomalies

Development of the head and neck is organized around the pharyngeal (branchial) apparatus consisting of ectodermal clefts, mesodermal/neural crest arches, and endodermal pouches.

---

## 1. Pharyngeal Arch Derivatives Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pharyngeal Arch} & \\textbf{Cranial Nerve} & \\textbf{Muscular Derivatives} & \\textbf{Skeletal / Cartilaginous Derivatives} & \\textbf{Clinical Congenital Malformation} \\\\
\\hline
\\textbf{1st Arch} & \\mathbf{\\text{Trigeminal (CN } V_3\\text{)}} & \\text{Muscles of Mastication (temporalis,} & \\text{Meckel cartilage: Malleus, Incus,} & \\mathbf{\\text{Treacher Collins Syndrome: Mandibulofacial}} \\\\
(\\textbf{Mandibular}) & (\\text{mandibular branch}) & \\text{masseter, pterygoids), mylohyoid, tensor tympani} & \\text{sphenomandibular ligament, mandible} & \\mathbf{\\text{dysostosis (neural crest migration failure)}} \\\\
\\textbf{2nd Arch} & \\mathbf{\\text{Facial (CN VII)}} & \\text{Muscles of Facial Expression, Stapedius,} & \\text{Reichert cartilage: Stapes, Styloid process,} & \\text{Pierre Robin Sequence: Micrognathia,} \\\\
(\\textbf{Hyoid}) & & \\text{Stylohyoid, Posterior belly of Digastric} & \\text{Stylohyoid ligament, Lesser horn of Hyoid} & \\text{glossoptosis, cleft palate} \\\\
\\textbf{3rd Arch} & \\mathbf{\\text{Glossopharyngeal (CN IX)}} & \\mathbf{\\text{Stylopharyngeus muscle}} & \\mathbf{\\text{Greater horn and lower body of Hyoid}} & \\text{Glossopharyngeal neuralgia, dysphagia} \\\\
\\textbf{4th Arch} & \\mathbf{\\text{Superior Laryngeal (CN X)}} & \\text{Cricothyroid, levator veli palatini,} & \\text{Thyroid cartilage, cuneiform cartilage} & \\text{Inability to tense vocal cords (high pitch loss)} \\\\
& & \\text{pharyngeal constrictors} & & \\\\
\\textbf{6th Arch} & \\mathbf{\\text{Recurrent Laryngeal (CN X)}} & \\mathbf{\\text{All intrinsic laryngeal muscles}} & \\text{Cricoid, arytenoid, corniculate cartilages} & \\mathbf{\\text{Recurrent laryngeal nerve palsy (hoarseness)}} \\\\
& & (\\text{except cricothyroid}) & & \\\\
\\hline
\\end{array}$$

---

## 2. Pharyngeal Pouches \u0026 Clefts Derivations

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pouch / Cleft} & \\textbf{Germ Layer} & \\textbf{Normal Adult Derivatives} & \\textbf{Congenital Pathology / Malformation} \\\\
\\hline
\\textbf{1st Pouch} & \\text{Endoderm} & \\mathbf{\\text{Eustachian tube, Middle ear tympanic cavity}} & \\text{Middle ear effusion / conductive hearing loss} \\\\
\\textbf{2nd Pouch} & \\text{Endoderm} & \\mathbf{\\text{Palatine tonsil lining \u0026 tonsillar crypts}} & \\text{Persistent tonsillar sinus} \\\\
\\textbf{3rd Pouch} & \\text{Endoderm} & \\mathbf{\\text{Inferior Parathyroid Glands + THYMUS}} & \\mathbf{\\text{DIGEORGE SYNDROME (22q11.2 deletion):}} \\\\
\\textbf{4th Pouch} & \\text{Endoderm} & \\mathbf{\\text{Superior Parathyroid Glands + Ultimobranchial}} & \\mathbf{\\text{Absent thymus (T-cell immunodeficiency) +}} \\\\
& & (\\text{C-cells of thyroid}) & \\mathbf{\\text{absent parathyroids (hypocalcemic tetany)}} \\\\
\\textbf{1st Cleft} & \\text{Ectoderm} & \\mathbf{\\text{External Auditory Meatus}} & \\text{External ear canal atresia / preauricular sinus} \\\\
\\textbf{2nd-4th Clefts} & \\text{Ectoderm} & \\text{Obliterated by 2nd arch overgrowth (cervical sinus)} & \\mathbf{\\text{BRANCHIAL CLEFT CYST: Lateral neck mass}} \\\\
& & & (\\mathbf{\\text{anterior border of Sternocleidomastoid; does not move}}) \\\\
\\hline
\\end{array}$$

- **Midline vs Lateral Neck Masses in Children**:
  - **Thyroglossal Duct Cyst**: Midline cystic mass derived from persistent thyroid descent tract from the **foramen cecum** at tongue base. **Characteristic: Elevates with tongue protrusion and swallowing** (treated with Sistrunk operation).
  - **Branchial Cleft Cyst**: Lateral neck mass along the anterior border of the sternocleidomastoid muscle (typically 2nd branchial cleft). **Does NOT elevate with tongue protrusion**.
`,
  clinicalVignettes: [
    {
      scenario: "A newborn infant presents on day 2 of life with hypocalcemic neuromuscular tetany, carpopedal spasms, low-set ears, micrognathia, a small cleft palate, and an interrupted aortic arch on echocardiogram. Flow cytometry reveals a profound deficiency of CD3+ T lymphocytes, while absolute B lymphocyte counts are completely normal. Chest radiography confirms the complete absence of a thymic shadow (thymic sail sign absent). Genetic fluorescence in situ hybridization (FISH) identifies a microdeletion on chromosome 22q11.2.",
      question: "What is the diagnosis, and what is the underlying embryological defect responsible for this infant's thymic and parathyroid abnormalities?",
      options: [
        "DiGeorge Syndrome (22q11.2 deletion); failure of development and differentiation of the third and fourth pharyngeal (branchial) endodermal pouches due to defective neural crest cell migration",
        "Treacher Collins Syndrome; defective 1st pharyngeal arch mesoderm",
        "Severe Combined Immunodeficiency (SCID); defective adenosine deaminase",
        "Branchial cleft cyst; persistence of the second pharyngeal cleft"
      ],
      correctAnswerIndex: 0,
      explanation: "This newborn exhibits the classical presentation of DiGeorge Syndrome (22q11.2 microdeletion): (1) Embryological Defect: Failure of normal development of the Third and Fourth Pharyngeal Pouches (endoderm) driven by defective neural crest cell migration into the pharyngeal apparatus; (2) Organ Deficits: The 3rd pouch gives rise to the Thymus and Inferior Parathyroids, while the 4th pouch gives rise to the Superior Parathyroids and ultimobranchial body; failure of development leads to congenital absence of the thymus (resulting in profound T-cell immunodeficiency with normal B-cell counts) and absence of parathyroid glands (producing severe neonatal hypocalcemia and tetany); (3) Associated Malformations: Conotruncal cardiac defects (interrupted aortic arch, truncus arteriosus) and craniofacial dysmorphism (micrognathia, low-set ears, cleft palate)."
    }
  ]
};
