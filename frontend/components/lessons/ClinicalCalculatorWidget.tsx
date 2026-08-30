'use client';

import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { ClinicalCalculators } from '@/.gemini/skills/ClinicalCalculatorSkills';

type CalculatorType = 'GCS' | 'PARKLAND' | 'CRCL' | 'CURB65' | 'PEDIATRIC';

export default function ClinicalCalculatorWidget({ defaultCalc = 'GCS' }: { defaultCalc?: CalculatorType }) {
  const [activeTab, setActiveTab] = useState<CalculatorType>(defaultCalc);

  // GCS State
  const [gcsEye, setGcsEye] = useState<number>(4);
  const [gcsVerbal, setGcsVerbal] = useState<number>(5);
  const [gcsMotor, setGcsMotor] = useState<number>(6);

  // Parkland State
  const [parklandWeight, setParklandWeight] = useState<number>(70);
  const [parklandTbsa, setParklandTbsa] = useState<number>(25);

  // Cockcroft-Gault State
  const [crclAge, setCrclAge] = useState<number>(65);
  const [crclWeight, setCrclWeight] = useState<number>(70);
  const [crclScr, setCrclScr] = useState<number>(1.4);
  const [crclIsFemale, setCrclIsFemale] = useState<boolean>(false);

  // CURB-65 State
  const [curbC, setCurbC] = useState<boolean>(false);
  const [curbU, setCurbU] = useState<boolean>(true);
  const [curbR, setCurbR] = useState<boolean>(false);
  const [curbB, setCurbB] = useState<boolean>(false);
  const [curb65, setCurb65] = useState<boolean>(true);

  // Pediatric Dose State
  const [pedWeight, setPedWeight] = useState<number>(18);
  const [pedDoseKgDay, setPedDoseKgDay] = useState<number>(40);
  const [pedFreq, setPedFreq] = useState<number>(3);
  const [pedConc, setPedConc] = useState<number>(50); // 250mg/5ml = 50mg/ml
  const [pedMaxSingle, setPedMaxSingle] = useState<number>(500);

  // Calculations
  const gcsResult = ClinicalCalculators.calculateGcs(gcsEye, gcsVerbal, gcsMotor);
  const parklandResult = ClinicalCalculators.calculateParkland(parklandWeight, parklandTbsa);
  const crclResult = ClinicalCalculators.calculateCockcroftGault(crclAge, crclWeight, crclScr, crclIsFemale);
  const curbResult = ClinicalCalculators.calculateCurb65(curbC, curbU, curbR, curbB, curb65);
  const pedResult = ClinicalCalculators.calculatePediatricDose(pedWeight, pedDoseKgDay, pedFreq, pedConc, pedMaxSingle);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Interactive Clinical Calculator</h3>
            <p className="text-xs text-slate-400">Point-of-care medical formulas & evidence-based dosing</p>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['GCS', 'PARKLAND', 'CRCL', 'CURB65', 'PEDIATRIC'] as CalculatorType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body: GCS */}
      {activeTab === 'GCS' && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Eye Opening (1-4)</label>
              <select
                value={gcsEye}
                onChange={(e) => setGcsEye(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
              >
                <option value={4}>4 — Spontaneous</option>
                <option value={3}>3 — To Sound</option>
                <option value={2}>2 — To Pressure / Pain</option>
                <option value={1}>1 — None</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Verbal Response (1-5)</label>
              <select
                value={gcsVerbal}
                onChange={(e) => setGcsVerbal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
              >
                <option value={5}>5 — Oriented</option>
                <option value={4}>4 — Confused</option>
                <option value={3}>3 — Inappropriate Words</option>
                <option value={2}>2 — Incomprehensible Sounds</option>
                <option value={1}>1 — None</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Motor Response (1-6)</label>
              <select
                value={gcsMotor}
                onChange={(e) => setGcsMotor(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
              >
                <option value={6}>6 — Obeys Commands</option>
                <option value={5}>5 — Localizes Pain</option>
                <option value={4}>4 — Flexion Withdrawal</option>
                <option value={3}>3 — Abnormal Flexion (Decorticate)</option>
                <option value={2}>2 — Extension (Decerebrate)</option>
                <option value={1}>1 — None</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-mono">Glasgow Coma Scale Total:</div>
              <div className="text-2xl font-black text-indigo-400 font-mono">{gcsResult.totalScore} / 15</div>
              <div className="text-xs text-slate-300 mt-1">{gcsResult.interpretation}</div>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              gcsResult.category === 'SEVERE' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
              gcsResult.category === 'MODERATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {gcsResult.category}
            </span>
          </div>
        </div>
      )}

      {/* Body: Parkland */}
      {activeTab === 'PARKLAND' && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Patient Weight (kg)</label>
              <input
                type="number"
                value={parklandWeight}
                onChange={(e) => setParklandWeight(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">% Total Body Surface Area (% TBSA Burn)</label>
              <input
                type="number"
                value={parklandTbsa}
                onChange={(e) => setParklandTbsa(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[11px] text-slate-400">Total 24h Lactated Ringers:</div>
              <div className="text-xl font-bold text-white font-mono">{parklandResult.totalFluidMl24h} mL</div>
            </div>
            <div>
              <div className="text-[11px] text-amber-400 font-bold">First 8 Hours (50%):</div>
              <div className="text-xl font-bold text-amber-300 font-mono">{parklandResult.first8HoursMl} mL ({parklandResult.hourlyRateFirst8h} mL/hr)</div>
            </div>
            <div>
              <div className="text-[11px] text-blue-400 font-bold">Next 16 Hours (50%):</div>
              <div className="text-xl font-bold text-blue-300 font-mono">{parklandResult.next16HoursMl} mL ({parklandResult.hourlyRateNext16h} mL/hr)</div>
            </div>
          </div>
        </div>
      )}

      {/* Body: Cockcroft-Gault */}
      {activeTab === 'CRCL' && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Age (Years)</label>
              <input
                type="number"
                value={crclAge}
                onChange={(e) => setCrclAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={crclWeight}
                onChange={(e) => setCrclWeight(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Serum Cr (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={crclScr}
                onChange={(e) => setCrclScr(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sex</label>
              <select
                value={crclIsFemale ? 'F' : 'M'}
                onChange={(e) => setCrclIsFemale(e.target.value === 'F')}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
              >
                <option value="M">Male (1.0)</option>
                <option value="F">Female (0.85 multiplier)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-mono">Estimated Creatinine Clearance:</div>
              <div className="text-2xl font-black text-indigo-400 font-mono">{crclResult.crClMlMin} mL/min</div>
              <div className="text-xs text-slate-300 mt-1">{crclResult.clinicalGuidance}</div>
            </div>
            <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-lg text-xs font-bold font-mono">
              {crclResult.dosageAdjustmentCategory}
            </span>
          </div>
        </div>
      )}

      {/* Body: CURB-65 */}
      {activeTab === 'CURB65' && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbC} onChange={(e) => setCurbC(e.target.checked)} className="rounded" />
              <span><strong>C</strong> — Confusion (Abbreviated Mental Test score &le; 8)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbU} onChange={(e) => setCurbU(e.target.checked)} className="rounded" />
              <span><strong>U</strong> — Urea (BUN &gt; 19 mg/dL or &gt; 7 mmol/L)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbR} onChange={(e) => setCurbR(e.target.checked)} className="rounded" />
              <span><strong>R</strong> — Respiratory Rate (&ge; 30 breaths/min)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbB} onChange={(e) => setCurbB(e.target.checked)} className="rounded" />
              <span><strong>B</strong> — Blood Pressure (SBP &lt; 90 or DBP &le; 60 mmHg)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer sm:col-span-2">
              <input type="checkbox" checked={curb65} onChange={(e) => setCurb65(e.target.checked)} className="rounded" />
              <span><strong>65</strong> — Age &ge; 65 Years Old</span>
            </label>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-mono">CURB-65 Pneumonia Severity:</div>
              <div className="text-2xl font-black text-indigo-400 font-mono">{curbResult.score} / 5 (30-day mortality: {curbResult.thirtyDayMortalityPercent}%)</div>
              <div className="text-xs text-slate-300 mt-1">{curbResult.recommendedDisposition}</div>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              curbResult.riskTier === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
              curbResult.riskTier === 'INTERMEDIATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {curbResult.riskTier} RISK
            </span>
          </div>
        </div>
      )}

      {/* Body: Pediatric Dose */}
      {activeTab === 'PEDIATRIC' && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Child Weight (kg)</label>
              <input
                type="number"
                value={pedWeight}
                onChange={(e) => setPedWeight(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Dose (mg/kg/day)</label>
              <input
                type="number"
                value={pedDoseKgDay}
                onChange={(e) => setPedDoseKgDay(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Frequency (Doses/Day)</label>
              <select
                value={pedFreq}
                onChange={(e) => setPedFreq(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
              >
                <option value={1}>Daily (Q24H)</option>
                <option value={2}>Twice Daily (BID / Q12H)</option>
                <option value={3}>Three Times Daily (TID / Q8H)</option>
                <option value={4}>Four Times Daily (QID / Q6H)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-mono">Dose per administration:</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {pedResult.dosePerAdministrationMg} mg ({pedResult.liquidVolumeMlPerDose} mL per dose)
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Total Daily: {pedResult.totalDailyDoseMg} mg/day</div>
            </div>
            {pedResult.warningAlert && (
              <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs">
                <AlertTriangle size={16} /> {pedResult.warningAlert}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
