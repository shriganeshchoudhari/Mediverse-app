import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Wind,
  Compass,
  Layers,
  Radio,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { BronchoscopySimulator } from '@/components/simulators/BronchoscopySimulator';

export const metadata: Metadata = {
  title: 'Flexible Bronchoscopy & EBUS Staging Workstation | Mediverse',
  description:
    'Comprehensive tracheobronchial 18-segment navigation, EBUS mediastinal lymph node staging, transbronchial needle aspiration (TBNA), and massive hemoptysis emergency protocol.',
};

export default function BronchoscopyNavigationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              INTERVENTIONAL PULMONOLOGY
            </span>
            <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
              AABIP / CHEST / IASLC STANDARDS
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <BronchoscopySimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: 18-Segment Tracheobronchial Anatomy */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Compass className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                18-Segment Airway Anatomy &amp; Kinematics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Right Bronchial Tree (10 Segments)
                </strong>
                Right Upper Lobe trifurcates sharply into Apical (B1), Posterior (B2), and Anterior (B3). The Bronchus Intermedius leads into Right Middle Lobe (Lateral B4, Medial B5) and Right Lower Lobe (Superior B6, Medial Basal B7, Anterior Basal B8, Lateral Basal B9, Posterior Basal B10).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Left Bronchial Tree (8 Segments)
                </strong>
                Left main bronchus is longer (~5 cm) and more horizontal. LUL divides into Upper Division (fused Apicoposterior B1+B2, Anterior B3) and Lingula (Superior B4, Inferior B5). LLL branches into Superior B6, fused Anteromedial Basal B7+B8, Lateral B9, and Posterior B10.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Scope Kinematics &amp; Landmarks
                </strong>
                Depth from incisors: 15 cm at vocal cords, 25 cm at main carina, 28-30 cm at secondary lobar carinae. Passing vocal cords during inspiration prevents vocal cord laceration and laryngeal spasm.
              </li>
            </ul>
          </div>

          {/* Card 2: EBUS-TBNA Mediastinal Staging */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-teal-400">
              <Radio className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                EBUS Mediastinal Staging (IASLC Map)
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-teal-300 font-semibold block mb-0.5">
                  N-Stage Hierarchy &amp; Station 7 (Subcarinal)
                </strong>
                Station 7 lies directly beneath the main carina; involvement represents N2 disease for both right and left lung primaries. Stations 2R/2L and 4R/4L represent paratracheal N2 nodes, while Stations 10 and 11 represent hilar/interlobar N1 nodes.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-teal-300 font-semibold block mb-0.5">
                  Color Power Doppler Vascular Rule
                </strong>
                Always interrogate the target with Color Power Doppler prior to needle puncture. The pulmonary artery, aorta, azygos vein, and left atrium lie directly adjacent to mediastinal nodal stations.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-teal-300 font-semibold block mb-0.5">
                  ROSE Cytology Criteria
                </strong>
                Rapid On-Site Evaluation (ROSE) requires adequate representation of lymphocytes to confirm true nodal sampling; cohesive clusters of pleomorphic cells establish metastatic carcinoma.
              </li>
            </ul>
          </div>

          {/* Card 3: Airway Emergencies & Interventions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Airway Emergencies &amp; Procedures
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Massive Hemoptysis Management
                </strong>
                Position patient bleeding lung down to prevent asphyxiation of the healthy lung. Therapeutic sequence: iced saline (4°C) flushes in 50 mL aliquots, topical epinephrine (1:20,000 dilution, max 0.6 mg), and balloon catheter tamponade in the bleeding lobar orifice.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Foreign Body Extraction
                </strong>
                Organic foreign bodies (nuts, seeds) cause rapid chemical inflammation. Avoid crushing friable nuts with standard biopsy forceps; use Dormia wire baskets, rat-tooth forceps, or cryoprobe freeze-adhesion for en bloc removal.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Bronchoalveolar Lavage (BAL) Cellularity
                </strong>
                Wedged in RML or lingula; &gt;40% fluid recovery is necessary. Marked lymphocytosis (&gt;40%) with an inverted CD4/CD8 ratio (&lt;1.0) is diagnostic of Hypersensitivity Pneumonitis, whereas CD4/CD8 &gt;3.5 indicates Sarcoidosis.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
