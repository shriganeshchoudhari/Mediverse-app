"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Shield, PlusCircle, User, Zap, Activity, AlertCircle } from "lucide-react";

interface ActionLog {
  time: string;
  message: string;
  effect: string;
}

export default function PatientEmergencySimulator() {
  // Patient State
  const [bloodVolume, setBloodVolume] = useState<number>(3.2); // Normal: 5.0 L
  const [activeBleeding, setActiveBleeding] = useState<boolean>(true);
  const [oxygenSaturation, setOxygenSaturation] = useState<number>(88); // %
  const [epinephrineDose, setEpinephrineDose] = useState<number>(0); // mcg/min
  const [oxygenFlow, setOxygenFlow] = useState<boolean>(false);
  const [pressureApplied, setPressureApplied] = useState<boolean>(false);

  // Time elapsed
  const [seconds, setSeconds] = useState<number>(0);
  const [logs, setLogs] = useState<ActionLog[]>([
    { time: "00:00", message: "Patient admitted to ER following trauma. Active external bleeding noted.", effect: "Hypovolemic Shock" }
  ]);

  // Derived vitals
  const [hr, setHr] = useState<number>(130);
  const [sbp, setSbp] = useState<number>(80);
  const [dbp, setDbp] = useState<number>(45);
  const [rr, setRr] = useState<number>(24);
  const [urineOutput, setUrineOutput] = useState<number>(8); // mL/hr

  const map = Math.round((sbp + 2 * dbp) / 3);
  const shockIndex = parseFloat((hr / sbp).toFixed(2));

  // Stop/Start simulator
  const [isAlive, setIsAlive] = useState<boolean>(true);
  const [isStabilized, setIsStabilized] = useState<boolean>(false);

  // Main simulation tick (every 1 second = 30 seconds of physiology time)
  useEffect(() => {
    if (!isAlive || isStabilized) return;

    const interval = setInterval(() => {
      setSeconds(s => s + 1);

      // Physiology math
      let bleedRate = activeBleeding ? 0.04 : 0.005; // L per tick
      if (pressureApplied) bleedRate = 0.002;

      setBloodVolume(vol => {
        const nextVol = Math.max(1.5, vol - bleedRate);
        if (nextVol <= 1.8) {
          setIsAlive(false);
          addLog("PATIENT HAS CRITICALLY ARRESTED.", "Asystole due to exsanguination.");
        }
        return parseFloat(nextVol.toFixed(3));
      });

      // Calculate dynamic vitals based on blood volume and drugs
      // As blood volume drops: HR increases (baroreceptor reflex), BP drops
      const volumeDeficit = 5.0 - bloodVolume; // L

      // BP equations
      let baseSbp = 120 - (volumeDeficit * 35) + (epinephrineDose * 4);
      let baseDbp = 80 - (volumeDeficit * 20) + (epinephrineDose * 2);

      // Clamping limits
      baseSbp = Math.max(30, Math.min(180, baseSbp));
      baseDbp = Math.max(15, Math.min(110, baseDbp));

      // Compensatory Tachycardia
      let baseHr = 72 + (volumeDeficit * 38) + (epinephrineDose * 5);
      baseHr = Math.max(40, Math.min(180, baseHr));

      // Respiratory compensation for lactic acidosis
      let baseRr = 12 + (volumeDeficit * 8);
      if (oxygenFlow) baseRr = Math.max(12, baseRr - 4);
      baseRr = Math.round(Math.min(45, baseRr));

      // Urine output is direct reflection of renal perfusion (MAP)
      const currentMap = (baseSbp + 2 * baseDbp) / 3;
      let output = 0;
      if (currentMap > 65) {
        output = Math.round((currentMap - 60) * 1.2);
      } else {
        output = Math.max(1, Math.round((currentMap / 65) * 10));
      }

      setSbp(Math.round(baseSbp));
      setDbp(Math.round(baseDbp));
      setHr(Math.round(baseHr));
      setRr(baseRr);
      setUrineOutput(output);

      // Oxygen saturation based on volume & oxygen supply
      let sat = 98 - (volumeDeficit * 6);
      if (oxygenFlow) sat = Math.min(100, sat + 8);
      setOxygenSaturation(Math.round(Math.max(50, sat)));

      // Check stabilization criteria:
      // BP > 90/60, HR < 100, no active bleeding, stable volume
      if (!activeBleeding && bloodVolume >= 4.2 && baseHr < 100 && currentMap >= 70) {
        setIsStabilized(true);
        addLog("PATIENT CLINICALLY STABILIZED.", "Vitals normal, blood volume restored.");
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [bloodVolume, activeBleeding, epinephrineDose, oxygenFlow, pressureApplied, isAlive, isStabilized]);

  const addLog = (message: string, effect: string) => {
    const timeStr = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    setLogs(prev => [{ time: timeStr, message, effect }, ...prev]);
  };

  // ER Actions
  const handleApplyPressure = () => {
    setPressureApplied(true);
    addLog("Direct pressure applied to femoral wound.", "Reduced bleeding rate.");
  };

  const handleApplySutures = () => {
    setActiveBleeding(false);
    setPressureApplied(false);
    addLog("Surgical vascular sutures completed.", "Bleeding arrested completely.");
  };

  const handleInfuseSaline = () => {
    setBloodVolume(vol => Math.min(6.0, vol + 0.3)); // 300mL stays intravascular
    addLog("Infused 500mL Normal Saline bolus.", "Preload & stroke volume transiently increased.");
  };

  const handleTransfuseBlood = () => {
    setBloodVolume(vol => Math.min(6.0, vol + 0.45)); // 1 unit whole blood
    addLog("Transfused 1 Unit of packed red blood cells (PRBC).", "Oxygen carrying capacity & blood volume increased.");
  };

  const handleAdministerOxygen = () => {
    setOxygenFlow(true);
    addLog("High-flow oxygen face mask applied (15L/min).", "Increased alveolar oxygen tension.");
  };

  const handleEpinephrineBolus = () => {
    setEpinephrineDose(prev => Math.min(20, prev + 5));
    addLog("Initiated Epinephrine infusion (+5 mcg/min).", "Systemic vasoconstriction (SVR increase) & cardiac contractility.");
  };

  const handleStopEpinephrine = () => {
    setEpinephrineDose(0);
    addLog("Stopped Epinephrine infusion.", "Vascular tone returning to baseline.");
  };

  const getShockClass = () => {
    const deficit = 5.0 - bloodVolume;
    if (deficit <= 0.75) return { label: "Class I (Mild Deficit)", color: "text-emerald-400" };
    if (deficit <= 1.5) return { label: "Class II (Compensated Shock)", color: "text-amber-400" };
    if (deficit <= 2.0) return { label: "Class III (Decompensated Shock)", color: "text-orange-500 font-bold" };
    return { label: "Class IV (Refractory Shock / Pre-Terminal)", color: "text-red-500 font-black animate-pulse" };
  };

  const shockClass = getShockClass();

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <Link href="/simulators" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Labs
        </Link>

        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-500" /> Patient ER Simulator
            </h1>
            <p className="text-slate-450 text-sm md:text-base mt-1">
              Case File: **Traumatic Hemorrhage (Hypovolemic Shock)**. Manage fluid resuscitation, control bleeding, and stabilize perfusion.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-black">Chamber Status</div>
              <div className={`text-sm font-bold ${!isAlive ? 'text-red-500' : isStabilized ? 'text-emerald-500' : 'text-amber-400'}`}>
                {!isAlive ? "ARRESTED / DEAD" : isStabilized ? "STABILIZED" : "STABLE BLEEDING"}
              </div>
            </div>
          </div>
        </header>

        {/* Live Vitals Monitor */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
            <Heart className="w-6 h-6 text-red-500 mb-2 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">Heart Rate</span>
            <span className="text-2xl font-black text-white">{isAlive ? `${hr} bpm` : "0"}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
            <Activity className="w-6 h-6 text-teal-400 mb-2" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">Blood Pressure</span>
            <span className="text-2xl font-black text-white">{isAlive ? `${sbp}/${dbp}` : "0/0"}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
            <Zap className="w-6 h-6 text-sky-400 mb-2" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">Mean Arterial Pressure</span>
            <span className="text-2xl font-black text-white">{isAlive ? `${map} mmHg` : "0"}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
            <User className="w-6 h-6 text-indigo-400 mb-2" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">Blood Volume</span>
            <span className="text-2xl font-black text-white">{bloodVolume.toFixed(2)} L</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
            <Activity className="w-6 h-6 text-purple-400 mb-2" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">Resp. Rate / SaO₂</span>
            <span className="text-2xl font-black text-white">{isAlive ? `${rr} / ${oxygenSaturation}%` : "0 / 0%"}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
            <PlusCircle className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">Urine Output</span>
            <span className="text-2xl font-black text-white">{isAlive ? `${urineOutput} mL/hr` : "0"}</span>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Action Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" /> ER Interventions
            </h2>

            <div className="flex flex-col gap-3">
              {/* Hemorrhage Control */}
              <button
                disabled={!isAlive || isStabilized}
                onClick={handleApplyPressure}
                className="py-3 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex justify-between items-center"
              >
                <span>🩸 Apply Pressure Bandage</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-black">Slows Bleeding</span>
              </button>

              <button
                disabled={!isAlive || isStabilized || !activeBleeding}
                onClick={handleApplySutures}
                className="py-3 px-4 bg-red-650 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition flex justify-between items-center"
              >
                <span>🧵 Perform Vascular Sutures</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-black">Arrests Bleeding</span>
              </button>

              {/* Fluids & Volume */}
              <button
                disabled={!isAlive || isStabilized}
                onClick={handleInfuseSaline}
                className="py-3 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex justify-between items-center"
              >
                <span>💧 Infuse Crystalloids (Saline)</span>
                <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-black">+500mL Bolus</span>
              </button>

              <button
                disabled={!isAlive || isStabilized}
                onClick={handleTransfuseBlood}
                className="py-3 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex justify-between items-center"
              >
                <span>🔴 Transfuse Whole Blood (PRBC)</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-black">+1 Unit</span>
              </button>

              {/* Oxygen */}
              <button
                disabled={!isAlive || isStabilized || oxygenFlow}
                onClick={handleAdministerOxygen}
                className="py-3 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex justify-between items-center"
              >
                <span>💨 Apply High-Flow Oxygen Mask</span>
                <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-black">O2 Face Mask</span>
              </button>

              {/* Pressor Support */}
              <button
                disabled={!isAlive || isStabilized}
                onClick={handleEpinephrineBolus}
                className="py-3 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex justify-between items-center"
              >
                <span>⚡ Epinephrine Infusion (+5 mcg)</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-black">Increase SVR</span>
              </button>

              {epinephrineDose > 0 && (
                <button
                  onClick={handleStopEpinephrine}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition"
                >
                  Stop Epinephrine Infusion
                </button>
              )}
            </div>
          </div>

          {/* Vitals Diagnostics & Explanations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Clinical Evaluation</h2>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-850">
                <span className="text-slate-450">Shock Severity Classification</span>
                <span className={shockClass.color}>{shockClass.label}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-850">
                <span className="text-slate-450">Shock Index (HR / SBP)</span>
                <span className={`font-bold ${shockIndex > 0.9 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {shockIndex} {shockIndex > 0.9 ? '(High Risk > 0.9)' : '(Normal 0.5-0.7)'}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-850">
                <span className="text-slate-450">Renal Perfusion State</span>
                <span className={`font-bold ${urineOutput < 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {urineOutput < 30 ? "Severe Oliguria (<30 mL/hr)" : "Normal Perfusion"}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <h3 className="text-xs font-bold text-white mb-2">Physiological Mechanics</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                In acute hemorrhage, reduced blood volume triggers the **Baroreceptor Reflex**. Afferent signaling to the medulla decreases, stimulating sympathetic tone. 
                This causes **tachycardia** (high HR) and **vasoconstriction** (narrowing pulse pressure, cooling skin) to protect brain and heart perfusion at the cost of renal clearance (severe oliguria).
              </p>
            </div>
          </div>

          {/* Live Action Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[400px]">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 mb-4">Patient Chart / ER Logs</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                    <span>{log.time}</span>
                    <span className="text-purple-400 uppercase tracking-widest">{log.effect}</span>
                  </div>
                  <p className="text-slate-300">{log.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
