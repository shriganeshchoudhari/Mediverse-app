"use client";

import React, { useState, useEffect } from "react";
import { parseQuizQuestions, type MCQItem } from "./quizParser";

export type { MCQItem } from "./quizParser";

interface QuizComponentProps {
  markdownContent: string;
  chapterId: string;
}

export default function QuizComponent({ markdownContent, chapterId }: QuizComponentProps) {
  const [questions, setQuestions] = useState<MCQItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total
  const [mistakes, setMistakes] = useState<{question: MCQItem, selectedKey: string}[]>([]);
  const [reviewingMistakes, setReviewingMistakes] = useState(false);

  useEffect(() => {
    setQuestions(parseQuizQuestions(markdownContent));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(600);
    setMistakes([]);
    setReviewingMistakes(false);
  }, [markdownContent]);

  useEffect(() => {
    if (quizCompleted || reviewingMistakes || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setQuizCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizCompleted, reviewingMistakes, timeLeft]);

  if (questions.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center select-none my-6">
        <span className="text-3xl block mb-3">📝</span>
        <h4 className="text-white font-bold text-sm mb-2">Practice Quiz</h4>
        <p className="text-xs text-slate-400">
          A reviewed practice quiz is not available for this chapter yet.
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelect = (key: string) => {
    if (isAnswered) return;
    setSelectedOption(key);
  };

  const handleSubmit = () => {
    if (!selectedOption || isAnswered) return;
    setIsAnswered(true);
    if (selectedOption === currentQ.answer) {
      setScore(prev => prev + 1);
    } else {
      setMistakes(prev => [...prev, { question: currentQ, selectedKey: selectedOption }]);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(600);
    setMistakes([]);
    setReviewingMistakes(false);
  };

  if (quizCompleted && !reviewingMistakes) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center select-none animate-fade-in my-6">
        <span className="text-3xl block mb-3">🎓</span>
        <h4 className="text-white font-bold text-sm mb-2">Quiz Completed!</h4>
        <p className="text-xs text-slate-400 mb-4">
          You scored <span className="text-blue-400 font-bold">{score}</span> out of <span className="text-white">{questions.length}</span> questions.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleReset}
            className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold transition"
          >
            Retake Quiz
          </button>
          {mistakes.length > 0 && (
            <button
              onClick={() => setReviewingMistakes(true)}
              className="text-xs px-4 py-2 bg-blue-600 rounded text-white font-bold hover:bg-blue-500 transition shadow-md shadow-blue-900/20"
            >
              Review Mistakes
            </button>
          )}
        </div>
      </div>
    );
  }

  if (reviewingMistakes) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 my-6 select-none animate-fade-in">
        <h4 className="text-white font-bold text-sm mb-4">Reviewing Mistakes</h4>
        <div className="space-y-6 mb-6 max-h-96 overflow-y-auto pr-2">
          {mistakes.map((m, idx) => (
            <div key={idx} className="p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
              <p className="text-sm font-semibold text-slate-200 mb-3">{m.question.question}</p>
              <div className="space-y-2 mb-3">
                {m.question.options.map(opt => (
                  <div key={opt.key} className={`p-2 text-xs rounded border ${
                    opt.key === m.question.answer ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" :
                    opt.key === m.selectedKey ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-slate-800 text-slate-500"
                  }`}>
                    <span className="font-bold mr-2">{opt.key}</span> {opt.text}
                    {opt.key === m.selectedKey && " (Your Answer)"}
                    {opt.key === m.question.answer && " (Correct Answer)"}
                  </div>
                ))}
              </div>
              {m.question.explanation && (
                <div className="text-xs text-slate-400 bg-slate-900 p-2 rounded">
                  <span className="font-bold text-blue-400">Explanation: </span>
                  {m.question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold transition shadow-md shadow-blue-900/20"
          >
            Finish Review
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 my-6 select-none animate-fade-in">
      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-4 font-semibold uppercase tracking-wider">
        <span>Practice Quiz</span>
        <div className="flex gap-4">
          <span className={`flex items-center gap-1 ${timeLeft < 60 ? "text-red-400 animate-pulse" : "text-blue-400"}`}>
            ⏱ {formatTime(timeLeft)}
          </span>
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-200 leading-relaxed mb-4">{currentQ.question}</p>
        
        <div className="space-y-2">
          {currentQ.options.map(opt => {
            const isSelected = selectedOption === opt.key;
            const isCorrect = opt.key === currentQ.answer;
            
            let btnClass = "border-slate-800 bg-slate-950/40 hover:bg-slate-950/80 text-slate-300";
            if (isAnswered) {
              if (isCorrect) {
                btnClass = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
              } else if (isSelected) {
                btnClass = "border-red-500/30 bg-red-500/10 text-red-400";
              } else {
                btnClass = "border-slate-850 bg-slate-950/20 text-slate-500 opacity-60";
              }
            } else if (isSelected) {
              btnClass = "border-blue-600 bg-blue-500/10 text-white font-semibold";
            }

            return (
              <button
                key={opt.key}
                disabled={isAnswered}
                onClick={() => handleSelect(opt.key)}
                className={`w-full text-left p-3.5 rounded-lg border text-xs flex items-start gap-3 transition-all ${btnClass}`}
              >
                <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border font-bold text-[10px] ${
                  isAnswered && isCorrect ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300" :
                  isAnswered && isSelected ? "border-red-500/40 bg-red-500/20 text-red-300" :
                  isSelected ? "border-blue-500 bg-blue-600 text-white" : "border-slate-800 text-slate-400"
                }`}>
                  {opt.key}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && currentQ.explanation && (
        <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-slate-400 leading-relaxed mb-6 animate-fade-in">
          <strong className="text-blue-400 font-semibold block mb-1">Explanation:</strong>
          {currentQ.explanation}
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!isAnswered ? (
          <button
            disabled={!selectedOption}
            onClick={handleSubmit}
            className="text-xs px-4 py-2 bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-600 rounded text-white font-bold hover:bg-blue-500 transition shadow-md shadow-blue-900/20"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="text-xs px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-bold transition shadow-md shadow-emerald-900/20"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}
