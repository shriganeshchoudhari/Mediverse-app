import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, User, ShieldCheck, BookOpen } from 'lucide-react';
import StandardizedPatientWorkstation from '@/components/simulators/StandardizedPatientWorkstation';

export const metadata: Metadata = {
  title: 'Standardized Patient & Voice AI Telehealth Workstation | Mediverse',
  description:
    'Interactive generative standardized patient simulation workstation. Conduct live verbal patient history interviews, perform bedside physical exams, order STAT diagnostic investigations, and receive automated evidence-based OSCE SOAP note evaluations.',
  keywords: [
    'Standardized Patient',
    'Voice AI Patient',
    'Telehealth Simulator',
    'OSCE Exam Simulator',
    'Clinical History Taking',
    'SOAP Note Grader',
    'Acute Appendicitis',
    'STEMI',
    'Bacterial Meningitis'
  ]
};

export default function TelehealthPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation & Breadcrumbs */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/simulators"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Simulators
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Track B1 &bull; Telehealth &amp; OSCE
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Clinical Simulation &amp; Voice AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              OSCE Validated
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Workstation Component */}
      <main className="py-6 sm:py-8">
        <StandardizedPatientWorkstation />
      </main>

      {/* Clinical Evidence & Reference Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-400 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Pedagogical Standards &amp; Clinical Competency Framework
          </div>
          <p className="leading-relaxed text-slate-400">
            Designed according to the NBME / USMLE Step 2 Clinical Skills (CS) framework, the Association of American Medical Colleges (AAMC) Core Entrustable Professional Activities (EPAs) for Entering Residency, and standard Calgary-Cambridge consultation guides. 
            Features real-time speech-to-text, emotional pitch/speed voice synthesis, and multi-dimensional diagnostic rubrics.
          </p>
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-900 text-[11px] text-slate-400">
            <span>&copy; {new Date().getFullYear()} Mediverse Medical Simulation Platform</span>
            <span>Track B1 Standardized Patient Telehealth Live &bull; 203 Production Routes</span>
          </div>
        </div>
      </footer>
    </div>
  );
}