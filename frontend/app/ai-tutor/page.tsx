"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "student" | "ai";
  text: string;
  followUp?: string;
  confidence?: number;
  timestamp: string;
}

const MEDICAL_TOPICS = [
  "Cardiology",
  "Pulmonology",
  "Neurology",
  "Gastroenterology",
  "Nephrology",
  "Endocrinology",
  "Pharmacology",
  "Pathology",
  "Clinical Examination",
];

export default function SocraticAiTutorPage() {
  const [selectedTopic, setSelectedTopic] = useState("Cardiology");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Welcome to your Mediverse Socratic AI Tutor. Ask me any clinical physiology, pathology, or pharmacology question to engage in active Socratic exploration.",
      confidence: 0.95,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = prompt.trim();
    if (!query) return;

    setErrorMessage(null);
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "student",
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/ai/socratic/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          question: query,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: Something went wrong. Please try again.`);
      }

      const data = await res.json();
      const aiReplyText = data.followUp || data.answer || data.question || "Can you elaborate on your physiological reasoning?";
      const aiMsg: Message = {
        id: data.sessionId || `ai-${Date.now()}`,
        sender: "ai",
        text: aiReplyText,
        followUp: data.followUp,
        confidence: data.confidence ?? 0.9,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while consulting the AI tutor. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🩺</span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                Cognitive Clinical Engine
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Socratic AI Tutor</h1>
            <p className="text-slate-400 text-sm mt-1">
              Master clinical case reasoning and pathophysiological mechanisms through inquiry-led dialogues.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition self-start sm:self-auto"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Topic Selector */}
        <div className="mt-6 bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="topic-selector" className="text-sm font-semibold text-slate-300 whitespace-nowrap">
            Select Topic:
          </label>
          <select
            id="topic-selector"
            aria-label="Select Topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full sm:w-72 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {MEDICAL_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-4 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-400 hover:text-white underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Conversation History */}
        <div
          data-testid="conversation-history"
          className="mt-6 bg-slate-900/60 rounded-xl border border-slate-800 p-6 min-h-[420px] max-h-[600px] overflow-y-auto space-y-4 shadow-inner"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              data-testid={msg.sender === "student" ? "student-message" : undefined}
              className={`flex flex-col ${
                msg.sender === "student" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                  msg.sender === "student"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-800/90 border border-slate-700 text-slate-200 rounded-bl-none"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-xs opacity-75">
                  <span className="font-semibold">
                    {msg.sender === "student" ? "You (Medical Scholar)" : "AI Socratic Tutor"}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.sender === "ai" && msg.confidence !== undefined && (
                  <div
                    data-testid="confidence-score"
                    className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-emerald-400"
                  >
                    <span>🎯 Socratic Accuracy Index:</span>
                    <span className="font-mono font-bold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      {Math.round(msg.confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isThinking && (
            <div
              data-testid="ai-thinking-indicator"
              className="flex items-center gap-2 p-4 max-w-sm rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-sm animate-pulse"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce delay-100" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce delay-200" />
              <span className="text-xs font-medium ml-1">Consulting clinical knowledge graphs...</span>
            </div>
          )}
        </div>

        {/* Input Prompt Area */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              aria-label="Ask a question"
              placeholder="Ask a question about cardiac physiology, shock, or receptor kinetics..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={isThinking || !prompt.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 font-semibold text-sm text-white rounded-xl transition shadow-md whitespace-nowrap"
            >
              Ask Tutor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
