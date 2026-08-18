"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Volume2, Award, BookOpen, ChevronRight, CheckCircle } from "lucide-react";

interface VivaQuestion {
  id: number;
  question: string;
  keyTerms: string[];
  explanation: string;
}

export default function VivaVoceExaminer() {
  const questions: VivaQuestion[] = [
    {
      id: 1,
      question: "Explain the physiological basis of the Frank-Starling Law of the heart.",
      keyTerms: ["end-diastolic volume", "preload", "sarcomere length", "stretch", "stroke volume", "venous return"],
      explanation: "According to the Frank-Starling law, an increase in venous return stretches the myocardial fibers (increasing end-diastolic volume/preload toward optimal sarcomere length), which increases the force of contraction and stroke volume."
    },
    {
      id: 2,
      question: "What is the role of central chemoreceptors in regulating breathing, and what stimulates them?",
      keyTerms: ["carbon dioxide", "co2", "hydrogen ion", "h+", "blood-brain barrier", "cerebrospinal fluid", "medulla"],
      explanation: "Central chemoreceptors in the medulla are stimulated by carbon dioxide (CO2). CO2 crosses the blood-brain barrier and hydrates to form hydrogen ions (H+) in the cerebrospinal fluid, directly triggering increased ventilation."
    },
    {
      id: 3,
      question: "Describe the molecular difference between skeletal and smooth muscle contraction regulation.",
      keyTerms: ["troponin", "calmodulin", "myosin light-chain kinase", "mlck", "tropomyosin", "phosphorylation"],
      explanation: "Skeletal muscle uses calcium binding to Troponin C to shift tropomyosin. Smooth muscle lacks troponin; instead, calcium binds to Calmodulin, activating Myosin Light-Chain Kinase (MLCK) to phosphorylate myosin heads."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [examState, setExamState] = useState<"setup" | "active" | "grading" | "completed">("setup");
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Synthesis and Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = "en-US";
        rec.onresult = (e: any) => {
          const transcript = e.results[e.results.length - 1][0].transcript;
          setTypedAnswer(prev => (prev ? `${prev} ${transcript}` : transcript));
        };
        rec.onend = () => setIsListening(false);
        recognitionRef.current = rec;
      }
    }
  }, []);

  const speakQuestion = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartExam = () => {
    setExamState("active");
    setCurrentIdx(0);
    setScore(0);
    setTypedAnswer("");
    speakQuestion(questions[0].question);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your response.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Grade Answer based on key terms matched
  const [grades, setGrades] = useState<any[]>([]);

  const handleNext = () => {
    const q = questions[currentIdx];
    const userAnsLower = typedAnswer.toLowerCase();
    
    // Check how many key terms matched
    const matchedTerms = q.keyTerms.filter(term => userAnsLower.includes(term.toLowerCase()));
    const scorePct = Math.round((matchedTerms.length / q.keyTerms.length) * 100);
    
    let gradeLabel = "Fail (Insufficient Details)";
    if (scorePct >= 80) gradeLabel = "Distinction (Superb Clinical Accuracy)";
    else if (scorePct >= 50) gradeLabel = "Pass (Adequate Physiological Knowledge)";
    
    const newGrade = {
      question: q.question,
      userAnswer: typedAnswer || "[No response provided]",
      matchedTerms,
      totalTerms: q.keyTerms.length,
      grade: gradeLabel,
      correctAnswers: q.explanation
    };

    setGrades(prev => [...prev, newGrade]);
    
    if (scorePct >= 50) setScore(s => s + 1);

    // Go to next question
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setTypedAnswer("");
      speakQuestion(questions[nextIdx].question);
    } else {
      setExamState("completed");
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Viva completed. Review your scores."));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-4xl mx-auto">
        <Link href="/exam" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Exams
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Mic className="w-8 h-8 text-purple-500" /> Viva Voce Examiner
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Simulate a practical university oral examination. Speak or type your answers to physiological case prompts.
          </p>
        </header>

        {examState === "setup" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto text-center flex flex-col items-center">
            <BookOpen className="w-12 h-12 text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Prepare for your Viva</h2>
            <p className="text-xs text-slate-450 mb-6 leading-relaxed">
              The examiner will read out clinical physiology questions. Try to use professional medical vocabulary in your answers to score high marks.
            </p>
            <button
              onClick={handleStartExam}
              className="w-full py-4 bg-purple-650 hover:bg-purple-600 text-white font-bold rounded-xl transition shadow-lg shadow-purple-600/20"
            >
              Enter Exam Room
            </button>
          </div>
        )}

        {examState === "active" && (
          <div className="space-y-6">
            {/* Question Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-slate-500">Question {currentIdx + 1} of {questions.length}</span>
                <button
                  onClick={() => speakQuestion(questions[currentIdx].question)}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
                  title="Repeat Question"
                >
                  <Volume2 className="w-4 h-4 text-purple-400" />
                </button>
              </div>

              <h2 className="text-xl text-white font-bold mb-8 leading-relaxed">
                {questions[currentIdx].question}
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <button
                    onClick={toggleListening}
                    className={`p-4 rounded-full transition flex items-center justify-center ${
                      isListening 
                        ? 'bg-red-650 text-white animate-pulse' 
                        : 'bg-purple-650 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <span className="text-xs text-slate-450 font-semibold">
                    {isListening ? "Listening... Speak now." : "Click microphone to dictate, or type response below."}
                  </span>
                </div>

                <textarea
                  value={typedAnswer}
                  onChange={e => setTypedAnswer(e.target.value)}
                  placeholder="Type your physiological explanation here..."
                  className="w-full h-32 bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none rounded-xl p-4 text-sm text-slate-200 leading-relaxed placeholder-slate-600"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-purple-650 hover:bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2 transition"
              >
                Submit Answer <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {examState === "completed" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
              <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white mb-2">Viva Voce Completed</h2>
              <p className="text-slate-400 text-xs mb-6">Passed {score} out of {questions.length} questions</p>

              <button
                onClick={() => setExamState("setup")}
                className="px-6 py-3 bg-purple-650 hover:bg-purple-600 text-white font-bold rounded-xl transition"
              >
                Restart Exam
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Detailed Evaluation</h3>
              {grades.map((grade, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-slate-850 pb-3">
                    <h4 className="font-bold text-sm text-white flex-1 mr-4">Q{idx + 1}: {grade.question}</h4>
                    <span className={`text-xs font-black uppercase tracking-wider ${grade.grade.includes("Pass") || grade.grade.includes("Distinction") ? 'text-emerald-400' : 'text-red-400'}`}>
                      {grade.grade}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-[10px] text-slate-500 font-bold uppercase mb-1">Your Response</h5>
                    <p className="text-xs text-slate-350 italic leading-relaxed">"{grade.userAnswer}"</p>
                  </div>

                  <div>
                    <h5 className="text-[10px] text-slate-500 font-bold uppercase mb-1">Matched Keywords</h5>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {grade.matchedTerms.map((term: string, tIdx: number) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          {term}
                        </span>
                      ))}
                      {grade.matchedTerms.length === 0 && (
                        <span className="text-[10px] text-red-400 italic">No key terms matched.</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <h5 className="text-[10px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Model Physiology Response
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{grade.correctAnswers}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
