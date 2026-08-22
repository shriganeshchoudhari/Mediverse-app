import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Stethoscope, ArrowLeft, ArrowRight, Activity, Shield, HeartPulse, Brain, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MD / MS Postgraduate Residency Tracks | Mediverse',
  description: '12 postgraduate super-specialty residency tracks covering Critical Care, Cardiology, Neurology, Pulmonology, and Emergency Medicine on Mediverse.',
};

const RESIDENCY_TRACKS = [
  {
    id: 'pg-critical-care',
    code: 'PG-CCM',
    title: 'MD Critical Care Medicine & Resuscitation',
    route: '/criticalcare',
    duration: '3 Years',
    regulator: 'NMC / NBE',
    description: 'Advanced ICU hemodynamics, ARDSNet lung-protective ventilation, PiCCO/Swan-Ganz thermodilution, septic shock vasopressor titration, and multi-organ failure management.',
    icon: '🫁',
    tag: 'HIGH YIELD',
  },
  {
    id: 'pg-cardiology',
    code: 'PG-CARD',
    title: 'DM / MD Cardiology & Interventional Hemodynamics',
    route: '/cardiovascular',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Pressure-volume loops, advanced ACLS refractory arrhythmia pacing, transcatheter aortic valve replacement (TAVR), and invasive coronary physiology.',
    icon: '❤️',
    tag: 'ADVANCED LAB',
  },
  {
    id: 'pg-neurology',
    code: 'PG-NEUR',
    title: 'DM / MD Neurology & Stroke Intensive Care',
    route: '/neurology',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Hyperacute ischemic stroke thrombolysis/thrombectomy, continuous EEG monitoring in status epilepticus, neuromuscular junction crisis, and neurotrauma ICP management.',
    icon: '🧠',
    tag: 'HIGH YIELD',
  },
  {
    id: 'pg-pulmonology',
    code: 'PG-PULM',
    title: 'MD Respiratory Medicine & Interventional Pulmonology',
    route: '/pulmonology',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Complex spirometry flow-volume loop interpretation, non-invasive ventilation (BiPAP/CPAP), bronchoscopy, and pleural disease thoracocentesis.',
    icon: '💨',
    tag: 'SIMULATOR BINDING',
  },
  {
    id: 'pg-emergency-medicine',
    code: 'PG-EM',
    title: 'MD Emergency Medicine & Trauma Resuscitation',
    route: '/emergencymedicine',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'ATLS Primary/Secondary survey, ultrasound-guided eFAST, emergency surgical airway (cricothyroidotomy), and massive transfusion protocol.',
    icon: '🚨',
    tag: 'CRITICAL OSCE',
  },
  {
    id: 'pg-nephrology',
    code: 'PG-NEPH',
    title: 'DM / MD Nephrology & Renal Replacement Therapy',
    route: '/nephrology',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Continuous Renal Replacement Therapy (CRRT), acid-base Stewart physicochemical approach, glomerular filtration kinetics, and acute tubular necrosis.',
    icon: '🧪',
    tag: 'INTERACTIVE',
  },
  {
    id: 'pg-gastroenterology',
    code: 'PG-GAST',
    title: 'DM / MD Gastroenterology & Hepatology',
    route: '/gastroenterology',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Acute variceal bleeding band ligation, acute pancreatitis scoring, liver cirrhosis portal hypertension decompensation, and therapeutic endoscopy.',
    icon: '🔬',
    tag: 'CORE TRACK',
  },
  {
    id: 'pg-endocrinology',
    code: 'PG-ENDO',
    title: 'DM / MD Endocrinology & Metabolic Disorders',
    route: '/endocrinology',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Diabetic Ketoacidosis (DKA) algorithmic fluid/potassium management, hyperosmolar hyperglycemic state (HHS), adrenal crisis, and thyroid storm.',
    icon: '⚡',
    tag: 'CORE TRACK',
  },
  {
    id: 'pg-anesthesiology',
    code: 'PG-ANES',
    title: 'MD Anesthesiology & Perioperative Medicine',
    route: '/anesthesiology',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Difficult airway algorithms, ultrasound-guided regional peripheral nerve blocks, target-controlled infusion (TCI), and malignant hyperthermia crisis.',
    icon: '💉',
    tag: 'SIMULATOR BINDING',
  },
  {
    id: 'pg-surgery',
    code: 'PG-SURG',
    title: 'MS General Surgery & Advanced Laparoscopy',
    route: '/surgery',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Emergency laparotomy, damage-control surgery, laparoscopic knot tying, surgical oncology margins, and perioperative Enhanced Recovery After Surgery (ERAS).',
    icon: '🔪',
    tag: 'HIGH YIELD',
  },
  {
    id: 'pg-radiology',
    code: 'PG-RAD',
    title: 'MD Radio-Diagnosis & Interventional Radiology',
    route: '/radiology',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Multidetector CT windowing (Brain, Bone, Lung, Soft Tissue), MRI T1/T2/FLAIR/DWI sequence physics, and image-guided diagnostic biopsies.',
    icon: '📡',
    tag: 'DICOM VIEWER',
  },
  {
    id: 'pg-hematology',
    code: 'PG-HEM',
    title: 'DM / MD Clinical Hematology & Transfusion Medicine',
    route: '/hematology',
    duration: '3 Years',
    regulator: 'NMC',
    description: 'Coagulopathy thromboelastography (TEG/ROTEM), hematologic malignancy flow cytometry, hemoglobinopathies, and stem cell transplantation protocols.',
    icon: '🩸',
    tag: 'CORE TRACK',
  },
];

export default function MdMsResidencyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-blue-950/80 bg-gradient-to-r from-slate-950 via-blue-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link
              href="/healthcare/allopathic"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition mb-3"
            >
              <ArrowLeft size={14} /> Back to Allopathic Medicine
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="inline mr-1" /> Postgraduate Residency Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                12 ACTIVE TRACKS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              MD / MS Postgraduate Residency Tracks
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              NMC-recognized 3-year postgraduate residency curricula across 12 clinical super-specialties with interactive biophysical solvers, ventilator waveforms, and high-yield clinical case vignettes.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/subjects"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition"
            >
              MBBS Undergrad Portal
            </Link>
            <Link
              href="/exam"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition"
            >
              Residency Exam Runner
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Residency Tracks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESIDENCY_TRACKS.map((track) => (
            <Link
              key={track.id}
              href={track.route}
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-850/80 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {track.icon}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                    {track.tag}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-blue-400">{track.code}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mt-0.5">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {track.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  <span>{track.duration}</span> • <span>{track.regulator}</span>
                </div>
                <span className="font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Launch Track <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
