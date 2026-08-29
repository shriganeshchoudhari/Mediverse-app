'use client';

import React from 'react';
import styles from './PrescriptionCard.module.css';

export interface DrugEntry {
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  mechanism?: string;
  indication?: string;
}

export interface RxCardData {
  condition: string;
  firstLineRegimen: DrugEntry[];
  secondLineAlternative?: DrugEntry[];
  renalAdjustment?: string;
  blackBoxWarnings?: string[];
  monitoringParameters?: string[];
}

interface PrescriptionCardProps {
  data: RxCardData;
}

export default function PrescriptionCard({ data }: PrescriptionCardProps) {
  return (
    <div className={styles.rxCard}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.icon}>💊</span>
          <h4 className={styles.title}>{data.condition || 'Evidence-Based Prescribing Protocol'}</h4>
          <span className={styles.badge}>Formulary Rx</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>First-Line Regimen</div>
        <div className={styles.regimenGrid}>
          {data.firstLineRegimen?.map((drug, idx) => (
            <div key={idx} className={styles.drugCard}>
              <div className={styles.drugName}>{drug.drugName}</div>
              <div className={styles.drugDose}>
                {drug.dosage} • {drug.route} • {drug.frequency}
              </div>
              {drug.mechanism && <div className={styles.drugMechanism}>{drug.mechanism}</div>}
            </div>
          ))}
        </div>
      </div>

      {data.secondLineAlternative && data.secondLineAlternative.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Second-Line / Alternative Options</div>
          <div className={styles.regimenGrid}>
            {data.secondLineAlternative.map((drug, idx) => (
              <div key={idx} className={styles.drugCard}>
                <div className={styles.drugName}>{drug.drugName}</div>
                <div className={styles.drugDose}>
                  {drug.dosage} • {drug.route} • {drug.frequency}
                </div>
                {drug.indication && <div className={styles.drugMechanism}>Indication: {drug.indication}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.renalAdjustment && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Renal & Hepatic Dose Modifications</div>
          <div className={styles.renalBox}>⚠️ {data.renalAdjustment}</div>
        </div>
      )}

      {data.blackBoxWarnings && data.blackBoxWarnings.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Black-Box Warnings & Sentinel Safety Alerts</div>
          <div className={styles.warningBox}>
            {data.blackBoxWarnings.map((w, idx) => (
              <div key={idx}>⛔ {w}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
