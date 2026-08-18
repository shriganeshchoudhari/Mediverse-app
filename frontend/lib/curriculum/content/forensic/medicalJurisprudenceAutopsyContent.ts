/**
 * Medical Jurisprudence, Inquests & Autopsy Protocols Learning Content
 * Authoritative medical content derived from Reddy, Parikh, Knight, and USMLE / PG Entrance.
 * Mapped to NMC CBME Competencies: FM10.1, FM11.1, FM12.1, FM13.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MEDICAL_JURISPRUDENCE_AUTOPSY_MODULE: PhysiologyLessonModule = {
  id: "for-jurisprudence",
  unitCode: "FM10.1",
  title: "Medical Jurisprudence, Legal Inquests, Medical Negligence & Autopsy Protocols",
  competencies: ["FM10.1", "FM11.1", "FM12.1", "FM13.1"],
  estimatedMinutes: 130,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Medical Jurisprudence, Legal Inquests, Medical Negligence & Autopsy Protocols

Medical Jurisprudence encompasses the legal rights, responsibilities, liabilities of medical practitioners, courtroom testimony, consent laws, and forensic autopsy protocols.

---

## 1. Legal Inquest Types in India (CrPC Sections)

| Inquest Type | Presiding Official & Legal Provision | Mandatory Indications & Scope |
| :--- | :--- | :--- |
| **Police Inquest** | Police Officer not below the rank of Sub-Inspector (**Section 174 CrPC**) | Conducted in all routine unnatural, suicidal, homicidal, accidental, or suspicious deaths. |
| **Magistrate Inquest** | Executive Magistrate or Judicial Magistrate (**Section 176 CrPC**) | **MANDATORY in 4 Specific High-Stakes Situations**:<br>1. **Custodial Deaths**: Death occurring in police custody, prison, or psychiatric asylum.<br>2. **Police Firing**: Death caused by police encounter or firing.<br>3. **Dowry Deaths**: Death of a woman within **7 years of marriage** under suspicious / unnatural circumstances (**Section 304B IPC**).<br>4. **Exhumation**: Lawful disinterment of a buried corpse for post-mortem examination. |

---

## 2. Medical Negligence & Legal Doctrines

- **Civil vs Criminal Negligence**:
  - **Civil Negligence**: Failure to exercise reasonable care and skill resulting in patient injury; adjudicated in Consumer Forums or Civil Court; damages awarded as financial compensation.
  - **Criminal Negligence (Section 304A IPC)**: Gross, culpable negligence or reckless disregard for patient life (*"Mens rea"* / rash act); punishable with imprisonment up to 2 years.
- **Bolam Test**:
  - A doctor is NOT guilty of negligence if they acted in accordance with a practice accepted as proper by a **responsible body of medical professionals skilled in that particular art**, even if another body of opinion disagrees.
- **Res Ipsa Loquitur ("The Thing Speaks for Itself")**:
  - Legal doctrine shifting the burden of proof from the plaintiff to the doctor when the negligence is glaringly obvious and would not occur in the absence of negligence (e.g. leaving a surgical mop/artery forceps inside the peritoneal cavity, amputating the wrong leg, administering mismatched blood).

---

## 3. Autopsy Dissection Techniques & Viscera Preservation

| Eponymous Autopsy Technique | Method of Dissection & Organ Removal | Ideal Indications |
| :--- | :--- | :--- |
| **Virchow Technique** | **Organ-by-Organ removal** (widely practiced routine method) | Demonstrates individual organ pathology; anatomical relationships disrupted. |
| **Letulle Technique** | **En Masse removal** (thoracic, cervical, abdominal, and pelvic organs removed as one massive continuous block) | Best for preserving vascular connections and tract pathology (e.g. retroperitoneal tumors, aortic dissections). |
| **Ghon Technique** | **En Bloc removal** in functionally related organ systems (Cervicothoracic block, Celiac/GI block, Urogenital block) | Balanced approach preserving systemic relationships. |
| **Rokitansky Technique** | **In-Situ dissection** combined with organ inspection prior to removal | Minimal disruption; ideal in highly infectious autopsy cases (e.g. HIV, Hepatitis, Anthrax). |

> **Forensic Viscera Preservation Protocol for Toxicology**:
> - **Preservative of Choice**: **Saturated Solution of Sodium Chloride (Saturated NaCl)** for routine viscera (Stomach with contents, upper $30\\text{ cm}$ of small intestine, $500\\text{ g}$ of liver with gallbladder, one whole kidney each, spleen).
> - **Preservative for Suspected Salt / Acid Poisoning**: **Rectified Spirit** (except in alcohol, carbolic acid, and phosphorus poisoning where saturated NaCl is used).
> - **Absolute Rule**: **NEVER use Formalin** for preserving viscera intended for chemical/toxicological analysis (formalin destroys and chemically alters alkaloids and volatile poisons).
`,
  clinicalVignettes: [
    {
      scenario: "A 23-year-old married woman is brought to the government hospital dead with 80% burn injuries. Her marriage took place 3 years prior to the incident, and her family alleges ongoing harassment and demands for dowry from her in-laws.",
      question: "Which of the following legal authorities is mandated by law to conduct the official inquest into this death?",
      options: [
        "Executive Magistrate (Section 176 CrPC)",
        "Sub-Inspector of Police (Section 174 CrPC)",
        "Forensic Medical Officer",
        "Chief Medical Officer of the Hospital"
      ],
      correctAnswerIndex: 0,
      explanation: "Under Section 176 CrPC, a Magistrate Inquest is strictly mandatory in all unnatural or suspicious deaths of a woman within 7 years of marriage (suspected dowry death under Section 304B IPC) as well as deaths occurring in police custody, police firing, or exhumation cases."
    }
  ]
};
