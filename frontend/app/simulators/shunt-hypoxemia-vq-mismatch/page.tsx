import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Wind, ShieldCheck, Activity, BookOpen, Stethoscope } from 'lucide-react';
import ShuntHypoxemiaSimulator from '@/components/simulators/ShuntHypoxemiaSimulator';

export const metadata: Metadata = {
  title: 'Hypoxemic & Hypercapnic Respiratory Failure Workstation | Mediverse',
  description:
    'Interactive pulmonology and critical care workstation modeling the Alveolar Gas Equation, A-a gradient, classic Berggren shunt fraction (Qs/Qt), 5 mechanisms of hypoxemia, and DO2/VO2 oxygen transport dynamics.',
  keywords: [
    'Shunt Fraction',
    'Qs/Qt',
    'Berggren Equation',
    'Alveolar Gas Equation',
    'A-a Gradient',
    'Hypoxemia Mechanisms',
    'V/Q Mismatch',
    'ARDS Berlin Definition',
    'Oxygen Delivery DO2',
    'Oxygen Consumption VO2',
    'Hyperoxia Test'
  ]
};

export default function ShuntHypoxemiaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation & Breadcrumbs */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/simulators"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors p-2 rounded-lg hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Simulators
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950 text-sky-400 border border-sky-800">
                Track A70 &bull; Grand Capstone
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Critical Care &amp; Pulmonology
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Berggren Verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Workstation Component */}
      <main className="py-6 sm:py-8">
        <ShuntHypoxemiaSimulator />
      </main>

      {/* Clinical Evidence & Reference Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-400 space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Foundational Literature &amp; Practice Standards
          </div>
          <p className="leading-relaxed text-slate-400">
            Engineered in strict accordance with the classic Berggren shunt formulation (1942), the ARDS Berlin Definition (JAMA 2012), 
            the ARDSNet Low Tidal Volume protocol (NEJM 2000), the PROSEVA trial (NEJM 2013), and standard respiratory physiology treatises (West&apos;s Respiratory Physiology). 
            Intended exclusively for medical education, intensive care residency training, and physiological research simulations.
          </p>
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-900 text-[11px] text-slate-400">
            <span>&copy; {new Date().getFullYear()} Mediverse Medical Simulation Platform</span>
            <span>Grand Capstone Complete &bull; 203 Production Routes Milestone</span>
          </div>
        </div>
      </footer>
    </div>
  );
}