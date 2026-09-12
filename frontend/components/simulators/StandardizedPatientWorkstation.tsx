'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Heart,
  Activity,
  User,
  Sparkles,
  Stethoscope,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Send,
  RefreshCw,
  Clock,
  Award,
  BookOpen,
  Zap,
  HelpCircle,
  Thermometer,
  ShieldAlert,
  ClipboardList
} from 'lucide-react';
import {
  STANDARDIZED_PERSONAS,
  StandardizedPatientPersona,
  ClinicalFact,
  PhysicalExamFinding,
  DiagnosticTestResult,
  StudentSoapNote,
  OsceEvaluationResult,
  generatePatientResponse,
  executePhysicalExamManeuver,
  executeDiagnosticTestOrder,
  gradeStudentSoapNote
} from '../../.gemini/skills/StandardizedPatientEngine';

export default function StandardizedPatientWorkstation() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('acute-appendicitis-01');
  const persona = STANDARDIZED_PERSONAS[selectedPersonaId] || STANDARDIZED_PERSONAS['acute-appendicitis-01'];

  // State
  const [activeTab, setActiveTab] = useState<'dialogue' | 'exam' | 'diagnostics' | 'soap' | 'debrief'>('dialogue');
  const [currentFacts, setCurrentFacts] = useState<ClinicalFact[]>(() =>
    persona.clinicalFacts.map((f) => ({ ...f }))
  );
  const [performedManeuverIds, setPerformedManeuverIds] = useState<string[]>([]);
  const [examResults, setExamResults] = useState<PhysicalExamFinding[]>([]);
  const [orderedInvestigationIds, setOrderedInvestigationIds] = useState<string[]>([]);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticTestResult[]>([]);

  // Dialogue & Speech
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'Doctor' | 'Patient' | 'System'; text: string; time: string }>>([
    { sender: 'System', text: `Telehealth Standardized Patient session initiated with ${persona.name} (${persona.age}y ${persona.gender.toLowerCase()}).`, time: 'Now' },
    { sender: 'Patient', text: persona.chiefComplaint, time: 'Now' }
  ]);

  // Audio waveform simulation
  const [waveHeight, setWaveHeight] = useState<number[]>([15, 25, 40, 60, 30, 15]);

  // SOAP Note Form
  const [soapSubjective, setSoapSubjective] = useState('');
  const [soapObjective, setSoapObjective] = useState('');
  const [soapAssessment, setSoapAssessment] = useState('');
  const [soapPlan, setSoapPlan] = useState('');
  const [primaryDiagnosisInput, setPrimaryDiagnosisInput] = useState('');
  const [differentialsInput, setDifferentialsInput] = useState('');
  const [osceResult, setOsceResult] = useState<OsceEvaluationResult | null>(null);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  // Switch persona handler
  const handleSelectPersona = (newId: string) => {
    setSelectedPersonaId(newId);
    const newPersona = STANDARDIZED_PERSONAS[newId];
    if (newPersona) {
      setCurrentFacts(newPersona.clinicalFacts.map((f) => ({ ...f })));
      setPerformedManeuverIds([]);
      setExamResults([]);
      setOrderedInvestigationIds([]);
      setDiagnosticResults([]);
      setOsceResult(null);
      setSoapSubjective('');
      setSoapObjective('');
      setSoapAssessment('');
      setSoapPlan('');
      setPrimaryDiagnosisInput('');
      setDifferentialsInput('');
      setChatMessages([
        { sender: 'System', text: `Switched patient to ${newPersona.name} (${newPersona.age}y, ${newPersona.occupation}).`, time: 'Now' },
        { sender: 'Patient', text: newPersona.chiefComplaint, time: 'Now' }
      ]);
    }
  };

  // Text-To-Speech function
  const speakPatientReply = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = persona.voiceSettings.pitch;
      utterance.rate = persona.voiceSettings.rate;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
      setIsSpeaking(false);
    }
  };

  // Web Speech API Voice Recognition setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleSendMessage(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        alert('Web Speech API is not supported in this browser. Please type your questions below.');
      }
    }
  };

  // Send message to patient
  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'Doctor' as const, text: messageText.trim(), time: timeStr };

    const { replyText, updatedFacts, newlyUnlockedFact } = generatePatientResponse(persona, messageText, currentFacts);

    setCurrentFacts(updatedFacts);

    const patientMsg = { sender: 'Patient' as const, text: replyText, time: timeStr };

    setChatMessages((prev) => [...prev, userMsg, patientMsg]);
    setTextInput('');
    speakPatientReply(replyText);
  };

  // Perform physical exam maneuver
  const handlePerformManeuver = (maneuverId: string) => {
    if (performedManeuverIds.includes(maneuverId)) return;

    const finding = executePhysicalExamManeuver(persona, maneuverId);
    setPerformedManeuverIds((prev) => [...prev, maneuverId]);
    setExamResults((prev) => [finding, ...prev]);

    // Update SOAP objective note preview
    setSoapObjective((prev) => {
      const line = `${finding.maneuverName}: ${finding.findingDescription}`;
      return prev ? `${prev}\n${line}` : line;
    });
  };

  // Order diagnostic investigation
  const handleOrderInvestigation = (testId: string) => {
    if (orderedInvestigationIds.includes(testId)) return;

    const result = executeDiagnosticTestOrder(persona, testId);
    setOrderedInvestigationIds((prev) => [...prev, testId]);
    setDiagnosticResults((prev) => [result, ...prev]);
  };

  // Run OSCE SOAP Note Evaluation
  const handleGradeSoapNote = () => {
    const studentNote: StudentSoapNote = {
      subjective: soapSubjective,
      objective: soapObjective,
      assessment: soapAssessment,
      plan: soapPlan,
      primaryDiagnosis: primaryDiagnosisInput,
      differentialDiagnoses: differentialsInput.split(',').map((s) => s.trim()).filter(Boolean),
      performedManeuvers: performedManeuverIds,
      orderedInvestigations: orderedInvestigationIds,
      safetyPrecautionsTaken: []
    };

    const evaluation = gradeStudentSoapNote(persona, studentNote, currentFacts);
    setOsceResult(evaluation);
  };

  // Waveform animation
  useEffect(() => {
    if (isSpeaking || isListening) {
      const interval = setInterval(() => {
        setWaveHeight([
          Math.floor(Math.random() * 50) + 15,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 95) + 30,
          Math.floor(Math.random() * 70) + 25,
          Math.floor(Math.random() * 60) + 20,
          Math.floor(Math.random() * 40) + 10
        ]);
      }, 120);
      return () => clearInterval(interval);
    } else {
      setWaveHeight([15, 20, 25, 20, 15, 10]);
    }
  }, [isSpeaking, isListening]);

  // Unlocked facts stats
  const unlockedCount = useMemo(() => currentFacts.filter((f) => f.revealed).length, [currentFacts]);
  const totalFactsCount = currentFacts.length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 p-2 sm:p-4 md:p-6">
      {/* Header & Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-6 md:p-8 border border-emerald-800/40 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Stethoscope className="w-72 h-72 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Track B1 &bull; Generative Standardized Patients
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Voice AI &amp; Web Speech
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Automated OSCE Grading
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <User className="w-8 h-8 text-emerald-400" />
              Standardized Patient &amp; Voice AI Telehealth Workstation
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl">
              Conduct live verbal clinical history taking, perform targeted bedside physical exam maneuvers, 
              order STAT diagnostic workups, and receive automated, evidence-based OSCE SOAP note evaluations.
            </p>
          </div>
        </div>

        {/* Persona Selector Bar */}
        <div className="mt-6 pt-6 border-t border-emerald-800/30">
          <div className="text-xs font-medium text-emerald-300 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            SELECT CLINICAL STANDARDIZED PATIENT:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.values(STANDARDIZED_PERSONAS).map((p) => {
              const isSelected = selectedPersonaId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPersona(p.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-900/60 border-emerald-400 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-300">{p.name} ({p.age}y {p.gender[0]})</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Pain: {p.painScale}/10
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{p.underlyingDiagnosis}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.chiefComplaint}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Telehealth Video Console (Left) + Clinical Workspace Tabs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Telehealth Video Feed & Vitals Monitor (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Telehealth Video Panel */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden relative">
            {/* Live Call Header */}
            <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  TELEHEALTH SECURE FEED &bull; 1080p
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    soundEnabled
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title={soundEnabled ? 'Mute Patient Voice' : 'Unmute Patient Voice'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Video Viewport / Animated Avatar */}
            <div className="relative aspect-video bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
              {/* Patient Avatar Frame */}
              <div className="relative mb-3">
                <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all ${
                  isSpeaking
                    ? 'border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                    : isListening
                    ? 'border-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'border-slate-700'
                } bg-slate-800`}>
                  <User className="w-14 h-14 text-slate-400" />
                </div>
                {/* Pain status badge */}
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 shadow">
                  Pain: {persona.painScale}/10
                </div>
              </div>

              <div className="text-sm font-bold text-white">{persona.name}</div>
              <div className="text-xs text-slate-400">{persona.occupation} &bull; Age {persona.age}</div>

              {/* Real-time Voice Audio Visualizer */}
              <div className="mt-4 flex items-center gap-1.5 h-8">
                {waveHeight.map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-1.5 rounded-full transition-all duration-100 ${
                      isSpeaking ? 'bg-emerald-400' : isListening ? 'bg-cyan-400' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <div className="text-[11px] font-medium mt-1">
                {isSpeaking && <span className="text-emerald-400 animate-pulse">&bull; Patient Speaking...</span>}
                {isListening && <span className="text-cyan-400 animate-pulse">&bull; Listening to Doctor...</span>}
                {!isSpeaking && !isListening && <span className="text-slate-500">Connected &bull; Ready for Question</span>}
              </div>
            </div>

            {/* Bedside Vitals Telemetry Box */}
            <div className="p-4 bg-slate-950/90 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Live Bedside Telemetry
                </span>
                <span className="text-[10px] font-mono text-emerald-400">NORMAL RHYTHM</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Heart className="w-2.5 h-2.5 text-rose-500" /> HR
                  </span>
                  <div className="text-sm font-bold text-white font-mono">{persona.vitals.heartRate} <span className="text-[9px] font-normal text-slate-400">bpm</span></div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">BP</span>
                  <div className="text-sm font-bold text-white font-mono">{persona.vitals.bloodPressure}</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">RR</span>
                  <div className="text-sm font-bold text-white font-mono">{persona.vitals.respiratoryRate} <span className="text-[9px] font-normal text-slate-400">/min</span></div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Thermometer className="w-2.5 h-2.5 text-amber-500" /> Temp
                  </span>
                  <div className="text-sm font-bold text-white font-mono">{persona.vitals.temperatureCelsius}&deg;C</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400">SpO2</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono">{persona.vitals.oxygenSaturation}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Doctor Question Chips */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Suggested Clinical History Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Where exactly does it hurt?",
                "When did this pain begin?",
                "Does the pain move anywhere?",
                "Have you had any nausea or vomiting?",
                "Do you have any drug allergies?",
                "What medications do you take?",
                "Have you ever had surgeries before?",
                "Does coughing or walking make it worse?"
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Clinical Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Navigation Buttons */}
          <div className="flex flex-wrap items-center border-b border-slate-800 gap-1 pb-1">
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'dialogue'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              1. Dialogue &amp; History ({unlockedCount}/{totalFactsCount})
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'exam'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              2. Physical Exam ({performedManeuverIds.length})
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'diagnostics'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              3. Diagnostics ({orderedInvestigationIds.length})
            </button>
            <button
              onClick={() => setActiveTab('soap')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'soap'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              4. SOAP Note &amp; Grade
            </button>
            <button
              onClick={() => setActiveTab('debrief')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'debrief'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              5. Case Debrief
            </button>
          </div>

          {/* TAB 1: LIVE DIALOGUE & TRANSCRIPT */}
          {activeTab === 'dialogue' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Patient History Exploration</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {unlockedCount} / {totalFactsCount} Critical Facts Unlocked
                  </span>
                </div>
                <button
                  onClick={() => handleSelectPersona(selectedPersonaId)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3 h-3" /> Clear Chat
                </button>
              </div>

              {/* Chat Message Scroll Box */}
              <div className="h-80 overflow-y-auto space-y-3 pr-2 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === 'Doctor'
                        ? 'items-end'
                        : msg.sender === 'Patient'
                        ? 'items-start'
                        : 'items-center'
                    }`}
                  >
                    {msg.sender !== 'System' ? (
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                          msg.sender === 'Doctor'
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75">
                          <span className="font-bold">{msg.sender === 'Doctor' ? 'Dr. You' : persona.name}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="leading-relaxed text-xs">{msg.text}</p>
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-400 text-center my-1">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Box with Voice Mic & Send */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-lg shadow-rose-600/40'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                  title={isListening ? 'Stop Recording' : 'Push-to-Talk (Microphone)'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  placeholder="Ask the patient a clinical question (e.g., 'When did the pain start?')..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(textInput);
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={() => handleSendMessage(textInput)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PHYSICAL EXAMINATION */}
          {activeTab === 'exam' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Bedside Physical Examination</span>
                <span className="text-xs text-slate-400">Click to perform maneuver on patient</span>
              </div>

              {/* Maneuver Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'GENERAL_APPEARANCE', label: 'General Inspection' },
                  { id: 'VITAL_SIGNS_CHECK', label: 'Vital Signs Verify' },
                  { id: 'CARDIOVASCULAR_AUSCULTATION', label: 'Cardiac Auscultation' },
                  { id: 'RESPIRATORY_AUSCULTATION', label: 'Pulmonary Auscultation' },
                  { id: 'ABDOMINAL_PALPATION', label: 'Abdominal Palpation' },
                  { id: 'MCBURNEY_SIGN', label: "McBurney's Point" },
                  { id: 'ROVSING_SIGN', label: "Rovsing's Sign" },
                  { id: 'MURPHY_SIGN', label: "Murphy's Sign (RUQ)" },
                  { id: 'MENINGEAL_SIGNS', label: 'Kernig & Brudzinski' },
                  { id: 'NEUROLOGICAL_CRANIAL_NERVES', label: 'Cranial Nerve Exam' }
                ].map((item) => {
                  const isDone = performedManeuverIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePerformManeuver(item.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        isDone
                          ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.label}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Exam Findings Log */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-300">Exam Findings Recorded:</span>
                {examResults.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-4 text-center rounded-xl bg-slate-950/50 border border-slate-800">
                    No physical examination maneuvers performed yet. Select maneuvers above to examine patient.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                    {examResults.map((finding, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          finding.isAbnormal
                            ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white">{finding.maneuverName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            finding.isAbnormal ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {finding.isAbnormal ? 'POSITIVE / ABNORMAL' : 'NORMAL'}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed">{finding.findingDescription}</p>
                        <p className="text-[11px] text-slate-400 mt-1 italic">&bull; Clinical note: {finding.clinicalSignificance}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DIAGNOSTICS & LABS */}
          {activeTab === 'diagnostics' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">STAT Diagnostic Investigations</span>
                <span className="text-xs text-slate-400">Order indicated labs &amp; imaging</span>
              </div>

              {/* Order Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'CBC', label: 'Complete Blood Count (CBC)' },
                  { id: 'BMP', label: 'Basic Metabolic Panel (BMP)' },
                  { id: 'ECG_12_LEAD', label: '12-Lead ECG' },
                  { id: 'TROPONIN_HS', label: 'High-Sensitivity Troponin' },
                  { id: 'URINALYSIS', label: 'Urinalysis' },
                  { id: 'CT_ABDOMEN_PELVIS', label: 'CT Abdomen / Pelvis' },
                  { id: 'CXR', label: 'Chest X-Ray' },
                  { id: 'LUMBAR_PUNCTURE', label: 'Lumbar Puncture (CSF)' }
                ].map((test) => {
                  const isOrdered = orderedInvestigationIds.includes(test.id);
                  return (
                    <button
                      key={test.id}
                      onClick={() => handleOrderInvestigation(test.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        isOrdered
                          ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold truncate">{test.label}</span>
                        {isOrdered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Diagnostic Results Feed */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-300">Diagnostic Reports Returned:</span>
                {diagnosticResults.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-4 text-center rounded-xl bg-slate-950/50 border border-slate-800">
                    No diagnostic tests ordered. Select investigations above to review formal lab and imaging reports.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
                    {diagnosticResults.map((test, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                          <span className="font-bold text-emerald-400">{test.testName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            Turnaround: {test.turnaroundMinutes} min
                          </span>
                        </div>

                        {/* Results Table */}
                        <div className="space-y-1 text-[11px]">
                          {test.results.map((r, rIdx) => (
                            <div key={rIdx} className="flex justify-between py-0.5 border-b border-slate-900">
                              <span className="text-slate-400">{r.parameter}</span>
                              <span className={`font-mono font-semibold ${r.isCritical ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                                {r.value} <span className="text-[9px] font-normal text-slate-500">({r.referenceRange})</span>
                              </span>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs text-slate-300 pt-1 leading-relaxed italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                          &bull; Radiologist / Pathologist Impression: {test.formalReport}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SOAP NOTE & OSCE EVALUATOR */}
          {activeTab === 'soap' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Clinical SOAP Note Documentation</h3>
                  <p className="text-[11px] text-slate-400">Author clinical charting and submit for automated OSCE rubric scoring.</p>
                </div>
                <button
                  onClick={handleGradeSoapNote}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-700/30"
                >
                  <Award className="w-4 h-4" />
                  Grade OSCE Note
                </button>
              </div>

              {/* SOAP Input Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Subjective (HPI &amp; Review of Systems):</label>
                  <textarea
                    rows={2}
                    placeholder="Document patient's history, symptom onset, quality, radiation, and pertinent negatives..."
                    value={soapSubjective}
                    onChange={(e) => setSoapSubjective(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Objective (Vitals, Physical Exam &amp; Diagnostics):</label>
                  <textarea
                    rows={2}
                    placeholder="Document examination findings and diagnostic investigation results..."
                    value={soapObjective}
                    onChange={(e) => setSoapObjective(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Primary Clinical Diagnosis:</label>
                    <input
                      type="text"
                      placeholder="e.g. Acute Appendicitis"
                      value={primaryDiagnosisInput}
                      onChange={(e) => setPrimaryDiagnosisInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Differential Diagnoses (comma separated):</label>
                    <input
                      type="text"
                      placeholder="e.g. Mesenteric Adenitis, Diverticulitis"
                      value={differentialsInput}
                      onChange={(e) => setDifferentialsInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Plan (Medical, Surgical &amp; Safety Precautions):</label>
                  <textarea
                    rows={2}
                    placeholder="Document immediate resuscitation, targeted pharmacotherapy, specialist consults, and allergy checks..."
                    value={soapPlan}
                    onChange={(e) => setSoapPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* OSCE Automated Scorecard */}
              {osceResult && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OSCE Competency Evaluation</span>
                      <div className="text-xl font-bold text-white mt-0.5">
                        Score: <span className="text-emerald-400">{osceResult.overallScorePercentage}%</span> &bull; Grade: <span className="text-emerald-400">{osceResult.letterGrade}</span>
                      </div>
                    </div>
                    {osceResult.criticalSafetyViolation && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-800 animate-pulse flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" /> SAFETY VIOLATION
                      </span>
                    )}
                  </div>

                  {/* Competency Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400">History (25)</span>
                      <div className="text-sm font-bold text-white mt-1">{osceResult.sectionScores.historyTaking.score}/25</div>
                      <span className="text-[9px] text-slate-500">{osceResult.sectionScores.historyTaking.percentage}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Exam (20)</span>
                      <div className="text-sm font-bold text-white mt-1">{osceResult.sectionScores.physicalExam.score}/20</div>
                      <span className="text-[9px] text-slate-500">{osceResult.sectionScores.physicalExam.percentage}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Diagnostics (20)</span>
                      <div className="text-sm font-bold text-white mt-1">{osceResult.sectionScores.diagnosticStewardship.score}/20</div>
                      <span className="text-[9px] text-slate-500">{osceResult.sectionScores.diagnosticStewardship.percentage}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Differential (20)</span>
                      <div className="text-sm font-bold text-white mt-1">{osceResult.sectionScores.differentialAccuracy.score}/20</div>
                      <span className="text-[9px] text-slate-500">{osceResult.sectionScores.differentialAccuracy.percentage}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400">Plan &amp; Safety (15)</span>
                      <div className="text-sm font-bold text-white mt-1">{osceResult.sectionScores.patientSafetyAndPlan.score}/15</div>
                      <span className="text-[9px] text-slate-500">{osceResult.sectionScores.patientSafetyAndPlan.percentage}%</span>
                    </div>
                  </div>

                  {/* Feedback Bullets */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <span className="font-bold text-slate-300">Actionable OSCE Feedback:</span>
                    {osceResult.actionableFeedback.map((fb, idx) => (
                      <div key={idx} className="text-slate-300 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-400 font-bold">&bull;</span>
                        <span>{fb}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CLINICAL DEBRIEF */}
          {activeTab === 'debrief' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Case Debrief &amp; Hidden Gold Standard Guide
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-400">Definitive Diagnosis &amp; ICD-10:</span>
                  <div className="text-sm font-bold text-white">{persona.underlyingDiagnosis} (ICD-10: {persona.icd10Code})</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300">Critical Clinical Facts in this Case:</span>
                  <div className="space-y-1.5">
                    {persona.clinicalFacts.map((fact) => {
                      const isFound = currentFacts.find((f) => f.id === fact.id)?.revealed;
                      return (
                        <div key={fact.id} className="flex items-start gap-2 text-[11px]">
                          {isFound ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          )}
                          <span className={isFound ? 'text-slate-200' : 'text-slate-500'}>
                            {fact.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-300">Contraindications &amp; High-Stakes Hazards:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {persona.contraindicationsOrAllergies.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}