import re
import os

def read_ird():
    with open('docs/IRD.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=#\s+Implementation Roadmap|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def main():
    text = read_ird()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total raw parsed chapters in IRD.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            if num not in chapter_map or len(c) > len(chapter_map[num]):
                chapter_map[num] = c

    print(f"Unique chapters found: {len(chapter_map)} (expected 150)")

    # 1. Enhance Chapter 1 (Master Phased Release Progression M0 to M4)
    if 1 in chapter_map:
        chap1_addition = r"""
---

# 1.10 Mediverse Master Phased Release Roadmap (M0 to M4)

### IRD-0017: Master Release Milestones
The Mediverse engineering program is executed across 5 defined release milestones:

| Phase | Milestone Target | Timeline | Core Engineering Deliverables |
|---|---|---|---|
| **Phase 0** | **M0: Architecture & Foundation** | Weeks 1–4 | Monorepo baseline, Spring Boot 3.4 / Java 21, Next.js 14, PostgreSQL 16, Flyway `V1`–`V8`, CI/CD pipelines |
| **Phase 1** | **M1: 3D Multi-Organ & Cardiovascular Core** | Weeks 5–10 | ThreeCanvas WebGL2, GLSL dissection clipping shaders, Suga-Sagawa PV-loop simulator, MCQ quiz engine |
| **Phase 2** | **M2: Simulation Labs & Socratic AI** | Weeks 11–16 | Acid-Base Davenport lab, Renal Starling GFR lab, Socratic AI floating drawer (`GlobalSocraticAssistant.tsx`), SSE streaming |
| **Phase 3** | **M3: Clinical Exam Runner & CMS Review** | Weeks 17–22 | `QuizRunner.tsx`, clinical vignette bank, Bloom's Radar mastery breakdown (`ExamSummaryView.tsx`), 5-stage CMS review (`V24`) |
| **Phase 4** | **M4: Enterprise LMS Integration & GA** | Weeks 23–28 | IMS Global LTI 1.3 Advantage (OIDC, AGS, NRPS - `V26`), SCIM directory sync, multi-campus university launch |
"""
        if "# 1.10 Mediverse Master Phased" not in chapter_map[1]:
            chapter_map[1] = insert_before_end(chapter_map[1], chap1_addition)

    # 2. Enhance Chapter 12 (Engineering Squad Topologies)
    if 12 in chapter_map:
        chap12_addition = r"""
---

# 12.10 Cross-Functional Engineering Squad Topologies & Resource Allocation

### IRD-0209: Feature Squad Staffing Model
Program execution is distributed across 5 specialized, cross-functional squads:

* **Squad 1: 3D Graphics & Simulation Solvers** (1 Lead 3D WebGL Engineer, 2 Three.js Developers, 1 Physiology Subject Matter Expert).
* **Squad 2: Socratic AI & Knowledge Platform** (1 AI/ML Lead, 2 Backend Spring AI Engineers, 1 Vector Search Specialist).
* **Squad 3: Core Learning & Clinical Assessment** (1 Lead Frontend Engineer, 2 Fullstack Developers, 1 Medical Education Specialist).
* **Squad 4: Curriculum CMS & Medical Review Workflow** (2 Backend Java Engineers, 1 Frontend UX Designer, 1 Clinical Reviewer Lead).
* **Squad 5: LTI 1.3 LMS Integration & Cloud Platform SRE** (2 Platform Engineers, 1 Security Specialist, 1 QA Automation Lead).
"""
        if "# 12.10 Cross-Functional Engineering" not in chapter_map[12]:
            chapter_map[12] = insert_before_end(chapter_map[12], chap12_addition)

    # 3. Enhance Chapter 71 (3D Asset Production & Differential Solver Schedule)
    if 71 in chapter_map:
        chap71_addition = r"""
---

# 71.10 3D Anatomical Asset Production & Differential Solver Validation Milestones

### IRD-1153: Interactive Content Engineering Track
* **3D Multi-Organ Modeling Schedule:** Progressive delivery of Draco-compressed 3D organ models with anatomical landmark presets (`OrganPresets.ts`) across 6 core systems (Cardiovascular, Respiratory, Renal, Neuro, GI, Endocrine).
* **Differential Equation Solvers Validation:** Benchmarking and calibration of numerical solvers (`cardiacSolver.ts`, `acidBaseSolver.ts`, `renalSolver.ts`, `membraneSolver.ts`) against Guyton & Hall clinical physiology data, guaranteeing $< 1.0\text{ms}$ calculation latencies.
"""
        if "# 71.10 3D Anatomical Asset" not in chapter_map[71]:
            chapter_map[71] = insert_before_end(chapter_map[71], chap71_addition)

    # 4. Enhance Chapter 80 (University Campus Pilot & LTI 1.3 Deployment)
    if 80 in chapter_map:
        chap80_addition = r"""
---

# 80.10 University Campus Pilot, LTI 1.3 Integration & Academic Rollout Schedule

### IRD-1297: Campus Deployment & Academic Schedule
* **Campus Beta Pilot:** 6-week onboarding pilot with 200 medical students across 2 partner medical universities verifying LTI 1.3 Single Sign-On and automated grade passback (AGS).
* **Semester Release Cutoff:** Code freeze strictly enforced 4 weeks prior to semester start dates (August 15 for Fall, January 15 for Spring).
* **Operational Hypercare:** 30 days of dedicated SRE and clinical SME hypercare support following each major university cohort onboarding.
"""
        if "# 80.10 University Campus Pilot" not in chapter_map[80]:
            chapter_map[80] = insert_before_end(chapter_map[80], chap80_addition)

    # Reassemble complete IRD.md
    output_parts = [chapter_map[i].strip() for i in sorted(chapter_map.keys())]
    final_ird = "\n\n---\n\n".join(output_parts)

    print(f"Final IRD.md length: {len(final_ird)} characters across {len(output_parts)} chapters.")
    with open('docs/IRD.md', 'w', encoding='utf-8') as f:
        f.write(final_ird)
    print("Successfully updated docs/IRD.md with all implementation roadmap schedules!")

if __name__ == '__main__':
    main()
