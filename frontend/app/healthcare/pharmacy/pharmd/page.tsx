import React from 'react';
import { PHARMD_CURRICULUM, PHARMD_METADATA } from '../../../../lib/curriculum/pharmdCurriculumScaffold';
import { PCICompetencyMap } from '../../../../components/pharmacy/PCICompetencyMap';
import styles from './pharmd.module.css';

export default function PharmDPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{PHARMD_METADATA.programName} ({PHARMD_METADATA.abbreviation})</h1>
      <p>Duration: {PHARMD_METADATA.duration} | {PHARMD_METADATA.regulatoryBody}</p>

      <h2>Quick Launch Simulators</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button>PK/PD Simulation</button>
        <button>TDM Dashboard</button>
        <button>Drug Interaction Checker</button>
        <button>Pharmacovigilance Reports</button>
      </div>

      <h2>Curriculum Viewer</h2>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {PHARMD_CURRICULUM.map(year => (
          <div key={year.year} style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
            <h3>{year.title}</h3>
            {year.subjects.map(sub => (
              <div key={sub.id} style={{ marginBottom: '1rem' }}>
                <strong>{sub.name}</strong> ({sub.code})
                <ul>
                  {sub.lessons.map(l => (
                    <li key={l.id}>{l.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem' }}>PCI Competency Map</h2>
      <details>
        <summary>View Matrix</summary>
        <PCICompetencyMap />
      </details>
    </div>
  );
}
