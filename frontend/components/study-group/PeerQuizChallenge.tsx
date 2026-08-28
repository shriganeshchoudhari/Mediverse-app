'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Swords, 
  Trophy, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Sparkles, 
  Brain, 
  Bot, 
  UserCheck, 
  ChevronRight, 
  RotateCcw, 
  Award, 
  Flame, 
  HelpCircle,
  Stethoscope,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface PeerQuizChallengeProps {
  roomId?: string;
  roomName?: string;
  userId?: string;
  userName?: string;
}

interface Question {
  id: string;
  specialty: string;
  vignette: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  highYieldPearl: string;
  rationale: string;
  distractorExplanations: { [key: string]: string };
}

const QUESTION_BANK: Question[] = [
  {
    id: 'q1-nephrology',
    specialty: '🩺 Nephrology & Acid-Base',
    vignette: 'A 24-year-old male with type 1 diabetes presents with nausea, abdominal pain, and rapid deep respirations (Kussmaul breathing). Arterial blood gas shows pH 7.18, PaCO2 24 mmHg, HCO3- 9 mEq/L. Serum chemistries: Na+ 136 mEq/L, K+ 5.4 mEq/L, Cl- 98 mEq/L, Glucose 480 mg/dL. Which of the following is the most accurate calculation of the anion gap and the primary metabolic derangement?',
    options: [
      { key: 'A', text: 'Anion gap 29; High anion gap metabolic acidosis with compensatory respiratory alkalosis' },
      { key: 'B', text: 'Anion gap 14; Normal anion gap metabolic acidosis with primary respiratory acidosis' },
      { key: 'C', text: 'Anion gap 38; High anion gap metabolic acidosis with concurrent metabolic alkalosis' },
      { key: 'D', text: 'Anion gap 19; Mixed non-anion gap metabolic acidosis and respiratory acidosis' },
    ],
    correctAnswer: 'A',
    highYieldPearl: 'Anion Gap = Na+ - (Cl- + HCO3-) = 136 - (98 + 9) = 29 (Normal: 8-12 mEq/L). Winter\'s formula: Expected PaCO2 = 1.5 × [HCO3-] + 8 ± 2 = 1.5 × 9 + 8 = 21.5 ± 2 mmHg (matches measured PaCO2 24 mmHg, confirming pure respiratory compensation).',
    rationale: 'Diabetic ketoacidosis (DKA) results in accumulation of unmeasured ketoacids (acetoacetate and beta-hydroxybutyrate), creating a profound High Anion Gap Metabolic Acidosis (HAGMA). Hyperventilation (Kussmaul breathing) represents appropriate physiological respiratory compensation.',
    distractorExplanations: {
      B: 'Incorrect. Anion gap calculation is 136 - (98 + 9) = 29, which is markedly elevated (>12), not normal.',
      C: 'Incorrect. Calculating the delta-delta ratio (ΔAG / ΔHCO3- = [29 - 10] / [24 - 9] = 19 / 15 ≈ 1.26) indicates an uncomplicated pure HAGMA without concurrent metabolic alkalosis.',
      D: 'Incorrect. The anion gap is 29, not 19, and the low PaCO2 (24) reflects appropriate respiratory compensation rather than primary respiratory acidosis.',
    },
  },
  {
    id: 'q2-cardiology',
    specialty: '🫀 Cardiology & Arrhythmias',
    vignette: 'A 28-year-old athlete experiences sudden-onset palpitations and lightheadedness during training. ECG shows a regular, narrow-complex tachycardia at 190 bpm with retrogradely conducted P waves visible just after the QRS complex (short RP interval). Vagal maneuvers briefly terminate the arrhythmia. Which of the following is the underlying electrophysiologic mechanism?',
    options: [
      { key: 'A', text: 'Dual AV nodal pathways with slow-fast reentrant circuit (AVNRT)' },
      { key: 'B', text: 'Orthodromic atrioventricular reciprocating tachycardia via accessory pathway' },
      { key: 'C', text: 'Enhanced automaticity of ectopic pulmonary vein myocardial sleeves' },
      { key: 'D', text: 'Macro-reentrant wavefront around the tricuspid valve annulus' },
    ],
    correctAnswer: 'A',
    highYieldPearl: 'AV Nodal Reentrant Tachycardia (AVNRT) is the most common paroxysmal SVT. It is mediated by dual AV nodal physiology (slow pathway with short refractory period + fast pathway with long refractory period). Pseudo-r\' waves in V1 or pseudo-S waves in inferior leads reflect retrograde P waves.',
    rationale: 'Typical slow-fast AVNRT involves antegrade conduction down the slow pathway and retrograde conduction up the fast pathway. Because retrograde atrial activation occurs almost simultaneously with ventricular activation, retrograde P waves appear immediately after (or buried in) the QRS complex (short RP interval). Vagal maneuvers terminate AVNRT by increasing parasympathetic tone and prolonging AV nodal refractoriness.',
    distractorExplanations: {
      B: 'Incorrect. Orthodromic AVRT conducts antegrade through the AV node and retrograde via an accessory bundle (e.g. Kent bundle), typically displaying a longer RP interval than typical AVNRT.',
      C: 'Incorrect. Enhanced automaticity of pulmonary veins is the primary trigger for Atrial Fibrillation, which produces an irregularly irregular narrow-complex rhythm, not a regular narrow-complex tachycardia.',
      D: 'Incorrect. Macro-reentry around the tricuspid annulus (cavo-tricuspid isthmus) describes typical Atrial Flutter (sawtooth F waves at ~300 bpm atrial rate), not AVNRT.',
    },
  },
  {
    id: 'q3-neurology',
    specialty: '🧠 Neurology & Stroke Localization',
    vignette: 'A 64-year-old woman is brought to the emergency department with sudden dizziness, vomiting, and severe dysphagia. Neurological examination reveals loss of pain and temperature sensation on the right side of the face and left side of the body, right Horner syndrome (ptosis, miosis, anhidrosis), right-sided limb ataxia, and hoarseness with an absent right gag reflex. Occlusion of which artery is most likely responsible?',
    options: [
      { key: 'A', text: 'Posterior Inferior Cerebellar Artery (PICA) / Vertebral Artery' },
      { key: 'B', text: 'Anterior Inferior Cerebellar Artery (AICA)' },
      { key: 'C', text: 'Superior Cerebellar Artery (SCA)' },
      { key: 'D', text: 'Anterior Spinal Artery (ASA) paramedian branch' },
    ],
    correctAnswer: 'A',
    highYieldPearl: 'Lateral Medullary (Wallenberg) Syndrome = PICA occlusion. Classic features: Nucleus Ambiguus lesion (CN IX, X: dysphagia, hoarseness, absent gag reflex), Spinal Trigeminal Nucleus (ipsilateral facial pain/temp), Spinothalamic (contralateral body pain/temp), Inferior Cerebellar Peduncle (ipsilateral ataxia), and Descending Sympathetics (ipsilateral Horner syndrome).',
    rationale: 'Lateral medullary syndrome (Wallenberg syndrome) is classically caused by infarction of the dorsolateral medulla supplied by PICA (or the vertebral artery). The unique distinguishing feature from AICA (lateral pontine syndrome) is the presence of dysphagia, hoarseness, and loss of gag reflex due to Nucleus Ambiguus (CN IX/X) involvement, whereas AICA causes facial paralysis (CN VII) and hearing loss (CN VIII).',
    distractorExplanations: {
      B: 'Incorrect. AICA occlusion causes Lateral Pontine Syndrome (facial nerve CN VII palsy, sensorineural deafness CN VIII, and vestibular symptoms), without the vocal cord paralysis or absent gag reflex of CN IX/X.',
      C: 'Incorrect. SCA occlusion causes ipsilateral cerebellar ataxia and contralateral loss of pain/temperature sensation without Horner syndrome or lower cranial nerve palsies.',
      D: 'Incorrect. ASA occlusion in the medulla produces Medial Medullary Syndrome: contralateral hemiparesis (corticospinal tract), contralateral loss of proprioception/vibration (medial lemniscus), and ipsilateral tongue deviation (CN XII).',
    },
  },
  {
    id: 'q4-pharmacology',
    specialty: '💊 Clinical Pharmacology & Nephrology',
    vignette: 'A 56-year-old patient with type 2 diabetes and CKD Stage 3a (eGFR 52 mL/min/1.73m²) with persistent microalbuminuria (UACR 280 mg/g) is started on Empagliflozin. By which specific molecular mechanism does this medication provide renal nephroprotection and slow progression of diabetic kidney disease?',
    options: [
      { key: 'A', text: 'Inhibition of SGLT2 in the proximal convoluted tubule, restoring macula densa tubuloglomerular feedback and reducing intraglomerular pressure' },
      { key: 'B', text: 'Direct vasodilatation of the efferent arteriole via bradykinin B2 receptor activation' },
      { key: 'C', text: 'Competitive antagonism of endothelin-1 ET-A receptors on podocyte slit diaphragms' },
      { key: 'D', text: 'Selective suppression of renal renin release through AT1 receptor down-regulation' },
    ],
    correctAnswer: 'A',
    highYieldPearl: 'SGLT2 inhibitors block glucose and sodium reabsorption in the early PCT. Increased Na+ and Cl- delivery to the macula densa restores tubuloglomerular feedback (TGF), causing afferent arteriolar vasoconstriction. This decreases hyperfiltration and reduces intraglomerular pressure.',
    rationale: 'In diabetic nephropathy, chronic proximal hyper-reabsorption of glucose and sodium depletes solute delivery to the macula densa. This deactivates tubuloglomerular feedback (TGF), leading to inappropriate afferent arteriolar vasodilation and damaging intraglomerular hypertension. SGLT2 inhibitors restore solute delivery to the macula densa, stimulating afferent vasoconstriction, relieving intraglomerular hypertension, and preserving nephrons.',
    distractorExplanations: {
      B: 'Incorrect. ACE inhibitors and ARBs promote efferent arteriolar vasodilation (by inhibiting angiotensin II), not SGLT2 inhibitors.',
      C: 'Incorrect. Endothelin receptor antagonists (such as atrasentan or sparsentan) block ET-A receptors, not SGLT2 inhibitors.',
      D: 'Incorrect. SGLT2 inhibitors do not down-regulate AT1 receptors or directly block renin release.',
    },
  },
  {
    id: 'q5-infectious-disease',
    specialty: '🦠 Infectious Disease & Critical Care',
    vignette: 'A 21-year-old college student presents to the emergency department with a 12-hour history of severe headache, high fever (39.8°C), photophobia, nuchal rigidity, and a rapidly progressive petechial/purpuric rash on the extremities. Blood cultures and lumbar puncture are pending. What is the most appropriate immediate management?',
    options: [
      { key: 'A', text: 'Immediate IV Ceftriaxone + IV Vancomycin + IV Dexamethasone (administered prior to or with the first antibiotic dose)' },
      { key: 'B', text: 'Oral Ciprofloxacin 500 mg stat while waiting for lumbar puncture results' },
      { key: 'C', text: 'IV Ampicillin alone with hypertonic saline bolus' },
      { key: 'D', text: 'IV Acyclovir monotherapy until bacterial cultures confirm sterility' },
    ],
    correctAnswer: 'A',
    highYieldPearl: 'Acute bacterial meningitis (S. pneumoniae & N. meningitidis) is a medical emergency. Empiric therapy: Ceftriaxone (or Cefotaxime) + Vancomycin (for cephalosporin-resistant pneumococci). IV Dexamethasone given before/with the 1st dose reduces mortality and hearing loss in pneumococcal meningitis.',
    rationale: 'The presentation is classic for acute meningococcal meningitis (Neisseria meningitidis) or pneumococcal meningitis. Antimicrobial therapy must NEVER be delayed for diagnostic procedures. Empiric coverage requires high-dose 3rd-generation cephalosporin (Ceftriaxone) plus Vancomycin. Adjunctive IV Dexamethasone reduces subarachnoid inflammatory cascade and neurological sequelae.',
    distractorExplanations: {
      B: 'Incorrect. Oral ciprofloxacin is used for post-exposure prophylaxis in close contacts of meningococcal disease, never for treatment of active fulminant meningitis.',
      C: 'Incorrect. Ampicillin is added only for Listeria monocytogenes coverage in neonates, elderly (>50 years), or immunocompromised patients. It is insufficient as monotherapy in a young adult.',
      D: 'Incorrect. Acyclovir is the treatment for HSV encephalitis (which presents with focal temporal lobe seizures and altered mentation, not petechial rash with severe nuchal rigidity).',
    },
  },
];

interface OpponentProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  accuracy: number; // 0 to 1
  minResponseTime: number; // in seconds
  maxResponseTime: number;
}

const OPPONENTS: OpponentProfile[] = [
  {
    id: 'ai-fellow',
    name: 'Dr. Synapse (AI Fellow)',
    title: 'Chief AI Medical Fellow • 88% USMLE Accuracy',
    avatar: '🤖',
    accuracy: 0.85,
    minResponseTime: 4,
    maxResponseTime: 8,
  },
  {
    id: 'res-bot',
    name: 'Resident Bot (PGY-2)',
    title: 'Emergency Medicine Resident • Rapid Responder',
    avatar: '⚡',
    accuracy: 0.75,
    minResponseTime: 5,
    maxResponseTime: 11,
  },
  {
    id: 'peer-sarah',
    name: 'Sarah Chen (MS3 Peer)',
    title: 'Cohort Study Partner • Nephrology Honors',
    avatar: '👩‍⚕️',
    accuracy: 0.8,
    minResponseTime: 6,
    maxResponseTime: 13,
  },
];

export function PeerQuizChallenge({
  roomId = 'study-group-default',
  roomName = 'Clinical Cohort Alpha',
  userId = 'user-current',
  userName = 'Student',
}: PeerQuizChallengeProps) {
  // Game States: 'lobby' | 'in-game' | 'summary'
  const [gameState, setGameState] = useState<'lobby' | 'in-game' | 'summary'>('lobby');
  const [selectedOpponent, setSelectedOpponent] = useState<OpponentProfile>(OPPONENTS[0]);

  // Round / Question State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [userSelectedOption, setUserSelectedOption] = useState<string | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState<boolean>(false);
  const [showRationale, setShowRationale] = useState<boolean>(false);

  // Scores and Streaks
  const [userScore, setUserScore] = useState<number>(0);
  const [userStreak, setUserStreak] = useState<number>(0);
  const [userCorrectCount, setUserCorrectCount] = useState<number>(0);
  const [userResponseTimes, setUserResponseTimes] = useState<number[]>([]);

  // Opponent State for current question
  const [opponentSelectedOption, setOpponentSelectedOption] = useState<string | null>(null);
  const [opponentStatus, setOpponentStatus] = useState<string>('Thinking...');
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [opponentCorrectCount, setOpponentCorrectCount] = useState<number>(0);

  // Auto advance timer
  const [autoAdvanceCount, setAutoAdvanceCount] = useState<number | null>(null);

  const questionStartTimeRef = useRef<number>(Date.now());
  const opponentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentQ = QUESTION_BANK[currentQuestionIndex] || QUESTION_BANK[0];

  // Start Duel Game
  const handleStartDuel = () => {
    setGameState('in-game');
    setCurrentQuestionIndex(0);
    setUserScore(0);
    setOpponentScore(0);
    setUserStreak(0);
    setUserCorrectCount(0);
    setOpponentCorrectCount(0);
    setUserResponseTimes([]);
    resetQuestionState(0);
  };

  // Reset state for new question
  const resetQuestionState = useCallback((qIndex: number) => {
    setTimeLeft(30);
    setUserSelectedOption(null);
    setIsAnswerLocked(false);
    setShowRationale(false);
    setAutoAdvanceCount(null);
    setOpponentSelectedOption(null);
    setOpponentStatus('Analyzing vignette...');
    questionStartTimeRef.current = Date.now();

    // Schedule Opponent Response
    const q = QUESTION_BANK[qIndex];
    if (!q) return;

    const delaySeconds = Math.floor(
      Math.random() * (selectedOpponent.maxResponseTime - selectedOpponent.minResponseTime + 1) +
        selectedOpponent.minResponseTime
    );

    if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);

    opponentTimeoutRef.current = setTimeout(() => {
      // Determine if opponent answers correctly based on accuracy
      const isCorrect = Math.random() < selectedOpponent.accuracy;
      let chosenOpt = q.correctAnswer;
      if (!isCorrect) {
        const incorrectOptions = q.options.filter((o) => o.key !== q.correctAnswer);
        chosenOpt = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)].key;
      }
      setOpponentSelectedOption(chosenOpt);
      setOpponentStatus(`Locked in answer (${chosenOpt}) ⚡`);

      if (isCorrect) {
        const oppPoints = 100 + Math.round(Math.max(0, 30 - delaySeconds) * 2.5);
        setOpponentScore((prev) => prev + oppPoints);
        setOpponentCorrectCount((prev) => prev + 1);
      }
    }, delaySeconds * 1000);
  }, [selectedOpponent]);

  // Main 30-Second Countdown Timer
  useEffect(() => {
    if (gameState !== 'in-game' || isAnswerLocked) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired! Auto submit with no answer selected
          handleAnswerSubmit(null, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState, isAnswerLocked, currentQuestionIndex]);

  // User submits answer
  const handleAnswerSubmit = (optionKey: string | null, remainingTime: number) => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    setUserSelectedOption(optionKey);
    setShowRationale(true);

    const timeSpent = (Date.now() - questionStartTimeRef.current) / 1000;
    setUserResponseTimes((prev) => [...prev, Math.min(30, timeSpent)]);

    const isCorrect = optionKey === currentQ.correctAnswer;
    if (isCorrect) {
      const speedBonus = Math.round(remainingTime * 2.5);
      const streakMultiplier = userStreak >= 2 ? 1.5 : userStreak === 1 ? 1.2 : 1.0;
      const earned = Math.round((100 + speedBonus) * streakMultiplier);
      setUserScore((prev) => prev + earned);
      setUserStreak((prev) => prev + 1);
      setUserCorrectCount((prev) => prev + 1);
    } else {
      setUserStreak(0);
    }
  };

  // Next Question or Finish Duel
  const handleNextQuestion = () => {
    if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
    if (currentQuestionIndex + 1 < QUESTION_BANK.length) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      resetQuestionState(nextIdx);
    } else {
      setGameState('summary');
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Duel Meter Tug-of-War calculation
  const totalScore = userScore + opponentScore || 1;
  const userPercent = Math.max(10, Math.min(90, Math.round((userScore / totalScore) * 100)));

  // Average time calculation
  const avgUserTime = userResponseTimes.length
    ? (userResponseTimes.reduce((a, b) => a + b, 0) / userResponseTimes.length).toFixed(1)
    : '0.0';

  const isUserVictory = userScore > opponentScore;
  const isTie = userScore === opponentScore && userScore > 0;

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      
      {/* LOBBY VIEW */}
      {gameState === 'lobby' && (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700/80 text-center max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-rose-500/25">
            ⚔️
          </div>
          
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Peer Board Exam Quiz Duel
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl mx-auto">
            Test your clinical judgment in a 5-question rapid-fire head-to-head USMLE board duel. 30 seconds per question with live score tug-of-war and +50 XP for victory.
          </p>

          {/* Opponent Selection Cards */}
          <div className="mt-8 text-left">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center">
              Select Your Duel Opponent
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {OPPONENTS.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpponent(opp)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedOpponent.id === opp.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{opp.avatar}</span>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{opp.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{opp.title}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Board Accuracy:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {Math.round(opp.accuracy * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Speed:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {opp.minResponseTime}-{opp.maxResponseTime}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duel Rules Pill */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 text-left grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Timer className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">30s Rapid Timer</span>
                <span className="text-slate-500 dark:text-slate-400">Fast answers score speed multipliers up to +175 pts.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Brain className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Board Rationales</span>
                <span className="text-slate-500 dark:text-slate-400">Instant teaching pearls and distractor analyses after each question.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Award className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">+50 XP Victory Bonus</span>
                <span className="text-slate-500 dark:text-slate-400">Earn study cohort XP and boost clinical rank.</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="mt-8">
            <button
              onClick={handleStartDuel}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 text-white font-extrabold text-lg shadow-xl shadow-indigo-500/25 hover:opacity-95 transform active:scale-95 transition flex items-center gap-3 mx-auto"
            >
              <Swords className="h-6 w-6" /> Start 5-Question Duel
            </button>
          </div>
        </div>
      )}

      {/* IN-GAME ACTIVE DUEL VIEW */}
      {gameState === 'in-game' && (
        <div className="space-y-6">
          
          {/* Top Live Score HUD & Duel Meter */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              
              {/* User Player HUD */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-base shadow-md">
                  {userName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <span>YOU</span>
                    {userStreak > 1 && (
                      <span className="bg-amber-500/30 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                        🔥 {userStreak}x Streak
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black tracking-tight text-white">
                    {userScore} <span className="text-xs text-slate-400 font-normal">pts</span>
                  </div>
                </div>
              </div>

              {/* Center Match Round & Timer */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Question {currentQuestionIndex + 1} of {QUESTION_BANK.length}
                </div>
                <div
                  className={`px-4 py-1.5 rounded-full font-mono font-black text-lg flex items-center gap-1.5 transition-all ${
                    timeLeft <= 5
                      ? 'bg-rose-600 text-white animate-pulse'
                      : timeLeft <= 10
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-emerald-400 border border-slate-700'
                  }`}
                >
                  <Timer className="h-4 w-4" /> {timeLeft}s
                </div>
              </div>

              {/* Opponent HUD */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs text-rose-300 font-semibold uppercase tracking-wider">
                    {selectedOpponent.name}
                  </div>
                  <div className="text-2xl font-black tracking-tight text-white">
                    {opponentScore} <span className="text-xs text-slate-400 font-normal">pts</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-600 flex items-center justify-center font-bold text-2xl shadow-md">
                  {selectedOpponent.avatar}
                </div>
              </div>

            </div>

            {/* Duel Score Tug-Of-War Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                <span className="text-indigo-400">Your Lead: {userPercent}%</span>
                <span className="text-rose-400">{100 - userPercent}% :Challenger</span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 h-full"
                  style={{ width: `${userPercent}%` }}
                />
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500 h-full"
                  style={{ width: `${100 - userPercent}%` }}
                />
              </div>
            </div>

            {/* Opponent Live Status Ticker */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Match Active
              </span>
              <span className="italic text-rose-300">{opponentStatus}</span>
            </div>
          </div>

          {/* Timer Visual Countdown Bar */}
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5
                  ? 'bg-rose-500'
                  : timeLeft <= 12
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>

          {/* Question Vignette Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                {currentQ.specialty}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                High-Yield Clinical Vignette
              </span>
            </div>

            <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQ.vignette}
            </p>

            {/* Options List */}
            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = userSelectedOption === opt.key;
                const isCorrect = currentQ.correctAnswer === opt.key;
                const isOpponentSelected = opponentSelectedOption === opt.key;

                let buttonStyle = 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-800';

                if (isAnswerLocked) {
                  if (isCorrect) {
                    buttonStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold ring-2 ring-rose-500/20';
                  } else {
                    buttonStyle = 'border-slate-200 dark:border-slate-700 opacity-60 bg-slate-50 dark:bg-slate-900/30';
                  }
                } else if (isSelected) {
                  buttonStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/30';
                }

                return (
                  <button
                    key={opt.key}
                    disabled={isAnswerLocked}
                    onClick={() => handleAnswerSubmit(opt.key, timeLeft)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start justify-between gap-3 ${buttonStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base leading-snug">
                        {opt.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isOpponentSelected && (
                        <span className="text-xs bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-700">
                          {selectedOpponent.name.split(' ')[0]} Picked
                        </span>
                      )}
                      {isAnswerLocked && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      )}
                      {isAnswerLocked && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instant Teaching Rationale Card (Revealed after answering) */}
          {showRationale && (
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/80 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Instant Board Teaching Rationale
                  </h3>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  {currentQuestionIndex + 1 < QUESTION_BANK.length ? (
                    <>
                      Next Question <ChevronRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View Final Duel Summary <Trophy className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* High Yield Pearl */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-700/50">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-1">
                  <Sparkles className="h-4 w-4" /> High-Yield Board Pearl
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {currentQ.highYieldPearl}
                </p>
              </div>

              {/* Detailed Pathophysiology / Vignette Explanation */}
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Clinical Rationale:</span>
                {currentQ.rationale}
              </div>

              {/* Distractor Breakdown */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                  Why other options are incorrect:
                </span>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {Object.entries(currentQ.distractorExplanations).map(([key, text]) => (
                    <div key={key}>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Option {key}:</span> {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUMMARY / VICTORY VIEW */}
      {gameState === 'summary' && (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700/80 max-w-3xl mx-auto text-center space-y-6">
          
          {/* Trophy / Result Banner */}
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-xl ${
                isUserVictory
                  ? 'bg-gradient-to-tr from-amber-400 to-amber-500 shadow-amber-500/30 text-white'
                  : isTie
                  ? 'bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-500/30 text-white'
                  : 'bg-gradient-to-tr from-slate-600 to-slate-700 shadow-slate-500/30 text-white'
              }`}
            >
              {isUserVictory ? '🏆' : isTie ? '🤝' : '🩺'}
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-4">
              {isUserVictory ? 'VICTORY CONQUERED!' : isTie ? 'HARD-FOUGHT DRAW!' : 'CLINICAL DEBRIEF REQUIRED'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {isUserVictory
                ? `You outmatched ${selectedOpponent.name} in rapid board diagnostics!`
                : `Solid effort against ${selectedOpponent.name}. Review rationales below to sharpen clinical reflexes.`}
            </p>
          </div>

          {/* XP Reward Card */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-amber-500/20 to-purple-500/10 border border-amber-500/40 rounded-2xl p-5 flex items-center justify-center gap-4">
            <Award className="h-10 w-10 text-amber-500" />
            <div className="text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Cohort Study XP Awarded
              </div>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {isUserVictory ? '+50 XP Awarded' : isTie ? '+35 XP Awarded' : '+20 XP Awarded'}
              </div>
            </div>
          </div>

          {/* Head to Head Stat Comparison Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="text-xs text-slate-400">Your Score</div>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {userScore} pts
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="text-xs text-slate-400">Opponent Score</div>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {opponentScore} pts
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="text-xs text-slate-400">Your Accuracy</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {userCorrectCount} / {QUESTION_BANK.length} ({Math.round((userCorrectCount / QUESTION_BANK.length) * 100)}%)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="text-xs text-slate-400">Avg Reaction Time</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {avgUserTime}s
              </div>
            </div>
          </div>

          {/* Question Review List */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Board Questions & Pearl Review
            </h3>
            <div className="space-y-2.5">
              {QUESTION_BANK.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60"
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-indigo-600 dark:text-indigo-400">{q.specialty}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Correct Answer: {q.correctAnswer}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{q.vignette}</p>
                  <div className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg">
                    📌 {q.highYieldPearl}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleStartDuel}
              className="flex-1 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-5 w-5" /> Challenge Again / Rematch
            </button>
            <button
              onClick={() => setGameState('lobby')}
              className="flex-1 py-3.5 px-6 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-base transition"
            >
              Switch Challenger
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
