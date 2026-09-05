"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Star,
  RefreshCw,
  CheckCircle,
  BarChart2,
  Volume2,
  VolumeX,
  Sparkles,
  Image as ImageIcon,
  Maximize2,
  X,
  Plus,
  Shuffle,
  RotateCcw,
  Search,
  Brain,
  Zap,
  Layers,
  AlertTriangle,
  Lightbulb,
  Keyboard,
  Flame,
  Eye
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import DeckImporterModal, { ImportedCard } from "@/components/flashcards/DeckImporterModal";
import {
  ReviewQuality,
  FlashcardReviewRecord,
  processReview,
  getDueCards,
  computeSessionStats,
  getIntervalHistogramData,
  SessionStats,
} from "../../../.gemini/skills/SpacedRepetitionEngine";

export interface Card {
  id: number;
  deck: string;
  front: string;
  back: string;
  interval: number; // days
  repetition: number;
  ef: number; // easiness factor
  type?: "standard" | "cloze" | "image" | "basic";
  imageUrl?: string;
  audioPrompt?: string;
  mnemonic?: string;
  lapses?: number;
  nextReviewDate?: string | Date;
  lastReviewDate?: string | Date | null;
  totalReviews?: number;
  retentionHistory?: ReviewQuality[];
}

const cardToRecord = (c: Card): FlashcardReviewRecord => ({
  cardId: String(c.id),
  easinessFactor: c.ef || 2.5,
  intervalDays: c.interval || 1,
  repetitions: c.repetition || 0,
  nextReviewDate: c.nextReviewDate ? new Date(c.nextReviewDate) : new Date(Date.now() - 3600000),
  lastReviewDate: c.lastReviewDate ? new Date(c.lastReviewDate) : null,
  totalReviews: c.totalReviews || 0,
  retentionHistory: c.retentionHistory || [],
});

const DOMAINS = [
  "All Decks",
  "Cardiovascular",
  "Renal",
  "Respiratory",
  "Pharmacology",
  "Neuroanatomy",
  "Clinical High-Yield"
] as const;

const INITIAL_CARDS: Card[] = [
  {
    id: 1,
    deck: "Cardiovascular",
    type: "cloze",
    front: "In cardiac muscle contraction, the {{c1::A band}} remains constant in length, while the {{c2::I band}} and {{c3::H zone}} shorten.",
    back: "In cardiac muscle contraction, the {{c1::A band}} remains constant in length, while the {{c2::I band}} and {{c3::H zone}} shorten.",
    mnemonic: "HIZ shrink, A stays: H-zone, I-band, and Z-lines move closer during sarcomere shortening; A-band is Always the same length.",
    audioPrompt: "In cardiac muscle contraction, which sarcomere band remains constant in length, and which bands shorten?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 2,
    deck: "Renal",
    type: "standard",
    front: "Which nephron segment and transporter are inhibited by Loop Diuretics (e.g. Furosemide), and what metabolic derangement do they induce?",
    back: "Loop diuretics inhibit the Na+/K+/2Cl- (NKCC2) cotransporter in the Thick Ascending Limb (TAL) of Henle's loop. They induce Hypokalemic Hypochloremic Metabolic Alkalosis and hypercalciuria.",
    mnemonic: "Loops Lose Calcium (hypercalciuria), Thiazides Take Calcium (hypercalcemia/hypocalciuria).",
    audioPrompt: "Which nephron segment and transporter are inhibited by loop diuretics, and what metabolic derangement do they induce?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 3,
    deck: "Respiratory",
    type: "cloze",
    front: "Pulmonary surfactant is synthesized by {{c1::Type II pneumocytes}} starting around week 26 of gestation, composed primarily of {{c2::dipalmitoylphosphatidylcholine (DPPC)}}.",
    back: "Pulmonary surfactant is synthesized by {{c1::Type II pneumocytes}} starting around week 26 of gestation, composed primarily of {{c2::dipalmitoylphosphatidylcholine (DPPC)}}.",
    mnemonic: "Type II cells have 2 crucial roles: produce surfactant to decrease alveolar surface tension, and act as progenitor stem cells for Type I pneumocytes.",
    audioPrompt: "What cells synthesize pulmonary surfactant and what is its primary phospholipid constituent?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 4,
    deck: "Pharmacology",
    type: "standard",
    front: "What are the classic clinical manifestations of Anticholinergic Toxicity (e.g., Atropine or Scopolamine toxicity)?",
    back: "Tachycardia, anhidrosis (dry mouth/skin), mydriasis with cycloplegia, fever/hyperthermia, flushed skin, urinary retention, and acute delirium or hallucinations.",
    mnemonic: "Hot as a hare (fever), Blind as a bat (cycloplegia/mydriasis), Dry as a bone (anhidrosis), Red as a beet (vasodilation), Mad as a hatter (delirium), Full as a flask (urinary retention).",
    audioPrompt: "What are the classic clinical manifestations of anticholinergic toxicity?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 5,
    deck: "Neuroanatomy",
    type: "image",
    front: "Identify the vascular anatomy of the Circle of Willis and explain the presentation of an Anterior Communicating Artery (ACom) aneurysm rupture vs compression.",
    back: "ACom aneurysm rupture causes Subarachnoid Hemorrhage ('worst headache of life'). Compression of the central optic chiasm leads to Bitemporal Hemianopsia without motor deficits.",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    mnemonic: "ACom = Anterior optic chiasm compression (Bitemporal visual field loss). PCom = Posterior CN III palsy (blown pupil, 'down and out' eye).",
    audioPrompt: "What are the clinical consequences of an anterior communicating artery aneurysm rupture and compression?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 6,
    deck: "Clinical High-Yield",
    type: "standard",
    front: "What constitutes Beck's Triad, and what acute life-threatening cardiovascular emergency does it diagnose?",
    back: "Beck's Triad diagnoses Acute Cardiac Tamponade. The triad consists of: 1) Hypotension / Decreased arterial BP, 2) Distended jugular veins (Elevated JVP), 3) Muffled / Distant heart sounds.",
    mnemonic: "3 D's of Beck: Distant heart sounds, Distended jugular veins, Decreased arterial blood pressure (plus pulsus paradoxus).",
    audioPrompt: "What is Beck's Triad and what condition does it diagnose?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 7,
    deck: "Cardiovascular",
    type: "standard",
    front: "What is the physiological mechanism of an S3 heart sound, and what clinical conditions does a pathological S3 indicate?",
    back: "Caused by sudden deceleration of rapid ventricular passive filling into an overcompliant or volume-overloaded ventricle during early diastole. Pathological in systolic heart failure (dilated cardiomyopathy, mitral/aortic regurgitation).",
    mnemonic: "S3 = Ken-tuck-y (SLOSH'-ing-in, early diastole volume overload). S4 = Ten-nes-see (STIFF'-wall, late diastole atrial kick against hypertrophy).",
    audioPrompt: "What is the physiological mechanism of an S3 heart sound and what does it indicate?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 8,
    deck: "Pharmacology",
    type: "cloze",
    front: "Warfarin inhibits {{c1::VKOR (Vitamin K epoxide reductase)}}, depleting active clotting factors {{c2::II, VII, IX, X, Protein C, Protein S}}, monitored via {{c3::PT / INR}}.",
    back: "Warfarin inhibits {{c1::VKOR (Vitamin K epoxide reductase)}}, depleting active clotting factors {{c2::II, VII, IX, X, Protein C, Protein S}}, monitored via {{c3::PT / INR}}.",
    mnemonic: "Vitamin K-dependent clotting factors: 1972 (10, 9, 7, 2) + anticoagulant Proteins C & S. Rapid reversal is 4-Factor Prothrombin Complex Concentrate (PCC) + IV Vitamin K.",
    audioPrompt: "What enzyme is inhibited by Warfarin and which coagulation factors are depleted?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 9,
    deck: "Renal",
    type: "cloze",
    front: "Renin is released by {{c1::Juxtaglomerular (JG) cells}} in response to renal hypoperfusion, sympathetic beta-1 stimulation, and decreased {{c2::NaCl delivery}} sensed by the {{c3::Macula Densa}}.",
    back: "Renin is released by {{c1::Juxtaglomerular (JG) cells}} in response to renal hypoperfusion, sympathetic beta-1 stimulation, and decreased {{c2::NaCl delivery}} sensed by the {{c3::Macula Densa}}.",
    mnemonic: "Macula Densa = Sodium Chemosensor in distal convoluted tubule; JG Cells = Modified vascular smooth muscle baroreceptors producing renin.",
    audioPrompt: "What anatomical structures and physiologic signals stimulate the release of renin?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  },
  {
    id: 10,
    deck: "Clinical High-Yield",
    type: "image",
    front: "What clinical findings define Charcot's Triad and Reynolds' Pentad in Acute Ascending Cholangitis?",
    back: "Charcot's Triad: 1) RUQ abdominal pain, 2) Fever/chills, 3) Jaundice.\nReynolds' Pentad: Charcot's Triad + 4) Hypotension/Septic shock + 5) Altered mental status.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    mnemonic: "Charcot = Pain + Fever + Jaundice. Reynolds adds Shock + Confusion (indicates suppurative cholangitis requiring emergent biliary decompression).",
    audioPrompt: "What clinical findings define Charcot's Triad and Reynolds' Pentad for acute cholangitis?",
    interval: 1,
    repetition: 0,
    ef: 2.5,
    lapses: 0
  }
];

// Helper: Cloze Front Formatter (replaces {{c1::answer}} with styled masked [...])
function renderClozeFront(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\{\{c\d+::(.*?)(?:::([^}]*))?\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    const hint = match[2] ? `[... ${match[2]} ...]` : "[ ... ]";
    parts.push(
      <span
        key={`cloze-front-${start}`}
        className="inline-block px-2.5 py-0.5 mx-1 font-bold text-sky-300 bg-sky-950/90 border border-sky-500/50 rounded-lg shadow-inner font-mono text-sm tracking-wider animate-pulse"
      >
        {hint}
      </span>
    );
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

// Helper: Cloze Back Formatter (replaces {{c1::answer}} with styled highlighted answer)
function renderClozeBack(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\{\{c\d+::(.*?)(?:::([^}]*))?\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    const answer = match[1];
    parts.push(
      <span
        key={`cloze-back-${start}`}
        className="inline-block px-2.5 py-0.5 mx-1 font-bold text-emerald-200 bg-emerald-950/90 border border-emerald-500/60 rounded-lg shadow-sm text-sm"
      >
        {answer}
      </span>
    );
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

// Helper to remove cloze markers for clean audio narration
function cleanClozeForSpeech(text: string, showAnswer = true): string {
  if (showAnswer) {
    return text.replace(/\{\{c\d+::(.*?)(?:::.*?)?\}\}/g, "$1");
  } else {
    return text.replace(/\{\{c\d+::(.*?)(?:::([^}]*))?\}\}/g, (_, __, hint) =>
      hint ? `blank, hint: ${hint}` : "blank"
    );
  }
}

export default function FlashcardsDashboard() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [activeDeck, setActiveDeck] = useState<string>("All Decks");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(240);
  const [streak, setStreak] = useState<number>(7);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isImporterOpen, setIsImporterOpen] = useState<boolean>(false);
  const [expandedImage, setExpandedImage] = useState<{ url: string; caption: string } | null>(null);
  const [aiToast, setAiToast] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [reviewMode, setReviewMode] = useState<"all" | "due">("all");
  const [sessionResults, setSessionResults] = useState<{ cardId: string; quality: ReviewQuality }[]>([]);

  // Initialize and persist cards to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mediverse_flashcards_phase_g");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed);
        }
      }
      const savedXp = localStorage.getItem("mediverse_flashcards_xp");
      if (savedXp) setXp(parseInt(savedXp, 10));
      const savedStreak = localStorage.getItem("mediverse_flashcards_streak");
      if (savedStreak) setStreak(parseInt(savedStreak, 10));
    } catch (e) {
      console.warn("Could not load stored flashcards", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("mediverse_flashcards_phase_g", JSON.stringify(cards));
      localStorage.setItem("mediverse_flashcards_xp", xp.toString());
      localStorage.setItem("mediverse_flashcards_streak", streak.toString());
    } catch (e) {
      console.warn("Could not save flashcards to storage", e);
    }
  }, [cards, xp, streak, isHydrated]);

  // Compute all SM-2 review records, due cards, and session statistics
  const allRecords = useMemo(() => cards.map(cardToRecord), [cards]);
  const dueRecords = useMemo(() => getDueCards(allRecords), [allRecords]);
  const dueCardIds = useMemo(() => new Set(dueRecords.map((r) => r.cardId)), [dueRecords]);

  const sessionStats = useMemo(() => {
    return computeSessionStats(allRecords, sessionResults);
  }, [allRecords, sessionResults]);

  const histogramData = useMemo(() => {
    return getIntervalHistogramData(allRecords);
  }, [allRecords]);

  // Filter cards by deck, search query, and review mode
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      if (reviewMode === "due" && !dueCardIds.has(String(c.id))) {
        return false;
      }
      const matchesDeck = activeDeck === "All Decks" || c.deck === activeDeck;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.front.toLowerCase().includes(q) ||
        c.back.toLowerCase().includes(q) ||
        c.deck.toLowerCase().includes(q) ||
        (c.mnemonic && c.mnemonic.toLowerCase().includes(q));
      return matchesDeck && matchesQuery;
    });
  }, [cards, activeDeck, searchQuery, reviewMode, dueCardIds]);

  const currentCard = filteredCards[currentCardIdx] || null;

  // Deck statistics
  const deckStats = useMemo(() => {
    const counts: Record<string, { total: number; mastered: number; learning: number }> = {};
    DOMAINS.forEach((d) => {
      counts[d] = { total: 0, mastered: 0, learning: 0 };
    });

    cards.forEach((c) => {
      const isMastered = c.repetition >= 2 && c.interval >= 6;
      if (counts["All Decks"]) {
        counts["All Decks"].total += 1;
        if (isMastered) counts["All Decks"].mastered += 1;
        else counts["All Decks"].learning += 1;
      }
      if (counts[c.deck]) {
        counts[c.deck].total += 1;
        if (isMastered) counts[c.deck].mastered += 1;
        else counts[c.deck].learning += 1;
      }
    });

    return counts;
  }, [cards]);

  // Available deck names for importer
  const availableDeckList = useMemo(() => {
    const customDecks = Array.from(new Set(cards.map((c) => c.deck)));
    const all = Array.from(
      new Set([...DOMAINS.filter((d) => d !== "All Decks"), ...customDecks])
    );
    return all;
  }, [cards]);

  // Overall mastery rate
  const masteryPercentage = useMemo(() => {
    if (cards.length === 0) return 0;
    const mastered = cards.filter((c) => c.repetition >= 2 && c.interval >= 6).length;
    return Math.round((mastered / cards.length) * 100);
  }, [cards]);

  // Stop TTS on card change or flip
  const stopTTS = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    stopTTS();
  }, [currentCardIdx, isFlipped, activeDeck, stopTTS]);

  // Text-To-Speech handler with speech rate 0.95
  const handleListen = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        alert("Speech synthesis is not supported in this browser.");
        return;
      }

      if (isSpeaking) {
        stopTTS();
        return;
      }

      if (!currentCard) return;

      let textToSpeak = "";
      if (currentCard.audioPrompt) {
        textToSpeak = currentCard.audioPrompt;
      } else if (isFlipped) {
        textToSpeak = cleanClozeForSpeech(currentCard.back, true);
        if (currentCard.mnemonic) {
          textToSpeak += `. Mnemonic hint: ${currentCard.mnemonic}`;
        }
      } else {
        textToSpeak = cleanClozeForSpeech(currentCard.front, false);
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [currentCard, isFlipped, isSpeaking, stopTTS]
  );

  // Spaced Repetition (SuperMemo SM-2) Grading
  const handleGrade = useCallback(
    (quality: ReviewQuality) => {
      if (!currentCard) return;

      stopTTS();

      const record = cardToRecord(currentCard);
      const updatedRecord = processReview(record, quality);

      setCards((prev) =>
        prev.map((c) => {
          if (c.id === currentCard.id) {
            return {
              ...c,
              interval: updatedRecord.intervalDays,
              repetition: updatedRecord.repetitions,
              ef: updatedRecord.easinessFactor,
              nextReviewDate: updatedRecord.nextReviewDate,
              lastReviewDate: updatedRecord.lastReviewDate,
              totalReviews: updatedRecord.totalReviews,
              retentionHistory: updatedRecord.retentionHistory,
              lapses: quality < 3 ? (c.lapses || 0) + 1 : (c.lapses || 0),
            };
          }
          return c;
        })
      );

      setSessionResults((prev) => [
        ...prev,
        { cardId: String(currentCard.id), quality },
      ]);
      setXp((prev) => prev + (quality >= 4 ? 20 : quality === 3 ? 10 : 5));

      setIsFlipped(false);

      if (currentCardIdx < filteredCards.length - 1) {
        setCurrentCardIdx((prev) => prev + 1);
      } else {
        setCurrentCardIdx(0);
      }
    },
    [currentCard, currentCardIdx, filteredCards.length, stopTTS]
  );

  // AI Concept Clarifier Trigger (Dispatches mediverse:ask-ai custom event)
  const handleAskAI = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;

    const topic = currentCard.deck;
    const q = cleanClozeForSpeech(currentCard.front, false);
    const ans = cleanClozeForSpeech(currentCard.back, true);
    const mnem = currentCard.mnemonic ? `\nMnemonic Reference: ${currentCard.mnemonic}` : "";

    const prompt = `Please provide a high-yield clinical clarification for this medical board concept:\n\nSystem/Domain: ${topic}\nQuestion/Target: ${q}\nCore Board Fact: ${ans}${mnem}\n\nExplain the underlying pathophysiology, high-yield differential diagnoses, and exam pearls.`;

    window.dispatchEvent(new CustomEvent("mediverse:ask-ai", { detail: { text: prompt } }));

    setAiToast(`Prompt sent to Socratic AI Tutor (${currentCard.deck})`);
    setTimeout(() => setAiToast(null), 4000);
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape") {
        if (expandedImage) setExpandedImage(null);
        if (isImporterOpen) setIsImporterOpen(false);
        return;
      }

      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "1") {
        if (isFlipped) {
          e.preventDefault();
          handleGrade(1);
        }
      } else if (e.key === "2") {
        if (isFlipped) {
          e.preventDefault();
          handleGrade(3);
        }
      } else if (e.key === "3") {
        if (isFlipped) {
          e.preventDefault();
          handleGrade(4);
        }
      } else if (e.key === "4") {
        if (isFlipped) {
          e.preventDefault();
          handleGrade(5);
        }
      } else if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleListen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, handleGrade, handleListen, expandedImage, isImporterOpen]);

  // Import handler for DeckImporterModal
  const handleImportCards = (imported: ImportedCard[]) => {
    const formatted: Card[] = imported.map((c, i) => ({
      id: Date.now() + i,
      deck: c.deck || (activeDeck === "All Decks" ? "Clinical High-Yield" : activeDeck),
      front: c.front || "Untitled Question",
      back: c.back || "No answer provided",
      interval: 1,
      repetition: 0,
      ef: 2.5,
      type: c.type === "cloze" ? "cloze" : c.type === "image" ? "image" : "standard",
      imageUrl: c.imageUrl,
      lapses: 0
    }));

    setCards((prev) => [...prev, ...formatted]);
    setIsImporterOpen(false);
    setAiToast(`Successfully imported ${formatted.length} card(s)!`);
    setTimeout(() => setAiToast(null), 3500);
  };

  // Shuffle current deck
  const handleShuffle = () => {
    setCards((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    setCurrentCardIdx(0);
    setIsFlipped(false);
  };

  // Reset progress to default cards
  const handleResetToDefaults = () => {
    if (confirm("Reset all flashcards and spaced repetition metrics back to original deck defaults?")) {
      setCards(INITIAL_CARDS);
      setCurrentCardIdx(0);
      setIsFlipped(false);
      localStorage.removeItem("mediverse_flashcards_phase_g");
    }
  };

  // Dynamic retention curve data based on user cards and SM-2 retention estimate
  const curveData = useMemo(() => {
    const avgEf = cards.reduce((acc, c) => acc + (c.ef || 2.5), 0) / (cards.length || 1);
    return [
      { day: "Day 1", retention: 100, target: 100 },
      { day: "Day 2", retention: Math.min(96, Math.round(85 + avgEf * 3)), target: 90 },
      { day: "Day 3", retention: Math.min(93, Math.round(78 + avgEf * 3.5)), target: 82 },
      { day: "Day 5", retention: Math.min(88, Math.round(72 + avgEf * 3.8)), target: 76 },
      { day: "Day 7", retention: Math.min(84, Math.round(67 + avgEf * 4)), target: 70 },
      { day: "Day 14", retention: Math.min(80, Math.round(60 + avgEf * 4.5)), target: 65 },
      { day: "Day 30", retention: Math.min(76, Math.round(54 + avgEf * 5)), target: 60 }
    ];
  }, [cards]);

  // Interval preview helpers for grading buttons using SM-2
  const getNextInterval = (grade: ReviewQuality, card: Card | null) => {
    if (!card) return "1d";
    const record = cardToRecord(card);
    const updated = processReview(record, grade);
    return `${updated.intervalDays}d`;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold bg-slate-900/60 hover:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-800 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImporterOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-sky-950/50 transition-all border border-sky-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" /> + Create / Import Cards
            </button>
          </div>
        </div>

        {/* Header Summary */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/30 text-sky-400">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                  Spaced Repetition Flashcard System
                  <span className="text-xs font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md uppercase tracking-wider">
                    Phase G SM-2
                  </span>
                </h1>
                <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                  High-yield MBBS & USMLE recall engine with Cloze deletion, medical diagram lightbox, and Socratic AI tutoring.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto">
            <div className="flex-1 md:flex-initial bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-center shadow-inner">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Retention Streak
              </div>
              <div className="text-base font-extrabold text-amber-400 mt-0.5">{streak} Days Active</div>
            </div>
            <div className="flex-1 md:flex-initial bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-center shadow-inner">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 text-sky-400" /> Syllabus XP
              </div>
              <div className="text-base font-extrabold text-sky-400 mt-0.5">{xp} XP</div>
            </div>
            <div className="flex-1 md:flex-initial bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-center shadow-inner">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> Mastery Rate
              </div>
              <div className="text-base font-extrabold text-emerald-400 mt-0.5">{masteryPercentage}%</div>
            </div>
          </div>
        </header>

        {/* AI Toast Alert Notification */}
        {aiToast && (
          <div className="bg-gradient-to-r from-purple-950/90 to-slate-900 border border-purple-500/40 text-purple-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-lg shadow-purple-950/40 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>{aiToast}</span>
            </div>
            <button onClick={() => setAiToast(null)} className="text-purple-400 hover:text-purple-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Deck Filters & Search */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* SRS Review Mode Selector */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" /> Study Queue
                </span>
                <span
                  data-testid="due-queue-badge"
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dueRecords.length > 0
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {dueRecords.length} Due Now
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    setReviewMode("all");
                    setCurrentCardIdx(0);
                    setIsFlipped(false);
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition text-center ${
                    reviewMode === "all"
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All ({cards.length})
                </button>
                <button
                  onClick={() => {
                    setReviewMode("due");
                    setCurrentCardIdx(0);
                    setIsFlipped(false);
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition text-center ${
                    reviewMode === "due"
                      ? "bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Due Only ({dueRecords.length})
                </button>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" /> Deck Domains
                </h2>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {cards.length} cards
                </span>
              </div>

              {/* Search bar inside decks */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter cards..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentCardIdx(0);
                    setIsFlipped(false);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Deck buttons */}
              <div className="flex flex-col gap-1.5">
                {DOMAINS.map((deck) => {
                  const isActive = activeDeck === deck;
                  const stats = deckStats[deck] || { total: 0, mastered: 0 };
                  return (
                    <button
                      key={deck}
                      onClick={() => {
                        setActiveDeck(deck);
                        setCurrentCardIdx(0);
                        setIsFlipped(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-between ${
                        isActive
                          ? "bg-sky-500/15 border-sky-500 text-sky-300 shadow-sm"
                          : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-sky-400" : "bg-slate-600"}`} />
                        <span className="truncate">{deck}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <span>{stats.total}</span>
                        {stats.total > 0 && (
                          <span className="text-emerald-400">({Math.round((stats.mastered / stats.total) * 100)}%)</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={handleShuffle}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-sky-300 transition text-[11px] font-medium"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Shuffle
                </button>
                <button
                  onClick={handleResetToDefaults}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition text-[11px] font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset All
                </button>
              </div>
            </div>

            {/* Quick Keyboard Reference Card */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-lg text-[11px] text-slate-400 hidden lg:block">
              <div className="flex items-center gap-2 font-bold text-slate-300 mb-2 uppercase tracking-wider text-[10px]">
                <Keyboard className="w-3.5 h-3.5 text-indigo-400" /> Hotkeys Active
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span>Flip / Show Answer</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">Space / ↵</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Grade Card (Again / Hard / Good / Easy)</span>
                  <div className="flex gap-1">
                    <kbd className="px-1 py-0.5 bg-slate-950 border border-slate-700 rounded text-red-300 font-mono text-[10px]">1</kbd>
                    <kbd className="px-1 py-0.5 bg-slate-950 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">2</kbd>
                    <kbd className="px-1 py-0.5 bg-slate-950 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">3</kbd>
                    <kbd className="px-1 py-0.5 bg-slate-950 border border-slate-700 rounded text-emerald-300 font-mono text-[10px]">4</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Audio Narration (TTS)</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">A</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Core Spaced Repetition Interactive Card */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {currentCard ? (
              <div className="flex flex-col gap-4">
                {/* Progress bar and card index indicator */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 font-mono text-[11px]">
                      Card {currentCardIdx + 1} of {filteredCards.length}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-sky-400 font-medium">{currentCard.deck}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* TTS Read Aloud Button */}
                    <button
                      onClick={handleListen}
                      title="Read aloud with Text-to-Speech (Shortcut: A)"
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold transition ${
                        isSpeaking
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                          <span>Stop [A]</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Listen [A]</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Main 3D Card Canvas */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`group relative w-full min-h-[380px] rounded-3xl border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between p-6 md:p-8 shadow-2xl overflow-hidden ${
                    isFlipped
                      ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-sky-500/40 text-slate-100 shadow-sky-950/20"
                      : "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800 hover:border-slate-700 text-slate-200"
                  }`}
                >
                  {/* Top Card Badges & Indicators */}
                  <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase bg-slate-950 px-2.5 py-1 rounded-lg text-sky-400 border border-slate-800 flex items-center gap-1">
                        📁 {currentCard.deck}
                      </span>

                      {currentCard.type === "cloze" && (
                        <span className="text-[10px] font-bold uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-lg">
                          Cloze Deletion
                        </span>
                      )}

                      {currentCard.type === "image" && (
                        <span className="text-[10px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Diagram Card
                        </span>
                      )}

                      {(currentCard.lapses || 0) > 0 && (
                        <span className="text-[10px] font-bold uppercase bg-red-950/80 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Lapse ({currentCard.lapses}x)
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono">
                      Interval: {currentCard.interval}d • Rep: {currentCard.repetition} • EF: {currentCard.ef}
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="flex-1 flex flex-col justify-center items-center text-center my-2">
                    {!isFlipped ? (
                      /* Front side */
                      <div className="space-y-4 w-full">
                        <div className="text-xs uppercase font-bold text-sky-400 tracking-wider">
                          {currentCard.type === "cloze" ? "Fill in the blank" : "Question / Prompt"}
                        </div>

                        <div className="text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto text-slate-100">
                          {currentCard.type === "cloze" ? (
                            renderClozeFront(currentCard.front)
                          ) : (
                            currentCard.front
                          )}
                        </div>

                        {/* Optional thumbnail preview for Image cards */}
                        {currentCard.imageUrl && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedImage({
                                url: currentCard.imageUrl!,
                                caption: currentCard.front
                              });
                            }}
                            className="relative mx-auto mt-3 max-w-xs group/img rounded-xl overflow-hidden border border-slate-700 bg-slate-950 hover:border-sky-500 transition-all cursor-zoom-in shadow-md"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={currentCard.imageUrl}
                              alt="Medical diagram thumbnail"
                              className="w-full h-32 object-cover group-hover/img:scale-105 transition duration-300 opacity-90 group-hover/img:opacity-100"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition">
                              <span className="bg-sky-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg">
                                <Maximize2 className="w-3 h-3" /> Inspect Diagram
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Back side */
                      <div className="space-y-4 w-full text-left">
                        <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider text-center">
                          Key Clinical Answer
                        </div>

                        <div className="text-base md:text-lg font-medium leading-relaxed text-slate-100 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                          {currentCard.type === "cloze" ? (
                            renderClozeBack(currentCard.back)
                          ) : (
                            <div className="whitespace-pre-line">{currentCard.back}</div>
                          )}
                        </div>

                        {/* High-yield Diagram Thumbnail (Clickable) */}
                        {currentCard.imageUrl && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedImage({
                                url: currentCard.imageUrl!,
                                caption: currentCard.back
                              });
                            }}
                            className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 hover:border-sky-500 transition-all cursor-zoom-in shadow-md group/imgback"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={currentCard.imageUrl}
                              alt="Medical diagram illustration"
                              className="w-full h-40 object-cover group-hover/imgback:scale-102 transition duration-300"
                            />
                            <div className="absolute bottom-2 right-2 bg-slate-900/90 border border-slate-700 text-sky-300 text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                              <Maximize2 className="w-3 h-3" /> Click to Expand
                            </div>
                          </div>
                        )}

                        {/* Mnemonic Banner */}
                        {currentCard.mnemonic && (
                          <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3.5 text-amber-200 text-xs flex items-start gap-2.5">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-300">High-Yield Mnemonic: </span>
                              <span className="text-amber-100">{currentCard.mnemonic}</span>
                            </div>
                          </div>
                        )}

                        {/* AI Concept Clarifier Dispatch Button */}
                        <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                          <button
                            onClick={handleAskAI}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/50 text-purple-200 hover:text-white text-xs font-bold transition shadow-md shadow-purple-950/30 active:scale-95"
                          >
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span>🧠 AI Concept Clarifier</span>
                          </button>

                          {(currentCard.lapses || 0) > 0 && (
                            <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Lapse recovery active (interval reset to 1d)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Flip Indicator */}
                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 text-sky-400 animate-spin-slow" />
                      {isFlipped ? "Click anywhere or press [Space] to flip back" : "Click anywhere or press [Space] to flip"}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Mediverse Flashcard Engine</span>
                  </div>
                </div>

                {/* Bottom Grading & Action Controls */}
                {isFlipped ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-in fade-in slide-in-from-bottom-2">
                    {/* Grade 1: Again */}
                    <button
                      onClick={() => handleGrade(1)}
                      className="py-3 px-2 bg-red-650 hover:bg-red-600 text-white rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 shadow-lg shadow-red-950/40 border border-red-500/40 active:scale-98"
                    >
                      <div className="flex items-center gap-1">
                        <span>Again</span>
                        <kbd className="px-1.5 py-0.5 bg-red-800/80 rounded text-[10px] font-mono">[1]</kbd>
                      </div>
                      <span className="text-[10px] text-red-200 font-medium">
                        Next: {getNextInterval(1, currentCard)}
                      </span>
                    </button>

                    {/* Grade 3: Hard */}
                    <button
                      onClick={() => handleGrade(3)}
                      className="py-3 px-2 bg-amber-650 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 shadow-lg shadow-amber-950/40 border border-amber-500/40 active:scale-98"
                    >
                      <div className="flex items-center gap-1">
                        <span>Hard</span>
                        <kbd className="px-1.5 py-0.5 bg-amber-800/80 rounded text-[10px] font-mono">[2]</kbd>
                      </div>
                      <span className="text-[10px] text-amber-200 font-medium">
                        Next: {getNextInterval(3, currentCard)}
                      </span>
                    </button>

                    {/* Grade 4: Good */}
                    <button
                      onClick={() => handleGrade(4)}
                      className="py-3 px-2 bg-sky-650 hover:bg-sky-600 text-white rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 shadow-lg shadow-sky-950/40 border border-sky-500/40 active:scale-98"
                    >
                      <div className="flex items-center gap-1">
                        <span>Good</span>
                        <kbd className="px-1.5 py-0.5 bg-sky-800/80 rounded text-[10px] font-mono">[3]</kbd>
                      </div>
                      <span className="text-[10px] text-sky-200 font-medium">
                        Next: {getNextInterval(4, currentCard)}
                      </span>
                    </button>

                    {/* Grade 5: Easy */}
                    <button
                      onClick={() => handleGrade(5)}
                      className="py-3 px-2 bg-emerald-650 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 shadow-lg shadow-emerald-950/40 border border-emerald-500/40 active:scale-98"
                    >
                      <div className="flex items-center gap-1">
                        <span>Easy</span>
                        <kbd className="px-1.5 py-0.5 bg-emerald-800/80 rounded text-[10px] font-mono">[4]</kbd>
                      </div>
                      <span className="text-[10px] text-emerald-200 font-medium">
                        Next: {getNextInterval(5, currentCard)}
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xl active:scale-99"
                  >
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span>Show Answer</span>
                    <kbd className="ml-2 px-2 py-0.5 bg-slate-950 border border-slate-700 text-slate-400 rounded text-[10px] font-mono">
                      [Space / Enter]
                    </kbd>
                  </button>
                )}
              </div>
            ) : (
              /* Empty Deck State */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[380px] shadow-2xl">
                <CheckCircle className="w-14 h-14 text-emerald-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-black text-white mb-2">Deck Review Completed!</h3>
                <p className="text-xs text-slate-400 max-w-sm mb-6">
                  All flashcards in &quot;{activeDeck}&quot; have been reviewed for this schedule cycle.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setActiveDeck("All Decks");
                      setCurrentCardIdx(0);
                      setIsFlipped(false);
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
                  >
                    Review All Decks
                  </button>
                  <button
                    onClick={() => setIsImporterOpen(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
                  >
                    + Import More Cards
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Spaced Repetition Analytics & Retention Curve */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Live Review Session Analytics */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" /> Active Session Analytics
                </h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded">
                  SM-2 Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Reviewed</div>
                  <div data-testid="session-reviewed-count" className="text-lg font-black text-slate-100 font-mono mt-0.5">
                    {sessionStats.cardsReviewed}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Retention</div>
                  <div data-testid="session-retention-rate" className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                    {sessionStats.retentionRate}%
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Avg Quality</div>
                  <div data-testid="session-avg-quality" className="text-lg font-black text-sky-400 font-mono mt-0.5">
                    {sessionStats.averageQuality} <span className="text-xs text-slate-400 font-normal">/ 5</span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Due Queue</div>
                  <div data-testid="session-due-count" className="text-lg font-black text-amber-400 font-mono mt-0.5">
                    {dueRecords.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Empirical Interval Distribution Histogram */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-400" /> Interval Histogram
                </h3>
                <span className="text-[10px] text-indigo-400 font-mono">SM-2 Spacing</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Distribution of card recall intervals across standard memory clusters.
              </p>
              <div className="h-40 w-full" data-testid="interval-histogram">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="interval" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#1e293b",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="count" name="Cards" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Retention Curve Chart */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-sky-400" /> Retention Curve (SM-2)
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">Ebbinghaus Model</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">
                Predicted memory retention across intervals based on your current Easiness Factors.
              </p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curveData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#1e293b",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "11px"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      name="Your Retention %"
                      stroke="#0ea5e9"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#0ea5e9" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Standard Target"
                      stroke="#475569"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Deck Performance Breakdown Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Performance Breakdown
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Mastered Cards (Rep &ge; 2)</span>
                    <span className="text-emerald-400 font-bold">
                      {cards.filter((c) => c.repetition >= 2).length} / {cards.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${cards.length ? (cards.filter((c) => c.repetition >= 2).length / cards.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Learning / New Cards</span>
                    <span className="text-sky-400 font-bold">
                      {cards.filter((c) => c.repetition < 2).length} / {cards.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${cards.length ? (cards.filter((c) => c.repetition < 2).length / cards.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Total Lapses Recovered:</span>
                  <span className="text-amber-400 font-bold">
                    {cards.reduce((acc, c) => acc + (c.lapses || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Image / Diagram Lightbox Modal */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">High-Yield Medical Diagram Inspection</h3>
              </div>
              <button
                onClick={() => setExpandedImage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={expandedImage.url}
                alt="High-resolution clinical diagram"
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-lg border border-slate-800"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <p className="line-clamp-2 max-w-2xl text-slate-300">{expandedImage.caption}</p>
              <button
                onClick={() => setExpandedImage(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition shrink-0 ml-4"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deck Importer Modal */}
      <DeckImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImport={handleImportCards}
        availableDecks={availableDeckList}
      />
    </div>
  );
}
