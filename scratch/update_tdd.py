import re
import os

def read_tdd():
    with open('docs/TDD.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, chap_num, addition):
    pattern = rf'\n\s*\*\*End of Chapter {chap_num}\*\*'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx] + addition + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n" + addition

def main():
    text = read_tdd()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total parsed chapters in TDD.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            chapter_map[num] = c

    # 1. Enhance Chapter 5 (Technology Stack & Version Matrix)
    if 5 in chapter_map:
        chap5_addition = r"""
---

# 5.10 Mediverse Core Technology Stack & Version Matrix

### TECH-025: Production Technology Stack Standard
The platform standardizes on the following production-verified technology stack:

| Layer / Subsystem | Primary Technology | Version | Purpose & Rationale |
|---|---|---|---|
| **Web Framework** | Next.js (App Router) | `14.2.x` | React Server Components (RSC), nested layouts, and static page optimization |
| **UI Library** | React | `18.3.x` | Component lifecycle, custom hooks, and concurrent rendering |
| **3D Graphics Engine** | Three.js | `0.160.x` | WebGL2 hardware-accelerated anatomical organ rendering and clipping |
| **Styling Engine** | Vanilla CSS & CSS Modules | Custom | Scoped modular CSS (`*.module.css`) and centralized design tokens (`globals.css`) |
| **Math & Typography** | KaTeX / Remark / Rehype | `0.16.x` | High-fidelity LaTeX biomedical and physiological equation rendering |
| **Backend Framework** | Spring Boot | `3.4.1` | Production-grade REST controllers, dependency injection, and transaction management |
| **Runtime Language** | Java (LTS) | `21` | Virtual threads (Project Loom), pattern matching, and high-throughput concurrency |
| **Security Framework** | Spring Security | `6.2.x` | Stateless JWT authentication and method-level authorization (`@PreAuthorize`) |
| **Build Toolchain** | Gradle (Groovy DSL) | `8.5` | Fast incremental compilation, multi-project orchestration, and automated test execution |
| **Relational Database** | PostgreSQL | `16.x` | ACID compliance, JSONB content blocks, and versioned Flyway migrations (V1–V26) |
| **In-Memory Cache** | Redis | `7.x` | Session caching, high-frequency curriculum caching, and rate limiting |
"""
        if "# 5.10 Mediverse Core Technology" not in chapter_map[5]:
            chapter_map[5] = insert_before_end(chapter_map[5], 5, chap5_addition)

    # 2. Enhance Chapter 8 (Package Structure)
    if 8 in chapter_map:
        chap8_addition = r"""
---

# 8.10 Frontend & Backend Bounded Context Package Architecture

### PKG-025: Backend Modular Monolith Domain Architecture
The backend application (`com.curiolearn.*`) enforces strict Domain-Driven package modularity:

```text
com.curiolearn/
├── auth/           # Identity, JWT token generation, security filters, User entity
├── curriculum/     # Subject, Module, Chapter, Lesson, ContentBlock, CMS Review Controller
├── simulation/     # Simulation catalog, calculate API, mathematical parameter models
├── aitutor/        # Socratic AI tutor, SSE streaming controller, RAG context service
├── quiz/           # Question banks, clinical vignettes, exam scoring, submissions
├── progress/       # Student metrics, bookmarks, spaced repetition revision schedules
├── admin/          # Institutional user management, system telemetry, audit reporting
└── common/         # Global exception handling, response envelopes, pagination utils
```

### PKG-026: Frontend Next.js 14 Application Structure
```text
frontend/
├── app/            # Next.js 14 App Router routes (/auth, /curriculum, /simulators, /exam, /cms)
├── components/     # UI components (3d/ThreeCanvas, ai/GlobalSocraticAssistant, exam/QuizRunner)
├── lib/            # Business logic (simulations/*Solvers, competencies/clinicalExamQuestions)
├── hooks/          # Custom state hooks (useSocraticChatStream, useThreeMemoryCleanup)
├── config/         # AuthContext, API client configuration
└── public/         # Static assets (brand vector badges, 3D glb models, manifest.json)
```
"""
        if "# 8.10 Frontend & Backend Bounded" not in chapter_map[8]:
            chapter_map[8] = insert_before_end(chapter_map[8], 8, chap8_addition)

    # 3. Enhance Chapter 13 (Dependency Management - Gradle)
    if 13 in chapter_map:
        chap13_addition = r"""
---

# 13.10 Gradle Multi-Project Build & Toolchain Architecture

### MAVEN-025: Standard Gradle Toolchain Specification
The backend build toolchain is standardized on **Gradle 8.5 (Groovy DSL)** via `build.gradle` and `settings.gradle`:

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.4.1'
    id 'io.spring.dependency-management' version '1.1.7'
}

group = 'com.curiolearn'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'io.jsonwebtoken:jjwt-api:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.6'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.3'
    implementation 'org.flywaydb:flyway-core'
    implementation 'org.flywaydb:flyway-database-postgresql'
    runtimeOnly 'org.postgresql:postgresql'
    runtimeOnly 'com.h2database:h2'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}
```
"""
        if "# 13.10 Gradle Multi-Project" not in chapter_map[13]:
            chapter_map[13] = insert_before_end(chapter_map[13], 13, chap13_addition)

    # 4. Enhance Chapter 35 (Lesson Module & CMS Review Workflow)
    if 35 in chapter_map:
        chap35_addition = r"""
---

# 35.10 Role-Based Medical Curriculum CMS Review Engine

### LESSON-025: 5-Stage Content Governance State Machine
Curriculum lessons undergo a strict review lifecycle:
```
[ DRAFT ] ──(submitForReview)──► [ IN_REVIEW ]
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
         [ APPROVED ]                                    [ REJECTED ]
              │                                               │
              ▼                                               ▼
        [ PUBLISHED ]                                     [ DRAFT ]
```

### LESSON-026: Content Review Controller & Audit Schema
* **Controller:** `CmsReviewController.java` (`GET /api/v1/cms/lessons`, `POST /submit`, `POST /review`, `GET /history`).
* **Service:** `CmsReviewService.java` managing state transitions, version incrementation, and role authorization.
* **Audit Table:** `content_reviews` (`V24__cms_content_review_workflow.sql`) storing immutable reviewer decisions, timestamps, and required rejection rationale.
"""
        if "# 35.10 Role-Based Medical Curriculum" not in chapter_map[35]:
            chapter_map[35] = insert_before_end(chapter_map[35], 35, chap35_addition)

    # 5. Enhance Chapter 36 (Assessment Module & Clinical Exam Runner)
    if 36 in chapter_map:
        chap36_addition = r"""
---

# 36.10 Timed Clinical Vignette Exam Engine & NMC CBME Radar Analytics

### ASSESS-025: Clinical Examination Runner Architecture
* **Component:** `QuizRunner.tsx` mounted at `/exam`.
* **State Machine:** Countdown timer with auto-submit, distractor strikeout formatting, question flagging/bookmarking, and drawer navigation.
* **Question Bank:** `clinicalExamQuestions.ts` containing high-yield USMLE Step 1 / NMC CBME clinical vignettes.

### ASSESS-026: Bloom's Taxonomy & NMC Competency Radar Analytics
* **Component:** `ExamSummaryView.tsx` and `nmcMapping.ts`.
* **Mastery Breakdown:** Multi-axis Radar Chart breaking down student mastery across NMC competencies (`PY1.1` to `PY11.14`), score percentiles, and detailed rationale reviews.
"""
        if "# 36.10 Timed Clinical Vignette" not in chapter_map[36]:
            chapter_map[36] = insert_before_end(chapter_map[36], 36, chap36_addition)

    # 6. Enhance Chapter 50 (AI Tutor Design & SSE Streaming)
    if 50 in chapter_map:
        chap50_addition = r"""
---

# 50.10 Socratic AI Server-Sent Events (SSE) Streaming Engine & KaTeX Rendering

### TUTOR-025: Server-Sent Events (SSE) Streaming Architecture
* **Controller:** `AITutorApiController.java` exposing `POST /api/v1/ai-tutor/chat/stream` with `MediaType.TEXT_EVENT_STREAM_VALUE`.
* **Client Hook:** `useSocraticChatStream.ts` consuming sequential token chunks and updating the conversation state.
* **UI Drawer:** `GlobalSocraticAssistant.tsx` providing a global floating companion that auto-detects current route context and renders LaTeX math formulas via KaTeX.
"""
        if "# 50.10 Socratic AI Server-Sent" not in chapter_map[50]:
            chapter_map[50] = insert_before_end(chapter_map[50], 50, chap50_addition)

    # 7. Enhance Chapter 55 (Database Implementation & Flyway Schema)
    if 55 in chapter_map:
        chap55_addition = r"""
---

# 55.10 Master Database Schema & Flyway Versioned Migration Register (V1–V26)

### SCHEMA-025: Production Database Migration Inventory
The database schema evolution is managed via versioned Flyway SQL migrations:

| Migration File | Primary Tables Created / Modified | Functional Domain |
|---|---|---|
| `V1__init_schema.sql` | `users`, `roles`, `user_roles`, `categories` | IAM & Foundations |
| `V2__curriculum_structure.sql` | `subjects`, `modules`, `chapters`, `topics`, `lessons` | Curriculum Hierarchy |
| `V3__content_blocks.sql` | `content_blocks` (Markdown, LaTeX, Media, 3D Models) | Lesson Content |
| `V10__quizzes_and_questions.sql` | `quizzes`, `quiz_questions`, `quiz_submissions` | Assessment Engine |
| `V24__cms_content_review_workflow.sql` | `content_reviews` | CMS Review Audit Log |
| `V26__ai_tutor_rag_and_lti13.sql` | `ai_tutor_sessions`, `lti_deployments`, `lti_launches` | AI RAG & LTI 1.3 LMS |
"""
        if "# 55.10 Master Database Schema" not in chapter_map[55]:
            chapter_map[55] = insert_before_end(chapter_map[55], 55, chap55_addition)

    # 8. Enhance Chapter 58 (REST API Design & Simulation Solvers)
    if 58 in chapter_map:
        chap58_addition = r"""
---

# 58.10 Client-Side & Server-Side Mathematical Simulation Solvers

### API-025: Mathematical Physiology Differential Equation Solvers
* **Cardiac Hemodynamics Solver (`cardiacSolver.ts`):** Suga-Sagawa time-varying elastance E(t), ESPVR, EDPVR, Stroke Volume, Cardiac Output, and Ejection Fraction.
* **Acid-Base Davenport Solver (`acidBaseSolver.ts`):** Henderson-Hasselbalch solver ($pH = 6.1 + \log_{10}\frac{[HCO_3^-]}{0.03 \cdot PaCO_2}$), Anion Gap, Winter's formula, and Davenport buffer lines.
* **Renal Microvascular Solver (`renalSolver.ts`):** Starling Glomerular Filtration Rate ($GFR = K_f \cdot [(P_{gc} - P_{bs}) - (\pi_{gc} - \pi_{bs})]$), Inulin/Creatinine clearance, and fractional sodium excretion (FeNa).
* **Electrophysiology Solver (`membraneSolver.ts`):** Goldman-Hodgkin-Katz membrane voltage equation.
* **Backend Calculation API:** `SimulationApiController.java` (`POST /api/v1/simulations/calculate`).
"""
        if "# 58.10 Client-Side & Server-Side" not in chapter_map[58]:
            chapter_map[58] = insert_before_end(chapter_map[58], 58, chap58_addition)

    # Reassemble complete TDD.md
    output_parts = [chapter_map[i] for i in sorted(chapter_map.keys())]
    final_tdd = "\n".join(output_parts)

    print(f"Final TDD.md length: {len(final_tdd)} characters")
    with open('docs/TDD.md', 'w', encoding='utf-8') as f:
        f.write(final_tdd)
    print("Successfully updated docs/TDD.md with all remediated technical designs!")

if __name__ == '__main__':
    main()
