'use client';

import React, { useState } from 'react';
import styles from './ComparativeAnatomyViewer.module.css';

type SpeciesId = 'human' | 'canine' | 'feline' | 'equine' | 'bovine';
type SystemId = 'digestive' | 'skeletal' | 'dental';

interface SpeciesInfo {
  id: SpeciesId;
  name: string;
  icon: string;
  classification: string;
}

const SPECIES_LIST: SpeciesInfo[] = [
  { id: 'human', name: 'Human (Homo sapiens)', icon: '🧍', classification: 'Primate / Monogastric Omnivore' },
  { id: 'canine', name: 'Canine (Dog)', icon: '🐕', classification: 'Carnivore / Simple Monogastric' },
  { id: 'feline', name: 'Feline (Cat)', icon: '🐈', classification: 'Obligate Carnivore / High Protein' },
  { id: 'equine', name: 'Equine (Horse)', icon: '🐎', classification: 'Hindgut Fermenter (Cecal-Colic)' },
  { id: 'bovine', name: 'Bovine (Cattle)', icon: '🐄', classification: 'Ruminant (4-Chambered Forestomach)' }
];

const COMPARATIVE_DATA: Record<SystemId, Record<SpeciesId, { title: string; desc: string; formulaOrFeature: string; adaptation: string }>> = {
  digestive: {
    human: {
      title: 'Simple Monogastric GI Tract',
      desc: 'Single glandular stomach (capacity ~1.5L), small intestine (6m), non-fermentative cecum & ascending/transverse/descending colon.',
      formulaOrFeature: 'Stomach: 1 Chamber | Transit: 24-48h',
      adaptation: 'Optimized for varied cooked omnivorous diet with enzymatic digestion.'
    },
    canine: {
      title: 'Short, High-Acidity Carnivore Tract',
      desc: 'Highly distensible single stomach (pH 1-2), short simple intestine (5x body length) for rapid protein/fat digestion.',
      formulaOrFeature: 'Stomach: 1 Chamber (Large) | Transit: 8-12h',
      adaptation: 'Gastric acid kills foodborne bacteria; short colon minimizes putrefactive fermentation.'
    },
    feline: {
      title: 'Obligate Carnivore Digestive Anatomy',
      desc: 'Shortest intestinal tract ratio (4:1 body length). Limited amylase activity; strict taurine, arginine, and arachidonic acid requirement.',
      formulaOrFeature: 'Stomach: 1 Chamber | Minimal Cecum',
      adaptation: 'Minimal carbohydrate utilization; continuous hepatic gluconeogenesis from amino acids.'
    },
    equine: {
      title: 'Hindgut Fermenter (Expanded Cecum & Great Colon)',
      desc: 'Small non-glandular/glandular stomach (8-15L, cannot vomit due to tight cardiac sphincter), massive cecum (30L) & ascending colon (80L) for microbial fiber breakdown.',
      formulaOrFeature: 'Stomach: Simple (Margo plicatus) | Cecum/Colon: Massive Fermenter',
      adaptation: 'Continuous grazing herbivore; volatile fatty acids (VFAs) absorbed in large colon provide 70% energy.'
    },
    bovine: {
      title: 'Complex 4-Chambered Ruminant Forestomach',
      desc: 'Rumen (150-200L, microbial vat), Reticulum (honeycomb sorting), Omasum (manyplies water absorption), Abomasum (true glandular acid stomach).',
      formulaOrFeature: 'Forestomach: 4 Chambers (Rumen, Reticulum, Omasum, Abomasum)',
      adaptation: 'Rumination & cud-chewing allows extraction of high-grade microbial protein and VFAs from low-quality roughage.'
    }
  },
  skeletal: {
    human: {
      title: 'Plantigrade Bipedal Pentadactyl Extremity',
      desc: '5 digits (pollex opposable), plantigrade foot posture (tarsals/metatarsals bear direct weight on flat sole).',
      formulaOrFeature: 'Digits: 5 | Posture: Plantigrade',
      adaptation: 'Opposable thumb for fine tool manipulation; upright bipedal stability.'
    },
    canine: {
      title: 'Digitigrade Carnivore Paw',
      desc: 'Weight borne on digits 2-5 (digital pads); dewclaw (digit 1) vestigial/non-weight-bearing on thoracic limb.',
      formulaOrFeature: 'Digits: 4 Functional (1 Dewclaw) | Posture: Digitigrade',
      adaptation: 'Spring-loaded locomotion, shock absorption, agility in high-speed pursuit.'
    },
    feline: {
      title: 'Digitigrade Retractile Claw System',
      desc: 'Elastic dorsal ligaments hold ungual process retracted into sheath; flexor digitorum profundus contracts to extend claws.',
      formulaOrFeature: 'Digits: 5 Fore / 4 Hind | Posture: Digitigrade',
      adaptation: 'Silent stalking, prey capture, tree-climbing sharpness preservation.'
    },
    equine: {
      title: 'Unguligrade Single-Digit (Monodactyl) Hoof',
      desc: 'Weight borne solely on distal phalanx (P3 / Coffin bone) of Digit 3. Metacarpal III = Cannon bone; splint bones = reduced Digits 2 & 4.',
      formulaOrFeature: 'Digit: Single (Digit III) | Posture: Unguligrade',
      adaptation: 'High-efficiency elastic energy return (stay apparatus) allows sleeping while standing and rapid galloping.'
    },
    bovine: {
      title: 'Artiodactyl Cloven Hoof (Didactyl)',
      desc: 'Weight borne equally on Digits 3 and 4 (dual claws). Cannon bone formed by fused Metacarpals III & IV; dewclaws are vestigial Digits 2 & 5.',
      formulaOrFeature: 'Digits: 2 Main Claws (III & IV) | Posture: Unguligrade',
      adaptation: 'Traction on muddy pastures and heavy load bearing capacity.'
    }
  },
  dental: {
    human: {
      title: 'Heterodont Diphyodont Omnivore Dentition',
      desc: 'Incisors for cutting, canines for tearing, premolars and bunodont molars for crushing varied food.',
      formulaOrFeature: 'Dental Formula: 2(I 2/2, C 1/1, P 2/2, M 3/3) = 32',
      adaptation: 'Low cusps (bunodont) facilitate omnivorous diet without specialized shearing.'
    },
    canine: {
      title: 'Carnassial Shearing Dentition',
      desc: 'Well-developed pointed canines and specialized carnassial teeth (Upper P4 and Lower M1) for slicing meat and crushing bone.',
      formulaOrFeature: 'Dental Formula: 2(I 3/3, C 1/1, P 4/4, M 2/3) = 42',
      adaptation: 'Carnassial scissor action shears muscle fascia; large roots resist torsional prey struggle.'
    },
    feline: {
      title: 'Strict Carnivorous Sectorial Dentition',
      desc: 'Sharp pointed incisors, long curved canine killing teeth, reduced molar count with specialized razor-sharp carnassial teeth (P3/M1).',
      formulaOrFeature: 'Dental Formula: 2(I 3/3, C 1/1, P 3/2, M 1/1) = 30',
      adaptation: 'No grinding molars; jaw moves strictly vertically in scissor slicing motion.'
    },
    equine: {
      title: 'Hypsodont Herbivorous Lophodont Dentition',
      desc: 'High-crowned (hypsodont) teeth with continuous eruption throughout life; prominent diastema (interdental space for bit).',
      formulaOrFeature: 'Dental Formula: 2(I 3/3, C 1/1, P 3-4/3, M 3/3) = 36-42',
      adaptation: 'Enamel/cementum ridges (lophs) continuously grind silica-rich grasses with lateral mastication.'
    },
    bovine: {
      title: 'Selenodont Ruminant with Dental Pad',
      desc: 'No maxillary incisors or canines; replaced by a tough keratinized dental pad (pulvinus dentalis). Crescent-shaped enamel ridges (selenodont).',
      formulaOrFeature: 'Dental Formula: 2(I 0/4, C 0/0, P 3/3, M 3/3) = 32',
      adaptation: 'Tongue pulls grass against upper dental pad; lateral circular chewing grinds roughage.'
    }
  }
};

export default function ComparativeAnatomyViewer() {
  const [selectedSystem, setSelectedSystem] = useState<SystemId>('digestive');
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesId>('bovine');

  const currentData = COMPARATIVE_DATA[selectedSystem][selectedSpecies];
  const speciesObj = SPECIES_LIST.find(s => s.id === selectedSpecies)!;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Comparative Vertebrate Anatomy Explorer</h2>
        <p className={styles.subtitle}>
          Interactive multi-species anatomical comparison: Human vs Canine vs Feline vs Equine vs Bovine across digestive, skeletal, and dental systems.
        </p>
      </header>

      {/* System Selector Tabs */}
      <div className={styles.systemTabs}>
        <button
          className={`${styles.systemBtn} ${selectedSystem === 'digestive' ? styles.activeSystem : ''}`}
          onClick={() => setSelectedSystem('digestive')}
        >
          🍽️ Digestive Systems (Monogastric vs Ruminant vs Hindgut)
        </button>
        <button
          className={`${styles.systemBtn} ${selectedSystem === 'skeletal' ? styles.activeSystem : ''}`}
          onClick={() => setSelectedSystem('skeletal')}
        >
          🦴 Skeletal Distal Limb & Locomotion (Plantigrade vs Digitigrade vs Unguligrade)
        </button>
        <button
          className={`${styles.systemBtn} ${selectedSystem === 'dental' ? styles.activeSystem : ''}`}
          onClick={() => setSelectedSystem('dental')}
        >
          🦷 Skull & Dental Formulas (Heterodont vs Carnassial vs Hypsodont vs Selenodont)
        </button>
      </div>

      {/* Species Selector Pills */}
      <div className={styles.speciesRow}>
        {SPECIES_LIST.map(sp => (
          <button
            key={sp.id}
            className={`${styles.speciesPill} ${selectedSpecies === sp.id ? styles.activeSpecies : ''}`}
            onClick={() => setSelectedSpecies(sp.id)}
          >
            <span className={styles.speciesIcon}>{sp.icon}</span>
            <div className={styles.speciesText}>
              <strong>{sp.name.split('(')[0]}</strong>
              <small>{sp.classification.split('/')[0]}</small>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Morphological Representation */}
        <div className={styles.visualCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.speciesHeading}>{speciesObj.icon} {speciesObj.name}</span>
              <span className={styles.classBadge}>{speciesObj.classification}</span>
            </div>

            <div className={styles.svgContainer}>
              <svg viewBox="0 0 340 220" className={styles.anatomySvg}>
                {/* Silhouette & Anatomy Diagram Graphic */}
                <rect x="20" y="20" width="300" height="180" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                
                {selectedSystem === 'digestive' && (
                  <g>
                    {selectedSpecies === 'bovine' ? (
                      /* 4-Chambered Ruminant Graphic */
                      <g>
                        <ellipse cx="140" cy="110" rx="60" ry="45" fill="#1e293b" stroke="#84cc16" strokeWidth="3" />
                        <text x="140" y="115" fill="#84cc16" fontSize="12" fontWeight="700" textAnchor="middle">Rumen (80%)</text>
                        <circle cx="215" cy="85" r="22" fill="#1e293b" stroke="#a3e635" strokeWidth="2" />
                        <text x="215" y="88" fill="#a3e635" fontSize="9" textAnchor="middle">Reticulum</text>
                        <circle cx="225" cy="130" r="18" fill="#1e293b" stroke="#65a30d" strokeWidth="2" />
                        <text x="225" y="133" fill="#65a30d" fontSize="9" textAnchor="middle">Omasum</text>
                        <ellipse cx="260" cy="150" rx="20" ry="14" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                        <text x="260" y="153" fill="#f87171" fontSize="8" textAnchor="middle">Abomasum</text>
                      </g>
                    ) : selectedSpecies === 'equine' ? (
                      /* Hindgut Cecal Fermenter Graphic */
                      <g>
                        <ellipse cx="90" cy="90" rx="30" ry="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                        <text x="90" y="93" fill="#fbbf24" fontSize="10" textAnchor="middle">Stomach</text>
                        <ellipse cx="190" cy="115" rx="65" ry="50" fill="#1e293b" stroke="#84cc16" strokeWidth="3" />
                        <text x="190" y="115" fill="#84cc16" fontSize="11" fontWeight="700" textAnchor="middle">Great Colon & Cecum</text>
                        <text x="190" y="130" fill="#cbd5e1" fontSize="9" textAnchor="middle">(110 Liters)</text>
                      </g>
                    ) : (
                      /* Monogastric Graphic */
                      <g>
                        <path d="M 100 80 C 100 50, 190 50, 200 90 C 210 130, 130 150, 110 120 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
                        <text x="150" y="100" fill="#38bdf8" fontSize="12" fontWeight="700" textAnchor="middle">Single Stomach</text>
                        <path d="M 120 135 Q 160 180 230 140" fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
                        <text x="180" y="170" fill="#94a3b8" fontSize="10" textAnchor="middle">Intestinal Loop</text>
                      </g>
                    )}
                  </g>
                )}

                {selectedSystem === 'skeletal' && (
                  <g>
                    <text x="170" y="60" fill="#38bdf8" fontSize="13" fontWeight="700" textAnchor="middle">
                      {selectedSpecies === 'human' ? 'Plantigrade (5 Digits)' : selectedSpecies === 'equine' ? 'Unguligrade (Single Digit III Hoof)' : selectedSpecies === 'bovine' ? 'Artiodactyl (Digits III & IV Cloven Claws)' : 'Digitigrade (4-5 Digital Pads)'}
                    </text>
                    <line x1="80" y1="120" x2="260" y2="120" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="170" cy="120" r="16" fill="#0f172a" stroke="#84cc16" strokeWidth="3" />
                    <text x="170" y="125" fill="#84cc16" fontSize="10" fontWeight="700" textAnchor="middle">P3</text>
                    <text x="170" y="170" fill="#cbd5e1" fontSize="10" textAnchor="middle">
                      {currentData.formulaOrFeature}
                    </text>
                  </g>
                )}

                {selectedSystem === 'dental' && (
                  <g>
                    <text x="170" y="60" fill="#fbbf24" fontSize="12" fontWeight="700" textAnchor="middle">
                      {currentData.formulaOrFeature}
                    </text>
                    <rect x="60" y="90" width="220" height="50" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="170" y="120" fill="#fde68a" fontSize="11" textAnchor="middle">
                      {selectedSpecies === 'bovine' ? 'Dental Pad (No Upper Incisors)' : selectedSpecies === 'canine' ? 'Sectorial Carnassials (P4/M1)' : 'Specialized Occlusal Grinding Surface'}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className={styles.featureBox}>
              <strong>Formula / Defining Characteristic:</strong>
              <p>{currentData.formulaOrFeature}</p>
            </div>
          </div>
        </div>

        {/* Right: Comparative Anatomy Details */}
        <div className={styles.infoCol}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>{currentData.title}</h3>
            <p className={styles.description}>{currentData.desc}</p>
          </div>

          <div className={styles.adaptCard}>
            💡 <strong>Evolutionary & Functional Adaptation:</strong>
            <p>{currentData.adaptation}</p>
          </div>

          <div className={styles.quickFactsCard}>
            <h4 className={styles.factsHeading}>Species Comparison Matrix</h4>
            <div className={styles.matrixList}>
              <div className={styles.matrixRow}>
                <span>Canine / Feline:</span>
                <strong>High acid (pH 1-2), short simple transit</strong>
              </div>
              <div className={styles.matrixRow}>
                <span>Equine (Horse):</span>
                <strong>Enormous hindgut fermentation vat (110L)</strong>
              </div>
              <div className={styles.matrixRow}>
                <span>Bovine (Cattle):</span>
                <strong>4-chamber microbial forestomach (200L)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
