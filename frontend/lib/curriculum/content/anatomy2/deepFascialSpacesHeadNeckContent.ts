/**
 * Human Anatomy II: Deep Fascial Spaces of the Head & Neck, Infratemporal Fossa & Ludwig Angina
 * Authoritative gross anatomy content derived from Gray's Anatomy (42nd ed.), Moore's.
 * Mapped to NMC CBME Competencies: AN35.1, AN35.2, SU18.2, ENT1.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DEEP_FASCIAL_SPACES_HEAD_NECK_MODULE: PhysiologyLessonModule = {
  id: "anatomy2-deep-fascial-spaces-head-neck",
  unitCode: "AN35.1",
  title: "Deep Cervical Fascia & Spaces: Retropharyngeal 'Danger Space', Ludwig Angina (Submandibular) & Pterygopalatine Fossa",
  competencies: ["AN35.1", "AN35.2", "SU18.2", "ENT1.2"],
  estimatedMinutes: 150,
  organ3dTarget: "DIGESTIVE",
  markdownContent: `
# Deep Cervical Fascia & Spaces: Danger Space, Ludwig Angina & Infratemporal Fossa

Surgical anatomy of the deep cervical fascial compartments governs the pathways of descending mediastinitis, odontogenic infections, and skull base neurovascular transmission.

---

## 1. Deep Cervical Fascia Compartments \u0026 Clinical Infections

$$\\begin{array}{lcccc}
\\hline
\\textbf{Fascial Space} & \\textbf{Anatomical Boundaries} & \\textbf{Contained Structures} & \\textbf{Clinical Pathway of Spread} & \\textbf{Surgical Emergency Risk} \\\\
\\hline
\\textbf{Danger Space} & \\mathbf{\\text{Between Alar Fascia (anterior)}} & \\text{Loose areolar tissue} & \\mathbf{\\text{Extends from skull base to}} & \\mathbf{\\text{DESCENDING NECROTIZING}} \\\\
& \\mathbf{\\text{and Prevertebral Fascia (posterior)}} & & \\mathbf{\\text{POSTERIOR MEDIASTINUM (T1-T4)}} & \\mathbf{\\text{MEDIASTINITIS (Fatal Sepsis)}} \\\\
\\textbf{Retropharyngeal} & \\text{Between Buccopharyngeal Fascia} & \\text{Retropharyngeal lymph nodes} & \\text{Extends from skull base down} & \\text{Retropharyngeal abscess} \\\\
\\textbf{Space} & \\text{and Alar Fascia} & (\\text{Nodes of Rouviere}) & \\text{to Superior Mediastinum (T4)} & (\\text{airway compromise in children}) \\\\
\\textbf{Submandibular} & \\mathbf{\\text{Sublingual + Submylohyoid}} & \\text{Submandibular gland, lingual nerve,} & \\mathbf{\\text{Odontogenic 2nd/3rd molar infection}} & \\mathbf{\\text{LUDWIG ANGINA: Massive tongue}} \\\\
\\textbf{Space} & \\text{spaces divided by Mylohyoid muscle} & \\text{hypoglossal nerve, facial vessels} & \\text{spreads bilaterally into floor of mouth} & \\mathbf{\\text{elevation } \\rightarrow \\text{ asphyxiation}} \\\\
\\textbf{Carotid Sheath} & \\text{Formed by Investing, Pretracheal,} & \\mathbf{\\text{Common / Internal Carotid Artery,}} & \\text{Provides vertical conduit between} & \\mathbf{\\text{Lemierre Syndrome: Suppurative}} \\\\
& \\text{and Prevertebral layers} & \\mathbf{\\text{Internal Jugular Vein, Vagus (CN X)}} & \\text{skull base and aortic arch} & \\mathbf{\\text{IJV thrombophlebitis (F. necrophorum)}} \\\\
\\hline
\\end{array}$$

---

## 2. Infratemporal \u0026 Pterygopalatine Fossa Communication Hub

- **Pterygopalatine Fossa Gateways**:
  1. **Foramen Rotundum**: Transmits the **Maxillary Nerve ($V_2$)** into the fossa.
  2. **Pterygomaxillary Fissure**: Lateral gateway transmitting the **Maxillary Artery** from the infratemporal fossa.
  3. **Sphenopalatine Foramen**: Medial gateway transmitting the **Sphenopalatine Artery and Nasopalatine Nerve** into the nasal cavity (key site for refractory posterior epistaxis ligation).
  4. **Inferior Orbital Fissure**: Transmits infraorbital nerve and vessels into the orbit floor.
  5. **Vidian (Pterygoid) Canal**: Transmits the Nerve of the Pterygoid Canal (carrying preganglionic parasympathetics from greater petrosal nerve and postganglionic sympathetics from deep petrosal nerve to the pterygopalatine ganglion).
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old male presents with severe tooth pain involving the mandibular second and third molars that has progressed over 4 days into profound submandibular and floor-of-mouth swelling, drooling, high fever, and 'hot potato' voice. On physical examination, the submandibular region is brawny, indurated, tender, and non-fluctuant bilaterally. The tongue is visibly elevated and pushed posterosuperiorly against the soft palate, with severe trismus and inspiratory stridor.",
      question: "What is the diagnosis, which anatomical space is involved, and what is the mandatory immediate management priority?",
      options: [
        "Ludwig Angina involving bilateral sublingual and submandibular (submylohyoid) spaces; the immediate mandatory priority is securing the definitive airway (via awake fiberoptic intubation or surgical tracheostomy/cricothyroidotomy) followed by IV broad-spectrum antibiotics and surgical decompression",
        "Peritonsillar abscess; perform simple needle aspiration in the ED chair",
        "Parotitis; administer oral Amoxicillin and sialogogues",
        "Thyroglossal duct cyst; perform elective Sistrunk procedure"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic Ludwig Angina: (1) Anatomical Localization: A rapidly progressive, aggressive cellulitis of the bilateral submandibular and sublingual spaces, typically originating from an odontogenic infection of the 2nd or 3rd mandibular molars (whose roots extend beneath the mylohyoid ridge into the submylohyoid space); (2) Life Threat: As the sublingual compartment swells, the tongue is forced upward and backward, causing acute mechanical upper airway obstruction; (3) Management Priority: Immediate airway control is paramount (blind oral intubation is contraindicated due to distorted anatomy and risk of laryngospasm; awake fiberoptic intubation or surgical airway is required), combined with broad-spectrum IV antibiotics and surgical drainage."
    }
  ]
};
