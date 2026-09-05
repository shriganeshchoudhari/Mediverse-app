import React from 'react';
import Link from 'next/link';
import { Activity, Wind, Brain, Droplets, FlaskConical, Stethoscope, Gauge, Heart, Radio, Microscope, Baby, Flame, Dna } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Physiology Labs & Solvers | Mediverse',
  description: 'Interactive mathematical simulation engines for cardiovascular, respiratory, renal, and electrophysiology systems.',
};

const SIMULATORS = [
  {
    id: 'lifelike-heart',
    title: 'Photorealistic Living Heart 3D',
    description: 'Explore living biological tissue shaders, dual-phase Wiggers pumping, apical wringing torsion, and cross-sectional dissection.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: '3D Biomechanics',
    status: 'Available'
  },
  {
    id: 'acid-base',
    title: 'Acid-Base & Davenport Nomogram',
    description: 'Solve Henderson-Hasselbalch, analyze Anion Gap & Winter\'s compensation, and explore live 2D Davenport buffer lines.',
    icon: <FlaskConical className="w-7 h-7 text-teal-400" />,
    badge: 'Acid-Base Engine',
    status: 'Available'
  },
  {
    id: 'lab-interpretation',
    title: 'Diagnostic Lab & Blood Gas (ABG/VBG) Solver',
    description: 'Solve complex multi-disorder acid-base disturbances, Winter\'s formula, Delta-Delta ratios, microcytic/macrocytic anemia, osmolar gap, and 1:1 coagulation mixing studies.',
    icon: <Microscope className="w-7 h-7 text-emerald-400" />,
    badge: 'Diagnostic Laboratory',
    status: 'Available'
  },
  {
    id: 'mechanical-ventilation',
    title: 'Mechanical Ventilation & Respiratory Mechanics',
    description: 'Equation of motion solver: VCV/PCV waveforms, inspiratory hold mechanics (Pplat, Raw, Cstat), driving pressure, auto-PEEP, and ARDSNet PBW lung-protective titration.',
    icon: <Wind className="w-7 h-7 text-cyan-400" />,
    badge: 'Critical Care ICU',
    status: 'Available'
  },
  {
    id: 'pediatric-resuscitation',
    title: 'Pediatric & Neonatal Resuscitation (PALS / NRP)',
    description: 'Broselow tape weight estimation, pediatric endotracheal sizing, PALS weight-based emergency drug calculator, and NRP Golden Minute APGAR scoring.',
    icon: <Baby className="w-7 h-7 text-rose-400" />,
    badge: 'Pediatric Emergency',
    status: 'Available'
  },
  {
    id: 'cpet',
    title: 'Cardiopulmonary Exercise Testing (CPET)',
    description: 'Wasserman 9-panel diagnostic workstation: VO2 peak, anaerobic threshold (V-slope), ventilatory efficiency (VE/VCO2 slope), O2 pulse kinetics, breathing reserve, and exercise limitation classification.',
    icon: <Flame className="w-7 h-7 text-amber-400" />,
    badge: 'Metabolic Ergometry',
    status: 'Available'
  },
  {
    id: 'anesthesia-machine',
    title: 'Anesthesia Delivery & Vaporizer Workstation',
    description: 'Circle breathing system physics, Link-25 hypoxic guard, low-flow anesthesia kinetics, age-adjusted MAC, FA/FI uptake curves, CO2 absorber exhaustion, and Malignant Hyperthermia Dantrolene protocol.',
    icon: <Gauge className="w-7 h-7 text-amber-400" />,
    badge: 'Anesthesiology & Critical Care',
    status: 'Available'
  },
  {
    id: 'pharmacogenomics',
    title: 'Clinical Pharmacogenomics (PGx) & Precision Therapeutics',
    description: 'Star allele diplotype calling, CPIC Level 1A CDS rules (Clopidogrel, Codeine, 6-MP, 5-FU, Abacavir HLA-B*57:01), IWPC precision warfarin dosing, and 14-day INR kinetics.',
    icon: <Dna className="w-7 h-7 text-indigo-400" />,
    badge: 'Precision Therapeutics',
    status: 'Available'
  },
  {
    id: 'crrt',
    title: 'Continuous Renal Replacement Therapy (CRRT)',
    description: 'Extracorporeal blood purification: SCUF, CVVH, CVVHD, CVVHDF, TMP & filter clotting hydraulics, KDIGO effluent dosing, and regional citrate anticoagulation.',
    icon: <Droplets className="w-7 h-7 text-sky-400" />,
    badge: 'Critical Care Nephrology',
    status: 'Available'
  },
  {
    id: 'cardiac-cycle',
    title: 'Cardiac Cycle & PV Loop',
    description: 'Manipulate preload, afterload, and contractility to instantly visualize Suga-Sagawa pressure-volume loops and Wiggers dynamics.',
    icon: <Activity className="w-7 h-7 text-rose-400" />,
    badge: 'Hemodynamics',
    status: 'Available'
  },
  {
    id: 'renal-filtration',
    title: 'Renal Clearance & GFR',
    description: 'Adjust afferent/efferent arteriole resistance and observe Starling hydrostatic and oncotic forces on GFR and FeNa.',
    icon: <Droplets className="w-7 h-7 text-emerald-400" />,
    badge: 'Renal Kinetics',
    status: 'Available'
  },
  {
    id: 'respiratory-vq',
    title: 'V/Q Mismatch & Gas Exchange',
    description: 'Model ventilation-perfusion matching, physiological dead space, right-to-left shunt, and the Alveolar Gas Equation.',
    icon: <Wind className="w-7 h-7 text-sky-400" />,
    badge: 'Pulmonary Gas',
    status: 'Available'
  },
  {
    id: 'spirometry',
    title: 'Spirometry & Airway Mechanics',
    description: 'Simulate obstructive and restrictive pulmonary pathologies by adjusting airway radius, chest wall compliance, and FEV1/FVC.',
    icon: <Gauge className="w-7 h-7 text-blue-400" />,
    badge: 'Ventilatory Mechanics',
    status: 'Available'
  },
  {
    id: 'nerve-muscle',
    title: 'Nerve-Muscle Electrophysiology',
    description: 'Compute Goldman-Hodgkin-Katz membrane potentials and model nerve action potential conduction and muscle twitch summation.',
    icon: <Brain className="w-7 h-7 text-amber-400" />,
    badge: 'Biophysics',
    status: 'Available'
  },
  {
    id: 'patient-emergency',
    title: 'Emergency Resuscitation Simulator',
    description: 'Manage critically ill patients in acute cardiogenic shock, septic vasodilatation, and severe hypoxemic respiratory failure.',
    icon: <Stethoscope className="w-7 h-7 text-red-400" />,
    badge: 'Critical Care Lab',
    status: 'Available'
  },
  {
    id: 'pharmacokinetics',
    title: 'Pharmacokinetics PK/PD & TDM Solver',
    description: 'Two-compartment Bateman PK model: plot plasma concentration curves, compute Cmax, AUC, Tmax across IV/Oral/IM routes with MTC/MEC safety windows.',
    icon: <FlaskConical className="w-7 h-7 text-violet-400" />,
    badge: 'Drug Kinetics',
    status: 'Available'
  },
  {
    id: 'ecg-rhythm',
    title: '12-Lead ECG Rhythm Simulator',
    description: 'Synthesize PQRST waveforms with adjustable PR, QRS, QT intervals. Identify normal sinus, AF, STEMI, LBBB, and bradycardia patterns.',
    icon: <Activity className="w-7 h-7 text-green-400" />,
    badge: 'Electrocardiology',
    status: 'Available'
  },
  {
    id: 'hemodynamics-shock',
    title: 'Hemodynamic Shock Classifier',
    description: 'Input Swan-Ganz catheter data (CO, SVR, PCWP, CVP, SvO₂) to auto-classify shock phenotype with treatment guidance and radar fingerprint.',
    icon: <Stethoscope className="w-7 h-7 text-orange-400" />,
    badge: 'Critical Care',
    status: 'Available'
  },
  {
    id: 'clinical-case-branching',
    title: 'Clinical Case Branching & AI OSCE Evaluator',
    description: 'Interactive multi-branch patient encounters: manage acute RV STEMI, febrile neutropenia, dynamic hemodynamics, and receive 5-dimension AI rubric scoring with Attending Viva.',
    icon: <Brain className="w-7 h-7 text-indigo-400" />,
    badge: 'OSCE Clinical Exam',
    status: 'Available'
  },
  {
    id: 'icu-telemetry',
    title: 'ICU Central Telemetry Station',
    description: 'Multi-bed real-time physiological waveforms (Lead II ECG, Pleth, Art Line), crisis alarm surveillance, 6-second caliper strips, and emergency bedside interventions.',
    icon: <Activity className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Critical Care Telemetry',
    status: 'Available'
  },
  {
    id: 'pocus',
    title: 'Point-of-Care Ultrasound (POCUS) Station',
    description: 'Virtual sonography: eFAST trauma survey, BLUE pleural protocol, 2D B-mode sector & M-mode sweeps, tissue attenuation physics, and electronic caliper mm measurement.',
    icon: <Radio className="w-7 h-7 text-sky-400" />,
    badge: 'Acute Care Sonography',
    status: 'Available'
  }
];

export default function SimulatorsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <div className="text-blue-400 text-xs font-bold tracking-wider uppercase mb-2">
            Mathematical Engines &amp; Simulation Solvers
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Virtual Physiology Labs
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            Experience physiology in motion. Our interactive simulators allow you to manipulate key physiological variables and instantly compute real-time mathematical, biophysical, and clinical outcomes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIMULATORS.map((sim) => (
            <Link 
              key={sim.id} 
              href={`/simulators/${sim.id}`}
              className="group flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    {sim.icon}
                  </div>
                  <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[11px] font-bold rounded-md border border-blue-500/20">
                    {sim.badge}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {sim.title}
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {sim.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Interactive Engine
                </span>
                <span className="text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                  Launch Lab →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
