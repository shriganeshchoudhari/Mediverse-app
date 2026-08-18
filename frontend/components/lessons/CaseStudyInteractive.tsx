"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { parseCaseStudy, type CaseScenario } from "./caseStudyParser";

interface CaseStudyInteractiveProps {
  content: string;
}

export default function CaseStudyInteractive({ content }: CaseStudyInteractiveProps) {
  const [scenario, setScenario] = useState<CaseScenario | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!content) {
      setScenario(null);
      return;
    }

    setScenario(parseCaseStudy(content));
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setCompleted(false);
    setScore(0);
  }, [content]);

  if (!scenario) return null;

  if (scenario.questions.length === 0) {
    return (
      <section className="bg-slate-900/40 rounded-xl shadow-lg border border-slate-800 p-6 md:p-8 my-8 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-4">Clinical Case</h3>
        <div className="prose prose-invert prose-sm max-w-none p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
          <ReactMarkdown>{scenario.clinicalPresentation}</ReactMarkdown>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Interactive questions are unavailable until this case has reviewed answer options.
        </p>
      </section>
    );
  }

  const currentQuestion = scenario.questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
    if (showFeedback) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);
    if (isCorrect) setScore(s => s + 10);
  };

  const handleNext = () => {
    if (currentQuestionIndex < scenario.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const resetCase = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setCompleted(false);
    setScore(0);
  };

  const selectedOption = currentQuestion?.options.find(o => o.id === selectedOptionId);

  return (
    <div className="bg-slate-900/40 rounded-xl shadow-lg border border-slate-800 p-6 md:p-8 my-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="bg-blue-900/50 text-blue-400 p-2 rounded-lg">🏥</span>
          Clinical Case Simulation
        </h3>
        <div className="prose prose-invert prose-sm max-w-none p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
          <ReactMarkdown>{scenario.clinicalPresentation}</ReactMarkdown>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!completed && currentQuestion ? (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between text-xs text-slate-400 mb-4 font-semibold uppercase tracking-wider">
              <span>Decision Point {currentQuestionIndex + 1} of {scenario.questions.length}</span>
              <span>Score: {score}</span>
            </div>

            <h4 className="text-lg font-semibold text-white mb-6">
              {currentQuestion.text}
            </h4>

            <div className="space-y-3">
              {currentQuestion.options.map(option => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle = "border-slate-700 hover:border-blue-500 hover:bg-slate-800 text-slate-300";
                
                if (showFeedback) {
                  if (option.isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-900/20 text-emerald-300 font-medium";
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = "border-red-500 bg-red-900/20 text-red-300";
                  } else {
                    optionStyle = "border-slate-800 opacity-50";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id, option.isCorrect)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between bg-slate-900 ${optionStyle}`}
                  >
                    <span>{option.text}</span>
                    {showFeedback && option.isCorrect && <span className="text-emerald-500 text-xl">✓</span>}
                    {showFeedback && isSelected && !option.isCorrect && <span className="text-red-500 text-xl">✗</span>}
                  </button>
                );
              })}
            </div>

            {showFeedback && selectedOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`mt-6 p-5 rounded-lg border ${selectedOption.isCorrect ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-orange-900/10 border-orange-500/30'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-2xl ${selectedOption.isCorrect ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {selectedOption.isCorrect ? '🎯' : '💡'}
                  </div>
                  <div>
                    <h5 className={`font-bold ${selectedOption.isCorrect ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {selectedOption.isCorrect ? 'Correct!' : 'Not quite right.'}
                    </h5>
                    <p className="mt-1 text-slate-300">{selectedOption.feedback}</p>
                    
                    <button
                      onClick={handleNext}
                      className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    >
                      {currentQuestionIndex < scenario.questions.length - 1 ? 'Next Question →' : 'Finish Case'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-slate-900/50 rounded-xl border border-emerald-900/30"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-emerald-400 mb-2">Case Study Completed!</h3>
            <p className="text-slate-300 mb-2">
              Final Score: {score} / {scenario.questions.length * 10}
            </p>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">
              You've successfully navigated the clinical scenario and applied your physiological knowledge to real-world diagnosis.
            </p>
            <button
              onClick={resetCase}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium transition-colors"
            >
              Restart Case
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
