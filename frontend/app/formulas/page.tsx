"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

// Mock formula database
const FORMULAS = [
  {
    id: "cardiac-output",
    system: "Cardiovascular",
    name: "Cardiac Output (CO)",
    formula: "CO = HR \\times SV",
    description: "The volume of blood pumped by the heart per minute. HR = Heart Rate, SV = Stroke Volume.",
    normalValue: "4-8 L/min"
  },
  {
    id: "mean-arterial-pressure",
    system: "Cardiovascular",
    name: "Mean Arterial Pressure (MAP)",
    formula: "MAP = DP + \\frac{1}{3}(SP - DP)",
    description: "The average pressure in a patient's arteries during one cardiac cycle. DP = Diastolic Pressure, SP = Systolic Pressure.",
    normalValue: "70-100 mmHg"
  },
  {
    id: "fick-principle",
    system: "Cardiovascular",
    name: "Fick Principle (Cardiac Output)",
    formula: "CO = \\frac{VO_2}{C_aO_2 - C_vO_2}",
    description: "Used to measure cardiac output. VO2 = Oxygen consumption, CaO2 = Arterial oxygen content, CvO2 = Venous oxygen content.",
    normalValue: "Depends on body size"
  },
  {
    id: "ejection-fraction",
    system: "Cardiovascular",
    name: "Ejection Fraction (EF)",
    formula: "EF = \\frac{SV}{EDV} \\times 100",
    description: "The fraction of outbound blood pumped from the heart with each heartbeat. SV = Stroke Volume, EDV = End-Diastolic Volume.",
    normalValue: "55-70%"
  },
  {
    id: "alveolar-gas",
    system: "Respiratory",
    name: "Alveolar Gas Equation",
    formula: "P_AO_2 = F_iO_2(P_{atm} - P_{H_2O}) - \\frac{P_aCO_2}{R}",
    description: "Calculates the partial pressure of oxygen in the alveoli. R = Respiratory quotient (approx 0.8).",
    normalValue: "100-104 mmHg (at sea level, room air)"
  },
  {
    id: "bohr-equation",
    system: "Respiratory",
    name: "Bohr Equation (Physiologic Dead Space)",
    formula: "V_D = V_T \\times \\frac{P_aCO_2 - P_ECO_2}{P_aCO_2}",
    description: "Calculates physiologic dead space. VT = Tidal Volume, PaCO2 = Arterial PCO2, PECO2 = Mixed expired PCO2.",
    normalValue: "Approx 150 mL (anatomic dead space)"
  },
  {
    id: "clearance",
    system: "Renal",
    name: "Renal Clearance",
    formula: "C_x = \\frac{U_x \\times V}{P_x}",
    description: "The volume of plasma from which a substance is completely removed per unit time. U = Urine concentration, V = Urine flow rate, P = Plasma concentration.",
    normalValue: "Substance dependent (Inulin ~120 mL/min)"
  },
  {
    id: "gfr",
    system: "Renal",
    name: "Glomerular Filtration Rate (GFR)",
    formula: "GFR = K_f \\times [(P_{GC} - P_{BS}) - (\\pi_{GC} - \\pi_{BS})]",
    description: "The volume of fluid filtered from the renal glomerular capillaries into Bowman's capsule per unit time.",
    normalValue: "90-120 mL/min"
  },
  {
    id: "filtration-fraction",
    system: "Renal",
    name: "Filtration Fraction (FF)",
    formula: "FF = \\frac{GFR}{RPF}",
    description: "The fraction of renal plasma flow that is filtered across the glomerular capillaries. RPF = Renal Plasma Flow.",
    normalValue: "Approx 20%"
  },
  {
    id: "henderson-hasselbalch",
    system: "Acid-Base",
    name: "Henderson-Hasselbalch Equation",
    formula: "pH = pK_a + \\log_{10} \\left( \\frac{[HCO_3^-]}{0.03 \\times P_aCO_2} \\right)",
    description: "Describes the derivation of pH as a measure of acidity in biological and chemical systems.",
    normalValue: "pH 7.35-7.45"
  },
  {
    id: "anion-gap",
    system: "Acid-Base",
    name: "Anion Gap",
    formula: "AG = [Na^+] - ([Cl^-] + [HCO_3^-])",
    description: "The difference between primary measured cations and primary measured anions in serum. Used to diagnose metabolic acidosis.",
    normalValue: "8-12 mEq/L"
  },
  {
    id: "nernst-equation",
    system: "Nervous System",
    name: "Nernst Equation",
    formula: "E_x = \\frac{RT}{zF} \\ln \\frac{[X]_{out}}{[X]_{in}}",
    description: "Calculates the equilibrium potential for a single specific ion across a cell membrane.",
    normalValue: "Ion specific (e.g., K+ is ~-90mV)"
  }
];

export default function FormulasPage() {
  const [search, setSearch] = useState("");
  const [filterSystem, setFilterSystem] = useState("All");

  const systems = ["All", ...Array.from(new Set(FORMULAS.map(f => f.system)))];

  const filteredFormulas = FORMULAS.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.description.toLowerCase().includes(search.toLowerCase());
    const matchesSystem = filterSystem === "All" || f.system === filterSystem;
    return matchesSearch && matchesSystem;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Physiology Formulas</h1>
          <p className="text-slate-400 max-w-2xl">
            A quick reference guide for essential physiological equations. Search by name, variable, or filter by body system.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search formulas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {systems.map(sys => (
              <button
                key={sys}
                onClick={() => setFilterSystem(sys)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition font-medium ${
                  filterSystem === sys 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {sys}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFormulas.map(f => (
            <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">{f.system}</div>
                  <h3 className="text-xl font-bold text-white">{f.name}</h3>
                </div>
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4 overflow-x-auto flex items-center justify-center min-h-[80px]">
                {/* For actual production, we'd use KaTeX here. Using simple markdown-like display for prototype */}
                <code className="text-emerald-400 font-mono text-lg">{f.formula}</code>
              </div>
              
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                {f.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm bg-blue-900/10 text-blue-300 p-3 rounded-lg border border-blue-500/10">
                <span className="font-bold">Normal Value:</span> {f.normalValue}
              </div>
            </div>
          ))}
          
          {filteredFormulas.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
              No formulas found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
