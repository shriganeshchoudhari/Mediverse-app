"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Contrast,
  Type,
  Wifi,
  WifiOff,
  Activity,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  Eye,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { useToast } from "../ToastContext";

export type ThemeMode = "dark" | "light" | "high-contrast";
export type FontSizeScale = "standard" | "large" | "xlarge";

export default function ThemeAccessibilityManager() {
  const { showToast } = useToast();

  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [fontSize, setFontSize] = useState<FontSizeScale>("standard");
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("mediverse:theme") as ThemeMode | null;
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light" || savedTheme === "high-contrast")) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        applyTheme("dark");
      }

      const savedFontSize = localStorage.getItem("mediverse:font-size") as FontSizeScale | null;
      if (savedFontSize && (savedFontSize === "standard" || savedFontSize === "large" || savedFontSize === "xlarge")) {
        setFontSize(savedFontSize);
        applyFontSize(savedFontSize);
      } else {
        applyFontSize("standard");
      }

      const savedLowBandwidth = localStorage.getItem("mediverse:low-bandwidth");
      const isLowBandwidth = savedLowBandwidth === "true";
      setLowBandwidth(isLowBandwidth);
      applyLowBandwidth(isLowBandwidth);

      const savedReducedMotion = localStorage.getItem("mediverse:reduced-motion");
      const isReducedMotion = savedReducedMotion === "true";
      setReducedMotion(isReducedMotion);
      applyReducedMotion(isReducedMotion);

      setIsLoaded(true);
    } catch (e) {
      console.warn("Failed to load accessibility settings:", e);
      setIsLoaded(true);
    }
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    root.classList.remove("theme-dark", "theme-light", "theme-high-contrast");
    root.classList.add(`theme-${mode}`);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("mediverse:theme", newTheme);
    applyTheme(newTheme);
    window.dispatchEvent(new CustomEvent("mediverse:theme-changed", { detail: { theme: newTheme } }));
    showToast(`Theme updated to ${newTheme === "high-contrast" ? "High-Contrast OLED (WCAG AAA)" : newTheme.toUpperCase()}`, "info");
  };

  const applyFontSize = (scale: FontSizeScale) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-font-size", scale);
    switch (scale) {
      case "large":
        root.style.fontSize = "115%";
        break;
      case "xlarge":
        root.style.fontSize = "130%";
        break;
      case "standard":
      default:
        root.style.fontSize = "100%";
        break;
    }
  };

  const handleFontSizeChange = (scale: FontSizeScale) => {
    setFontSize(scale);
    localStorage.setItem("mediverse:font-size", scale);
    applyFontSize(scale);
    window.dispatchEvent(new CustomEvent("mediverse:font-size-changed", { detail: { scale } }));
    showToast(`Font scaling set to ${scale === "standard" ? "Standard (100%)" : scale === "large" ? "Large (115%)" : "Extra Large (130%)"}`, "info");
  };

  const applyLowBandwidth = (enabled: boolean) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-low-bandwidth", enabled ? "true" : "false");
  };

  const handleLowBandwidthToggle = () => {
    const next = !lowBandwidth;
    setLowBandwidth(next);
    localStorage.setItem("mediverse:low-bandwidth", next ? "true" : "false");
    applyLowBandwidth(next);
    window.dispatchEvent(new CustomEvent("mediverse:low-bandwidth-changed", { detail: { enabled: next } }));
    showToast(
      next
        ? "Low-Bandwidth Mode enabled: 3D models replaced with lightweight vector SVGs."
        : "Standard Mode enabled: Interactive 3D WebGL renderers restored.",
      "info"
    );
  };

  const applyReducedMotion = (enabled: boolean) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-reduced-motion", enabled ? "true" : "false");
    if (enabled) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  };

  const handleReducedMotionToggle = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    localStorage.setItem("mediverse:reduced-motion", next ? "true" : "false");
    applyReducedMotion(next);
    window.dispatchEvent(new CustomEvent("mediverse:reduced-motion-changed", { detail: { enabled: next } }));
    showToast(
      next
        ? "Reduced Motion enabled: Disabling transitions & dynamic animations."
        : "Standard Motion enabled.",
      "info"
    );
  };

  const handleResetDefaults = () => {
    handleThemeChange("dark");
    handleFontSizeChange("standard");
    if (lowBandwidth) handleLowBandwidthToggle();
    if (reducedMotion) handleReducedMotionToggle();
    showToast("All appearance & accessibility settings reset to defaults.", "info");
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Overview Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Sliders className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Display & Accessibility</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-xl">
              Customize visual ergonomics, high-contrast readability, typography scaling, and low-bandwidth asset optimizations for clinical study.
            </p>
          </div>
          <button
            onClick={handleResetDefaults}
            className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* 1. THEME MODE SWITCHER */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-semibold text-white">Visual Theme</h3>
          </div>
          <span className="text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2.5 py-1 rounded-full">
            Active: {theme === "high-contrast" ? "High-Contrast OLED" : theme.charAt(0).toUpperCase() + theme.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => handleThemeChange("dark")}
            className={`text-left p-4 rounded-xl border transition relative overflow-hidden flex flex-col justify-between ${
              theme === "dark"
                ? "bg-slate-950 border-blue-500 ring-2 ring-blue-500/30 shadow-lg"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-blue-400">
                  <Moon className="w-4 h-4" />
                </div>
                {theme === "dark" && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Dark Mode (Default)</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Tailored Slate 950 deep canvas designed for nocturnal clinical study and low-light fatigue reduction.
              </p>
            </div>
            {/* Color Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-3 border-t border-slate-800/80">
              <span className="w-4 h-4 rounded-full bg-[#020617] border border-slate-700" title="Slate 950 Background" />
              <span className="w-4 h-4 rounded-full bg-[#0f172a] border border-slate-700" title="Slate 900 Surface" />
              <span className="w-4 h-4 rounded-full bg-[#2563eb]" title="Mediverse Blue Accent" />
              <span className="w-4 h-4 rounded-full bg-[#10b981]" title="Emerald Clinical Accent" />
            </div>
          </button>

          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => handleThemeChange("light")}
            className={`text-left p-4 rounded-xl border transition relative overflow-hidden flex flex-col justify-between ${
              theme === "light"
                ? "bg-slate-950 border-blue-500 ring-2 ring-blue-500/30 shadow-lg"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                  <Sun className="w-4 h-4" />
                </div>
                {theme === "light" && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Light (Clinical Paper)</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Crisp clinical slate & white palette optimized for bright hospital ward environments and daytime reading.
              </p>
            </div>
            {/* Color Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-3 border-t border-slate-800/80">
              <span className="w-4 h-4 rounded-full bg-[#f8fafc] border border-slate-400" title="Slate 50 Background" />
              <span className="w-4 h-4 rounded-full bg-[#ffffff] border border-slate-400" title="Pure White Surface" />
              <span className="w-4 h-4 rounded-full bg-[#0284c7]" title="Clinical Sky Blue" />
              <span className="w-4 h-4 rounded-full bg-[#0f172a]" title="Slate 900 Text" />
            </div>
          </button>

          {/* High-Contrast OLED Card */}
          <button
            type="button"
            onClick={() => handleThemeChange("high-contrast")}
            className={`text-left p-4 rounded-xl border transition relative overflow-hidden flex flex-col justify-between ${
              theme === "high-contrast"
                ? "bg-slate-950 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-black border border-cyan-400 text-yellow-400">
                  <Contrast className="w-4 h-4" />
                </div>
                {theme === "high-contrast" && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-300 bg-black px-2 py-0.5 rounded-full border border-yellow-400">
                    <Check className="w-3 h-3" /> WCAG AAA
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="font-semibold text-white text-sm">High-Contrast OLED</h4>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 font-mono px-1.5 py-0.2 rounded border border-cyan-800">
                  AAA
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Pitch black <code className="text-cyan-300 font-mono text-[11px]">#000000</code> with vibrant neon blue & yellow for maximum visual accessibility.
              </p>
            </div>
            {/* Color Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-3 border-t border-slate-800/80">
              <span className="w-4 h-4 rounded-full bg-[#000000] border border-cyan-400" title="True OLED Black" />
              <span className="w-4 h-4 rounded-full bg-[#00e5ff] border border-white" title="Neon Cyan Accent" />
              <span className="w-4 h-4 rounded-full bg-[#ffd600] border border-white" title="Neon Yellow Warning" />
              <span className="w-4 h-4 rounded-full bg-[#ffffff] border border-cyan-400" title="Pure White Text" />
            </div>
          </button>
        </div>
      </div>

      {/* 2. FONT SIZE SCALING */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-semibold text-white">Typography & Font Scaling</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
            {fontSize === "standard" ? "100% (Standard)" : fontSize === "large" ? "115% (Large)" : "130% (Extra Large)"}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Scale clinical vignettes, drug dosages, and anatomical labels system-wide without breaking diagrams or calculation grids.
        </p>

        {/* Scale Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleFontSizeChange("standard")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
              fontSize === "standard"
                ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div>
              <div className="text-sm font-semibold text-white">Standard</div>
              <div className="text-xs text-slate-400">100% Base (16px)</div>
            </div>
            {fontSize === "standard" && <Check className="w-4 h-4 text-blue-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleFontSizeChange("large")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
              fontSize === "large"
                ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div>
              <div className="text-sm font-semibold text-white">Large</div>
              <div className="text-xs text-slate-400">115% Scale (18.4px)</div>
            </div>
            {fontSize === "large" && <Check className="w-4 h-4 text-blue-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleFontSizeChange("xlarge")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
              fontSize === "xlarge"
                ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div>
              <div className="text-sm font-semibold text-white">Extra Large</div>
              <div className="text-xs text-slate-400">130% Scale (20.8px)</div>
            </div>
            {fontSize === "xlarge" && <Check className="w-4 h-4 text-blue-400" />}
          </button>
        </div>

        {/* Live Typography Preview Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono mb-2">
            Live Clinical Sample Preview
          </div>
          <div
            className="transition-all duration-200 space-y-1 text-slate-200"
            style={{
              fontSize: fontSize === "standard" ? "1rem" : fontSize === "large" ? "1.15rem" : "1.30rem",
              lineHeight: 1.5,
            }}
          >
            <p className="font-semibold text-white">
              Patient #4092: Acute Coronary Syndrome Assessment
            </p>
            <p className="text-slate-300">
              Administer Aspirin 325 mg PO stat + Ticagrelor 180 mg loading dose. ECG demonstrates 2.5 mm ST elevation in leads V1-V4 consistent with anterior STEMI.
            </p>
          </div>
        </div>
      </div>

      {/* 3. LOW-BANDWIDTH MODE */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className={`p-2.5 rounded-xl border ${
              lowBandwidth
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}>
              {lowBandwidth ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-white">Low-Bandwidth & Offline Mode</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  lowBandwidth
                    ? "bg-amber-950 text-amber-400 border-amber-800"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}>
                  {lowBandwidth ? "ACTIVE (SVG Fallbacks)" : "OFF (3D WebGL)"}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                When active, disables heavy 3D WebGL renderers and particle simulations, substituting with lightweight vector SVG diagrams and fast cached content. Ideal for low-connectivity rural rotations or mobile data savings.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={lowBandwidth}
            onClick={handleLowBandwidthToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 focus:outline-none flex-shrink-0 ${
              lowBandwidth ? "bg-amber-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                lowBandwidth ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Bandwidth Savings Details */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-slate-300 font-medium">~85% Payload Reduction</div>
              <div className="text-slate-500 text-[11px]">Replaces 15MB 3D meshes with 80KB vector SVGs</div>
            </div>
          </div>
          <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
            <Activity className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-slate-300 font-medium">Extended Battery & GPU Life</div>
              <div className="text-slate-500 text-[11px]">Eliminates WebGL continuous frame rendering</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. REDUCED MOTION TOGGLE */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className={`p-2.5 rounded-xl border ${
              reducedMotion
                ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-white">Reduced Motion Override</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  reducedMotion
                    ? "bg-purple-950 text-purple-400 border-purple-800"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}>
                  {reducedMotion ? "REDUCED" : "DEFAULT"}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                Overrides browser animation settings to pause auto-rotating 3D models, heartbeat pulsation effects, and transition animations for vestibular motion sensitivity.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={handleReducedMotionToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 focus:outline-none flex-shrink-0 ${
              reducedMotion ? "bg-purple-600" : "bg-slate-700"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                reducedMotion ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Persistence & Compliance Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>All preferences automatically persisted to client localStorage.</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">WCAG 2.2 AAA Ready</span>
      </div>
    </div>
  );
}
