export interface MCQItem {
  question: string;
  options: { key: string; text: string }[];
  answer: string;
  explanation?: string;
}

export function parseQuizQuestions(markdownContent: string): MCQItem[] {
  const parsed: MCQItem[] = [];
  const lines = markdownContent.split("\n");
  let inMCQSection = false;
  let currentQuestion = "";
  let currentOptions: { key: string; text: string }[] = [];
  let currentAnswer = "";
  let currentExplanation = "";

  const saveCurrent = () => {
    if (currentQuestion && currentOptions.length >= 2 && currentAnswer) {
      parsed.push({
        question: currentQuestion,
        options: [...currentOptions],
        answer: currentAnswer,
        explanation: currentExplanation || undefined,
      });
    }

    currentQuestion = "";
    currentOptions = [];
    currentAnswer = "";
    currentExplanation = "";
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (/^###\s*16\.\s/i.test(line)) {
      inMCQSection = true;
      continue;
    }

    if (inMCQSection && /^###\s*\d+\./i.test(line)) {
      saveCurrent();
      break;
    }

    if (!inMCQSection) {
      continue;
    }

    const questionMatch = line.match(/^\d+\.\s*(.*)/);
    if (questionMatch) {
      saveCurrent();
      currentQuestion = questionMatch[1].trim();
      continue;
    }

    const optionMatch = line.match(/^\*\s*([A-D])\)\s*(.*)/i);
    if (optionMatch) {
      currentOptions.push({
        key: optionMatch[1].toUpperCase(),
        text: optionMatch[2].trim(),
      });
      continue;
    }

    // Support all variants of the legacy *Answer*: and preferred **Answer**: formats.
    const answerMatch = line.match(/^(?:[-*]\s+)?\*{1,2}Answer\*{1,2}\*?\s*:\s*([A-D])\s*(.*)/i);
    if (answerMatch) {
      currentAnswer = answerMatch[1].toUpperCase();
      currentExplanation = answerMatch[2]
        ? answerMatch[2].replace(/^\(|\)$/g, "").trim()
        : "";
    }
  }

  saveCurrent();
  return parsed;
}
