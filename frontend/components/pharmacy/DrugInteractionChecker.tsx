'use client';

import React, { useState, useMemo } from 'react';
import styles from './DrugInteractionChecker.module.css';
import {
  CLINICAL_DRUG_DATABASE,
  checkRegimenInteractions,
  ClinicalDrugItem,
  DrugInteraction
} from '@/lib/pharmacy/DrugInteractionPresets';

export default function DrugInteractionChecker() {
  const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>(['warfarin', 'aspirin']);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const availableDrugs = useMemo(() => {
    return CLINICAL_DRUG_DATABASE.filter(d => 
      !selectedDrugIds.includes(d.id) &&
      (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [selectedDrugIds, searchTerm]);

  const selectedDrugsList = useMemo(() => {
    return selectedDrugIds.map(id => CLINICAL_DRUG_DATABASE.find(d => d.id === id)).filter(Boolean) as ClinicalDrugItem[];
  }, [selectedDrugIds]);

  const interactions = useMemo(() => {
    return checkRegimenInteractions(selectedDrugIds);
  }, [selectedDrugIds]);

  const handleAddDrug = (id: string) => {
    if (selectedDrugIds.length < 8 && !selectedDrugIds.includes(id)) {
      setSelectedDrugIds(prev => [...prev, id]);
      setSearchTerm('');
    }
  };

  const handleRemoveDrug = (id: string) => {
    setSelectedDrugIds(prev => prev.filter(drugId => drugId !== id));
  };

  const handleApplyPreset = (ids: string[]) => {
    setSelectedDrugIds(ids);
  };

  const majorCount = interactions.filter(i => i.severity === 'major').length;
  const moderateCount = interactions.filter(i => i.severity === 'moderate').length;
  const minorCount = interactions.filter(i => i.severity === 'minor').length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Multi-Drug Interaction & CYP450 Safety Checker</h2>
        <p className={styles.subtitle}>
          Polypharmacy safety analyzer assessing CYP3A4, CYP2D6, CYP2C9, CYP2C19, P-glycoprotein, and pharmacodynamic synergistic risks.
        </p>
      </header>

      {/* Preset Scenarios */}
      <div className={styles.presetsBar}>
        <span className={styles.presetLabel}>Quick Presets:</span>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset(['warfarin', 'aspirin', 'clopidogrel'])}>
          Bleeding Triple Risk (Warfarin + Aspirin + Clopidogrel)
        </button>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset(['simvastatin', 'clarithromycin'])}>
          Statin Toxicity (Simvastatin + Clarithromycin)
        </button>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset(['digoxin', 'amiodarone'])}>
          Digitalis P-gp Toxicity (Digoxin + Amiodarone)
        </button>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset(['lisinopril', 'spironolactone'])}>
          Hyperkalemia Risk (Lisinopril + Spironolactone)
        </button>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset(['fluoxetine', 'tramadol'])}>
          Serotonin Syndrome (Fluoxetine + Tramadol)
        </button>
      </div>

      <div className={styles.layout}>
        {/* Left Column: Drug Regimen Builder */}
        <div className={styles.regimenSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Current Medication Regimen ({selectedDrugsList.length}/8)</h3>
            
            <div className={styles.selectedDrugsList}>
              {selectedDrugsList.map(drug => (
                <div key={drug.id} className={styles.drugChip}>
                  <div className={styles.chipInfo}>
                    <span className={styles.chipName}>{drug.name}</span>
                    <span className={styles.chipCategory}>{drug.category}</span>
                  </div>
                  <div className={styles.chipEnzymes}>
                    {drug.cypSubstrates.length > 0 && <span className={styles.subTag}>Sub: {drug.cypSubstrates.join(',')}</span>}
                    {drug.cypInhibitors.length > 0 && <span className={styles.inhTag}>Inh: {drug.cypInhibitors.join(',')}</span>}
                    {drug.cypInducers.length > 0 && <span className={styles.indTag}>Ind: {drug.cypInducers.join(',')}</span>}
                  </div>
                  <button className={styles.removeBtn} onClick={() => handleRemoveDrug(drug.id)}>×</button>
                </div>
              ))}
            </div>

            {/* Search and Add */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search drug to add (e.g. Warfarin, Metoprolol, Rifampin)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <div className={styles.dropdown}>
                  {availableDrugs.slice(0, 6).map(drug => (
                    <div
                      key={drug.id}
                      className={styles.dropdownItem}
                      onClick={() => handleAddDrug(drug.id)}
                    >
                      <span className={styles.dropName}>{drug.name}</span>
                      <span className={styles.dropCategory}>{drug.category}</span>
                    </div>
                  ))}
                  {availableDrugs.length === 0 && (
                    <div className={styles.noResults}>No matching drugs found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Alerts */}
        <div className={styles.resultsSection}>
          <div className={styles.summaryBar}>
            <div className={styles.summaryTitle}>
              Interactions Detected: <strong>{interactions.length}</strong>
            </div>
            <div className={styles.badgeSummary}>
              {majorCount > 0 && <span className={`${styles.countBadge} ${styles.major}`}>{majorCount} Major</span>}
              {moderateCount > 0 && <span className={`${styles.countBadge} ${styles.moderate}`}>{moderateCount} Moderate</span>}
              {minorCount > 0 && <span className={`${styles.countBadge} ${styles.minor}`}>{minorCount} Minor</span>}
              {interactions.length === 0 && <span className={`${styles.countBadge} ${styles.safe}`}>No Known Major DDIs</span>}
            </div>
          </div>

          <div className={styles.interactionsList}>
            {interactions.map(item => (
              <div key={item.id} className={`${styles.interactionCard} ${styles[item.severity]}`}>
                <div className={styles.cardTop}>
                  <div className={styles.drugPair}>
                    <span className={styles.pairItem}>{item.drugA.toUpperCase()}</span>
                    <span className={styles.vsText}>+</span>
                    <span className={styles.pairItem}>{item.drugB.toUpperCase()}</span>
                  </div>
                  <span className={`${styles.severityBadge} ${styles[item.severity]}`}>
                    {item.severity.toUpperCase()}
                  </span>
                </div>

                {item.cypEnzymeInvolved && (
                  <div className={styles.enzymeTag}>
                    Enzyme Axis: <strong>{item.cypEnzymeInvolved}</strong>
                  </div>
                )}

                <div className={styles.cardBody}>
                  <p><strong>Mechanism:</strong> {item.mechanism}</p>
                  <p><strong>Clinical Effect:</strong> {item.clinicalEffect}</p>
                </div>

                <div className={styles.managementBox}>
                  <strong>Pharmacist Action:</strong> {item.managementStrategy}
                </div>
              </div>
            ))}

            {interactions.length === 0 && (
              <div className={styles.emptyState}>
                <p>✅ No critical drug-drug interactions detected between the selected medications.</p>
                <small>Always cross-reference patient kidney/liver function and clinical contraindications.</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
