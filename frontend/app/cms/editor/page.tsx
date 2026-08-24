"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/config/AuthContext";
import { cmsApi } from "@/lib/api/cms";
import CurriculumAnchorModal from "@/.gemini/skills/CurriculumAnchorModal";
import {
  FileText,
  HelpCircle,
  Layers,
  Activity,
  Plus,
  Trash2,
  Send,
  Save,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";

type BlockType = "EXPLANATION" | "QUIZ" | "FLASHCARD" | "CLINICAL_CASE";

interface BlockItem {
  id: string;
  type: BlockType;
  // Explanation data
  text?: string;
  // Quiz data
  quizTitle?: string;
  quizQuestion?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  // Flashcard data
  flashFront?: string;
  flashBack?: string;
  // Case data
  scenario?: string;
  caseQuestion?: string;
  caseReasoning?: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export default function CMSEditorStudioPage() {
  const { token, user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [conceptId, setConceptId] = useState<string | null>(null);
  const [conceptBreadcrumb, setConceptBreadcrumb] = useState<string | null>(null);
  const [showAnchorModal, setShowAnchorModal] = useState(false);
  const [blocks, setBlocks] = useState<BlockItem[]>([
    {
      id: generateId(),
      type: "EXPLANATION",
      text: "### Pathophysiology & Mechanisms\n\nEnter detailed core theory markdown here..."
    }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function addBlock(type: BlockType) {
    if (type === "EXPLANATION") {
      setBlocks((prev) => [
        ...prev,
        { id: generateId(), type: "EXPLANATION", text: "### Key Clinical Insights\n\nEnter explanation text..." }
      ]);
    } else if (type === "QUIZ") {
      setBlocks((prev) => [
        ...prev,
        {
          id: generateId(),
          type: "QUIZ",
          quizQuestion: "What is the hallmark diagnostic finding?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0,
          explanation: "Option A is correct based on guideline criteria."
        }
      ]);
    } else if (type === "FLASHCARD") {
      setBlocks((prev) => [
        ...prev,
        {
          id: generateId(),
          type: "FLASHCARD",
          flashFront: "High-Yield Clinical Pearl: ...",
          flashBack: "Diagnostic and therapeutic pearl details..."
        }
      ]);
    } else if (type === "CLINICAL_CASE") {
      setBlocks((prev) => [
        ...prev,
        {
          id: generateId(),
          type: "CLINICAL_CASE",
          scenario: "A 48-year-old patient presents with acute symptoms...",
          caseQuestion: "What is the most appropriate next step in management?",
          caseReasoning: "Targeted stabilization and protocolized intervention."
        }
      ]);
    }
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  const [isAiGenerating, setIsAiGenerating] = useState(false);

  function updateBlock(id: string, updates: Partial<BlockItem>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }

  async function handleAiGenerate() {
    const explanationBlock = blocks.find((b) => b.type === "EXPLANATION" && b.text && b.text.trim().length > 30);
    if (!explanationBlock || !explanationBlock.text) {
      setStatusMsg({
        type: "error",
        text: "Please write at least 30 characters in the Theory/Explanation block first for AI drafting."
      });
      return;
    }

    setIsAiGenerating(true);
    setStatusMsg(null);

    try {
      const quizRes = await fetch("/api/v1/ai/generate/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ text: explanationBlock.text, count: 2 })
      });

      const flashRes = await fetch("/api/v1/ai/generate/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ text: explanationBlock.text, count: 2 })
      });

      const newBlocks: BlockItem[] = [];

      if (quizRes.ok) {
        const quizData = await quizRes.json();
        if (quizData.questions && quizData.questions.length > 0) {
          const q = quizData.questions[0];
          newBlocks.push({
            id: generateId(),
            type: "QUIZ",
            quizQuestion: q.question,
            options: q.options,
            correctIndex: q.correctIndex || 0,
            explanation: q.explanation
          });
        }
      }

      if (flashRes.ok) {
        const flashData = await flashRes.json();
        if (flashData.cards && flashData.cards.length > 0) {
          const c = flashData.cards[0];
          newBlocks.push({
            id: generateId(),
            type: "FLASHCARD",
            flashFront: c.front,
            flashBack: c.back
          });
        }
      }

      if (newBlocks.length > 0) {
        setBlocks((prev) => [...prev, ...newBlocks]);
        setStatusMsg({
          type: "success",
          text: "✨ AI Assistant generated Quiz and Flashcard blocks from your Theory text!"
        });
      } else {
        addBlock("QUIZ");
        addBlock("FLASHCARD");
      }
    } catch (err: any) {
      console.error("AI Generation error:", err);
      addBlock("QUIZ");
      addBlock("FLASHCARD");
      setStatusMsg({
        type: "success",
        text: "Draft Quiz & Flashcard templates added."
      });
    } finally {
      setIsAiGenerating(false);
    }
  }

  async function handleSave(submitForReview: boolean) {
    if (!title.trim()) {
      setStatusMsg({ type: "error", text: "Please provide a valid lesson title." });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      // Transform blocks to backend schema
      const formattedBlocks = blocks.map((b, idx) => {
        let metadata: any = {};
        if (b.type === "EXPLANATION") {
          metadata = { text: b.text || "" };
        } else if (b.type === "QUIZ") {
          metadata = {
            title: b.quizTitle || `${title} Practice Checkpoint`,
            questions: [
              {
                question: b.quizQuestion || "",
                options: b.options || ["A", "B", "C", "D"],
                correctIndex: b.correctIndex || 0,
                explanation: b.explanation || ""
              }
            ]
          };
        } else if (b.type === "FLASHCARD") {
          metadata = {
            title: `${title} Spaced Deck`,
            cards: [{ front: b.flashFront || "", back: b.flashBack || "", difficulty: "High-Yield" }]
          };
        } else if (b.type === "CLINICAL_CASE") {
          metadata = {
            scenario: b.scenario || "",
            question: b.caseQuestion || "",
            explanation: b.caseReasoning || ""
          };
        }

        return {
          type: b.type,
          orderIndex: idx + 1,
          metadata
        };
      });

      const res = await cmsApi.createLesson({
        title,
        conceptId: conceptId || undefined,
        difficulty,
        blocks: formattedBlocks
      });

      if (submitForReview && res && res.id) {
        await cmsApi.submitForReview(res.id);
        setStatusMsg({
          type: "success",
          text: `Lesson "${title}" created and successfully submitted to the Faculty Review Queue!`
        });
      } else {
        setStatusMsg({
          type: "success",
          text: `Lesson "${title}" saved as DRAFT in the CMS repository.`
        });
      }

      setTimeout(() => {
        router.push("/cms");
      }, 1500);
    } catch (err: any) {
      console.error("CMS Save error:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to save lesson. Ensure you have Content Author credentials."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link
              href="/cms"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition mb-2"
            >
              <ArrowLeft size={14} /> Back to CMS Review Queue
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <Sparkles size={24} className="text-blue-400" /> Multi-Modal Content Authoring Studio
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Create structured theory, quizzes, flashcards, and clinical vignettes backed by the PostgreSQL curriculum schema.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Save size={14} /> Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Send size={14} /> Submit For Review
            </button>
          </div>
        </div>
      </div>

      {/* Main Authoring Form */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
              statusMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {statusMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Core Lesson Details Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            1. Lesson Metadata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Lesson Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Acute Coronary Syndromes: Pathophysiology & Biomarkers"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Difficulty Tier</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Clinical Core)</option>
                <option value="Advanced">Advanced (Postgraduate)</option>
              </select>
            </div>
          </div>

          {/* Curriculum Anchor */}
          <div className="pt-3 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-400 block mb-2">Curriculum Placement Anchor</label>
            {conceptId ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-900/10 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <LinkIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-100">Anchored to Curriculum</p>
                    <p className="text-xs text-blue-300/70 truncate max-w-xl">{conceptBreadcrumb}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAnchorModal(true)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAnchorModal(true)}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-slate-600 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-slate-300 transition"
              >
                <Plus size={16} /> Select Canonical Concept to Anchor Lesson
              </button>
            )}
          </div>
        </div>

        {/* Content Blocks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              2. Multi-Modal Content Blocks ({blocks.length})
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition disabled:opacity-50"
              >
                <Sparkles size={13} /> {isAiGenerating ? "AI Drafting..." : "✨ AI Auto-Draft Blocks"}
              </button>
              <button
                onClick={() => addBlock("EXPLANATION")}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
              >
                <FileText size={13} className="text-blue-400" /> + Theory Block
              </button>
              <button
                onClick={() => addBlock("QUIZ")}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
              >
                <HelpCircle size={13} className="text-emerald-400" /> + Quiz Block
              </button>
              <button
                onClick={() => addBlock("FLASHCARD")}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
              >
                <Layers size={13} className="text-amber-400" /> + Flashcard Deck
              </button>
              <button
                onClick={() => addBlock("CLINICAL_CASE")}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
              >
                <Activity size={13} className="text-rose-400" /> + Clinical Case
              </button>
            </div>
          </div>

          {/* Block Cards List */}
          <div className="space-y-4">
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span
                      className={
                        block.type === "EXPLANATION"
                          ? "text-blue-400"
                          : block.type === "QUIZ"
                          ? "text-emerald-400"
                          : block.type === "FLASHCARD"
                          ? "text-amber-400"
                          : "text-rose-400"
                      }
                    >
                      {block.type}
                    </span>
                  </div>

                  {blocks.length > 1 && (
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="text-slate-500 hover:text-rose-400 transition text-xs p-1"
                      title="Remove block"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                {/* Block Content Editor */}
                {block.type === "EXPLANATION" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Markdown Content</label>
                    <textarea
                      rows={6}
                      value={block.text || ""}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                      placeholder="Write comprehensive theory in GitHub Flavored Markdown..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {block.type === "QUIZ" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Question Text</label>
                      <input
                        type="text"
                        value={block.quizQuestion || ""}
                        onChange={(e) => updateBlock(block.id, { quizQuestion: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(block.options || []).map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${block.id}`}
                            checked={block.correctIndex === oIdx}
                            onChange={() => updateBlock(block.id, { correctIndex: oIdx })}
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(block.options || [])];
                              newOpts[oIdx] = e.target.value;
                              updateBlock(block.id, { options: newOpts });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Clinical Explanation Key</label>
                      <input
                        type="text"
                        value={block.explanation || ""}
                        onChange={(e) => updateBlock(block.id, { explanation: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                      />
                    </div>
                  </div>
                )}

                {block.type === "FLASHCARD" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-amber-400">Flashcard Front (Prompt)</label>
                      <textarea
                        rows={3}
                        value={block.flashFront || ""}
                        onChange={(e) => updateBlock(block.id, { flashFront: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-emerald-400">Flashcard Back (Answer)</label>
                      <textarea
                        rows={3}
                        value={block.flashBack || ""}
                        onChange={(e) => updateBlock(block.id, { flashBack: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                )}

                {block.type === "CLINICAL_CASE" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-rose-400">Clinical Scenario</label>
                      <textarea
                        rows={3}
                        value={block.scenario || ""}
                        onChange={(e) => updateBlock(block.id, { scenario: e.target.value })}
                        placeholder="Patient demographics, presentation, vitals, labs..."
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Clinical Question</label>
                        <input
                          type="text"
                          value={block.caseQuestion || ""}
                          onChange={(e) => updateBlock(block.id, { caseQuestion: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Diagnostic Reasoning</label>
                        <input
                          type="text"
                          value={block.caseReasoning || ""}
                          onChange={(e) => updateBlock(block.id, { caseReasoning: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <CurriculumAnchorModal
        isOpen={showAnchorModal}
        onClose={() => setShowAnchorModal(false)}
        onSelectConcept={(id, breadcrumb) => {
          setConceptId(id);
          setConceptBreadcrumb(breadcrumb);
          setShowAnchorModal(false);
        }}
      />
    </div>
  );
}
