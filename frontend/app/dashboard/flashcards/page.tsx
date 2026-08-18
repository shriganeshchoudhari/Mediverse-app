"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Star, RefreshCw, CheckCircle, BarChart2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Card {
  id: number;
  deck: string;
  front: string;
  back: string;
  interval: number; // days
  repetition: number;
  ef: number; // easiness factor
}

export default function FlashcardsDashboard() {
  const initialCards: Card[] = [
    { id: 1, deck: "Cardiovascular", front: "Which band does NOT change length during contraction?", back: "The A band (length of thick myosin filaments).", interval: 1, repetition: 0, ef: 2.5 },
    { id: 2, deck: "Renal", front: "What binds to Troponin C to initiate contraction?", back: "Calcium ($Ca^{2+}$) ions.", interval: 1, repetition: 0, ef: 2.5 },
    { id: 3, deck: "Respiratory", front: "What does the peak of the flow-volume loop represent?", back: "Peak Expiratory Flow (PEF).", interval: 1, repetition: 0, ef: 2.5 },
    { id: 4, deck: "Cardiovascular", front: "What does a prolonged PR interval (> 0.20s) indicate?", back: "First-degree AV nodal block.", interval: 1, repetition: 0, ef: 2.5 },
    { id: 5, deck: "Renal", front: "Which transporter is targeted by loop diuretics (e.g. furosemide)?", back: "The NKCC2 cotransporter in the thick ascending limb.", interval: 1, repetition: 0, ef: 2.5 }
  ];

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [activeDeck, setActiveDeck] = useState<string>("All Decks");
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(180);
  const [streak, setStreak] = useState<number>(5);

  const filteredCards = cards.filter(c => activeDeck === "All Decks" || c.deck === activeDeck);
  const currentCard = filteredCards[currentCardIdx] || null;

  // Spaced Repetition (SM-2) Grading
  const handleGrade = (quality: number) => {
    if (!currentCard) return;

    // Calculate new SM-2 parameters
    let nextInterval = 1;
    let nextRepetition = currentCard.repetition;
    let nextEf = currentCard.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    nextEf = Math.max(1.3, nextEf);

    if (quality < 3) {
      nextInterval = 1;
      nextRepetition = 0;
    } else {
      if (currentCard.repetition === 0) {
        nextInterval = 1;
      } else if (currentCard.repetition === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(currentCard.interval * nextEf);
      }
      nextRepetition += 1;
      setXp(x => x + 15); // Award 15 XP on correct recall
    }

    // Update local card state
    setCards(prev => prev.map(c => {
      if (c.id === currentCard.id) {
        return { ...c, interval: nextInterval, repetition: nextRepetition, ef: nextEf };
      }
      return c;
    }));

    setIsFlipped(false);
    
    // Go to next card in filtered deck
    if (currentCardIdx < filteredCards.length - 1) {
      setCurrentCardIdx(prev => prev + 1);
    } else {
      setCurrentCardIdx(0);
      alert("Review complete! All cards in this deck have been scheduled.");
    }
  };

  // Retention visual data (forgetting curve)
  const curveData = [
    { day: "Day 1", retention: 100 },
    { day: "Day 2", retention: 90 },
    { day: "Day 3", retention: 83 },
    { day: "Day 4", retention: 78 },
    { day: "Day 5", retention: 75 },
    { day: "Day 6", retention: 72 },
    { day: "Day 7", retention: 70 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-sky-500" /> Spaced Repetition (SM-2) Deck
            </h1>
            <p className="text-slate-450 text-sm md:text-base mt-1">
              Optimize long-term recall for MBBS boards. The SuperMemo-2 algorithm manages your card schedule.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center shadow-lg">
              <div className="text-[10px] text-slate-500 uppercase font-black">Retention Streak</div>
              <div className="text-sm font-bold text-amber-400">🔥 {streak} Days</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center shadow-lg">
              <div className="text-[10px] text-slate-500 uppercase font-black">Syllabus XP</div>
              <div className="text-sm font-bold text-sky-400">⭐ {xp} XP</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Deck List Side Column */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-450 mb-1">Your Decks</h2>
            {["All Decks", "Cardiovascular", "Renal", "Respiratory"].map((deck, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveDeck(deck);
                  setCurrentCardIdx(0);
                  setIsFlipped(false);
                }}
                className={`w-full text-left p-4 rounded-xl border text-xs font-semibold transition ${
                  activeDeck === deck 
                    ? 'bg-sky-600/10 border-sky-500 text-sky-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>📁 {deck}</span>
              </button>
            ))}
          </div>

          {/* Core Flashcard Interface */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {currentCard ? (
              <div className="flex flex-col gap-6">
                {/* 3D Flashcard Flip Mechanics */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`relative w-full h-80 rounded-3xl border cursor-pointer select-none transition-all duration-500 flex flex-col items-center justify-center p-8 text-center shadow-xl ${
                    isFlipped 
                      ? 'bg-slate-900 border-sky-500/40 text-slate-100' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute top-4 left-4 text-[10px] font-black uppercase bg-slate-950 px-2 py-0.5 rounded text-sky-400 border border-slate-800">
                    {currentCard.deck}
                  </span>
                  
                  <div className="text-base leading-relaxed font-bold">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </div>

                  <span className="absolute bottom-4 text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                    Click card to flip
                  </span>
                </div>

                {/* Grading Controls (Only visible when flipped) */}
                {isFlipped ? (
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleGrade(1)}
                      className="py-3 px-4 bg-red-650 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition flex flex-col items-center gap-1"
                    >
                      <span>Again</span>
                      <span className="text-[9px] text-red-200 font-normal">Next review: 1d</span>
                    </button>

                    <button
                      onClick={() => handleGrade(4)}
                      className="py-3 px-4 bg-sky-650 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition flex flex-col items-center gap-1"
                    >
                      <span>Good</span>
                      <span className="text-[9px] text-sky-200 font-normal">Next review: 6d</span>
                    </button>

                    <button
                      onClick={() => handleGrade(5)}
                      className="py-3 px-4 bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex flex-col items-center gap-1"
                    >
                      <span>Easy</span>
                      <span className="text-[9px] text-emerald-200 font-normal">Next review: 12d</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-xl text-xs transition"
                  >
                    Show Answer
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Deck Completed</h3>
                <p className="text-xs text-slate-450">No cards due for review in this deck.</p>
              </div>
            )}
          </div>

          {/* Retention Chart & Stat Analytics */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[280px]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-sky-400" /> Retention Curve
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curveData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#1e293b",
                        borderRadius: "6px",
                        color: "#fff",
                        fontSize: "10px",
                      }}
                    />
                    <Line type="monotone" dataKey="retention" name="Retention %" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
