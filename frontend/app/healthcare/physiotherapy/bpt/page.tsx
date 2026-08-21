import React from 'react';
import { BPT_CURRICULUM, BPT_METADATA } from '../../../../lib/curriculum/bptCurriculumScaffold';
import IAPCompetencyMap from '../../../../components/physiotherapy/IAPCompetencyMap';

export default function BPTPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>{BPT_METADATA.programName} ({BPT_METADATA.abbreviation})</h1>
      <p>{BPT_METADATA.duration} - {BPT_METADATA.regulatoryBody}</p>

      <section style={{ margin: '20px 0' }}>
        <h2>Simulators Quick Launch</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button>Goniometry Simulator</button>
          <button>Gait Analysis Simulator</button>
          <button>Electrotherapy (TENS) Simulator</button>
          <button>Pulmonary Rehab Simulator</button>
        </div>
      </section>

      <section>
        <h2>Curriculum Years</h2>
        {BPT_CURRICULUM.map(year => (
          <div key={year.year} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>{year.title}</h3>
            <p>{year.description}</p>
            <ul>
              {year.subjects.map(sub => (
                <li key={sub.id}>
                  <strong>{sub.name}</strong> ({sub.code})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>IAP Competency Map</h2>
        <IAPCompetencyMap />
      </section>
    </div>
  );
}
