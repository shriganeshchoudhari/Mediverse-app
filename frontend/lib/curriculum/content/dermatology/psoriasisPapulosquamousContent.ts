/**
 * Psoriasis, Papulosquamous Disorders & Lichen Planus Learning Content
 * Authoritative medical content derived from Fitzpatrick, Bolognia, Rook, and USMLE Step 2 CK Dermatology.
 * Mapped to NMC CBME Competencies: DR1.1, DR1.2, DR1.3, DR2.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PSORIASIS_PAPULOSQUAMOUS_MODULE: PhysiologyLessonModule = {
  id: "derm-psoriasis-papulosquamous",
  unitCode: "DR1.1",
  title: "Dermatology: Psoriasis Vulgaris (Auspitz Sign, Koebner Phenomenon) & Lichen Planus",
  competencies: ["DR1.1", "DR1.2", "DR1.3", "DR2.1"],
  estimatedMinutes: 140,
  organ3dTarget: "INTEGUMENTARY",
  markdownContent: `
# Dermatology: Psoriasis Vulgaris (Auspitz Sign, Koebner Phenomenon) & Lichen Planus

Papulosquamous dermatoses feature erythematous papules and plaques covered with scales, driven by immune-mediated keratinocyte hyperproliferation.

---

## 1. Psoriasis Vulgaris: Pathophysiology & Clinical Hallmarks

- **Pathophysiology**: Autoimmune T-cell mediated disease driven by the **IL-23 / Th17 / IL-17A / TNF-$\\alpha$ Axis**.
  - Triggers hyperactive epidermal proliferation with a shortened cell cycle transit time of **$3-4\\text{ days}$** (compared to the normal $28\\text{ days}$).
- **Clinical Morphologies**:
  - Sharply demarcated, erythematous, indurated plaques with adherent **Silvery-White (Micaceous) Scales** classically distributed over **Extensor Surfaces (Elbows, Knees, Scalp, Lumbosacral spine, Umbilicus)**.
- **Pathognomonic Clinical Signs**:
  - **Auspitz Sign**: Removal of silvery scale leads to pinpoint punctate bleeding droplets, caused by thinning of the suprapapillary epidermal plates overlying dilated, tortuous, hyperpermeable dermal capillary loops.
  - **Koebner Phenomenon (Isomorphic Response)**: Development of characteristic psoriatic lesions along lines of mechanical skin trauma, scratching, or surgical incisions.
  - **Psoriatic Nail Changes ($> 50\\%$)**: Subungual hyperkeratosis, punctate **Nail Pitting**, **"Oil-Drop" / "Salmon" Patches**, onycholysis, and nail plate dystrophy.
- **Histopathology**:
  - Hyperkeratosis with **Parakeratosis** (retention of nuclei in the stratum corneum).
  - Acanthosis (regular elongation of rete ridges likened to **"Test-Tubes in a Rack"**).
  - Loss / thinning of the stratum granulosum.
  - **Munro Microabscesses**: Intraepidermal neutrophilic collections within the parakeratotic stratum corneum.
  - **Spongiform Pustules of Kogoj**: Neutrophilic collections within the spinous layer.
- **Psoriatic Arthritis (PsA)**:
  - Asymmetric oligoarthritis, DIP joint predilection, **Dactylitis ("Sausage Digits")**, enthesitis, and pathognomonic **"Pencil-in-a-Cup" Deformity** on hand radiographs (HLA-B27 associated).

---

## 2. Guideline-Directed Pharmacotherapy of Psoriasis

| Severity & Clinical Scenario | 1st-Line Therapeutic Regimens | Clinical Warnings & Contraindications |
| :--- | :--- | :--- |
| **Mild-to-Moderate Plaque Psoriasis ($< 10\\%\\text{ BSA}$)** | **Topical High-Potency Corticosteroids** (Clobetasol propionate) combined with **Vitamin D3 Analogs (Calcipotriol / Calcitriol)**; topical retinoids (Tazarotene); Tar shampoos for scalp. | Long-term continuous topical steroids cause skin atrophy, striae, and telangiectasias; use intermittent pulse dosing. |
| **Moderate-to-Severe Plaque Psoriasis ($> 10\\%\\text{ BSA}$ or PsA)** | **Systemic Therapy**: **Methotrexate** ($7.5-25\\text{ mg/week}$ PO/SC $+$ Folic acid), **Cyclosporine**, **Apremilast** (oral PDE-4 inhibitor), or Phototherapy (**Narrowband UVB / PUVA**). | Methotrexate requires baseline hepatic function monitoring; Cyclosporine requires nephrotoxicity and BP surveillance. |
| **Severe Refractory / Biologic Therapy** | **Targeted Biologics**: Anti-TNF (Adalimumab, Infliximab), Anti-IL-17A (**Secukinumab, Ixekizumab**), Anti-IL-23 (**Risankizumab, Guselkumab**), Anti-IL-12/23 (Ustekinumab). | Must screen for **Latent Tuberculosis (IGRA / PPD)** and Hepatitis B/C prior to initiating biologic agents! |
| **CRITICAL CONTRAINDICATION** | **SYSTEMIC ORAL CORTICOSTEROIDS (e.g. Prednisone)** | **STRICTLY CONTRAINDICATED!** Tapering or withdrawing systemic steroids frequently triggers catastrophic, life-threatening **Generalized Pustular Psoriasis of von Zumbusch** or Erythrodermic Psoriasis. |

---

## 3. Other Papulosquamous Disorders: Lichen Planus & Pityriasis Rosea

- **Lichen Planus**:
  - **The 6 Ps**: **P**ruritic, **P**olygonal, **P**lanar (flat-topped), **P**urple (violaceous), **P**apules and **P**laques.
  - Predilection for **Flexor Surfaces of Wrists and Forearms**, ankles, and genitalia.
  - **Wickham\'s Striae**: Fine, reticular, lacy white lines on the surface of papules and oral buccal mucosa.
  - Strong systemic association with **Hepatitis C Virus (HCV)** infection.
  - Histology: Hypergranulosis, **"Sawtooth" Rete Ridges**, and dense band-like lymphocytic infiltrate hugging the dermo-epidermal junction with colloid (**Civatte**) apoptotic bodies.
- **Pityriasis Rosea**:
  - Initiates with a single, solitary **"Herald Patch"** ($2-5\\text{ cm}$ salmon-pink oval plaque on trunk with fine inner collarette of scale).
  - $1-2\\text{ weeks}$ later, followed by secondary eruptive phase along cutaneous Langer cleavage lines in a classic **"Christmas Tree" Pattern** on the back.
  - Self-limiting course ($6-8\\text{ weeks}$); viral reactivation of **HHV-6 / HHV-7** implicated.
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old male presents with thick, well-demarcated, red scaly plaques on both elbows and knees that have worsened over the winter. He notes that when he picks at the silvery scales, fine pinpoint bleeding droplets appear immediately. On closer inspection, several of his fingernails show deep punctate pitting and yellowish 'oil-drop' discoloration. His past medical history is notable for morning stiffness and swelling of his left index finger ('sausage digit'). A junior resident suggests starting oral Prednisone 40 mg daily for rapid symptom control.",
      question: "What is the diagnosis, what is the name of the pinpoint bleeding sign, and why is oral systemic prednisone strictly contraindicated?",
      options: [
        "Psoriasis Vulgaris; Auspitz Sign; Systemic steroids can trigger life-threatening Generalized Pustular Psoriasis upon withdrawal",
        "Lichen Planus; Wickham Sign; Systemic steroids exacerbate underlying Hepatitis C viremia",
        "Bullous Pemphigoid; Nikolsky Sign; Systemic steroids cause rapid full-thickness epidermal necrosis",
        "Pityriasis Rosea; Herald Sign; Systemic steroids prolong the viral replication of HHV-6"
      ],
      correctAnswerIndex: 0,
      explanation: "The clinical presentation of well-demarcated erythematous plaques with micaceous silvery scales on extensor surfaces, pinpoint bleeding upon scale removal (Auspitz sign), nail pitting/oil drops, and dactylitis is classic for Psoriasis Vulgaris with Psoriatic Arthritis. Systemic oral corticosteroids are strictly contraindicated in plaque psoriasis because steroid tapering or withdrawal carries a very high risk of rebound transformation into acute, life-threatening Generalized Pustular Psoriasis (von Zumbusch) or Psoriatic Erythroderma."
    }
  ]
};
