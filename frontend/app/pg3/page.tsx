"use client";

import React, { useState } from "react";
import ClinicalPg3LabViewer from "../../components/pg3/ClinicalPg3LabViewer";
import {
  PG3_CORE_MODULES,
  getPg3ModuleById,
} from "../../lib/curriculum/content/pg3";
import Link from "next/link";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import {
  Sparkles,
  BookOpen,
  Activity,
  Flame,
  Shield,
  Zap,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";

export default function ClinicalPg3LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("pg3-damage-control-laparotomy-lethal-triad");

  const activeModule = getPg3ModuleById(selectedModuleId) || PG3_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-indigo-950/80 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Postgraduate Trauma Surgery Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🏥 Postgraduate Advanced General Surgery &amp; Trauma Critical Care (PG-603)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Damage Control Laparotomy &amp; Trauma Critical Care (The Trauma Lethal Triad of hypothermia &lt;35°C, metabolic acidosis pH &lt;7.20 / base deficit &gt;6 mEq/L, and trauma-induced coagulopathy TIC, the 3-Stage DCL paradigm with abbreviated laparotomy &lt;60-90 min, four-quadrant packing, rapid shunting, linear bowel stapling without anastomosis, temporary abdominal closure TAC / ABThera negative pressure dressing, and Abdominal Compartment Syndrome ACS sustained IAP &gt;20 mmHg with new organ failure requiring emergent decompressive laparotomy), Complex Visceral &amp; Vascular Trauma (Pringle maneuver clamping the hepatoduodenal ligament at the Foramen of Winslow to differentiate hepatic inflow bleeding from retrohepatic IVC tears with 15-20 min ischemia limit, pancreatic trauma grading with Grade III distal pancreatectomy for duct injury left of SMV and Grade IV/V duodenal diverticulization, temporary intraluminal arterial shunts within &lt;6h warm ischemia window, and retroperitoneal hematoma exploration zones), REBOA Endovascular Resuscitation (Aortic Zone 1 thoracic occlusion T4-T12 with strict &le;30 min limit for subdiaphragmatic exsanguination, Zone 2 paravisceral T12-L2 absolute contraindication / no-inflation zone, Zone 3 infrarenal occlusion L2-L4 with &le;60 min limit for pelvic disruptions, and partial REBOA pREBOA to prevent reperfusion hyperkalemia), and Viscoelastometry-Guided Massive Transfusion (Thromboelastography TEG and ROTEM interpretation with R-time / CT prolongation treated with FFP or 4F-PCC, alpha-angle / CFT depression treated with Cryoprecipitate or Fibrinogen concentrate, MA / MCF depression treated with apheresis platelets, and LY30 &gt;3% hyperfibrinolysis treated with intravenous Tranexamic Acid TXA 1 g + 1 g within &lt;3h per the CRASH-2 trial).
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/subjects"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
            >
              Browse All Subjects
            </Link>
            <Link
              href="/exam"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition"
            >
              Take Clinical Exam
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Lab Viewer (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ClinicalPg3LabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Postgraduate Milestone: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              <MarkdownRenderer content={activeModule.markdownContent} />
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-indigo-950/40 border border-indigo-800/60">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert size={16} /> Trauma Surgery Case Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-indigo-900/50 border border-indigo-700/60 text-xs text-indigo-300 font-medium">
                  <strong>Answer &amp; Rationale:</strong> {activeModule.clinicalVignettes[0].explanation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Curriculum Units & High-Yield Pearls (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" /> PG-603 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {PG3_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-indigo-400 tracking-wider">
                        {mod.unitCode}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {mod.estimatedMinutes} min
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{mod.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span>{mod.competencies.join(", ")}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Guide */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-violet-950/60 border border-indigo-800/40">
            <h4 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Trauma Surgery Pearls
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Trauma Lethal Triad: <strong>Hypothermia (&lt;35°C), Acidosis (pH &lt;7.20), Coagulopathy (TIC)</strong>.</li>
              <li>Pringle Maneuver: <strong>Hepatoduodenal clamp safe for 15-20 min; separates inflow from IVC bleed</strong>.</li>
              <li>REBOA Zones: <strong>Zone 1 thoracic &le;30 min; Zone 2 strictly contraindicated; Zone 3 &le;60 min</strong>.</li>
              <li>CRASH-2 TXA: <strong>1 g bolus + 1 g infusion over 8h; MUST be administered within &lt;3h of trauma</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
