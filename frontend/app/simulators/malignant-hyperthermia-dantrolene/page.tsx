"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Shield, BookOpen, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import MalignantHyperthermiaSimulator from "../../../components/simulators/MalignantHyperthermiaSimulator";

export default function MalignantHyperthermiaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Interactive Anesthesiology &amp; Toxicologic Hyperthermia Crisis Suite</span>
          </div>
        </div>

        {/* Main Interactive Simulator Component */}
        <MalignantHyperthermiaSimulator />

        {/* Evidence-Based Clinical Reference & Guidelines Footnote */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Hypermetabolic Crisis &amp; Malignant Hyperthermia Clinical Manual
              </h2>
              <p className="text-xs text-slate-400">
                Synthesis of Malignant Hyperthermia Association of the United States (MHAUS), Hunter Toxicity Criteria &amp; EMHG Protocols
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <h3 className="font-semibold text-rose-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Malignant Hyperthermia (MH)
              </h3>
              <p>
                Inherited autosomal dominant disorder primarily caused by mutations in the skeletal muscle ryanodine receptor (RYR1) gene (70-80%)
                or the alpha-1S subunit of the L-type voltage-dependent calcium channel (CACNA1S).
              </p>
              <p>
                Triggered by volatile halogenated anesthetics (sevoflurane, desflurane, isoflurane) and depolarizing muscle relaxants (succinylcholine).
                Unregulated, massive sarcoplasmic reticulum calcium efflux stimulates continuous actin-myosin cross-bridge cycling,
                surging End-Tidal CO2 (&gt; 55-80 mmHg), causing masseter spasm / generalized rigidity, hyperthermia (&gt; 41&deg;C), and rhabdomyolysis.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <h3 className="font-semibold text-purple-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                NMS vs Serotonin Syndrome Triage
              </h3>
              <p>
                <strong>Neuroleptic Malignant Syndrome (NMS):</strong> Central dopamine (D2) blockade from antipsychotics. Evolving over 1-7 days with
                characteristic &quot;lead-pipe&quot; plastic rigidity, hyperthermia, autonomic lability, and hyporeflexia. Managed with Bromocriptine/Amantadine.
              </p>
              <p>
                <strong>Serotonin Syndrome (Hunter Criteria):</strong> Excess 5-HT1A/2A stimulation. Hyperacute onset (&lt; 24h) featuring spontaneous or
                inducible clonus, ocular clonus, brisk hyperreflexia (+3/+4), tremor, mydriasis, and hyperactive bowel sounds / diarrhea. Managed with Cyproheptadine.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <h3 className="font-semibold text-emerald-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-400" />
                Dantrolene Formulations &amp; Pitfalls
              </h3>
              <p>
                <strong>Ryanodex (Nanocrystalline):</strong> 250 mg per vial requiring only 5 mL of Sterile Water for Injection, ready in under 20 seconds.
                Contrast with traditional Dantrium (20 mg vials requiring 60 mL water each; an 80 kg patient requires 10 to 40 vials and liters of water).
              </p>
              <p>
                <strong>Lethal Contraindication:</strong> Never administer Calcium Channel Blockers (verapamil or diltiazem) with Dantrolene.
                Concurrent administration induces refractory myocardial depression, catastrophic hyperkalemic surges, and cardiovascular collapse.
              </p>
            </div>
          </div>

          <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl text-xs text-rose-200/90 flex items-center justify-between">
            <span>
              <strong>Emergency Guidance:</strong> MHAUS 24/7 Hotline: 1-800-MH-HYPER (1-800-644-9737). Litman RS, et al. Malignant Hyperthermia: Diagnosis and Management. <em>Anesthesiology</em>. 2018;128(1):152-167.
            </span>
            <span className="text-[10px] font-mono text-rose-400">MHAUS &bull; EMHG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
