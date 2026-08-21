'use client';

import React, { useState, useMemo } from 'react';
import styles from './ZoonoticSpilloverSimulator.module.css';

interface ZoonosisData {
  id: string;
  name: string;
  type: string;
  reservoir: string;
  intermediateHost: string;
  transmission: string;
  animalSigns: string;
  humanSigns: string;
  fatalityRate: string;
  baselineR0: number;
  oneHealthProtocol: string;
}

const ZOONOSES_LIST: ZoonosisData[] = [
  {
    id: 'rabies',
    name: 'Rabies Lyssavirus',
    type: 'Neurotropic RNA Rhabdovirus',
    reservoir: 'Bats / Wild Canids (Foxes, Jackals)',
    intermediateHost: 'Domestic Dogs (99% of human cases in developing nations)',
    transmission: 'Bite / saliva inoculation into wound / mucous membrane contact',
    animalSigns: 'Furious (aggression, salivation, hydrophobia) or Dumb (paralytic) rabies, change in bark tone',
    humanSigns: 'Encephalitic frenzy, aerophobia, spasms, fatal progressive encephalomyelitis (>99% fatal without PEP)',
    fatalityRate: 'Near 100% once clinical signs appear',
    baselineR0: 1.8,
    oneHealthProtocol: 'Mass dog vaccination (70% coverage threshold), post-exposure prophylaxis (RIG + cell-culture vaccine), wildlife oral bait vaccines.'
  },
  {
    id: 'anthrax',
    name: 'Bacillus anthracis (Anthrax)',
    type: 'Spore-forming Gram-positive Bacterium',
    reservoir: 'Soil (Spore dormancy for decades)',
    intermediateHost: 'Ruminants (Cattle, Sheep, Goats)',
    transmission: 'Direct contact with infected carcass / wool / ingestion / inhalation of spores',
    animalSigns: 'Peracute sudden death, dark unclotted blood from natural orifices, incomplete rigor mortis, splenomegaly',
    humanSigns: 'Cutaneous malignant pustule (black eschar), gastrointestinal necrosis, or fatal inhalational mediastinal widening',
    fatalityRate: 'Cutaneous: 20% (untreated) | Inhalational: >80%',
    baselineR0: 2.2,
    oneHealthProtocol: 'Annual livestock Sterne strain vaccination, deep burial with quicklime (DO NOT OPEN CARCASS), PPE for abattoir workers.'
  },
  {
    id: 'brucella',
    name: 'Brucella abortus / melitensis',
    type: 'Intracellular Zoonotic Bacterium',
    reservoir: 'Bovine, Ovine, Caprine, Swine herds',
    intermediateHost: 'Dairy Cattle & Sheep',
    transmission: 'Unpasteurized milk/cheese consumption, handling aborted fetal membranes/placenta',
    animalSigns: 'Late-term abortion storms, retained placenta, orchitis/epididymitis in bulls, hygroma of knee',
    humanSigns: 'Undulant fever, drenching night sweats, chronic spondylitis/sacroiliitis, endocarditis',
    fatalityRate: '<2% (high chronic morbidity and disability)',
    baselineR0: 2.5,
    oneHealthProtocol: 'Calfhood vaccination (Brucella abortus S19/RB51), test-and-slaughter policy, mandatory milk pasteurization.'
  },
  {
    id: 'avian-flu',
    name: 'Highly Pathogenic Avian Influenza (H5N1)',
    type: 'Orthomyxovirus (Segmented RNA)',
    reservoir: 'Wild Aquatic Birds (Ducks, Geese)',
    intermediateHost: 'Domestic Poultry (Chickens, Turkeys), Swine, Dairy Cattle',
    transmission: 'Aerosol, fecal-oral contamination, contaminated farm equipment, raw poultry contact',
    animalSigns: 'Cyanosis of comb/wattles, facial edema, drop in egg production, acute mortality up to 100%',
    humanSigns: 'Severe primary viral pneumonia, ARDS, multiorgan failure, cytokine storm',
    fatalityRate: '~50% in confirmed human spillover cases',
    baselineR0: 3.1,
    oneHealthProtocol: 'Culling infected flocks within 3km buffer zone, biosecurity zoning, sentinel surveillance, raw poultry ban.'
  }
];

export default function ZoonoticSpilloverSimulator() {
  const [selectedZoonosisId, setSelectedZoonosisId] = useState<string>('rabies');
  const [vaccinationActive, setVaccinationActive] = useState<boolean>(false);
  const [ppeActive, setPpeActive] = useState<boolean>(false);
  const [quarantineActive, setQuarantineActive] = useState<boolean>(false);
  const [surveillanceActive, setSurveillanceActive] = useState<boolean>(false);

  const currentZoonosis = useMemo(() => {
    return ZOONOSES_LIST.find(z => z.id === selectedZoonosisId) || ZOONOSES_LIST[0];
  }, [selectedZoonosisId]);

  // Compute effective R0 and outbreak status
  const effectiveR0 = useMemo(() => {
    let r0 = currentZoonosis.baselineR0;
    if (vaccinationActive) r0 *= 0.45; // 55% reduction
    if (ppeActive) r0 *= 0.65; // 35% reduction
    if (quarantineActive) r0 *= 0.70; // 30% reduction
    if (surveillanceActive) r0 *= 0.80; // 20% reduction
    return Number(Math.max(0.15, r0).toFixed(2));
  }, [currentZoonosis, vaccinationActive, ppeActive, quarantineActive, surveillanceActive]);

  const epidemicStatus = useMemo(() => {
    if (effectiveR0 < 1.0) {
      return { text: 'Contained (R₀ < 1.0 — Spillover Chain Extinguished)', color: 'green' };
    } else if (effectiveR0 < 1.5) {
      return { text: 'Sub-Critical Spread (R₀ 1.0 - 1.5 — Localized Sporadic Outbreak)', color: 'amber' };
    } else {
      return { text: 'Active Zoonotic Spillover & Epidemic Expansion (R₀ > 1.5)', color: 'red' };
    }
  }, [effectiveR0]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>One Health Zoonotic Spillover & Epidemiology Simulator</h2>
        <p className={styles.subtitle}>
          Interactive wildlife-to-human pathogen spillover simulator: evaluate transmission chains, basic reproduction numbers (R₀), and veterinary-public health One Health interventions.
        </p>
      </header>

      {/* Pathogen Selector */}
      <div className={styles.zoonosisTabs}>
        {ZOONOSES_LIST.map(z => (
          <button
            key={z.id}
            className={`${styles.zBtn} ${selectedZoonosisId === z.id ? styles.activeZBtn : ''}`}
            onClick={() => setSelectedZoonosisId(z.id)}
          >
            <strong>{z.name.split('(')[0]}</strong>
            <small>{z.type.split(' ')[0]}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Spillover Transmission Flow */}
        <div className={styles.flowCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.flowTitle}>{currentZoonosis.name}</span>
              <span className={styles.fatalityBadge}>Fatality: {currentZoonosis.fatalityRate}</span>
            </div>

            {/* Spillover Chain Visual Diagram */}
            <div className={styles.chainContainer}>
              <div className={styles.chainStep}>
                <span className={styles.stepIcon}>🦇</span>
                <strong>Wildlife Reservoir</strong>
                <p>{currentZoonosis.reservoir}</p>
              </div>
              <div className={styles.chainArrow}>⬇️ <em>Spillover Interface</em></div>
              <div className={styles.chainStep}>
                <span className={styles.stepIcon}>🐄</span>
                <strong>Domestic / Livestock Host</strong>
                <p>{currentZoonosis.intermediateHost}</p>
              </div>
              <div className={styles.chainArrow}>⬇️ <em>Zoonotic Transmission: {currentZoonosis.transmission.split('/')[0]}</em></div>
              <div className={styles.chainStep}>
                <span className={styles.stepIcon}>🧍</span>
                <strong>Human Index Case & Community</strong>
                <p>{currentZoonosis.humanSigns.split(',')[0]}</p>
              </div>
            </div>

            {/* Clinical Presentation Comparison */}
            <div className={styles.triadGrid}>
              <div className={styles.triadBox}>
                <span className={styles.triadLabel}>🐾 Animal Clinical Manifestation:</span>
                <p>{currentZoonosis.animalSigns}</p>
              </div>
              <div className={styles.triadBox}>
                <span className={styles.triadLabel}>🏥 Human Clinical Manifestation:</span>
                <p>{currentZoonosis.humanSigns}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: One Health Interventions & R0 Model */}
        <div className={styles.controlsCol}>
          {/* R0 Epidemic Meter */}
          <div className={styles.card}>
            <span className={styles.label}>Effective Reproduction Number (R₀)</span>
            <div className={styles.r0Box}>
              <span className={styles.r0Val}>{effectiveR0}</span>
              <span className={styles.r0Sub}>Baseline R₀: {currentZoonosis.baselineR0}</span>
            </div>

            <div className={`${styles.statusBanner} ${styles[epidemicStatus.color]}`}>
              {epidemicStatus.text}
            </div>
          </div>

          {/* One Health Intervention Toggles */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>One Health Tripartite Interventions</h3>
            
            <label className={`${styles.toggleItem} ${vaccinationActive ? styles.activeToggle : ''}`}>
              <input
                type="checkbox"
                checked={vaccinationActive}
                onChange={e => setVaccinationActive(e.target.checked)}
                className={styles.checkbox}
              />
              <div>
                <strong>Mass Animal / Livestock Vaccination</strong>
                <small>Reduces host reservoir viral/bacterial load by ~55%</small>
              </div>
            </label>

            <label className={`${styles.toggleItem} ${ppeActive ? styles.activeToggle : ''}`}>
              <input
                type="checkbox"
                checked={ppeActive}
                onChange={e => setPpeActive(e.target.checked)}
                className={styles.checkbox}
              />
              <div>
                <strong>Abattoir & Farm PPE / Biosecurity Barriers</strong>
                <small>Blocks mucosal, aerosol, and skin inoculation by ~35%</small>
              </div>
            </label>

            <label className={`${styles.toggleItem} ${quarantineActive ? styles.activeToggle : ''}`}>
              <input
                type="checkbox"
                checked={quarantineActive}
                onChange={e => setQuarantineActive(e.target.checked)}
                className={styles.checkbox}
              />
              <div>
                <strong>Zonal Animal Quarantine & Movement Restriction</strong>
                <small>Prevents geographical inter-herd transmission by ~30%</small>
              </div>
            </label>

            <label className={`${styles.toggleItem} ${surveillanceActive ? styles.activeToggle : ''}`}>
              <input
                type="checkbox"
                checked={surveillanceActive}
                onChange={e => setSurveillanceActive(e.target.checked)}
                className={styles.checkbox}
              />
              <div>
                <strong>Integrated One Health Genomic Surveillance</strong>
                <small>Enables rapid index case ring-containment by ~20%</small>
              </div>
            </label>
          </div>

          {/* Protocol Card */}
          <div className={styles.protocolCard}>
            🛡️ <strong>Global One Health Control Standard:</strong>
            <p>{currentZoonosis.oneHealthProtocol}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
