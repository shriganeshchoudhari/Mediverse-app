'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Volume2, Heart, Activity, User, Sparkles } from 'lucide-react';
import { STANDARDIZED_PATIENTS, StandardizedPatientPersona } from '@/frontend/.gemini/skills/VoicePatientPersona';

export default function AudioStreamer({ initialPersonaId = 'acute-appendicitis-01' }: { initialPersonaId?: string }) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(initialPersonaId);
  const [persona, setPersona] = useState<StandardizedPatientPersona>(STANDARDIZED_PATIENTS[initialPersonaId] || Object.values(STANDARDIZED_PATIENTS)[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ sender: 'Doctor' | 'Patient' | 'System'; text: string; time: string }>>([
    { sender: 'System', text: 'Telehealth AI Standardized Patient Session Initialized. Click mic to begin.', time: new Date().toLocaleTimeString() }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [revealedFactsCount, setRevealedFactsCount] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Switch persona
  const handlePersonaChange = (id: string) => {
    setSelectedPersonaId(id);
    const newPersona = STANDARDIZED_PATIENTS[id];
    if (newPersona) {
      setPersona(newPersona);
      setRevealedFactsCount(0);
      setTranscriptHistory([
        { sender: 'System', text: `Switched patient to ${newPersona.name} (${newPersona.age}y, ${newPersona.gender}). Chief Complaint: "${newPersona.chiefComplaint}"`, time: new Date().toLocaleTimeString() }
      ]);
    }
  };

  // Connect WebSocket
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8085';
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${wsUrl}/ws/telehealth`);

      ws.onopen = () => {
        setError(null);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'transcript') {
              setTranscriptHistory(prev => [...prev, {
                sender: 'Patient',
                text: data.message,
                time: new Date().toLocaleTimeString()
              }]);
            } else if (data.type === 'connection_established') {
              setTranscriptHistory(prev => [...prev, {
                sender: 'System',
                text: 'Connected to AI Patient Audio Pipeline.',
                time: new Date().toLocaleTimeString()
              }]);
            }
          } catch (e) {
            console.error('WS JSON parse error:', e);
          }
        }
      };

      ws.onerror = (e) => {
        console.warn('Telehealth WebSocket connection fallback active.');
      };

      wsRef.current = ws;
    } catch (err) {
      console.warn('WS initialization warning:', err);
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedPersonaId]);

  // Audio visualizer loop
  const updateVisualizer = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
      setAudioLevel(Math.min(100, Math.round(avg * 1.5)));
      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      setIsRecording(false);
      setAudioLevel(0);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup Web Audio API Analyzer for Waveform
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      updateVisualizer();

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data);
        }
      };

      mediaRecorder.start(250); // 250ms audio chunk frames
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setError(null);

      // Add doctor speaking event with simulated patient response
      const doctorSpeechTime = new Date().toLocaleTimeString();
      setTranscriptHistory(prev => [
        ...prev,
        { sender: 'Doctor', text: 'Can you describe exactly where the pain hurts and when it started?', time: doctorSpeechTime }
      ]);

      // Simulate natural patient latency & voice response
      setTimeout(() => {
        setRevealedFactsCount(prev => Math.min(persona.clinicalFacts.length, prev + 1));
        const sampleResponse = persona.clinicalFacts[0]?.fact || persona.chiefComplaint;
        setTranscriptHistory(prev => [
          ...prev,
          { sender: 'Patient', text: `(Grimacing in pain) "${sampleResponse}"`, time: new Date().toLocaleTimeString() }
        ]);
      }, 1800);

    } catch (err) {
      console.error('Microphone error:', err);
      setError('Microphone access unavailable or denied. Please check browser permissions.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Patient Profile & Vitals Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <User size={20} />
          </div>
          <div>
            <div className="font-bold text-white text-sm">{persona.name}</div>
            <div className="text-xs text-slate-400">{persona.age}y, {persona.gender} | {persona.occupation}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Heart size={16} className="text-red-400 animate-pulse" />
          <div className="text-xs">
            <span className="text-slate-400">Heart Rate:</span> <strong className="text-white font-mono">{persona.vitals.heartRate} bpm</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity size={16} className="text-blue-400" />
          <div className="text-xs">
            <span className="text-slate-400">BP:</span> <strong className="text-white font-mono">{persona.vitals.bloodPressure}</strong> | <span className="text-slate-400">SpO2:</span> <strong className="text-white font-mono">{persona.vitals.oxygenSaturation}%</strong>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <select
            value={selectedPersonaId}
            onChange={(e) => handlePersonaChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
          >
            {Object.values(STANDARDIZED_PATIENTS).map(p => (
              <option key={p.id} value={p.id}>{p.name} — {p.underlyingDiagnosis}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-300 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Live Audio Dialogue Transcript Stream */}
      <div className="bg-slate-950 rounded-xl p-4 h-64 overflow-y-auto border border-slate-800 flex flex-col gap-3 font-sans">
        {transcriptHistory.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[80%] text-sm ${
              item.sender === 'Doctor'
                ? 'ml-auto bg-indigo-600/30 border border-indigo-500/40 text-indigo-100'
                : item.sender === 'Patient'
                ? 'mr-auto bg-slate-900 border border-slate-700 text-slate-200'
                : 'mx-auto bg-slate-900/50 border border-slate-800 text-slate-400 text-xs italic text-center'
            }`}
          >
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="font-bold text-xs opacity-75">{item.sender}</span>
              <span className="text-[10px] opacity-50">{item.time}</span>
            </div>
            <p className="leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Audio Waveform & Push to Talk Controls */}
      <div className="flex items-center gap-6 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <button
          onClick={toggleRecording}
          aria-label={isRecording ? 'Mute Microphone' : 'Start Voice Consultation'}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isRecording ? <MicOff className="text-white w-6 h-6" /> : <Mic className="text-white w-6 h-6" />}
        </button>

        {/* Dynamic Voice Level Visualizer */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>{isRecording ? '🔴 MICROPHONE ACTIVE (Streaming 16kHz PCM)' : '⚪ MICROPHONE MUTED'}</span>
            <span>Clinical Discovery: {revealedFactsCount}/{persona.clinicalFacts.length} key facts</span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-75 ${
                isRecording ? (audioLevel > 60 ? 'bg-red-500' : 'bg-emerald-500') : 'bg-slate-700'
              }`}
              style={{ width: `${isRecording ? Math.max(5, audioLevel) : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
