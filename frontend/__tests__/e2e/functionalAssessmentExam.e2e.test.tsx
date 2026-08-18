import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizRunner, { QuizQuestion } from "@/components/exam/QuizRunner";

const MOCK_EXAM_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-cv-01",
    stem: "A 65-year-old male presents with exertional dyspnea and syncope. Physical examination reveals a harsh crescendo-decrescendo systolic murmur at the right upper sternal border radiating to the carotids. Which hemodynamic alteration is most characteristic?",
    options: [
      "Marked systolic pressure gradient between left ventricle and aorta",
      "Decreased left ventricular afterload",
      "Increased left ventricular compliance",
      "Decreased left ventricular end-diastolic pressure"
    ],
    correctIndex: 0,
    rationale: "Severe aortic stenosis generates a high transvalvular systolic pressure gradient between the left ventricle and aorta during ejection.",
    competencyCode: "PY5.1",
    patientVignette: "65yo M with critical aortic stenosis",
    clinicalPearl: "Pulsus parvus et tardus reflects delayed and weak carotid upstroke."
  },
  {
    id: "q-renal-01",
    stem: "A 45-year-old female presents with severe dehydration following 3 days of viral gastroenteritis. Serum Na is 142 mEq/L, BUN is 48 mg/dL, and Cr is 1.6 mg/dL (BUN/Cr ratio = 30). Urine Na is 12 mEq/L and FeNa is 0.4%. What is the diagnosis?",
    options: [
      "Prerenal Acute Kidney Injury secondary to hypovolemia",
      "Acute Tubular Necrosis",
      "Acute Interstitial Nephritis",
      "Postrenal Obstruction"
    ],
    correctIndex: 0,
    rationale: "BUN/Cr ratio > 20 and FeNa < 1% indicate intact tubular sodium and water reabsorption in response to renal hypoperfusion (Prerenal AKI).",
    competencyCode: "PY7.1",
    patientVignette: "45yo F with prerenal azotemia"
  }
];

describe("E2E Functional: Student Examination & Assessment Engine (FR-ASSESS)", () => {
  test("E2E-EXAM-001: Completes an entire exam journey with question selection, submission, and score verification", () => {
    const onFinishMock = jest.fn();

    render(
      <QuizRunner
        examTitle="Comprehensive Clinical Physiology Board Exam"
        durationSeconds={300}
        questions={MOCK_EXAM_QUESTIONS}
        onFinishExam={onFinishMock}
      />
    );

    // 1. Verify exam header and first question stem
    expect(screen.getByText(/Comprehensive Clinical Physiology Board Exam/i)).toBeInTheDocument();
    expect(screen.getByText(/A 65-year-old male presents with exertional dyspnea/i)).toBeInTheDocument();

    // 2. Select Option A for Question 1
    const optionA = screen.getByText(/Marked systolic pressure gradient/i);
    fireEvent.click(optionA);

    // 3. Flag Question 1 for review
    const flagBtn = screen.getByRole("button", { name: /Flag for Review/i });
    fireEvent.click(flagBtn);

    // 4. Navigate to Question 2
    const nextBtn = screen.getByRole("button", { name: /Next Question/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/A 45-year-old female presents with severe dehydration/i)).toBeInTheDocument();

    // 5. Select Option A for Question 2
    const optionQ2A = screen.getByText(/Prerenal Acute Kidney Injury/i);
    fireEvent.click(optionQ2A);

    // 6. Click Submit Exam button
    const submitBtn = screen.getByRole("button", { name: /Submit Exam/i });
    fireEvent.click(submitBtn);

    // 7. Confirm submission in modal
    const confirmSubmitBtn = screen.getByRole("button", { name: /Confirm & View Results/i });
    fireEvent.click(confirmSubmitBtn);

    // 8. Verify Score & Explanation on submitted exam view
    expect(screen.getByText(/Score: 2 \/ 2/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
    expect(screen.getByText(/BUN\/Cr ratio > 20 and FeNa < 1% indicate intact tubular sodium/i)).toBeInTheDocument();

    // 9. Verify callback payload
    expect(onFinishMock).toHaveBeenCalledTimes(1);
    expect(onFinishMock).toHaveBeenCalledWith(
      2,
      2,
      expect.objectContaining({
        "PY5.1": expect.objectContaining({ correct: 1, total: 1, percentage: 100 }),
        "PY7.1": expect.objectContaining({ correct: 1, total: 1, percentage: 100 })
      }),
      expect.any(Object)
    );
  });

  test("E2E-EXAM-002: Reviews question 1 to inspect clinical rationale and high-yield pearl", () => {
    render(
      <QuizRunner
        examTitle="Formative Self-Assessment"
        durationSeconds={300}
        questions={MOCK_EXAM_QUESTIONS}
      />
    );

    // Select answers and submit
    fireEvent.click(screen.getByText(/Marked systolic pressure gradient/i));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/i }));
    fireEvent.click(screen.getByText(/Prerenal Acute Kidney Injury/i));
    fireEvent.click(screen.getByRole("button", { name: /Submit Exam/i }));
    fireEvent.click(screen.getByRole("button", { name: /Confirm & View Results/i }));

    // Click "Review from Start"
    const reviewBtn = screen.getByRole("button", { name: /Review from Start/i });
    fireEvent.click(reviewBtn);

    // Verify clinical explanation and pearl for Question 1 are visible
    expect(screen.getByText(/Severe aortic stenosis generates a high transvalvular/i)).toBeInTheDocument();
    expect(screen.getByText(/Pulsus parvus et tardus reflects delayed and weak/i)).toBeInTheDocument();
  });
});
