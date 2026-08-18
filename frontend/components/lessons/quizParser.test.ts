import { parseQuizQuestions } from "./quizParser";

describe("parseQuizQuestions", () => {
  it("parses the curriculum's legacy answer marker", () => {
    const questions = parseQuizQuestions(`
### 16. MCQs
1. Which ion is essential for muscle contraction?
   * A) Sodium
   * B) Potassium
   * C) Calcium
   * D) Magnesium
   *Answer*: C (Calcium binds to troponin.)

### 17. Case-Based Learning
`);

    expect(questions).toEqual([
      {
        question: "Which ion is essential for muscle contraction?",
        options: [
          { key: "A", text: "Sodium" },
          { key: "B", text: "Potassium" },
          { key: "C", text: "Calcium" },
          { key: "D", text: "Magnesium" },
        ],
        answer: "C",
        explanation: "Calcium binds to troponin.",
      },
    ]);
  });

  it("also accepts the preferred bold answer marker", () => {
    const questions = parseQuizQuestions(`
### 16. MCQs
1. Which hormone lowers glucose?
* A) Glucagon
* B) Insulin
**Answer**: B
### 17. Case-Based Learning
`);

    expect(questions).toHaveLength(1);
    expect(questions[0].answer).toBe("B");
  });

  it("does not manufacture questions when the markdown is incomplete", () => {
    expect(parseQuizQuestions("### 16. MCQs\n1. Incomplete question")).toEqual([]);
  });
});
