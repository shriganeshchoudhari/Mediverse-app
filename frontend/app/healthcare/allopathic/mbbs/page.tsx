import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, BookOpen, ArrowLeft, ArrowRight, ShieldCheck, Layers, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MBBS Curriculum Portal | 19 Disciplines | Mediverse',
  description: 'Full 5.5-year MBBS undergraduate curriculum across 19 disciplines and 4 CBME professional phases with 3D anatomical dissection and simulation solvers.',
};

const MBBS_PHASES = [
  {
    phase: 'Phase 1: Pre-Clinical (Year 1)',
    duration: '13 Months',
    focus: 'Normal structure, cellular biochemistry, and organ physiology',
    subjects: [
      { code: 'ANAT-101', name: 'Human Anatomy & Histology', route: '/dissection', icon: '🦴', description: 'Gross anatomy, embryology, histology, neuroanatomy, and regional 3D dissection.' },
      { code: 'PHYS-101', name: 'Human Medical Physiology', route: '/physiology', icon: '⚡', description: 'Membrane biophysics, cardiac PV loops, respiratory mechanics, and renal clearance.' },
      { code: 'BIOC-101', name: 'Medical Biochemistry & Molecular Biology', route: '/metabolism', icon: '🧪', description: 'Metabolic pathways, enzyme kinetics, genetic code, and inborn errors of metabolism.' },
    ],
  },
  {
    phase: 'Phase 2: Para-Clinical (Year 2)',
    duration: '11 Months',
    focus: 'Mechanisms of disease, rational pharmacotherapy, microbiology, and forensic laws',
    subjects: [
      { code: 'PATH-201', name: 'Pathology & Hematology', route: '/pathology', icon: '🔬', description: 'General pathology, cellular injury, systemic pathology, neoplasia, and virtual microscopy.' },
      { code: 'PHARM-201', name: 'Pharmacology & Therapeutics', route: '/pharmacology', icon: '💊', description: 'Pharmacokinetics, autonomic drugs, antimicrobial chemotherapy, and receptor dynamics.' },
      { code: 'MICR-201', name: 'Medical Microbiology & Immunology', route: '/microbiology', icon: '🧫', description: 'Bacteriology, virology, mycology, parasitology, immunology, and infection control.' },
      { code: 'FMT-201', name: 'Forensic Medicine & Toxicology', route: '/forensic', icon: '⚖️', description: 'Thanatology, medical jurisprudence, legal autopsy, and emergency clinical toxicology.' },
    ],
  },
  {
    phase: 'Phase 3 Part 1: Clinical Specialties (Year 3)',
    duration: '12 Months',
    focus: 'Specialty organ systems and public health stewardship',
    subjects: [
      { code: 'COMM-301', name: 'Community Medicine & Public Health', route: '/community', icon: '🌐', description: 'Epidemiology, biostatistics, National Health Programs, and environmental health.' },
      { code: 'ENT-301', name: 'Otorhinolaryngology (ENT)', route: '/ent', icon: '👂', description: 'Otology, rhinology, laryngology, tuning fork tests, and tracheostomy procedures.' },
      { code: 'OPHTH-301', name: 'Ophthalmology', route: '/ophthalmology', icon: '👁️', description: 'Vision optics, glaucoma, cataract surgery, retinal disorders, and visual fields.' },
      { code: 'FM-301', name: 'Family Medicine & Primary Care', route: '/fam', icon: '🏡', description: 'Comprehensive primary care, chronic disease management, and preventive medicine.' },
    ],
  },
  {
    phase: 'Phase 3 Part 2: Major Clinical Disciplines (Year 4)',
    duration: '18 Months',
    focus: 'Inpatient bedside diagnosis, operative surgery, critical care, and emergency triage',
    subjects: [
      { code: 'MED-401', name: 'General Medicine & Sub-specialties', route: '/medicine', icon: '🩺', description: 'Cardiology, nephrology, neurology, pulmonology, endocrinology, and infectious disease.' },
      { code: 'SURG-401', name: 'General Surgery & Allied Disciplines', route: '/surgery', icon: '🔪', description: 'Trauma resuscitation, acute abdomen, surgical oncology, wound healing, and laparoscopy.' },
      { code: 'OBGYN-401', name: 'Obstetrics & Gynaecology', route: '/obgyn', icon: '🤰', description: 'Antenatal care, labor partograph, high-risk obstetrics, and gynaecological oncology.' },
      { code: 'PEDI-401', name: 'Pediatrics & Neonatology', route: '/pediatrics', icon: '👶', description: 'Developmental milestones, immunization, neonatal resuscitation, and pediatric emergency.' },
      { code: 'ORTH-401', name: 'Orthopedics & Traumatology', route: '/orthopedics', icon: '🦴', description: 'Fracture fixation principles, joint replacements, traction, and musculoskeletal trauma.' },
      { code: 'DERM-401', name: 'Dermatology, Venereology & Leprosy', route: '/dermatology', icon: '🩹', description: 'Cutaneous eruptions, autoimmune bullous diseases, sexually transmitted infections, and STI control.' },
      { code: 'PSYCH-401', name: 'Psychiatry & Behavioral Sciences', route: '/psychiatry', icon: '🧠', description: 'Psychopathology, mood disorders, schizophrenia, addiction medicine, and psychopharmacology.' },
      { code: 'ANES-401', name: 'Anesthesiology & Critical Care', route: '/anesthesiology', icon: '💉', description: 'Airway assessment, mechanical ventilation, general & regional anesthesia, and CPR.' },
      { code: 'RAD-401', name: 'Radio-Diagnosis & Imaging', route: '/radiology', icon: '📡', description: 'Chest X-ray interpretation, CT windowing, MRI pulse sequences, and FAST ultrasound.' },
      { code: 'OSCE-403', name: 'OSCE & Practical Clinical Stations', route: '/osce', icon: '🎯', description: 'Objective Structured Clinical Exam stations with examiner rubrics and scoring.' },
      { code: 'AETCOM-101', name: 'AETCOM (Ethics & Communication)', route: '/aetcom', icon: '📜', description: 'NMC CBME Attitude, Ethics, Communication, and medico-legal consent modules.' },
    ],
  },
];

export default function MbbsCurriculumPage() {
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
                <Sparkles size={14} className="inline mr-1" /> Undergraduate Medical Curriculum
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                NMC CBME COMPLIANT
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Bachelor of Medicine & Bachelor of Surgery (MBBS)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Complete 5.5-year competency-based undergraduate medical curriculum covering all 19 preclinical, paraclinical, and clinical disciplines with 3D dissection, clinical simulations, and AI tutoring.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/healthcare/allopathic/md-ms"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition"
            >
              MD / MS Residency Portal →
            </Link>
            <Link
              href="/exam"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition"
            >
              Start Clinical Exam
            </Link>
          </div>
        </div>
      </div>

      {/* Curriculum Phases & Subjects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-12">
        {MBBS_PHASES.map((phase, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> {phase.phase}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{phase.focus}</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold self-start sm:self-auto">
                ⏱️ {phase.duration}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {phase.subjects.map((sub) => (
                <Link
                  key={sub.code}
                  href={sub.route}
                  className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-850/80 transition-all duration-300 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl">{sub.icon}</span>
                      <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {sub.code}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                    Enter Subject Lab <ArrowRight size={14} className="ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
