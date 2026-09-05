'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  getPersonaForCase,
  parseCandidateQuery,
  computeHistoryCoverage,
  HISTORY_DIMENSIONS,
  HistoryDimension,
  PatientPersona,
  HistoryCoverageReport,
  ParsedCandidateTurn
} from '@/.gemini/skills/SimulatedPatientPersonaEngine';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Activity,
  User,
  HeartPulse,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface DialogueMessage {
  id: string;
  sender: 'candidate' | 'patient';
  text: string;
  dimension?: HistoryDimension;
  isJargon?: boolean;
  emotion?: 'pain' | 'reassured' | 'confused' | 'neutral';
  timestamp: string;
}

interface SimulatedPatientVoiceStationProps {
  caseId: string;
  onCoverageUpdate?: (report: HistoryCoverageReport) => void;
  className?: string;
}

export default function SimulatedPatientVoiceStation({
  caseId,
  onCoverageUpdate,
  className = ''
}: SimulatedPatientVoiceStationProps) {
  const persona: PatientPersona = useMemo(() => getPersonaForCase(caseId), [caseId]);

  // Dialogue state
  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: 'init-0',
      sender: 'patient',
      text: `Hello doctor... *clutches complaint area* I'm ${persona.name}. Please help me, ${persona.chiefComplaint.toLowerCase()}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakingTts, setIsSpeakingTts] = useState<boolean>(false);
  const [showCoverageDetails, setShowCoverageDetails] = useState<boolean>(false);

  // Covered dimensions set
  const [coveredDimensions, setCoveredDimensions] = useState<Set<HistoryDimension>>(new Set<HistoryDimension>());

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Compute coverage
  const coverageReport = useMemo(() => {
    return computeHistoryCoverage(coveredDimensions);
  }, [coveredDimensions]);

  // Notify parent of coverage updates
  useEffect(() => {
    if (onCoverageUpdate) {
      onCoverageUpdate(coverageReport);
    }
  }, [coverageReport, onCoverageUpdate]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleSendMessage(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech function
  const speakText = useCallback((text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    // Strip emotional stage cues enclosed in asterisks (e.g. *groaning*) for cleaner TTS
    const cleanedText = text.replace(/\*.*?\*/g, '').trim();
    if (!cleanedText) return;

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.pitch = persona.voicePitch;
    utterance.rate = persona.voiceRate;

    utterance.onstart = () => setIsSpeakingTts(true);
    utterance.onend = () => setIsSpeakingTts(false);
    utterance.onerror = () => setIsSpeakingTts(false);

    window.speechSynthesis.speak(utterance);
  }, [isMuted, persona.voicePitch, persona.voiceRate]);

  // Toggle Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
        setIsListening(false);
      }
    }
  };

  // Submit message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add Candidate message
    const candidateMsg: DialogueMessage = {
      id: `cand-${Date.now()}`,
      sender: 'candidate',
      text,
      timestamp: now
    };

    // 2. Parse query against persona
    const parsed: ParsedCandidateTurn = parseCandidateQuery(text, persona);

    // 3. Update covered dimensions
    if (parsed.matchedDimension) {
      setCoveredDimensions(prev => new Set<HistoryDimension>([...Array.from(prev), parsed.matchedDimension!]));
    }

    // 4. Add Patient response message
    const patientMsg: DialogueMessage = {
      id: `pt-${Date.now() + 1}`,
      sender: 'patient',
      text: parsed.response,
      dimension: parsed.matchedDimension,
      isJargon: parsed.isJargonWarning,
      emotion: parsed.detectedEmotion,
      timestamp: now
    };

    setMessages(prev => [...prev, candidateMsg, patientMsg]);
    setInputValue('');

    // Trigger TTS
    speakText(parsed.response);
  };

  // Reset interview
  const handleResetInterview = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeakingTts(false);
    }
    setCoveredDimensions(new Set<HistoryDimension>());
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'patient',
        text: `Hello doctor... *clutches complaint area* I'm ${persona.name}. Please help me, ${persona.chiefComplaint.toLowerCase()}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Helper to format emotional stage directions
  const formatDialogueText = (raw: string) => {
    const parts = raw.split(/(\*.*?\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <span key={idx} className="italic text-amber-400 font-medium font-serif mx-1">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Badge color based on affect
  const getAffectBadge = (affect: string) => {
    switch (affect) {
      case 'ANXIOUS_PAIN':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'BREATHLESS':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'GUARDED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CONFUSED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className={`bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col ${className}`}>
      
      {/* Patient Bedside Header Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-black text-sm flex items-center justify-center">
              {persona.name.split(' ').map(n => n[0]).join('')}
            </div>
            {isSpeakingTts && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">{persona.name}</h3>
              <span className="text-xs text-slate-400">({persona.age}y, {persona.gender})</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getAffectBadge(persona.affect)}`}>
                {persona.affect.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-lg truncate">
              {persona.affectDescription}
            </p>
          </div>
        </div>

        {/* Audio Mute & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!isMuted && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setIsSpeakingTts(false);
              }
              setIsMuted(!isMuted);
            }}
            title={isMuted ? 'Unmute Patient Speech' : 'Mute Patient Speech'}
            className={`p-2 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 ${
              isMuted
                ? 'bg-slate-800/80 text-slate-400 border-slate-700'
                : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMuted ? 'Voice Off' : 'Voice On'}</span>
          </button>

          <button
            onClick={handleResetInterview}
            title="Restart Patient Encounter"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Coverage Score Bar */}
      <div className="bg-slate-900/40 border-b border-slate-800 px-4 py-2.5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">History-Taking Coverage (SOCRATES):</span>
            <span className={`font-mono font-bold ${
              coverageReport.scorePercentage >= 80
                ? 'text-emerald-400'
                : coverageReport.scorePercentage >= 50
                ? 'text-blue-400'
                : 'text-amber-400'
            }`}>
              {coverageReport.scorePercentage}% Complete
            </span>
          </div>

          <button
            onClick={() => setShowCoverageDetails(!showCoverageDetails)}
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
          >
            <span>{showCoverageDetails ? 'Hide Dimensions' : 'View Checklist'}</span>
            {showCoverageDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${coverageReport.scorePercentage}%` }}
          />
        </div>

        {/* Expandable SOCRATES Dimension Badges */}
        {showCoverageDetails && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            {HISTORY_DIMENSIONS.map((dim) => {
              const isCovered = coveredDimensions.has(dim.id);
              return (
                <div
                  key={dim.id}
                  className={`p-2 rounded-lg border transition flex items-center gap-2 ${
                    isCovered
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isCovered ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <div className="truncate">
                    <span className="font-bold">{dim.shortLabel}</span>
                    <span className="text-[9px] opacity-70 ml-1">({dim.socratesCode})</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Conversation Transcript Area */}
      <div className="p-4 overflow-y-auto max-h-[380px] min-h-[260px] space-y-3.5 bg-slate-950/60">
        {messages.map((msg) => {
          const isCandidate = msg.sender === 'candidate';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-slate-500 font-mono">
                <span>{isCandidate ? 'You (Candidate)' : persona.name}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.dimension && (
                  <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-sans font-bold">
                    +{msg.dimension.replace('_', ' ')}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isCandidate
                    ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs shadow-md'
                }`}
              >
                {isCandidate ? msg.text : formatDialogueText(msg.text)}

                {msg.isJargon && (
                  <div className="mt-2 pt-2 border-t border-rose-500/30 flex items-center gap-1.5 text-[11px] text-rose-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>AETCOM Tip: Avoid complex medical jargon with patients. Use lay terminology.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="bg-slate-900/40 border-t border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-400" />
          Prompts:
        </span>
        {persona.suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] whitespace-nowrap transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar (Voice & Text) */}
      <div className="bg-slate-900 p-3 border-t border-slate-800 flex items-center gap-2">
        {/* Microphone STT Button */}
        {speechSupported && (
          <button
            onClick={toggleListening}
            aria-label="Toggle microphone"
            title={isListening ? 'Stop Listening' : 'Click to Speak into Microphone'}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse ring-4 ring-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        {/* Text Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={
            isListening
              ? 'Listening to your voice... speak now...'
              : 'Ask the patient a question or explore symptoms...'
          }
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim()}
          aria-label="Send question"
          className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
