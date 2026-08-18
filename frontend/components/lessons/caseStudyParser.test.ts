import { parseCaseStudy } from "./caseStudyParser";

describe("parseCaseStudy", () => {
  it("keeps an unstructured case read-only", () => {
    const scenario = parseCaseStudy(`
### 17. Case-Based Learning
A patient with a history of stroke has hyperreflexia and a positive Babinski sign.
`);

    expect(scenario.clinicalPresentation).toContain("history of stroke");
    expect(scenario.questions).toEqual([]);
  });

  it("requires an explicitly marked correct option", () => {
    const scenario = parseCaseStudy(`
### 17. Case-Based Learning
**Question:** Which finding is most consistent with an upper motor neuron lesion?
- Hyperreflexia (Correct: loss of descending inhibition)
- Fasciculations
`);

    expect(scenario.questions).toHaveLength(1);
    expect(scenario.questions[0].options.filter((option) => option.isCorrect)).toHaveLength(1);
    expect(scenario.questions[0].options[0].text).toBe("Hyperreflexia");
  });

  it("rejects questions without an explicitly correct option", () => {
    const scenario = parseCaseStudy(`
### 17. Case-Based Learning
**Question:** Choose an option.
- First option
- Second option
`);

    expect(scenario.questions).toEqual([]);
  });
});
