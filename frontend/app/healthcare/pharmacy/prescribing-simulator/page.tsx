import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Stethoscope, ShieldCheck, Award, Sparkles, BookOpen } from 'lucide-react';
import PrescriptionSimulator from '@/components/pharmacy/PrescriptionSimulator';

export const metadata: Metadata = {
  title: 'Clinical Prescribing Simulator | Pharmacy & Medicine | Mediverse',
  description:
    'Interactive clinical prescribing simulation engine evaluating patient case scenarios, renal dosing adjustments, allergy contraindications, and Miller-level competency grading.',
};

export default function PrescribingSimulatorPage() {
  return (
    <main className="min-h-screen bg-[#070b13] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/healthcare/pharmacy"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400 hover:text-cyan-400 transition group px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Pharmacy & Pharmacotherapy Hub
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Healthcare</span>
            <span>/</span>
            <span>Pharmacy</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Prescribing Simulator</span>
          </div>
        </div>

        {/* Page Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Stethoscope className="w-3.5 h-3.5" />
                Experiential Clinical Training
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Sentinel Safety Checking
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Award className="w-3.5 h-3.5" />
                Miller Competency Rubrics
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Clinical Prescribing & Pharmacotherapy Simulator
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-4xl leading-relaxed">
              Practice real-time clinical prescribing decisions for complex, multi-morbid patients. Formulate comprehensive pharmacological regimens, adjust doses for organ dysfunction (eGFR / CrCl), avoid dangerous allergenic triggers, and receive objective Miller-level debrief scores with guideline-directed feedback.
            </p>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <PrescriptionSimulator />
      </div>
    </main>
  );
}
