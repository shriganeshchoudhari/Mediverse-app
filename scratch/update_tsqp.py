import re
import os

def read_tsqp():
    with open('docs/TSQP.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=#\s+Testing Strategy|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def main():
    text = read_tsqp()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total raw parsed chapters in TSQP.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            if num not in chapter_map or len(c) > len(chapter_map[num]):
                chapter_map[num] = c

    print(f"Unique chapters found: {len(chapter_map)} (expected 70)")

    # 1. Enhance Chapter 10 (Automated Quality Gate Matrix)
    if 10 in chapter_map:
        chap10_addition = r"""
---

# 10.10 Production Automated Quality Gate Matrix

### TSR-0155: Quality Gate Thresholds
CI/CD pipelines enforce automated quality gates before permitting binary promotion:

| Testing Domain | Target Framework | Mandatory Quality Threshold | Blocking Severity |
|---|---|---|---|
| **Backend Unit & Integration** | JUnit 5 + JaCoCo | **Line Coverage $\ge 80\%$, Branch Coverage $\ge 75\%$** | Build Failure |
| **Frontend Unit & Component** | Jest + React Testing Library | **Statement Coverage $\ge 80\%$** | Build Failure |
| **Security SAST Scanning** | Semgrep SAST | **0 Critical, 0 High** security findings | PR Merge Blocker |
| **Dependency & Container SCA** | Trivy Scanner | **0 Critical CVEs**, signed SBOM attached | Deploy Blocker |
| **End-to-End User Journeys** | Playwright E2E | **100% Pass Rate** across critical exam and 3D flows | Deploy Blocker |
"""
        if "# 10.10 Production Automated" not in chapter_map[10]:
            chapter_map[10] = insert_before_end(chapter_map[10], chap10_addition)

    # 2. Enhance Chapter 53 (3D WebGL Multi-Organ Canvas Testing)
    if 53 in chapter_map:
        chap53_addition = r"""
---

# 53.10 3D WebGL Multi-Organ Canvas & WebGL Context Loss Testing Strategy

### TSR-0845: 3D Graphics Visual Regression Testing
* **Automated Pixel Diffing:** Playwright captures pixel snapshots of rendered 3D heart, lung, and kidney models under standardized camera coordinates; visual diff threshold set to $\le 0.05\%$.
* **TSR-0846: WebGL Context Loss Recovery Test:** Automated headless browser tests trigger `WEBGL_lose_context.loseContext()` and assert that `ThreeCanvas.tsx` restores geometry buffers without crashing upon `.restoreContext()`.
* **TSR-0847: VRAM Leak Detection:** Validates that `useThreeMemoryCleanup.ts` deallocates GPU buffers on component unmount, maintaining client heap under $500\text{ MB}$.
"""
        if "# 53.10 3D WebGL Multi-Organ" not in chapter_map[53]:
            chapter_map[53] = insert_before_end(chapter_map[53], chap53_addition)

    # 3. Enhance Chapter 54 (Physiological Simulation Solvers Precision Testing)
    if 54 in chapter_map:
        chap54_addition = r"""
---

# 54.10 Physiological Simulation Solvers Precision & Boundary Testing Strategy

### TSR-0861: Numerical Solver Mathematical Precision
* **Tolerance Benchmark:** Unit tests for `cardiacSolver.ts`, `acidBaseSolver.ts`, `renalSolver.ts`, and `membraneSolver.ts` validate output values against Guyton & Hall reference standards with a mathematical error tolerance of $< 0.01\%$.
* **TSR-0862: Extreme Boundary Clamping:** Solvers are tested against extreme pathological parameter inputs (e.g. $[K^+] = 1.0\text{ mEq/L}$, cardiac arrest $HR = 0$, severe SVR $= 3000\text{ dyn}\cdot\text{s}/\text{cm}^5$) to ensure graceful clamping without `NaN` or `Infinity` exceptions.
* **TSR-0863: Real-Time Performance:** Automated benchmark suites assert calculation latencies remain $< 1.0\text{ms}$ on standard CPU hardware.
"""
        if "# 54.10 Physiological Simulation" not in chapter_map[54]:
            chapter_map[54] = insert_before_end(chapter_map[54], chap54_addition)

    # 4. Enhance Chapter 55 (Socratic AI Prompt Regression & Citation Testing)
    if 55 in chapter_map:
        chap55_addition = r"""
---

# 55.10 Socratic AI Prompt Evaluation, Hallucination & Citation Testing Strategy

### TSR-0877: Socratic Guidance Scaffolding Validation
* **Promptfoo Benchmark Suite:** Automated LLM evaluation tests verify that the AI tutor provides guided scaffolding questions rather than answering exam vignettes directly.
* **TSR-0878: Medical Citation Grounding:** Evaluates that $\ge 98\%$ of physiological explanations cite standard medical authorities (Guyton & Hall, Costanzo Physiology).
* **TSR-0879: Triage Safety Guardrails:** Automated red-teaming tests assert $100\%$ refusal of live-patient diagnostic and emergency triage inquiries.
"""
        if "# 55.10 Socratic AI Prompt" not in chapter_map[55]:
            chapter_map[55] = insert_before_end(chapter_map[55], chap55_addition)

    # 5. Enhance Chapter 56 (Timed Clinical Exam Runner & State Recovery Testing)
    if 56 in chapter_map:
        chap56_addition = r"""
---

# 56.10 Timed Clinical Exam Runner, Distractor Strikeout & State Recovery Testing

### TSR-0893: Examination Engine E2E Validation
* **Playwright Exam Workflow:** Validates countdown timer accuracy, distractor strikethrough tool toggling, question bookmarking, and slide-over question grid navigation in `QuizRunner.tsx`.
* **TSR-0894: Network Disconnection Recovery:** Simulates mid-exam network loss; asserts that student responses persist in browser storage and synchronize upon reconnection without data loss.
* **TSR-0895: Radar Mastery Generation:** Asserts correct aggregation of NMC CBME competency scores (`PY1.1` to `PY11.14`) and Bloom's taxonomy radar charting in `ExamSummaryView.tsx`.
"""
        if "# 56.10 Timed Clinical Exam" not in chapter_map[56]:
            chapter_map[56] = insert_before_end(chapter_map[56], chap56_addition)

    # 6. Enhance Chapter 57 (IMS Global LTI 1.3 Advantage Conformance Testing)
    if 57 in chapter_map:
        chap57_addition = r"""
---

# 57.10 IMS Global LTI 1.3 Advantage Conformance & Grade Passback Testing

### TSR-0909: LMS Interoperability Conformance Testing
* **LTI 1.3 Security Handshake:** Automated integration tests validate OIDC launch initiation, RS256 JWKS signature verification, and state nonce validation against Canvas and Moodle sandboxes.
* **TSR-0910: Assignment and Grade Services (AGS):** Validates automated grade passback synchronization, score scaling, and retry queue resilience on transient LMS API failures.
"""
        if "# 57.10 IMS Global LTI" not in chapter_map[57]:
            chapter_map[57] = insert_before_end(chapter_map[57], chap57_addition)

    # Reassemble complete TSQP.md
    output_parts = [chapter_map[i].strip() for i in sorted(chapter_map.keys())]
    final_tsqp = "\n\n---\n\n".join(output_parts)

    print(f"Final TSQP.md length: {len(final_tsqp)} characters across {len(output_parts)} chapters.")
    with open('docs/TSQP.md', 'w', encoding='utf-8') as f:
        f.write(final_tsqp)
    print("Successfully updated docs/TSQP.md with all quality engineering specifications!")

if __name__ == '__main__':
    main()
