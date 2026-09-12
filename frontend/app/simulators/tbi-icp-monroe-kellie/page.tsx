"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Shield, BookOpen, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import TbiIcpSimulator from "../../../components/simulators/TbiIcpSimulator";

export default function TbiIcpMonroeKelliePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Neurocritical Care Simulation Environment</span>
          </div>
        </div>

        {/* Main Interactive Simulator Component */}
        <TbiIcpSimulator />

        {/* Evidence-Based Clinical Reference & Guidelines Footnote */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Neurocritical Care &amp; Traumatic Brain Injury (TBI) Reference Manual
              </h2>
              <p className="text-xs text-slate-400">
                Synthesis of Brain Trauma Foundation (BTF 4th Edition), SIBICC Tiered Algorithm &amp; RESCUEicp Trial Standards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <h3 className="font-semibold text-indigo-300 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                Monroe-Kellie Doctrine &amp; Spatial Buffers
              </h3>
              <p>
                The intracranial vault is a rigid, non-distensible compartment with an adult volume of approximately 1700 mL.
                Its contents comprise brain parenchyma (~80%, 1400 mL), cerebral blood volume (~10%, 150 mL), and CSF (~10%, 150 mL).
              </p>
              <p>
                When a mass lesion or vasogenic/cytotoxic edema expands, initial compensation occurs via CSF displacement into the spinal thecal sac
                and venous blood extrusion into the jugular system. Once this spatial reserve (~65-80 mL) is exhausted, intracranial compliance plummets
                and elastance surges, causing exponential rises in ICP with minimal volume increments.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <h3 className="font-semibold text-cyan-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                CPP Optimization &amp; Lundberg Waves
              </h3>
              <p>
                Cerebral Perfusion Pressure is calculated as CPP = MAP &minus; ICP. The Brain Trauma Foundation recommends targeting a CPP between 60 and 70 mmHg.
                Avoid CPP &lt; 60 mmHg (secondary ischemic insult) and CPP &gt; 70 mmHg (hyperperfusion-induced vasogenic edema and ARDS risk).
              </p>
              <p>
                Lundberg A (plateau) waves represent sudden surges of ICP to 50-100 mmHg lasting 5-20 minutes, signaling acute vasomotor decompensation
                and imminent transtentorial herniation. Lundberg B waves (0.5-2/min) warn of diminishing compliance, while C waves reflect benign systemic Traube-Hering oscillations.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <h3 className="font-semibold text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Hyperosmolar Therapy &amp; Surgery
              </h3>
              <p>
                <strong>Mannitol 20%</strong> (0.25-1.0 g/kg) expands intravascular volume and draws parenchymal water across intact blood-brain barriers.
                Monitor serum osmolality and osmolal gap; hold mannitol if gap &ge; 20 mOsm/kg or serum osm &ge; 320 mOsm/kg to prevent acute tubular necrosis.
              </p>
              <p>
                <strong>Hypertonic Saline</strong> (3% infusion or 23.4% 30 mL bullet) maintains volume in polytrauma and targets Na+ 145-155 mEq/L.
                Surgical decompressive craniectomy (&ge; 12 &times; 15 cm) transforms the rigid vault into an open system, reducing refractory ICP and mortality as proven in RESCUEicp.
              </p>
            </div>
          </div>

          <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200/90 flex items-center justify-between">
            <span>
              <strong>Clinical Practice Consensus:</strong> Carney N, Totten AM, O&apos;Reilly C, et al. Guidelines for the Management of Severe Traumatic Brain Injury, Fourth Edition. <em>Neurosurgery</em>. 2017;80(1):6-15.
            </span>
            <span className="text-[10px] font-mono text-indigo-400">BTF &bull; SIBICC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
