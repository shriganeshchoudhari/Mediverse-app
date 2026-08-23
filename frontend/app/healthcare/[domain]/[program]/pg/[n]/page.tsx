"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowLeft, Award, Clock, ArrowRight, Activity, ShieldCheck } from "lucide-react";

interface PGTrackMetadata {
  n: number;
  title: string;
  specialty: string;
  icon: string;
  focusAreas: string[];
  sampleModules: Array<{ id: string; title: string; minutes: number }>;
}

const PG_TRACKS: Record<number, PGTrackMetadata> = {
  1: {
    n: 1,
    title: "Postgraduate Track 1: Advanced Cardiology & Invasive Hemodynamics",
    specialty: "Cardiology",
    icon: "🫀",
    focusAreas: ["Swan-Ganz Profiling", "Wiggers Valvular Loop Diagnostics", "ACLS Cardiac Arrest Algorithms", "Interventional Hemodynamics"],
    sampleModules: [
      { id: "pg1-cardiovascular-adv", title: "Wiggers Diagram & Valvular Loop Shifts", minutes: 50 },
      { id: "pg1-hemodynamics", title: "Invasive Shock Profiling & Swan-Ganz Catheterization", minutes: 45 }
    ]
  },
  2: {
    n: 2,
    title: "Postgraduate Track 2: Advanced Pulmonology & Critical Care Ventilation",
    specialty: "Pulmonology",
    icon: "🫁",
    focusAreas: ["Mechanical Ventilation Modes", "ARDS ARDSNet Protocol", "V/Q Mismatch & Shunt Mechanics", "Capnography Interpretation"],
    sampleModules: [
      { id: "pg2-pulmonology-adv", title: "Mechanical Ventilation & Driving Pressure Optimization", minutes: 50 },
      { id: "pg2-ards", title: "ARDS Pathophysiology & Prone Positioning", minutes: 45 }
    ]
  },
  3: {
    n: 3,
    title: "Postgraduate Track 3: Gastroenterology & Advanced Hepatology",
    specialty: "Gastroenterology",
    icon: "🔬",
    focusAreas: ["Acute Liver Failure Management", "Portal Hypertension & Variceal Bleeding", "Inflammatory Bowel Disease Biologics", "Pancreatitis Severity Scoring"],
    sampleModules: [
      { id: "pg3-gastroenterology-adv", title: "Portal Hypertension & Decompensated Cirrhosis", minutes: 50 },
      { id: "pg3-pancreatitis", title: "Acute Pancreatitis Atlanta Classification", minutes: 45 }
    ]
  },
  4: {
    n: 4,
    title: "Postgraduate Track 4: Advanced Nephrology & Renal Replacement Therapy",
    specialty: "Nephrology",
    icon: "🧪",
    focusAreas: ["CRRT Prescription & Clearance", "Stewart Acid-Base Approach", "Glomerulonephritis Biopsy Pathology", "Refractory Hyperkalemia Management"],
    sampleModules: [
      { id: "pg4-nephrology-adv", title: "Continuous Renal Replacement Therapy (CRRT) Modes", minutes: 50 },
      { id: "pg4-acid-base", title: "Complex Mixed Acid-Base Disorders", minutes: 45 }
    ]
  },
  5: {
    n: 5,
    title: "Postgraduate Track 5: Neurology & Acute Stroke Interventions",
    specialty: "Neurology",
    icon: "🧠",
    focusAreas: ["Acute Ischemic Stroke Thrombolysis (rtPA/TNK)", "Mechanical Thrombectomy Indications", "Status Epilepticus Protocol", "Brain Death Determination"],
    sampleModules: [
      { id: "pg5-neurology-adv", title: "Acute Stroke Pathway & ASPECTS Scoring", minutes: 50 },
      { id: "pg5-epilepsy", title: "Refractory Status Epilepticus Protocols", minutes: 45 }
    ]
  },
  6: {
    n: 6,
    title: "Postgraduate Track 6: Endocrinology & Metabolic Crises",
    specialty: "Endocrinology",
    icon: "⚡",
    focusAreas: ["DKA vs HHS Protocolized Management", "Myxedema Coma & Thyroid Storm", "Adrenal Insufficiency Crisis", "Pheochromocytoma Blockade"],
    sampleModules: [
      { id: "pg6-endocrinology-adv", title: "Diabetic Ketoacidosis Protocolized Insulin Infusion", minutes: 50 },
      { id: "pg6-adrenal", title: "Acute Adrenal Crisis Diagnosis & Hydrocortisone Dosing", minutes: 45 }
    ]
  },
  7: {
    n: 7,
    title: "Postgraduate Track 7: Hematology & Oncology Protocols",
    specialty: "Hematology & Oncology",
    icon: "🩸",
    focusAreas: ["Massive Transfusion Protocol (MTP)", "Febrile Neutropenia Pathways", "Tumor Lysis Syndrome Prophylaxis", "CAR-T Cell Cytokine Release Syndrome"],
    sampleModules: [
      { id: "pg7-hematology-adv", title: "Massive Transfusion Protocol & Viscoelastic TEG", minutes: 50 },
      { id: "pg7-oncology", title: "Tumor Lysis Syndrome & Rasburicase Protocols", minutes: 45 }
    ]
  },
  8: {
    n: 8,
    title: "Postgraduate Track 8: Rheumatology & Clinical Immunology",
    specialty: "Rheumatology",
    icon: "🧬",
    focusAreas: ["Systemic Lupus Erythematosus Nephritis", "ANCA-Associated Vasculitis", "Biologic DMARD Selection", "Macrophage Activation Syndrome"],
    sampleModules: [
      { id: "pg8-rheumatology-adv", title: "Lupus Nephritis Classification & Induction Regimens", minutes: 50 },
      { id: "pg8-vasculitis", title: "Small Vessel Vasculitis & Plasma Exchange", minutes: 45 }
    ]
  },
  9: {
    n: 9,
    title: "Postgraduate Track 9: Infectious Diseases & Antimicrobial Stewardship",
    specialty: "Infectious Diseases",
    icon: "🦠",
    focusAreas: ["Sepsis-3 Bundles", "MDR Gram-Negative Pathogen Regimens", "Invasive Fungal Infections", "HIV Opportunistic Infections"],
    sampleModules: [
      { id: "pg9-infectious-adv", title: "Surviving Sepsis Campaign 1-Hour Bundle", minutes: 50 },
      { id: "pg9-antimicrobial", title: "PK/PD Target Attainment for Beta-Lactams", minutes: 45 }
    ]
  },
  10: {
    n: 10,
    title: "Postgraduate Track 10: Critical Care & Resuscitation",
    specialty: "Critical Care",
    icon: "🚨",
    focusAreas: ["Difficult Airway Algorithms", "Point-of-Care Ultrasound (POCUS/RUSH)", "Extracorporeal Membrane Oxygenation (ECMO)", "Vasopressor & Inotrope Selection"],
    sampleModules: [
      { id: "pg10-critical-care-adv", title: "RUSH Exam & POCUS Hemodynamic Assessment", minutes: 50 },
      { id: "pg10-ecmo", title: "VA vs VV ECMO Cannulation & Circuit Physics", minutes: 50 }
    ]
  },
  11: {
    n: 11,
    title: "Postgraduate Track 11: Medical Ethics, Legal Medicine & Research",
    specialty: "Ethics & Legal Medicine",
    icon: "⚖️",
    focusAreas: ["Informed Consent & Capacity", "End-of-Life Decisions & DNR", "Clinical Trial Design & GCP", "Medical Malpractice & Negligence Law"],
    sampleModules: [
      { id: "pg11-ethics-adv", title: "AETCOM Competencies & Clinical Decision Making", minutes: 45 },
      { id: "pg11-research", title: "Good Clinical Practice (GCP) & Bioethics", minutes: 45 }
    ]
  },
  12: {
    n: 12,
    title: "Postgraduate Track 12: Nuclear Medicine & Diagnostic Radiology",
    specialty: "Radiology & Nuclear Medicine",
    icon: "☢️",
    focusAreas: ["PET-CT FDG Metabolism", "SPECT Myocardial Perfusion", "Theranostics (Lutetium-177 PSMA)", "Radiation Protection Protocols"],
    sampleModules: [
      { id: "pg12-nuclear-adv", title: "FDG PET-CT Oncologic Staging & SUVmax", minutes: 50 },
      { id: "pg12-theranostics", title: "Targeted Radionuclide Therapy Protocols", minutes: 45 }
    ]
  }
};

export default function DynamicPostgraduateTrackPage() {
  const params = useParams();
  const router = useRouter();

  const domain = (params.domain as string) || "allopathic";
  const program = (params.program as string) || "md-ms";
  const trackNumber = parseInt(params.n as string, 10) || 1;

  const track = PG_TRACKS[trackNumber] || PG_TRACKS[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <Link
            href={`/healthcare/${domain}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <ArrowLeft size={14} /> Back to Postgraduate Residency Hub
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={14} /> Postgraduate Residency Track {track.n} / 12
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span>{track.icon}</span> {track.title}
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl mt-2 leading-relaxed">
                Advanced clinical competency training, evidence-based guidelines, and simulation modules for {track.specialty} specialists.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="px-4 py-2 rounded-xl bg-indigo-950/60 border border-indigo-800 text-xs font-semibold text-indigo-300">
                NMC Super-Specialty Aligned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Areas & Curriculum Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Core Clinical Focus Areas */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award size={18} className="text-indigo-400" /> Core Clinical Focus Areas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {track.focusAreas.map((area, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-indigo-400">DOMAIN {idx + 1}</div>
                <div className="text-sm font-semibold text-slate-200">{area}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Modules List */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-400" /> Interactive Curriculum Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {track.sampleModules.map((mod) => (
              <Link
                key={mod.id}
                href={`/healthcare/${domain}/md-ms/${mod.id}/${mod.id}`}
                className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-indigo-400">CLINICAL MODULE</span>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                    {mod.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {mod.minutes} mins
                  </span>
                  <span className="text-indigo-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition">
                    Study Module <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Switcher */}
        <section className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-300">All 12 Postgraduate Tracks</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(PG_TRACKS).map((t) => (
              <Link
                key={t.n}
                href={`/healthcare/${domain}/${program}/pg/${t.n}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                  t.n === track.n
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.icon} PG {t.n}: {t.specialty}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
