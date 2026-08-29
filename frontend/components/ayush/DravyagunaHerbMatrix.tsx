'use client';

import React, { useState, useMemo } from 'react';
import styles from './DravyagunaHerbMatrix.module.css';

export interface HerbDravya {
  id: string;
  sanskritName: string;
  botanicalName: string;
  family: string;
  rasa: string; // Tastes
  guna: string; // Attributes
  virya: 'Ushna' | 'Sheeta'; // Potency
  vipaka: 'Madhura' | 'Amla' | 'Katu'; // Post-digestive effect
  karma: string[]; // Actions
  doshaEffect: 'Vata-Kapha Hara' | 'Pitta-Kapha Hara' | 'Tridosha Hara' | 'Vata Hara' | 'Pitta Hara';
  formulations: string[];
  herbDrugInteraction?: string;
}

const HERB_DATABASE: HerbDravya[] = [
  {
    id: 'ashwagandha',
    sanskritName: 'Ashwagandha',
    botanicalName: 'Withania somnifera',
    family: 'Solanaceae',
    rasa: 'Tikta, Kashaya, Madhura',
    guna: 'Laghu, Snigdha',
    virya: 'Ushna',
    vipaka: 'Madhura',
    karma: ['Rasayana', 'Balya', 'Vajikarana', 'Medhya', 'Nidrajanana'],
    doshaEffect: 'Vata-Kapha Hara',
    formulations: ['Ashwagandharishta', 'Ashwagandhadi Lehya', 'Chyawanprash'],
    herbDrugInteraction: '⚠️ Potentiates GABAergic sedatives, barbiturates, and thyroid hormone replacement (T3/T4).'
  },
  {
    id: 'guduchi',
    sanskritName: 'Guduchi (Amrita)',
    botanicalName: 'Tinospora cordifolia',
    family: 'Menispermaceae',
    rasa: 'Tikta, Kashaya',
    guna: 'Guru, Snigdha',
    virya: 'Ushna',
    vipaka: 'Madhura',
    karma: ['Tridoshaghna', 'Jwaraghna', 'Rasayana', 'Deepana', 'Krimighna'],
    doshaEffect: 'Tridosha Hara',
    formulations: ['Amritarishta', 'Guduchi Ghana Vati', 'Sudarshana Churna'],
    herbDrugInteraction: '⚠️ Additive hypoglycemic effect with oral sulfonylureas and metformin.'
  },
  {
    id: 'shatavari',
    sanskritName: 'Shatavari',
    botanicalName: 'Asparagus racemosus',
    family: 'Asparagaceae',
    rasa: 'Madhura, Tikta',
    guna: 'Guru, Snigdha',
    virya: 'Sheeta',
    vipaka: 'Madhura',
    karma: ['Stanyajanana', 'Rasayana', 'Puktikara', 'Chakshushya'],
    doshaEffect: 'Pitta-Kapha Hara',
    formulations: ['Shatavari Gulam', 'Shatavaryadi Ghrita', 'Phala Ghrita'],
    herbDrugInteraction: '⚠️ Mild diuretic activity; monitor potassium when co-prescribed with loop diuretics.'
  },
  {
    id: 'guggulu',
    sanskritName: 'Guggulu',
    botanicalName: 'Commiphora mukul',
    family: 'Burseraceae',
    rasa: 'Tikta, Katu, Kashaya',
    guna: 'Laghu, Ruksha, Vishada, Sukshma',
    virya: 'Ushna',
    vipaka: 'Katu',
    karma: ['Medohara', 'Lekhana', 'Vataraktahara', 'Bhagnasandhanakara'],
    doshaEffect: 'Vata-Kapha Hara',
    formulations: ['Yogaraja Guggulu', 'Kaishore Guggulu', 'Kanchanara Guggulu'],
    herbDrugInteraction: '⚠️ Induces CYP3A4 metabolism; may reduce bioavailability of atorvastatin, diltiazem, and oral contraceptives.'
  },
  {
    id: 'brahmi',
    sanskritName: 'Brahmi',
    botanicalName: 'Bacopa monnieri',
    family: 'Plantaginaceae',
    rasa: 'Tikta, Kashaya, Madhura',
    guna: 'Laghu, Sara',
    virya: 'Sheeta',
    vipaka: 'Madhura',
    karma: ['Medhya', 'Ayushya', 'Unmadahara', 'Smritiprada'],
    doshaEffect: 'Tridosha Hara',
    formulations: ['Brahmi Ghrita', 'Saraswatarishta', 'Brahmi Vati'],
    herbDrugInteraction: '⚠️ May increase central acetylcholine levels; synergistic with cholinesterase inhibitors (Donepezil).'
  },
  {
    id: 'arjuna',
    sanskritName: 'Arjuna',
    botanicalName: 'Terminalia arjuna',
    family: 'Combretaceae',
    rasa: 'Kashaya',
    guna: 'Laghu, Ruksha',
    virya: 'Sheeta',
    vipaka: 'Katu',
    karma: ['Hridya', 'Sandhaniya', 'Vranaropana', 'Kaphapittahara'],
    doshaEffect: 'Pitta-Kapha Hara',
    formulations: ['Arjunarishta', 'Arjuna Ksheerapaka', 'Kakubhadi Churna'],
    herbDrugInteraction: '⚠️ Mild inotropic & ACE-inhibitory effect; observe blood pressure when combined with ARBs or beta-blockers.'
  }
];

export default function DravyagunaHerbMatrix() {
  const [search, setSearch] = useState('');
  const [doshaFilter, setDoshaFilter] = useState('ALL');
  const [viryaFilter, setViryaFilter] = useState('ALL');

  const filteredHerbs = useMemo(() => {
    return HERB_DATABASE.filter(h => {
      const matchSearch = h.sanskritName.toLowerCase().includes(search.toLowerCase()) ||
                          h.botanicalName.toLowerCase().includes(search.toLowerCase()) ||
                          h.karma.some(k => k.toLowerCase().includes(search.toLowerCase()));
      const matchDosha = doshaFilter === 'ALL' || h.doshaEffect.includes(doshaFilter);
      const matchVirya = viryaFilter === 'ALL' || h.virya === viryaFilter;
      return matchSearch && matchDosha && matchVirya;
    });
  }, [search, doshaFilter, viryaFilter]);

  return (
    <div className={styles.matrixContainer}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span style={{ fontSize: '1.75rem' }}>🌿</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Dravyaguna Herbology Matrix & Interaction Database</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>NCISM CBME Ayurvedic Pharmacognosy & Phytomedicine Sentinel</p>
          </div>
          <span className={styles.badge}>Rasa Panchaka Atlas</span>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by Sanskrit name, botanical name, or karma (e.g. Rasayana, Medhya)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.selectInput}
          value={doshaFilter}
          onChange={e => setDoshaFilter(e.target.value)}
        >
          <option value="ALL">All Doshas</option>
          <option value="Vata">Vata Pacifying</option>
          <option value="Pitta">Pitta Pacifying</option>
          <option value="Kapha">Kapha Pacifying</option>
          <option value="Tridosha">Tridosha Balancing</option>
        </select>
        <select
          className={styles.selectInput}
          value={viryaFilter}
          onChange={e => setViryaFilter(e.target.value)}
        >
          <option value="ALL">All Virya</option>
          <option value="Ushna">Ushna (Hot Potency)</option>
          <option value="Sheeta">Sheeta (Cooling Potency)</option>
        </select>
      </div>

      <div className={styles.grid}>
        {filteredHerbs.map(herb => (
          <div key={herb.id} className={styles.herbCard}>
            <div className={styles.herbHeader}>
              <div>
                <div className={styles.herbName}>{herb.sanskritName}</div>
                <div className={styles.latinName}>{herb.botanicalName} ({herb.family})</div>
              </div>
              <div className={styles.doshaTags}>
                <span className={styles.tag}>{herb.doshaEffect}</span>
              </div>
            </div>

            <div className={styles.rasaPanchakaRow}>
              <div>
                <div className={styles.rasaLabel}>Rasa</div>
                <div className={styles.rasaVal}>{herb.rasa.split(',')[0]}</div>
              </div>
              <div>
                <div className={styles.rasaLabel}>Guna</div>
                <div className={styles.rasaVal}>{herb.guna.split(',')[0]}</div>
              </div>
              <div>
                <div className={styles.rasaLabel}>Virya</div>
                <div className={styles.rasaVal} style={{ color: herb.virya === 'Ushna' ? '#fbbf24' : '#38bdf8' }}>{herb.virya}</div>
              </div>
              <div>
                <div className={styles.rasaLabel}>Vipaka</div>
                <div className={styles.rasaVal}>{herb.vipaka}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
              <strong>Therapeutic Karma:</strong> {herb.karma.join(' • ')}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              <strong>Classical Yoga Formulations:</strong> {herb.formulations.join(', ')}
            </div>

            {herb.herbDrugInteraction && (
              <div className={styles.interactionAlert}>
                {herb.herbDrugInteraction}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
