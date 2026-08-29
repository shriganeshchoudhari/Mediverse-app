'use client';

import React from 'react';
import styles from './LogbookPDFExport.module.css';

export interface ProcedureLogEntry {
  id: string;
  date: string;
  procedureName: string;
  domain: string;
  competencyCode: string;
  role: 'Observed' | 'Assisted' | 'Performed Independently';
  supervisor: string;
  status: 'VERIFIED' | 'PENDING_FACULTY';
}

const SAMPLE_LOGS: ProcedureLogEntry[] = [
  {
    id: 'proc-1',
    date: '2026-08-28',
    procedureName: 'Bag-Valve-Mask Ventilation & Endotracheal Intubation',
    domain: 'Allopathic / Anesthesiology',
    competencyCode: 'AS-4.2 (NMC CBME)',
    role: 'Performed Independently',
    supervisor: 'Dr. A. Nambiar, MD, DNB',
    status: 'VERIFIED'
  },
  {
    id: 'proc-2',
    date: '2026-08-27',
    procedureName: 'Inferior Alveolar Nerve Block (IANB)',
    domain: 'Dental / Oral Surgery',
    competencyCode: 'OS-2.1 (DCI CBME)',
    role: 'Performed Independently',
    supervisor: 'Dr. R. Deshmukh, MDS',
    status: 'VERIFIED'
  },
  {
    id: 'proc-3',
    date: '2026-08-25',
    procedureName: 'Panchakarma Nasya & Shirodhara Administration',
    domain: 'AYUSH / Ayurveda',
    competencyCode: 'PK-3.4 (NCISM CBME)',
    role: 'Assisted',
    supervisor: 'Vaidya S. Bhatt, MD (Ayu)',
    status: 'VERIFIED'
  },
  {
    id: 'proc-4',
    date: '2026-08-22',
    procedureName: 'Arterial Blood Gas (ABG) Radial Puncture',
    domain: 'Nursing / Critical Care',
    competencyCode: 'NC-5.1 (INC CBME)',
    role: 'Performed Independently',
    supervisor: 'Sr. Mary Kurian, MSc Nursing',
    status: 'VERIFIED'
  }
];

export default function LogbookPDFExport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`${styles.logbookContainer} ${styles.printableArea}`}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span style={{ fontSize: '1.75rem' }}>📑</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>CBME Accredited E-Logbook & Clinical Portfolio</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>NMC / DCI / INC / NCISM / PCI Statutory Competency Portfolio</p>
          </div>
          <span className={styles.badge}>Official Academic Transcript</span>
        </div>

        <button type="button" className={styles.exportBtn} onClick={handlePrint}>
          <span>🖨️</span> Export Official PDF
        </button>
      </div>

      <div className={styles.studentMetaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Candidate Name</span>
          <span className={styles.metaVal}>Dr. Shriganesh Choudhari</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Institutional Roll No</span>
          <span className={styles.metaVal}>MED-2026-UG-0842</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Academic Term</span>
          <span className={styles.metaVal}>Final Professional Part II (2026)</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Verified Procedures</span>
          <span className={styles.metaVal} style={{ color: '#34d399' }}>4 of 4 Verified (100%)</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.logTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Clinical Procedure</th>
              <th>Council Competency</th>
              <th>Level of Autonomy</th>
              <th>Supervisor Sign-Off</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_LOGS.map(log => (
              <tr key={log.id}>
                <td>{log.date}</td>
                <td>
                  <strong>{log.procedureName}</strong>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{log.domain}</div>
                </td>
                <td><code>{log.competencyCode}</code></td>
                <td>{log.role}</td>
                <td>{log.supervisor}</td>
                <td>
                  <span className={`${styles.statusPill} ${log.status === 'VERIFIED' ? styles.verified : styles.pending}`}>
                    {log.status === 'VERIFIED' ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
