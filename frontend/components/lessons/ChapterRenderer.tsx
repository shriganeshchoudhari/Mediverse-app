"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import ThreeCanvas from "../3d/ThreeCanvas";
import Mermaid from "./Mermaid";
import QuizComponent from "./QuizComponent";
import PhysiologyAnimation from "./PhysiologyAnimation";
import CaseStudyInteractive from "./CaseStudyInteractive";
import PomodoroTimer from "./PomodoroTimer";
import NotesDrawer from "./NotesDrawer";
import ContentBlockRenderer from "./ContentBlockRenderer";
import SimulationCalloutCard from "./SimulationCalloutCard";
import CalloutBlock from './CalloutBlock';
import XPToast from './XPToast';

interface PedagogyStep {
  name: string;
  anchor: string;
}

const steps: PedagogyStep[] = [
  { name: "1. Introduction", anchor: "step-1" },
  { name: "2. Daily Life Analogy", anchor: "step-2" },
  { name: "3. Basic Concept", anchor: "step-3" },
  { name: "4. Anatomy Review", anchor: "step-4" },
  { name: "5. Physiology", anchor: "step-5" },
  { name: "6. Mechanism", anchor: "step-6" },
  { name: "7. Animation", anchor: "step-7" },
  { name: "8. 3D Model", anchor: "step-8" },
  { name: "9. Flowchart", anchor: "step-9" },
  { name: "10. Clinical Correlation", anchor: "step-10" },
  { name: "11. Disorders", anchor: "step-11" },
  { name: "12. Summary", anchor: "step-12" },
  { name: "13. Important Formula", anchor: "step-13" },
  { name: "14. Mnemonics", anchor: "step-14" },
  { name: "15. Viva Questions", anchor: "step-15" },
  { name: "16. MCQs", anchor: "step-16" },
  { name: "17. Case-Based Learning", anchor: "step-17" },
  { name: "18. Flashcards", anchor: "step-18" },
  { name: "19. Revision Notes", anchor: "step-19" },
  { name: "20. Practice Quiz", anchor: "step-20" },
];

interface ChapterRendererProps {
  title: string;
  markdownContent: string;
  chapterId: string;
  topics?: any[];
}

interface FlashcardItem {
  front: string;
  back: string;
}

/** Map a heading text to its pedagogy step anchor if it matches */
function getStepAnchor(text: string): string | undefined {
  const match = text.match(/^(\d+)\.\s/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= 20) {
      return `step-${num}`;
    }
  }
  return undefined;
}

function parseCalloutBlocks(text: string): string {
  // Replace :::pearl ... ::: with <div data-callout="pearl">...</div>
  // Using a plain div so rehypeRaw passes it through and the div renderer can intercept it
  return text
    .replace(/:::pearl\n?([\s\S]*?):::/g, '<div data-callout="pearl">$1</div>')
    .replace(/:::trap\n?([\s\S]*?):::/g, '<div data-callout="trap">$1</div>')
    .replace(/:::highyield\n?([\s\S]*?):::/g, '<div data-callout="highyield">$1</div>')
    .replace(/:::remember\n?([\s\S]*?):::/g, '<div data-callout="remember">$1</div>');
}

/** Dynamic parser to extract flashcards from step 18 */
function parseMarkdownFlashcards(markdown: string): FlashcardItem[] {
  const cards: FlashcardItem[] = [];
  const lines = markdown.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("- **Front**:") || line.includes("**Front**:")) {
      let front = line.replace(/^[-\s]*\*\*Front\*\*:/, "").trim();
      let back = "";
      // Look at subsequent lines for **Back**:
      for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
        const nextLine = lines[j].trim();
        if (nextLine.includes("**Back**:")) {
          back = nextLine.split("**Back**:")[1].trim();
          i = j; // advance outer loop
          break;
        }
      }
      if (front && back) {
        cards.push({ front, back });
      }
    }
  }
  
  if (cards.length > 0) return cards;
  return [
    { front: "Define Homeostasis.", back: "Maintenance of static or constant conditions in the internal environment." },
    { front: "What is the typical gain of the baroreceptor system?", back: "Approximately -2." }
  ];
}

export default function ChapterRenderer({ title, markdownContent, chapterId, topics }: ChapterRendererProps) {
  const [activeStep, setActiveStep] = useState<string>("step-1");
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [completed, setCompleted] = useState<boolean>(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [conversationHistory, setConversationHistory] = useState<{role: string, text: string}[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [xpToast, setXpToast] = useState<{ xp: number; label: string } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize progress as active (50%)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`/api/v1/progress/${chapterId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ completionPercentage: 50 })
      }).catch(err => console.error("Failed to initialize progress", err));
    }
  }, [chapterId]);

  // Mark lesson progress to 100%
  const handleMarkAsCompleted = () => {
    const nextState = !completed;
    setCompleted(nextState);
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`/api/v1/progress/${chapterId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ completionPercentage: nextState ? 100 : 50 })
      }).catch(err => console.error("Failed to update progress", err));
    }
  };

  // Web Speech API narration
  const handleNarration = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const plainText = markdownContent
      .replace(/[#*`>|\-\[\]()]/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .substring(0, 5000);

    const utter = new SpeechSynthesisUtterance(plainText);
    utter.rate = audioSpeed;
    utter.onend = () => setIsPlaying(false);
    setUtterance(utter);
    setIsPlaying(true);
    window.speechSynthesis.speak(utter);
  }, [isPlaying, markdownContent, audioSpeed]);

  const handleAskAi = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    
    const newHistory = [...conversationHistory, { role: "user", text: aiQuery }];
    setConversationHistory(newHistory);
    const currentQuery = aiQuery;
    setAiQuery("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: currentQuery, context: title, history: newHistory })
      });
      const data = await res.json();
      setConversationHistory([...newHistory, { role: "model", text: data.answer }]);
    } catch (err) {
      setConversationHistory([...newHistory, { role: "model", text: "Sorry, I could not connect to the AI service right now." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const clearAiChat = () => {
    setConversationHistory([]);
    setAiQuery("");
  };

  // Update rate on running utterance: cancel and restart to apply rate changes in Web Speech API
  useEffect(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const plainText = markdownContent
        .replace(/[#*`>|\-\[\]()]/g, "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/\n{2,}/g, ". ")
        .replace(/\n/g, " ")
        .substring(0, 5000);

      const utter = new SpeechSynthesisUtterance(plainText);
      utter.rate = audioSpeed;
      utter.onend = () => setIsPlaying(false);
      setUtterance(utter);
      window.speechSynthesis.speak(utter);
    }
  }, [audioSpeed, markdownContent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleStepClick = (anchor: string) => {
    setActiveStep(anchor);
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Preprocess LaTeX math delimiters to standard dollar signs for remark-math
  const preprocessedContent = parseCalloutBlocks(
    markdownContent
      .replace(/\\\\\(/g, "$")
      .replace(/\\\\\)/g, "$")
      .replace(/\\\\\[/g, "$$")
      .replace(/\\\\\]/g, "$$")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$")
  );

  // Parse flashcards
  const parsedCards = parseMarkdownFlashcards(preprocessedContent);

  // Split markdown into sections to inject animation, 3D viewer, and case study inline
  const lines = preprocessedContent.split("\n");
  let step7Index = lines.findIndex((l) => /^###\s*7\.\s/.test(l.trim()));
  let step8Index = lines.findIndex((l) => /^###\s*8\.\s/.test(l.trim()));
  let step9Index = lines.findIndex((l) => /^###\s*9\.\s/.test(l.trim()));
  let step17Index = lines.findIndex((l) => /^###\s*17\.\s/.test(l.trim()));
  let step18Index = lines.findIndex((l) => /^###\s*18\.\s/.test(l.trim()));

  const beforeStep7 = step7Index >= 0 ? lines.slice(0, step7Index).join("\n") : preprocessedContent;
  
  const step7Content = (step7Index >= 0 && step8Index >= 0) 
    ? lines.slice(step7Index, step8Index).join("\n") 
    : (step7Index >= 0 ? lines.slice(step7Index).join("\n") : "");

  const step8Content = (step8Index >= 0 && step9Index >= 0)
    ? lines.slice(step8Index, step9Index).join("\n")
    : (step8Index >= 0 ? lines.slice(step8Index).join("\n") : "");

  const afterStep8To16 = (step9Index >= 0 && step17Index >= 0)
    ? lines.slice(step9Index, step17Index).join("\n")
    : (step9Index >= 0 ? lines.slice(step9Index).join("\n") : "");

  const step17Content = (step17Index >= 0 && step18Index >= 0)
    ? lines.slice(step17Index, step18Index).join("\n")
    : (step17Index >= 0 ? lines.slice(step17Index).join("\n") : "");

  const afterStep17 = step18Index >= 0 ? lines.slice(step18Index).join("\n") : "";

  // Calculate estimated reading time
  const totalWords = markdownContent.split(/\s+/).length;
  const estimatedTotalMins = Math.ceil(totalWords / 200); // 200 wpm
  const minsRemaining = Math.max(1, Math.ceil(estimatedTotalMins * (1 - (scrollProgress / 100))));

  const handleStepComplete = (stepNum: number) => {
    if (completedSteps.has(stepNum)) return;
    setCompletedSteps(prev => new Set([...Array.from(prev), stepNum]));

    setXpToast({ xp: 50, label: `Step ${stepNum} Complete` });
  };

  return (
    <>
      {/* Top Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-400 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      {scrollProgress > 5 && scrollProgress < 95 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-50 shadow-lg">
          ~{minsRemaining} min remaining
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans mt-2">
      {/* Sticky Pedagogy Index Panel */}
      <aside className="w-full lg:w-64 shrink-0 sticky top-0 lg:top-8 h-auto lg:h-fit max-h-[85vh] overflow-y-auto bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 z-20">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Pedagogy Model
        </h4>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {steps.map((step, idx) => (
            <button
              key={step.anchor}
              onClick={() => {
                handleStepClick(step.anchor);
                handleStepComplete(idx + 1);
              }}
              aria-current={activeStep === step.anchor ? "step" : undefined}
              className={`text-left text-xs py-2 px-3 rounded-lg whitespace-nowrap transition duration-200 flex items-center justify-between ${
                activeStep === step.anchor
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <span>{step.name}</span>
              {completedSteps.has(idx + 1) && <span className="text-emerald-400 ml-2">✓</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Chapter Content Frame */}
      <main className="flex-1 max-w-4xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl p-6 md:p-10 relative">
        {/* Header Block & Controls */}
        <header className="border-b border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-xs text-slate-500 hover:text-blue-400 font-semibold mb-3 gap-1 transition">
              ← Back to Syllabus
            </Link>
            {/* Step Progress Breadcrumb */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.7rem',
              color: '#64748b',
              marginBottom: '1rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
            }}>
              <span style={{ color: '#3b82f6' }}>{title}</span>
              <span>›</span>
              <span>{completedSteps.size} of {steps.length} steps complete</span>
              <span>•</span>
              <span>~{Math.ceil(markdownContent.length / 1200)} min read</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              {title}
            </h1>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
              Chapter Reference: {chapterId}
            </p>
          </div>

          {/* Narrator Engine Controls — Web Speech API */}
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 self-start sm:self-center shadow-inner">
            <button
              onClick={handleNarration}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                isPlaying 
                  ? "bg-red-600 hover:bg-red-500 text-white" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30"
              }`}
            >
              {isPlaying ? "⏸ Pause" : "🔊 Listen"}
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <label htmlFor="speed-select" className="font-medium">Speed:</label>
              <select
                id="speed-select"
                value={audioSpeed}
                onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded-md p-1 font-semibold text-slate-300 outline-none focus:border-blue-600 transition"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>
          </div>
        </header>

        {/* Dynamic Simulation Lab Integration Callout */}
        {(() => {
          const t = (title + " " + chapterId).toLowerCase();
          const matchingSim = [{id:"phys-cardiac-cycle",title:"Cardiac Cycle Simulator",simulatorRoute:"/simulators/cardiac-cycle",unitCode:"CV-1",simulatorParams:{},organ3dTarget:"heart"},{id:"phys-respiratory-vq",title:"Respiratory Simulator",simulatorRoute:"/simulators/respiratory",unitCode:"RS-1",simulatorParams:{},organ3dTarget:"lungs"}].find((m: any) => {
            if (m.id === "phys-cardiac-cycle") return t.includes("cardiac") || t.includes("wiggers") || t.includes("pv-loop") || t.includes("section4");
            if (m.id === "phys-respiratory-vq") return t.includes("respiratory") || t.includes("alveolar") || t.includes("gas") || t.includes("v/q") || t.includes("section5");
            if (m.id === "phys-renal-filtration") return t.includes("renal") || t.includes("filtration") || t.includes("gfr") || t.includes("clearance");
            if (m.id === "phys-nerve-muscle") return t.includes("nerve") || t.includes("action potential") || t.includes("action-potential") || t.includes("membrane") || t.includes("ghk") || t.includes("section3");
            if (m.id === "phys-acid-base") return t.includes("acid") || t.includes("davenport") || t.includes("anion gap") || t.includes("section6-acid");
            return false;
          });

          if (!matchingSim || !matchingSim.simulatorRoute) return null;

          return (
            <SimulationCalloutCard
              title={matchingSim.title}
              description={`Interactive physiological simulation engine mapped to NMC CBME ${matchingSim.unitCode}. Experiment with real-time parameters, hemodynamic curves, and diagnostic nomograms.`}
              route={matchingSim.simulatorRoute}
              presetParams={matchingSim.simulatorParams}
              organSystem={matchingSim.organ3dTarget}
            />
          );
        })()}

        {/* Render polymorphic content blocks if structured topics exist, otherwise fallback to flat markdown */}
        {topics && topics.length > 0 ? (
          <div ref={contentRef} className="space-y-12">
            {topics.map((topic: any) => (
              <div key={topic.id} className="space-y-8">
                <h2 className="text-xl font-extrabold text-white border-b border-slate-800 pb-3 mt-10 tracking-tight uppercase text-blue-500/95">
                  📁 {topic.title}
                </h2>
                {topic.concepts?.map((concept: any) => (
                  <div key={concept.id} className="space-y-6 bg-slate-900/20 p-6 rounded-xl border border-slate-850 shadow-sm">
                    <h3 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3">
                      💡 {concept.title}
                    </h3>
                    {concept.lesson?.contentBlocks?.map((block: any) => (
                      <div key={block.id} className="my-4">
                        <ContentBlockRenderer block={block} chapterId={chapterId} />
                      </div>
                    ))}
                    {!concept.lesson?.contentBlocks && (
                      <div className="text-xs text-slate-500 italic">No lesson blocks loaded.</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* Legacy Flat Markdown Renderers */
          <>
            {/* Markdown Content — Steps 1-6 */}
            <article ref={contentRef} className="prose-custom">
              <MarkdownBlock content={beforeStep7} />
            </article>

            {/* Step 7: Animation Summary */}
            {step7Content && (
              <section id="step-7" className="my-10 border-t border-slate-850 pt-8 scroll-mt-24">
                <article className="prose-custom">
                  <MarkdownBlock content={step7Content} />
                </article>
                <div className="mt-6">
                  <PhysiologyAnimation chapterId={chapterId} />
                </div>
              </section>
            )}

            {/* Embedded 3D Model — Step 8 (inline position) */}
            <section id="step-8" className="my-10 border-y border-slate-800 py-10 scroll-mt-24">
              {step8Content ? (
                <article className="prose-custom mb-6">
                  <MarkdownBlock content={step8Content} />
                </article>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2 border-l-4 border-blue-600 pl-3">
                    8. Interactive 3D Model
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 font-medium">
                    Drag to rotate, scroll to zoom, and select parts to view specific functions.
                  </p>
                </>
              )}
              <ThreeCanvas chapterId={chapterId} />
            </section>

            {/* Markdown Content — Steps 9-16 */}
            {afterStep8To16 && (
              <article className="prose-custom">
                <MarkdownBlock content={afterStep8To16} />
              </article>
            )}

            {/* Step 17: Interactive Case Study */}
            {step17Content && (
              <section id="step-17" className="my-10 scroll-mt-24">
                <CaseStudyInteractive content={step17Content} />
              </section>
            )}

            {/* Markdown Content — Steps 18-19 */}
            {afterStep17 && (
              <article className="prose-custom">
                <MarkdownBlock content={afterStep17} />
              </article>
            )}
          </>
        )}

        {/* Interactive Practice Quiz — Step 20 integration */}
        <section id="step-20-quiz" className="mt-12 pt-8 border-t border-slate-800 scroll-mt-24">
          <h3 className="text-lg font-semibold text-blue-400 mb-4 border-l-4 border-blue-600 pl-3">
            Interactive Practice Quiz
          </h3>
          <QuizComponent markdownContent={markdownContent} chapterId={chapterId} />
        </section>

        {/* Dynamic Interactive Flashcard Review Component */}
        <section id="interactive-flashcards" className="mt-12 pt-8 border-t border-slate-800">
          <h3 className="text-lg font-semibold text-blue-400 mb-4 border-l-4 border-blue-600 pl-3">
            Interactive Flashcard Deck
          </h3>
          <FlashcardPanel cards={parsedCards} chapterId={chapterId} />
        </section>

        {/* Progress Mark Action bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="progress-check"
              checked={completed}
              onChange={handleMarkAsCompleted}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-600 cursor-pointer" 
            />
            <label htmlFor="progress-check" className="text-xs text-slate-400 font-semibold cursor-pointer select-none">
              Mark this chapter as read (Award 100 XP)
            </label>
          </div>
          {completed && (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Completed
            </span>
          )}
        </div>
      </main>

      {/* AI Tutor Floating Button */}
      <button 
        onClick={() => setAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 rounded-full h-14 px-6 flex items-center justify-center font-bold tracking-wide transition-all z-40 group"
      >
        <span className="mr-2 text-xl group-hover:scale-110 transition-transform">🤖</span> Ask AI Tutor
      </button>

      {/* AI Tutor Drawer */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 h-full border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>🤖</span> Physiology Tutor
              </h3>
              <div className="flex items-center gap-3">
                {conversationHistory.length > 0 && (
                  <button 
                    onClick={clearAiChat}
                    className="text-xs text-slate-400 hover:text-red-400 transition"
                  >
                    Clear Chat
                  </button>
                )}
                <button 
                  onClick={() => setAiDrawerOpen(false)}
                  className="text-slate-500 hover:text-white transition"
                >
                  Close ✕
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl rounded-tl-none border border-slate-700/50 text-sm text-slate-300">
                Hi! I'm your AI tutor for <strong>{title}</strong>. What would you like to know or clarify?
              </div>
              
              {conversationHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl text-sm max-w-[90%] ${
                    msg.role === 'user' 
                      ? 'bg-emerald-900/30 border border-emerald-500/20 text-emerald-100 self-end rounded-tr-none' 
                      : 'bg-blue-900/20 border border-blue-500/20 text-blue-100 self-start rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {aiLoading && (
                <div className="text-sm text-slate-500 animate-pulse mt-4">
                  Thinking...
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
              <div className="flex gap-2">
                <input 
                  id="ai-tutor-input"
                  aria-label="Ask the AI Tutor a question"
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={handleAskAi}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <PomodoroTimer />
      <NotesDrawer chapterId={chapterId} />
      {xpToast && (
        <XPToast
          xp={xpToast.xp}
          label={xpToast.label}
          onDone={() => setXpToast(null)}
        />
      )}
    </>
  );
}

function FlashcardPanel({ cards: parsedCards, chapterId }: { cards: FlashcardItem[]; chapterId: string }) {
  const [dbCards, setDbCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Not logged in: fallback to parsed local markdown cards
      setDbCards(parsedCards.map((c, i) => ({ id: `local-${i}`, frontText: c.front, backText: c.back })));
      setLoading(false);
      return;
    }

    const payload = parsedCards.map(c => ({ frontText: c.front, backText: c.back }));
    fetch(`/api/v1/flashcards/sync/${chapterId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Sync failed");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbCards(data);
        } else {
          setDbCards(parsedCards.map((c, i) => ({ id: `local-${i}`, frontText: c.front, backText: c.back })));
        }
      })
      .catch(() => {
        setDbCards(parsedCards.map((c, i) => ({ id: `local-${i}`, frontText: c.front, backText: c.back })));
      })
      .finally(() => setLoading(false));
  }, [chapterId, parsedCards]);

  if (loading) {
    return <div className="text-xs text-slate-500 font-semibold my-4">Synchronizing flashcards with database...</div>;
  }

  if (dbCards.length === 0) return null;

  const handleRating = (rating: number) => {
    const token = localStorage.getItem("token");
    const currentCard = dbCards[currentIndex];
    if (token && currentCard && typeof currentCard.id === "string" && !currentCard.id.startsWith("local-")) {
      fetch(`/api/v1/flashcards/${currentCard.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating })
      }).catch(err => console.error("Failed to sync review", err));
    }

    if (currentIndex < dbCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center">
        <h4 className="text-emerald-400 font-bold text-sm mb-2">🎉 Review Completed!</h4>
        <p className="text-xs text-slate-400 mb-4">You have reviewed all active flashcards for this chapter.</p>
        <button 
          onClick={() => {
            setCurrentIndex(0);
            setShowAnswer(false);
            setCompleted(false);
          }}
          className="text-xs px-3 py-1.5 bg-blue-600 rounded text-white font-medium hover:bg-blue-500 transition"
        >
          Reset Session
        </button>
      </div>
    );
  }

  const card = dbCards[currentIndex];

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 my-4 select-none">
      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-4 font-semibold uppercase tracking-wider">
        <span>Active Flashcard</span>
        <span>Card {currentIndex + 1} of {dbCards.length}</span>
      </div>

      <div 
        onClick={() => setShowAnswer(p => !p)}
        className="min-h-[140px] flex items-center justify-center text-center cursor-pointer border border-dashed border-slate-800 rounded-lg p-6 bg-slate-950/40 hover:bg-slate-950/80 transition-colors"
      >
        <div className="space-y-2">
          {!showAnswer ? (
            <>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">{card.frontText}</p>
              <span className="inline-block text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                Click to flip
              </span>
            </>
          ) : (
            <>
              <p className="text-sm text-emerald-400 font-medium leading-relaxed">{card.backText}</p>
              <span className="inline-block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Tap again to show question
              </span>
            </>
          )}
        </div>
      </div>

      {showAnswer && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider font-semibold">
            How well did you recall this card?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Again", rating: 1, color: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20" },
              { label: "Hard", rating: 2, color: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20" },
              { label: "Good", rating: 3, color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20" },
              { label: "Easy", rating: 4, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" }
            ].map(btn => (
              <button
                key={btn.rating}
                onClick={() => handleRating(btn.rating)}
                className={`py-2 px-1 text-center rounded border font-semibold text-xs transition duration-200 ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Shared ReactMarkdown renderer with full plugin chain */
function MarkdownBlock({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-12 mb-6 tracking-tight">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-white mt-10 mb-5 pb-2 border-b border-slate-800">
            {children}
          </h2>
        ),
        h3: ({ children }) => {
          const extractText = (node: any): string => {
            if (typeof node === "string") return node;
            if (typeof node === "number") return String(node);
            if (Array.isArray(node)) return node.map(extractText).join("");
            if (node?.props?.children) return extractText(node.props.children);
            return "";
          };
          const text = extractText(children);
          const anchor = getStepAnchor(text);
          return (
            <h3
              id={anchor}
              className="text-lg font-semibold text-blue-400 mt-8 mb-4 border-l-4 border-blue-600 pl-3 scroll-mt-24"
            >
              {children}
            </h3>
          );
        },
        p: ({ children }) => (
          <p className="mb-5 text-slate-300 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-300">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 space-y-2 mb-6 text-slate-300">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-slate-300 leading-relaxed">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-slate-700 pl-4 italic text-slate-400 my-6 bg-slate-900/30 p-4 rounded-r-lg">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="text-white font-semibold">{children}</strong>
        ),
        code: ({ className, children, ...props }) => {
          const isBlock = className?.includes("language-");
          const lang = className ? className.replace("language-", "") : "";
          if (lang === "mermaid") {
            const chartCode = String(children).replace(/\n$/, "");
            return <Mermaid chart={chartCode} />;
          }
          if (isBlock) {
            return (
              <code
                className={`block bg-slate-900 p-4 rounded-lg text-sm font-mono text-blue-300 border border-slate-800 overflow-x-auto ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-400 font-mono text-xs border border-slate-800">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-6 overflow-x-auto">{children}</pre>
        ),
        hr: () => <hr className="border-slate-800 my-8" />,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 border border-slate-800 text-slate-400">
            {children}
          </td>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-blue-400 underline hover:text-blue-300 transition" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        div: ({ node, children, ...props }: any) => {
          const calloutType = props['data-callout'];
          if (calloutType) {
            return <CalloutBlock type={calloutType}>{children}</CalloutBlock>;
          }
          return <div {...props}>{children}</div>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}


