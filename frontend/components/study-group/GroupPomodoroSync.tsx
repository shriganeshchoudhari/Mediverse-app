'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Award, 
  Target, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Headphones, 
  MessageSquare, 
  Coffee, 
  Brain, 
  Stethoscope,
  Smile,
  Edit3,
  ChevronRight,
  Clock
} from 'lucide-react';

interface GroupPomodoroSyncProps {
  roomId?: string;
  roomName?: string;
  userId?: string;
  userName?: string;
}

type PomodoroMode = 'standard' | 'deep';
type PomodoroPhase = 'focus' | 'break';
type StudyStatus = '🧠 In Deep Focus' | '☕ On Break' | '💬 Question Asked' | '🩺 Reviewing Case';
type AmbientSoundType = 'mute' | 'rain' | 'alpha' | 'library';

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: StudyStatus;
  goal: string;
  blocksCompleted: number;
  isOnline: boolean;
  kudosCount: number;
}

const PRESET_GOALS = [
  'Review 20 Renal Flashcards',
  'Complete Acid-Base Case Simulation',
  'Cardiology ECGs (WPW & STEMI)',
  'Pharm Antiarrhythmics Class I-IV',
  'Anatomy Circle of Willis & Aneurysms',
  'Pathology Glomerulonephritis Biopsies'
];

const INITIAL_PEERS: Participant[] = [
  {
    id: 'peer-1',
    name: 'Sarah Chen',
    role: 'MS3 • Nephrology Focus',
    avatar: 'SC',
    status: '🧠 In Deep Focus',
    goal: 'Review 20 Renal Flashcards',
    blocksCompleted: 3,
    isOnline: true,
    kudosCount: 4,
  },
  {
    id: 'peer-2',
    name: 'Marcus Vance',
    role: 'PGY-1 • Emergency Med',
    avatar: 'MV',
    status: '🧠 In Deep Focus',
    goal: 'Reviewing ICU Ventilation Modes',
    blocksCompleted: 4,
    isOnline: true,
    kudosCount: 7,
  },
  {
    id: 'peer-3',
    name: 'Aisha Patel',
    role: 'MS4 • Cardiology Sub-I',
    avatar: 'AP',
    status: '☕ On Break',
    goal: 'Emergency Tox: Acetaminophen Overdose',
    blocksCompleted: 2,
    isOnline: true,
    kudosCount: 2,
  },
  {
    id: 'peer-4',
    name: 'David Kim',
    role: 'Dental-2 • Oral Surgery',
    avatar: 'DK',
    status: '💬 Question Asked',
    goal: 'Maxillary Nerve Block Pathways',
    blocksCompleted: 1,
    isOnline: true,
    kudosCount: 1,
  },
];

export function GroupPomodoroSync({
  roomId = 'study-group-default',
  roomName = 'Clinical Cohort Alpha',
  userId = 'user-current',
  userName = 'Student',
}: GroupPomodoroSyncProps) {
  // Timer Mode Settings (in seconds)
  const [mode, setMode] = useState<PomodoroMode>('standard');
  const focusDuration = mode === 'standard' ? 25 * 60 : 50 * 60;
  const breakDuration = mode === 'standard' ? 5 * 60 : 10 * 60;

  // Timer State
  const [phase, setPhase] = useState<PomodoroPhase>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentInterval, setCurrentInterval] = useState<number>(1);
  const [totalCompletedBlocks, setTotalCompletedBlocks] = useState<number>(0);
  const [earnedXP, setEarnedXP] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [kudosToast, setKudosToast] = useState<string | null>(null);

  // Goal State
  const [userGoal, setUserGoal] = useState<string>('Review 20 Renal Flashcards');
  const [goalInput, setGoalInput] = useState<string>('Review 20 Renal Flashcards');
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);

  // Status State
  const [userStatus, setUserStatus] = useState<StudyStatus>('🧠 In Deep Focus');
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PEERS);

  // Ambient Audio State
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('mute');
  const [volume, setVolume] = useState<number>(0.4);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{
    source?: AudioNode;
    gain?: GainNode;
    filter?: BiquadFilterNode;
    osc1?: OscillatorNode;
    osc2?: OscillatorNode;
  }>({});

  // Initialize Timer duration on mode switch when not running
  const handleModeChange = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    const newFocus = newMode === 'standard' ? 25 * 60 : 50 * 60;
    const newBreak = newMode === 'standard' ? 5 * 60 : 10 * 60;
    setTimeLeft(phase === 'focus' ? newFocus : newBreak);
  };

  // Web Audio Synth Generator for Ambient Sound
  const stopAmbientAudio = useCallback(() => {
    try {
      if (soundNodesRef.current.source) {
        (soundNodesRef.current.source as any).stop?.();
        soundNodesRef.current.source.disconnect();
      }
      if (soundNodesRef.current.osc1) {
        soundNodesRef.current.osc1.stop();
        soundNodesRef.current.osc1.disconnect();
      }
      if (soundNodesRef.current.osc2) {
        soundNodesRef.current.osc2.stop();
        soundNodesRef.current.osc2.disconnect();
      }
      if (soundNodesRef.current.gain) {
        soundNodesRef.current.gain.disconnect();
      }
      soundNodesRef.current = {};
    } catch (e) {
      console.warn('Error stopping ambient audio:', e);
    }
  }, []);

  const playChime = useCallback(() => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6 arpeggio
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.65);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }, []);

  const startAmbientAudio = useCallback((type: AmbientSoundType, vol: number) => {
    stopAmbientAudio();
    if (type === 'mute') {
      setIsAudioPlaying(false);
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * 0.35, ctx.currentTime);
      masterGain.connect(ctx.destination);
      soundNodesRef.current.gain = masterGain;

      if (type === 'rain') {
        // Generate Pink/Brownish noise with Bandpass filter for soothing rain simulation
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, ctx.currentTime);
        filter.Q.setValueAtTime(0.7, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        soundNodesRef.current.source = noise;
        soundNodesRef.current.filter = filter;
      } else if (type === 'alpha') {
        // Binaural Alpha Beat (216 Hz & 226 Hz -> 10Hz Alpha differential)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc2.frequency.setValueAtTime(226, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        soundNodesRef.current.osc1 = osc1;
        soundNodesRef.current.osc2 = osc2;
        soundNodesRef.current.filter = filter;
      } else if (type === 'library') {
        // Warm low-pass filtered brownian noise (gentle atmospheric hum)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 2.8;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        soundNodesRef.current.source = noise;
        soundNodesRef.current.filter = filter;
      }

      setIsAudioPlaying(true);
    } catch (e) {
      console.warn('Error starting ambient sound:', e);
    }
  }, [stopAmbientAudio]);

  // Adjust volume dynamically
  useEffect(() => {
    if (soundNodesRef.current.gain && audioCtxRef.current) {
      soundNodesRef.current.gain.gain.setValueAtTime(volume * 0.35, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [stopAmbientAudio]);

  // Timer Tick Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed current phase!
      if (phase === 'focus') {
        playChime();
        setTotalCompletedBlocks((prev) => prev + 1);
        setEarnedXP((prev) => prev + 25);
        setShowCompletionModal(true);
        setPhase('break');
        setTimeLeft(breakDuration);
        setUserStatus('☕ On Break');
      } else {
        playChime();
        setPhase('focus');
        setTimeLeft(focusDuration);
        setCurrentInterval((prev) => (prev % 4) + 1);
        setUserStatus('🧠 In Deep Focus');
      }
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, phase, breakDuration, focusDuration, playChime]);

  // Format Time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress Calculation
  const totalPhaseDuration = phase === 'focus' ? focusDuration : breakDuration;
  const progressPercent = Math.min(100, Math.max(0, ((totalPhaseDuration - timeLeft) / totalPhaseDuration) * 100));
  const strokeDashoffset = 565.48 - (565.48 * progressPercent) / 100;

  // Handlers
  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
    if (!isRunning && ambientSound !== 'mute' && !isAudioPlaying) {
      startAmbientAudio(ambientSound, volume);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(phase === 'focus' ? focusDuration : breakDuration);
  };

  const handleSkipPhase = () => {
    setIsRunning(false);
    if (phase === 'focus') {
      setPhase('break');
      setTimeLeft(breakDuration);
      setUserStatus('☕ On Break');
    } else {
      setPhase('focus');
      setTimeLeft(focusDuration);
      setCurrentInterval((prev) => (prev % 4) + 1);
      setUserStatus('🧠 In Deep Focus');
    }
  };

  const handleSaveGoal = () => {
    if (goalInput.trim()) {
      setUserGoal(goalInput.trim());
      setIsEditingGoal(false);
    }
  };

  const handleGiveKudos = (peerId: string, peerName: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === peerId ? { ...p, kudosCount: p.kudosCount + 1 } : p))
    );
    setKudosToast(`🙌 Sent high-five to ${peerName}!`);
    setTimeout(() => setKudosToast(null), 3000);
  };

  const handleAudioSelect = (type: AmbientSoundType) => {
    setAmbientSound(type);
    if (type === 'mute') {
      stopAmbientAudio();
      setIsAudioPlaying(false);
    } else {
      startAmbientAudio(type, volume);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* Toast Notification */}
      {kudosToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="h-5 w-5 text-amber-300" />
          <span className="font-medium text-sm">{kudosToast}</span>
        </div>
      )}

      {/* Header Banner with Synced Cohort Badge */}
      <div className="bg-gradient-to-r from-indigo-900/90 via-blue-900/90 to-purple-900/90 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Live Cohort Sync Active
              </span>
              <span className="text-xs text-indigo-200">
                {participants.length + 1} Medical Scholars Synchronized
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1 text-white tracking-tight flex items-center gap-2">
              <span>⏱️</span> Group Pomodoro & Clinical Study Cohort
            </h2>
            <p className="text-sm text-indigo-200/90 mt-0.5">
              Room: <span className="font-semibold text-white">{roomName}</span> • Synchronized focus intervals with automated +25 XP rewards.
            </p>
          </div>

          {/* XP & Stats Summary Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Sparkles className="h-5 w-5 fill-amber-300" />
              <div>
                <div className="text-xs text-indigo-200 font-normal uppercase">Cohort XP Earned</div>
                <div className="text-lg leading-tight">+{earnedXP} XP</div>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Flame className="h-5 w-5 fill-emerald-300" />
              <div>
                <div className="text-xs text-indigo-200 font-normal uppercase">Blocks Logged</div>
                <div className="text-lg leading-tight">{totalCompletedBlocks} Blocks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Timer on Left, Goals & Ambience on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pomodoro Circular Timer & Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800/90 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-between">
          
          {/* Mode Selector Tabs */}
          <div className="w-full flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-4">
            <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => handleModeChange('standard')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  mode === 'standard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Standard (25m / 5m)
              </button>
              <button
                onClick={() => handleModeChange('deep')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  mode === 'deep'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🔬 Deep Clinical (50m / 10m)
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-md">
                Interval {currentInterval} of 4
              </span>
            </div>
          </div>

          {/* Circular SVG Timer */}
          <div className="relative w-64 h-64 my-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background Ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-100 dark:text-slate-700/40"
              />
              {/* Progress Ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  phase === 'focus'
                    ? 'text-indigo-600 dark:text-indigo-500'
                    : 'text-emerald-500 dark:text-emerald-400'
                }`}
              />
            </svg>

            {/* Center Content */}
            <div className="absolute flex flex-col items-center text-center px-4">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-1 ${
                  phase === 'focus'
                    ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50'
                    : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50'
                }`}
              >
                {phase === 'focus' ? '🎯 Focus Session' : '☕ Cohort Break'}
              </span>
              <div className="text-5xl font-black tracking-tighter font-mono my-1 text-slate-900 dark:text-white">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[170px] truncate">
                {userGoal}
              </div>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="w-full flex items-center justify-center gap-4 mt-2 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <button
              onClick={handleReset}
              title="Reset Timer"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className={`px-8 py-3.5 rounded-xl font-bold text-base flex items-center gap-2.5 shadow-lg transition transform active:scale-95 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 fill-white" /> Pause Session
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-white" /> Start Cohort Focus
                </>
              )}
            </button>

            <button
              onClick={handleSkipPhase}
              title="Skip to Next Phase"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          {/* Status Quick Selector */}
          <div className="w-full mt-4 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">My Live Status:</span>
            <div className="flex gap-1.5 flex-wrap">
              {(['🧠 In Deep Focus', '☕ On Break', '💬 Question Asked', '🩺 Reviewing Case'] as StudyStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setUserStatus(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                    userStatus === st
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                      : 'bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Declared Focus Goal & Ambient Sound Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Declared Goal Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  My Session Focus Goal
                </h3>
              </div>
              {!isEditingGoal && (
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit Goal
                </button>
              )}
            </div>

            {isEditingGoal ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="e.g. Complete 20 Renal Flashcards..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingGoal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGoal}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Save Goal
                  </button>
                </div>

                {/* Preset suggestions */}
                <div className="pt-2">
                  <span className="text-xs text-slate-400 font-medium">Quick Medical Presets:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {PRESET_GOALS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setGoalInput(preset);
                          setUserGoal(preset);
                          setIsEditingGoal(false);
                        }}
                        className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-300 transition text-left"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-xl border border-indigo-100 dark:border-indigo-800/40">
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  Active Focus Target
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-base">
                  &ldquo;{userGoal}&rdquo;
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Declared to cohort &bull; Completion awards +25 XP
                </div>
              </div>
            )}
          </div>

          {/* Ambient Focus Audio Engine */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Focus Sound Ambience
                </h3>
              </div>
              {isAudioPlaying && ambientSound !== 'mute' && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Playing
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Synthetic Web Audio sound generator for deep focus without external downloads.
            </p>

            {/* Audio Toggle Options */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handleAudioSelect('rain')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  ambientSound === 'rain'
                    ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xl">🌧️</span>
                <div>
                  <div className="text-xs font-bold">Rainfall</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Pink noise filter</div>
                </div>
              </button>

              <button
                onClick={() => handleAudioSelect('alpha')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  ambientSound === 'alpha'
                    ? 'bg-purple-50 dark:bg-purple-900/40 border-purple-500 text-purple-700 dark:text-purple-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xl">🧘</span>
                <div>
                  <div className="text-xs font-bold">Alpha Waves</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">10Hz Binaural tone</div>
                </div>
              </button>

              <button
                onClick={() => handleAudioSelect('library')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  ambientSound === 'library'
                    ? 'bg-amber-50 dark:bg-amber-900/40 border-amber-500 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xl">📚</span>
                <div>
                  <div className="text-xs font-bold">Quiet Library</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Warm room hum</div>
                </div>
              </button>

              <button
                onClick={() => handleAudioSelect('mute')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  ambientSound === 'mute'
                    ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 text-slate-900 dark:text-white font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xl">🔇</span>
                <div>
                  <div className="text-xs font-bold">Mute</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Silent focus</div>
                </div>
              </button>
            </div>

            {/* Volume Slider */}
            {ambientSound !== 'mute' && (
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <Volume2 className="h-4 w-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-xs font-mono text-slate-400 w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Cohort Live Presence & Member Cards */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-indigo-500" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Cohort Presence & Active Study Goals
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live statuses of study partners working synchronously with you.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20">
            {participants.length + 1} Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Current User Card */}
          <div className="p-4 rounded-xl border-2 border-indigo-500/40 bg-indigo-50/30 dark:bg-indigo-950/20 relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
              YOU
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{userName}</div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{userStatus}</div>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Goal: </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{userGoal}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>🔥 {totalCompletedBlocks} blocks logged</span>
              <span className="font-semibold text-amber-500">+{earnedXP} XP</span>
            </div>
          </div>

          {/* Cohort Peers */}
          {participants.map((peer) => (
            <div
              key={peer.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm">
                    {peer.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{peer.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{peer.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleGiveKudos(peer.id, peer.name)}
                  title="Send High-Five"
                  className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 transition flex items-center gap-1"
                >
                  <span>🙌</span> {peer.kudosCount}
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    peer.status === '🧠 In Deep Focus'
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                      : peer.status === '☕ On Break'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {peer.status}
                </span>
              </div>

              {/* Goal */}
              <div className="mt-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Goal: </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{peer.goal}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>🔥 {peer.blocksCompleted} blocks</span>
                <span className="text-emerald-500 font-medium">Synced</span>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Focus Block Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30 text-3xl">
              🌟
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Focus Block Completed!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Outstanding discipline! You conquered another synchronized clinical focus interval.
            </p>

            {/* XP Award Pill */}
            <div className="my-6 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-amber-500" />
              <div className="text-left">
                <div className="text-xs text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider">Reward Earned</div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">+25 XP Awarded</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                <div className="text-slate-400 font-medium">Session Blocks</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{totalCompletedBlocks} Blocks</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                <div className="text-slate-400 font-medium">Total Focus Time</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {totalCompletedBlocks * (mode === 'standard' ? 25 : 50)} Mins
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setIsRunning(true);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
              >
                Start {mode === 'standard' ? '5m' : '10m'} Break ☕
              </button>
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setPhase('focus');
                  setTimeLeft(focusDuration);
                  setIsRunning(true);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-sm transition"
              >
                Next Focus Block 🎯
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
