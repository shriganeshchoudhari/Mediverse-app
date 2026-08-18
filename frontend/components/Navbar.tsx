"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../config/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={closeAll}
            className="flex items-center gap-3 font-bold text-white tracking-wide group"
            aria-label="Mediverse — Medical Education & Simulation Platform"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:border-blue-400 group-hover:bg-blue-500/25 transition-all duration-200 shadow-sm">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black tracking-tight text-base leading-none group-hover:text-blue-300 transition-colors">
                Mediverse
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-normal leading-tight mt-1">
                Medical Education &amp; Simulation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Dropdowns */}
          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            
            {/* 1. Curriculum Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("curriculum")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  activeDropdown === "curriculum"
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
                aria-expanded={activeDropdown === "curriculum"}
              >
                <span>Curriculum</span>
                <span className="text-[9px] opacity-70">▾</span>
              </button>

              {activeDropdown === "curriculum" && (
                <div className="absolute left-0 top-full mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 grid grid-cols-2 gap-2 animate-fade-in z-50">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Pre &amp; Para Clinical
                    </div>
                    <Link href="/subjects" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      📚 All 19 Subjects
                    </Link>
                    <Link href="/dissection" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      🫀 3D Dissection
                    </Link>
                    <Link href="/metabolism" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      ⚡ Metabolism Map
                    </Link>
                    <Link href="/pathology" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      🔬 Pathology
                    </Link>
                    <Link href="/pharmacology" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      💊 Pharmacology
                    </Link>
                  </div>
                  <div className="space-y-1 border-l border-slate-800/80 pl-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Clinical &amp; PG Tracks
                    </div>
                    <Link href="/medicine" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      🩺 Internal Medicine
                    </Link>
                    <Link href="/surgery" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      ✂️ Surgery Lab
                    </Link>
                    <Link href="/obgyn" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      👶 OB / GYN
                    </Link>
                    <Link href="/pediatrics" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                      🧸 Pediatrics
                    </Link>
                    <Link href="/pg1" onClick={closeAll} className="block px-2 py-1.5 rounded hover:bg-slate-800 text-blue-400 hover:text-blue-300 font-bold transition">
                      🎓 12 PG Packs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Simulators Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("simulators")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  activeDropdown === "simulators"
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
                aria-expanded={activeDropdown === "simulators"}
              >
                <span>Simulators</span>
                <span className="text-[9px] opacity-70">▾</span>
              </button>

              {activeDropdown === "simulators" && (
                <div className="absolute left-0 top-full mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 space-y-1 animate-fade-in z-50">
                  <Link href="/simulators" onClick={closeAll} className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-950/40 text-blue-300 border border-blue-800/40 font-bold mb-1 hover:bg-blue-900/50 transition">
                    <span>Virtual Physiology Labs</span>
                    <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded">All 8</span>
                  </Link>
                  <Link href="/simulators/cardiac-cycle" onClick={closeAll} className="block px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    ❤️ Suga-Sagawa PV Loops
                  </Link>
                  <Link href="/simulators/acid-base" onClick={closeAll} className="block px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    🧪 Acid-Base Davenport Nomogram
                  </Link>
                  <Link href="/simulators/renal-filtration" onClick={closeAll} className="block px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    💧 Renal Starling GFR &amp; FeNa
                  </Link>
                  <Link href="/simulators/respiratory-vq" onClick={closeAll} className="block px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    🫁 Alveolar Gas &amp; V/Q Matching
                  </Link>
                  <Link href="/simulators/nerve-muscle" onClick={closeAll} className="block px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    ⚡ Goldman-Hodgkin-Katz Biophysics
                  </Link>
                  <Link href="/simulators/patient-emergency" onClick={closeAll} className="block px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    🚨 Emergency Resuscitation Lab
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Assessments Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("assessments")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  activeDropdown === "assessments"
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
                aria-expanded={activeDropdown === "assessments"}
              >
                <span>Assessments</span>
                <span className="text-[9px] opacity-70">▾</span>
              </button>

              {activeDropdown === "assessments" && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 space-y-1 animate-fade-in z-50">
                  <Link href="/exam" onClick={closeAll} className="block px-3 py-2 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    <div className="font-bold">📝 Clinical Mock Exam</div>
                    <div className="text-[10px] text-slate-400">USMLE Step 1 / NMC CBME Timed Vignettes</div>
                  </Link>
                  <Link href="/osce" onClick={closeAll} className="block px-3 py-2 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    <div className="font-bold">🩺 OSCE Clinical Stations</div>
                    <div className="text-[10px] text-slate-400">Interactive Clinical Case Workflows</div>
                  </Link>
                  <Link href="/formulas" onClick={closeAll} className="block px-3 py-2 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    <div className="font-bold">📐 Formulas &amp; Equations</div>
                    <div className="text-[10px] text-slate-400">Quick Reference Physiological Solvers</div>
                  </Link>
                  <Link href="/glossary" onClick={closeAll} className="block px-3 py-2 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition">
                    <div className="font-bold">📖 Medical Glossary</div>
                    <div className="text-[10px] text-slate-400">Core Physiological Lexicon</div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Community Link */}
            <Link
              href="/study-groups"
              onClick={closeAll}
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition"
            >
              Study Cohorts
            </Link>
          </div>
        </div>

        {/* Right Side: Quick Search & User Auth Actions */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          
          {/* Quick Search Shortcut Trigger */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition"
            title="Search Curriculum (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="text-xs">Search...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Admin Panel Badge */}
          {mounted && user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={closeAll}
              className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 hover:bg-purple-900/60 transition"
            >
              Admin Panel
            </Link>
          )}

          {/* Authenticated User Menu */}
          {mounted && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                onClick={closeAll}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white transition"
              >
                Dashboard
              </Link>
              <div className="hidden md:block text-slate-400 text-xs">
                Hi, <span className="text-blue-400 font-bold">{user.firstName || user.email}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                onClick={closeAll}
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={closeAll}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Curriculum &amp; Dissection
            </div>
            <Link href="/subjects" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200">
              📚 Master 19-Subject Scaffold
            </Link>
            <Link href="/dissection" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200">
              🫀 3D Anatomical Dissection
            </Link>
            <Link href="/metabolism" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200">
              ⚡ Metabolic Pathways
            </Link>
            <Link href="/pg1" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-blue-400 font-bold">
              🎓 12 Postgraduate Residency Packs
            </Link>
          </div>

          <div className="space-y-1 border-t border-slate-900 pt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Physiology Simulators
            </div>
            <Link href="/simulators" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 font-bold">
              🧪 All Simulation Labs
            </Link>
            <Link href="/simulators/cardiac-cycle" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-300">
              ❤️ Cardiovascular PV Loops
            </Link>
            <Link href="/simulators/acid-base" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-300">
              🧪 Acid-Base Davenport Nomogram
            </Link>
            <Link href="/simulators/renal-filtration" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-300">
              💧 Renal Starling Filtration
            </Link>
            <Link href="/simulators/patient-emergency" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-300">
              🚨 Emergency Resuscitation
            </Link>
          </div>

          <div className="space-y-1 border-t border-slate-900 pt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Examinations &amp; Community
            </div>
            <Link href="/exam" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200">
              📝 Clinical Mock Exam (USMLE/CBME)
            </Link>
            <Link href="/osce" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200">
              🩺 OSCE Stations
            </Link>
            <Link href="/formulas" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200">
              📐 Formulas &amp; Equations
            </Link>
            <Link href="/study-groups" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200">
              👥 Study Groups &amp; Cohorts
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
