'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PanchakarmaScheduler from './PanchakarmaScheduler';
import PanchakarmaProcedureViewer from './PanchakarmaProcedureViewer';
import { 
  Calendar, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Flame, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Heart,
  Droplets,
  Wind
} from 'lucide-react';

export default function PanchakarmaGuideClient() {
  const [activeMainTab, setActiveMainTab] = useState<'scheduler' | 'viewer' | 'curriculum'>('scheduler');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header / Hero Section */}
      <div className="border-b border-amber-950/80 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            {/* Breadcrumb navigation */}
            <nav className="text-xs text-slate-400 mb-3 flex items-center gap-2 flex-wrap">
              <Link href="/healthcare" className="text-amber-400 hover:text-amber-300 transition">
                Healthcare Landscape
              </Link>
              <span>/</span>
              <Link href="/healthcare/ayush" className="text-amber-400 hover:text-amber-300 transition">
                AYUSH Systems
              </Link>
              <span>/</span>
              <Link href="/healthcare/ayush/bams" className="text-amber-400 hover:text-amber-300 transition">
                BAMS Curriculum
              </Link>
              <span>/</span>
              <span className="text-slate-300">Panchakarma Guide & Clinical Scheduler</span>
            </nav>

            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-3xl sm:text-4xl">🌿</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NCISM / CCIM BAMS
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  Kayachikitsa & Panchakarma
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Panchakarma Clinical Protocol Designer & Guide
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              Master the classical 5-fold cellular detoxification therapy (शोधन चिकित्सा). Design 7-day, 14-day, and 21-day clinical protocols with Purvakarma oleation titration, Pradhanakarma evacuation monitoring, and Paschatkarma Samsarjana Krama dietary ladders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/healthcare/ayush/bams"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition flex items-center gap-2 text-center justify-center"
            >
              ← BAMS Curriculum
            </Link>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        {/* Navigation Tabs Bar */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveMainTab('scheduler')}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 transition whitespace-nowrap ${
              activeMainTab === 'scheduler'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Calendar size={18} />
            <span>Panchakarma Scheduler (7/14/21 Days)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('viewer')}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 transition whitespace-nowrap ${
              activeMainTab === 'viewer'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-900/30 border border-sky-400/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Layers size={18} />
            <span>Therapy & Shuddhi Procedure Explorer</span>
          </button>

          <button
            onClick={() => setActiveMainTab('curriculum')}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 transition whitespace-nowrap ${
              activeMainTab === 'curriculum'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-900/30 border border-amber-400/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <BookOpen size={18} />
            <span>Samhita Principles & Samsarjana Guide</span>
          </button>
        </div>

        {/* Tab 1: Panchakarma Scheduler Component */}
        {activeMainTab === 'scheduler' && (
          <div className="animate-fadeIn">
            <PanchakarmaScheduler />
          </div>
        )}

        {/* Tab 2: Classical Procedure Viewer */}
        {activeMainTab === 'viewer' && (
          <div className="animate-fadeIn">
            <div className="mb-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-sm text-slate-300">
              <span className="font-bold text-sky-400">Therapy Protocol Explorer:</span> Explore step-by-step classical guidelines for individual Pradhanakarma procedures, titrate Snehana curves, count evacuation bouts (Vegas), and assess Shuddhi level.
            </div>
            <PanchakarmaProcedureViewer />
          </div>
        )}

        {/* Tab 3: Curriculum & Classical Principles */}
        {activeMainTab === 'curriculum' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: 3 Stages */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Stage Progression</div>
                  <h3 className="text-xl font-bold text-white mb-3">Trividha Karma (त्रिविध कर्म)</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Classical Ayurvedic detox follows an invariant tripartite structure:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">1. Purvakarma:</span>
                      <span>Deepana, Pachana, internal Snehapana (titrated ghee), and Sarvanga Swedana to unseat toxins.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">2. Pradhanakarma:</span>
                      <span>Vamana (emesis), Virechana (purgation), Basti (enemas), Nasya (nasal), or Raktamokshana.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">3. Paschatkarma:</span>
                      <span>Graded Samsarjana Krama dietary ladder and Rasayana to restore Agni and tissue immunity.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2: Samsarjana Krama */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Dietary Reconstruction</div>
                  <h3 className="text-xl font-bold text-white mb-3">Samsarjana Krama Ladder</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Post-purification, the digestive fire (Agni) is fragile like an ember in ash. It must be rebuilt systematically:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-200">1. Manda (मण्ड)</span>
                      <span className="text-slate-400">1:14 clear rice water</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-200">2. Peya (पेया)</span>
                      <span className="text-slate-400">1:4 thin rice gruel</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-200">3. Vilepi (विलेपी)</span>
                      <span className="text-slate-400">1:4 thick rice paste</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-200">4. Yusha (यूष)</span>
                      <span className="text-slate-400">Akrita & Krita Moong soup</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Shodhana vs Shamana */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Classical Distinction</div>
                  <h3 className="text-xl font-bold text-white mb-3">Shodhana vs Shamana</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">
                    Charaka Samhita Sutrasthana 16/20 establishes the clinical rationale of radical bio-purification:
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs italic text-amber-200/90 mb-3">
                    "दोषाः कदाचित्कुप्यन्ति जिता लङ्घनपाचनैः। जितास्तु संशोधनैर्ये न तेषां सम्भवः पुनः॥"
                  </div>
                  <p className="text-xs text-slate-300">
                    Diseases pacified by Shamana (palliation) may recur; but those eradicated by Panchakarma Shodhana never recur.
                  </p>
                </div>
              </div>
            </div>

            {/* Curriculum Cross-Links */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h4 className="text-base font-bold text-white mb-4">Related Mediverse AYUSH Learning Tools</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/healthcare/ayush/dravyaguna-explorer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-emerald-400 font-bold text-sm mb-1">🌿 Dravyaguna Explorer</div>
                    <p className="text-xs text-slate-400">Pharmacology, Rasa-Panchaka & Drug interactions.</p>
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                    Explore Herbs →
                  </div>
                </Link>

                <Link
                  href="/healthcare/ayush/marma-map"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sky-400 font-bold text-sm mb-1">📍 107 Marma Body Map</div>
                    <p className="text-xs text-slate-400">3D vital point anatomical projections.</p>
                  </div>
                  <div className="text-xs text-sky-400 font-semibold mt-3 flex items-center gap-1">
                    View 3D Marma →
                  </div>
                </Link>

                <Link
                  href="/healthcare/ayush/tridosha-ans"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-amber-400 font-bold text-sm mb-1">⚖️ Tridosha ANS Simulator</div>
                    <p className="text-xs text-slate-400">Autonomic nervous system equilibrium solver.</p>
                  </div>
                  <div className="text-xs text-amber-400 font-semibold mt-3 flex items-center gap-1">
                    Simulate ANS →
                  </div>
                </Link>

                <Link
                  href="/healthcare/ayush/prakriti-assessment"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-purple-400 font-bold text-sm mb-1">🧬 Prakriti Assessment</div>
                    <p className="text-xs text-slate-400">Psychosomatic constitution diagnostic engine.</p>
                  </div>
                  <div className="text-xs text-purple-400 font-semibold mt-3 flex items-center gap-1">
                    Assess Prakriti →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
