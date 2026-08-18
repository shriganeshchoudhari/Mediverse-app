export interface CaseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface CaseQuestion {
  id: string;
  text: string;
  options: CaseOption[];
}

export interface CaseScenario {
  clinicalPresentation: string;
  questions: CaseQuestion[];
}

export function parseCaseStudy(content: string): CaseScenario {
  const cleanContent = content.replace(/^###\s*17\.\s*Case-Based Learning/i, "").trim();
  const parts = cleanContent.split(/(?=\*\*Question\b)/i);
  const presentation = parts[0] || cleanContent;
  const questions: CaseQuestion[] = [];

  parts.slice(1).forEach((part, index) => {
    const lines = part.split("\n").filter((line) => line.trim().length > 0);
    const text = lines[0]
      .replace(/^\*\*Question\s*:?[\s]*/i, "")
      .replace(/\*\*$/, "")
      .trim();
    const options: CaseOption[] = [];

    lines.slice(1).forEach((line, optionIndex) => {
      const optionMatch = line.trim().match(/^-\s*(.*)/);
      if (!optionMatch) {
        return;
      }

      const rawOption = optionMatch[1].trim();
      const isCorrect = /\(\s*correct\b[^)]*\)/i.test(rawOption);
      const optionText = rawOption.replace(/\(\s*correct\b[^)]*\)/gi, "").trim();

      options.push({
        id: `q${index}-opt${optionIndex}`,
        text: optionText,
        isCorrect,
        feedback: isCorrect
          ? "Correct. Review the explanation in the case before continuing."
          : "Review the case explanation and the relevant physiological mechanism.",
      });
    });

    if (text && options.length >= 2 && options.filter((option) => option.isCorrect).length === 1) {
      questions.push({ id: `q${index}`, text, options });
    }
  });

  return { clinicalPresentation: presentation, questions };
}
