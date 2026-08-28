'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AVAILABLE_TOPICS = [
  'Cardiovascular', 'Respiratory', 'Renal & Electrolytes',
  'Gastroenterology', 'Neurology', 'Endocrinology & Metabolism',
  'Hematology & Oncology', 'Infectious Disease', 'Pharmacology',
  'Musculoskeletal', 'Obstetrics & Gynecology', 'Pediatrics',
];

const DIFFICULTY_OPTIONS = [
  { label: 'Easy', desc: 'Recall & recognition level', value: 'easy' },
  { label: 'Medium', desc: 'Application & analysis', value: 'medium' },
  { label: 'Hard', desc: 'Synthesis & clinical judgment', value: 'hard' },
  { label: 'Mixed', desc: 'All difficulty levels', value: 'mixed' },
];

const COUNT_OPTIONS = [10, 25, 50];
const TIME_OPTIONS = [
  { label: '10 min', value: 600 },
  { label: '20 min', value: 1200 },
  { label: '40 min', value: 2400 },
  { label: 'Untimed', value: 0 },
];

export default function ExamBuilderPage() {
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Cardiovascular']);
  const [difficulty, setDifficulty] = useState('mixed');
  const [count, setCount] = useState(25);
  const [timeLimit, setTimeLimit] = useState(1200);

  const toggleTopic = (t: string) =>
    setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleBuild = () => {
    const params = new URLSearchParams({
      topics: selectedTopics.join(','),
      difficulty,
      count: String(count),
      duration: String(timeLimit),
    });
    router.push(`/exam?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/exam" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 mb-8 transition">
          ← Back to Exams
        </Link>

        <header className="mb-10">
          <div className="text-blue-400 text-xs font-bold tracking-wider uppercase mb-2">Custom Exam Builder</div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Build Your Exam</h1>
          <p className="text-slate-400 text-sm">Tailor a clinical examination session to your study goals.</p>
        </header>

        {/* Topics */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">📚 Topics <span className="text-slate-500 font-normal text-xs">({selectedTopics.length} selected)</span></h2>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TOPICS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTopic(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  selectedTopics.includes(t)
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >{t}</button>
            ))}
          </div>
        </section>

        {/* Difficulty */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">🎯 Difficulty Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DIFFICULTY_OPTIONS.map(d => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDifficulty(d.value)}
                className={`p-3 rounded-xl border text-left transition ${
                  difficulty === d.value
                    ? 'bg-blue-500/15 border-blue-500/40 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold mb-0.5">{d.label}</div>
                <div className="text-[10px] text-slate-500">{d.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Question Count */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">📝 Question Count</h2>
          <div className="flex gap-3">
            {COUNT_OPTIONS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCount(c)}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition ${
                  count === c
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >{c} Qs</button>
            ))}
          </div>
        </section>

        {/* Time Limit */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold text-white mb-4">⏱️ Time Limit</h2>
          <div className="grid grid-cols-4 gap-3">
            {TIME_OPTIONS.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTimeLimit(t.value)}
                className={`py-3 rounded-xl border text-xs font-bold transition ${
                  timeLimit === t.value
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >{t.label}</button>
            ))}
          </div>
        </section>

        {/* Summary & Build */}
        <div className="bg-blue-950/30 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-1">Your exam: <span className="text-white font-bold">{count} questions</span> • <span className="text-white font-bold">{selectedTopics.length} topics</span> • <span className="text-white font-bold">{difficulty}</span> • {timeLimit === 0 ? 'Untimed' : `${timeLimit / 60} min`}</div>
            </div>
            <button
              type="button"
              onClick={handleBuild}
              disabled={selectedTopics.length === 0}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition"
            >
              Build Exam →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
