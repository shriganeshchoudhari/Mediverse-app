"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExamSimulator() {
  const router = useRouter();
  
  const [examState, setExamState] = useState<"setup" | "loading" | "running" | "results">("setup");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(3600); // 1 hour default
  
  // Running state
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  
  const handleStart = async () => {
    setExamState("loading");
    try {
      // Calculate how many questions to fetch based on duration (e.g. 1 question per 1.5 mins)
      const limit = Math.max(10, Math.floor(duration / 90));
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/v1/exam/questions?limit=${limit}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error("Failed to fetch questions");
      
      const data = await res.json();
      
      // Transform data to match frontend expectations:
      // The API returns { id, questionText, optionA, optionB, optionC, optionD, correctOption, explanation }
      // We map options into an array and convert correctOption (A/B/C/D) to index (0/1/2/3)
      const formatted = data.map((q: any) => ({
        id: q.id,
        text: q.questionText,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correct: q.correctOption.charCodeAt(0) - 65,
        explanation: q.explanation
      }));
      
      setQuestions(formatted);
      setTimeLeft(duration);
      setExamState("running");
    } catch (e) {
      console.error(e);
      alert("Error fetching exam questions. Please try again.");
      setExamState("setup");
    }
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examState === "running" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (examState === "running" && timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [examState, timeLeft]);
  
  const handleAnswer = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
  };
  
  const handleSubmit = async () => {
    // Calculate score
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) finalScore++;
    });
    setScore(finalScore);
    setExamState("results");
    
    // Save to backend
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/v1/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sectionIds: selectedSections.length > 0 ? selectedSections : ["general"],
          score: finalScore,
          totalQuestions: questions.length,
          timeTakenSeconds: duration - timeLeft
        })
      });
    } catch (e) {
      console.error("Failed to save exam session", e);
    }
  };
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (examState === "setup") {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Configure Your Exam</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Duration</label>
            <select 
              value={duration} 
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={1800}>30 Minutes</option>
              <option value={3600}>1 Hour</option>
              <option value={7200}>2 Hours</option>
              <option value={10800}>3 Hours</option>
            </select>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Topics (Coming Soon)</label>
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 text-slate-500 italic text-center">
              Full topic selection will be available when the question bank is fully populated. The simulator will currently use a mixed physiology question bank.
            </div>
          </div>
          
          <button 
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }
  
  if (examState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-400">Assembling your custom exam from the question bank...</p>
      </div>
    );
  }
  
  if (examState === "running") {
    const currentQ = questions[currentQuestionIdx];
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 font-medium">
            Question <span className="text-white font-bold">{currentQuestionIdx + 1}</span> of {questions.length}
          </div>
          <div className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
          <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
            {currentQ.text}
          </h3>
          
          <div className="space-y-3">
            {currentQ.options.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  answers[currentQuestionIdx] === idx 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-100' 
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex gap-4">
                  <span className="font-bold text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={() => setCurrentQuestionIdx(i => Math.max(0, i - 1))}
            disabled={currentQuestionIdx === 0}
            className="px-6 py-3 rounded-xl bg-slate-800 text-white font-medium disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentQuestionIdx === questions.length - 1 ? (
            <button 
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 transition"
            >
              Submit Exam
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQuestionIdx(i => Math.min(questions.length - 1, i + 1))}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
  
  if (examState === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Exam Completed</h2>
          <p className="text-slate-400 mb-8">Here is your performance breakdown</p>
          
          <div className="flex justify-center gap-8 mb-8">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 min-w-[150px]">
              <div className="text-4xl font-black text-blue-400 mb-2">{percentage}%</div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Score</div>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 min-w-[150px]">
              <div className="text-4xl font-black text-emerald-400 mb-2">{score}/{questions.length}</div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Correct</div>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 min-w-[150px]">
              <div className="text-4xl font-black text-amber-400 mb-2">{formatTime(duration - timeLeft)}</div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Time Taken</div>
            </div>
          </div>
          
          <div className="space-x-4">
            <button 
              onClick={() => {
                setExamState("setup");
                setSelectedSections([]);
                setScore(0);
                setAnswers({});
                setCurrentQuestionIdx(0);
              }}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
            >
              Take Another Exam
            </button>
            <button 
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
