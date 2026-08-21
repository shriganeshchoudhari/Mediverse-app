export interface VeterinarySurgeryCase {
  id: string;
  name: string;
  species: string;
  emergencyTier: 'Immediate' | 'Urgent' | 'Elective';
  clinicalPresentation: string;
  surgicalSteps: string[];
  anesthesiaConsiderations: string;
  vitalLimits: {
    hrBpm: { min: number; max: number };
    rrBpm: { min: number; max: number };
    mapMmHg: { min: number; max: number };
  };
}

export const VETERINARY_SURGERY_CASES: VeterinarySurgeryCase[] = [
  {
    id: 'gdv_canine',
    name: 'Canine GDV Decompression & Gastropexy',
    species: 'Canine',
    emergencyTier: 'Immediate',
    clinicalPresentation: 'Large breed dog with non-productive retching, abdominal distension, tachycardia, weak pulses, shock.',
    surgicalSteps: [
      'Initial stabilization with aggressive IV fluid therapy (crystalloids/colloids) in front half of body.',
      'Gastric decompression via orogastric tube or trocharization.',
      'Ventral midline celiotomy.',
      'Derotation of stomach (usually clockwise twist, so pull pylorus ventrally and to the right).',
      'Assessment of gastric and splenic viability; resect necrotic tissue (partial gastrectomy/splenectomy) if needed.',
      'Incisional gastropexy (pyloric antrum to right abdominal wall) to prevent recurrence.',
      'Abdominal lavage and closure.'
    ],
    anesthesiaConsiderations: 'High anesthetic risk (ASA IV/V). Pre-oxygenate. Avoid drugs that exacerbate hypotension (e.g., acepromazine). Use full mu agonists for analgesia. Prepare to treat ventricular arrhythmias (lidocaine) common post-derotation.',
    vitalLimits: {
      hrBpm: { min: 70, max: 160 },
      rrBpm: { min: 10, max: 30 },
      mapMmHg: { min: 65, max: 120 }
    }
  },
  {
    id: 'lda_bovine',
    name: 'Bovine Left Displaced Abomasum Omentopexy',
    species: 'Bovine',
    emergencyTier: 'Urgent',
    clinicalPresentation: 'Post-partum dairy cow, off feed, decreased milk production, ping heard on left paralumbar fossa percussion.',
    surgicalSteps: [
      'Right flank laparotomy (standing surgery).',
      'Regional anesthesia (line block, inverted L block, or paravertebral nerve block).',
      'Explore abdomen, locate abomasum on the left side under the rumen.',
      'Decompress abomasum using a sterile needle attached to tubing.',
      'Push deflated abomasum down and retrieve it on the right side.',
      'Omentopexy: Suture the greater omentum near the pylorus to the abdominal wall muscles to hold abomasum in correct right-sided position.',
      'Routine closure of abdominal wall.'
    ],
    anesthesiaConsiderations: 'Standing surgery requires good local anesthesia and restraint. Minimal sedation to avoid recumbency (low dose xylazine if needed, but risky).',
    vitalLimits: {
      hrBpm: { min: 60, max: 90 },
      rrBpm: { min: 15, max: 35 },
      mapMmHg: { min: 70, max: 110 }
    }
  },
  {
    id: 'lcv_equine',
    name: 'Equine Large Colon Volvulus',
    species: 'Equine',
    emergencyTier: 'Immediate',
    clinicalPresentation: 'Severe, unrelenting colic, marked abdominal distension, tachycardia, toxic line on mucous membranes.',
    surgicalSteps: [
      'Ventral midline laparotomy.',
      'Identify colonic volvulus (often at cecocolic fold).',
      'Exteriorize large colon (requires immense physical effort).',
      'Pelvic flexure enterotomy to evacuate contents (reduces weight and distension).',
      'Correction of the volvulus (derotation).',
      'Assess colonic viability (color, wall thickness, arterial pulses).',
      'Colonic resection and anastomosis if tissue is non-viable (poor prognosis).',
      'Colopexy may be considered in broodmares to prevent recurrence.',
      'Closure of linea alba (secure closure is critical to prevent incisional hernia).'
    ],
    anesthesiaConsiderations: 'Extreme risk. Patient often in profound distributive/hypovolemic shock. Rapid induction. Maintain blood pressure with inotropes (dobutamine). High risk of post-anesthetic myopathy/neuropathy and reperfusion injury.',
    vitalLimits: {
      hrBpm: { min: 30, max: 60 },
      rrBpm: { min: 8, max: 15 },
      mapMmHg: { min: 70, max: 90 }
    }
  },
  {
    id: 'rumenotomy_hardware',
    name: 'Bovine Rumenotomy Hardware Disease',
    species: 'Bovine',
    emergencyTier: 'Urgent',
    clinicalPresentation: 'Anorexia, fever, positive withers pinch test, reluctance to move, decreased rumen motility. (Traumatic Reticuloperitonitis).',
    surgicalSteps: [
      'Left flank laparotomy (standing surgery).',
      'Paravertebral nerve block.',
      'Incision into the left paralumbar fossa.',
      'Anchor rumen to the skin (e.g., using a rumen board or Cushing suture pattern) to prevent peritoneal contamination.',
      'Rumenotomy: Vertical incision into the rumen.',
      'Manual exploration of rumen and reticulum (arm inside the cow).',
      'Locate and remove penetrating foreign body (wire, nail) from the reticulum.',
      'Administer magnet into the reticulum if not already present.',
      'Two-layer closure of the rumen (inverting pattern like Cushing or Lembert).',
      'Remove rumen anchoring sutures, clean area, close abdominal wall.'
    ],
    anesthesiaConsiderations: 'Standing procedure. Paravertebral block (T13, L1, L2). Minimal to no systemic sedation required.',
    vitalLimits: {
      hrBpm: { min: 60, max: 90 },
      rrBpm: { min: 15, max: 35 },
      mapMmHg: { min: 70, max: 110 }
    }
  }
];
