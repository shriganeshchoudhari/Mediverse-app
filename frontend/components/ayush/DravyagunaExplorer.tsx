'use client';

import React, { useState, useMemo } from 'react';
import styles from './DravyagunaExplorer.module.css';
import { DRAVYAGUNA_HERBS } from '@/lib/ayush/DravyagunaHerbPresets';

export default function DravyagunaExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [doshaFilter, setDoshaFilter] = useState('');
  const [viryaFilter, setViryaFilter] = useState('');
  const [selectedHerbId, setSelectedHerbId] = useState(DRAVYAGUNA_HERBS[0].id);
  const [selectedDrug, setSelectedDrug] = useState('Warfarin');

  const allopathicDrugs = ['Warfarin', 'Metformin', 'Atorvastatin', 'Amlodipine', 'Levothyroxine'];

  const filteredHerbs = useMemo(() => {
    return DRAVYAGUNA_HERBS.filter(herb => {
      const matchSearch = herb.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          herb.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          herb.botanicalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDosha = doshaFilter ? herb.doshaPacifying.includes(doshaFilter) : true;
      const matchVirya = viryaFilter ? herb.virya === viryaFilter : true;
      return matchSearch && matchDosha && matchVirya;
    });
  }, [searchTerm, doshaFilter, viryaFilter]);

  const selectedHerb = DRAVYAGUNA_HERBS.find(h => h.id === selectedHerbId);

  const getInteraction = () => {
    if (!selectedHerb) return null;
    return selectedHerb.interactions.find(i => i.drug === selectedDrug) || { drug: selectedDrug, severity: 'Safe', warning: 'No known major interactions.' };
  };

  const interaction = getInteraction();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dravyaguna Explorer (Herb Pharmacology)</h2>
      
      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select value={doshaFilter} onChange={(e) => setDoshaFilter(e.target.value)} className={styles.selectInput}>
          <option value="">All Doshas</option>
          <option value="Vata">Vata Pacifying</option>
          <option value="Pitta">Pitta Pacifying</option>
          <option value="Kapha">Kapha Pacifying</option>
        </select>
        <select value={viryaFilter} onChange={(e) => setViryaFilter(e.target.value)} className={styles.selectInput}>
          <option value="">All Virya (Potency)</option>
          <option value="Ushna">Ushna (Hot)</option>
          <option value="Sheeta">Sheeta (Cold)</option>
        </select>
      </div>

      <div className={styles.layout}>
        {/* Left: Herb Grid */}
        <div className={styles.herbGrid}>
          {filteredHerbs.map(herb => (
            <div 
              key={herb.id} 
              className={`${styles.herbCard} ${selectedHerbId === herb.id ? styles.selectedCard : ''}`}
              onClick={() => setSelectedHerbId(herb.id)}
            >
              <div className={styles.imgPlaceholder}>🌱</div>
              <h4>{herb.name}</h4>
              <p className={styles.sanskrit}>{herb.sanskritName}</p>
              <div className={styles.badges}>
                <span className={styles.badge}>{herb.virya}</span>
                {herb.doshaPacifying.map(d => <span key={d} className={`${styles.badge} ${styles[d.toLowerCase()]}`}>{d}</span>)}
              </div>
            </div>
          ))}
          {filteredHerbs.length === 0 && <p>No herbs found.</p>}
        </div>

        {/* Right: Detailed Inspector */}
        {selectedHerb && (
          <div className={styles.inspector}>
            <div className={styles.header}>
              <h3>{selectedHerb.name} <span>({selectedHerb.botanicalName})</span></h3>
            </div>

            <div className={styles.energeticsPanel}>
              <h4>5-Fold Ayurvedic Energetics</h4>
              <div className={styles.energeticsGrid}>
                <div className={styles.enCard}><strong>Rasa (Taste):</strong> {selectedHerb.rasa}</div>
                <div className={styles.enCard}><strong>Guna (Quality):</strong> {selectedHerb.guna}</div>
                <div className={styles.enCard}><strong>Virya (Potency):</strong> {selectedHerb.virya}</div>
                <div className={styles.enCard}><strong>Vipaka (Post-digestive):</strong> {selectedHerb.vipaka}</div>
                <div className={styles.enCard}><strong>Prabhava:</strong> {selectedHerb.prabhava}</div>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h4>Phytochemicals</h4>
              <p>{selectedHerb.phytochemicals.join(', ')}</p>

              <h4>Clinical Indications</h4>
              <div className={styles.tagList}>
                {selectedHerb.indications.map(ind => <span key={ind} className={styles.tag}>{ind}</span>)}
              </div>

              <h4>Dosage</h4>
              <p>{selectedHerb.dosage}</p>
            </div>

            <div className={styles.interactionSection}>
              <h4>Drug Interaction Safety Checker</h4>
              <div className={styles.interactionControls}>
                <label>Co-administered Allopathic Drug:</label>
                <select value={selectedDrug} onChange={(e) => setSelectedDrug(e.target.value)}>
                  {allopathicDrugs.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {interaction && (
                <div className={`${styles.interactionAlert} ${styles[interaction.severity.toLowerCase()]}`}>
                  <div className={styles.severityBadge}>{interaction.severity}</div>
                  <p>{interaction.warning}</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
