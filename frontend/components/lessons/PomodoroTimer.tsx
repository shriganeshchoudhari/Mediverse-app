"use client";

import React, { useState, useEffect, useRef } from 'react';

type TimerMode = 'WORK' | 'BREAK';

export default function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TimerMode>('WORK');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (mode === 'WORK') {
      setCompletedSessions((prev) => prev + 1);
      setMode('BREAK');
      setTimeLeft(5 * 60);
      
      // Award XP for completion
      const token = localStorage.getItem("token");
      if (token) {
        // Assume an endpoint exists or reuse progress endpoint
        // For now, we'll just log it or simulate it
        console.log("Awarded 10 XP for Pomodoro completion!");
      }
    } else {
      setMode('WORK');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'WORK' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'WORK' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-slate-900 hover:bg-slate-800 text-white shadow-lg border border-slate-700 rounded-full h-14 px-6 flex items-center justify-center font-bold tracking-wide transition-all z-40 group"
      >
        <span className="mr-2 text-xl">⏱️</span> Focus Timer
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-72 z-50 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-slate-950 border-b border-slate-800">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
          <span>⏱️</span> Focus Timer
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition">
          ✕
        </button>
      </div>
      
      <div className="p-5 flex flex-col items-center">
        <div className="flex gap-2 mb-4 bg-slate-950 p-1 rounded-lg w-full">
          <button 
            onClick={() => switchMode('WORK')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${mode === 'WORK' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Work (25m)
          </button>
          <button 
            onClick={() => switchMode('BREAK')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${mode === 'BREAK' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Break (5m)
          </button>
        </div>

        <div className="text-5xl font-black text-white mb-6 font-mono tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-3 w-full">
          <button 
            onClick={toggleTimer}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={resetTimer}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-500 font-semibold uppercase">Sessions Completed</span>
        <span className="text-sm font-bold text-blue-400">{completedSessions}</span>
      </div>
    </div>
  );
}
