import re
import os

def read_sad():
    with open('docs/SAD.md', 'r', encoding='utf-8', errors='ignore') as f:
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
    text = read_sad()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total parsed chapters in SAD.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            chapter_map[num] = c

    # 1. Enhance Chapter 6 (Logical Architecture & 3D WebGL)
    if 6 in chapter_map:
        chap6_addition = r"""
---

# 6.10 3D WebGL Multi-Organ Graphics Engine & Dissection Pipeline

### ARCH-3D-001: Three.js WebGL2 Rendering Architecture
The 3D anatomical visualization layer is orchestrated via Three.js with hardware-accelerated WebGL2 rendering (`ThreeCanvas.tsx`), providing 6-DOF camera controls, perspective projection, and multi-light illumination models.

### ARCH-3D-002: Multi-Plane Cross-Sectional Dissection Shaders
The platform executes real-time anatomical slicing using custom local sagittal, coronal, and transverse clipping planes with stencil buffer capping (`DissectionShader.ts`), exposing internal cardiac chambers, alveolar sacs, and nephron tubules without geometry artifacts.

### ARCH-3D-003: Multi-Organ Preset Datasets & Landmark Beacons
Predefined clinical landmark coordinates, camera vectors, and histological correlations are encapsulated in `OrganPresets.ts` across 6 core systems: Cardiovascular, Respiratory, Renal, Neurophysiology, Gastrointestinal, and Endocrine.

### ARCH-3D-004: GPU Resource Lifecycle Management
To eliminate WebGL VRAM memory leaks during continuous student navigation, all 3D canvas components bind to `useThreeMemoryCleanup.ts`, explicitly executing `renderer.dispose()`, `geometry.dispose()`, and `material.dispose()` upon component unmount.
"""
        if "# 6.10 3D WebGL Multi-Organ" not in chapter_map[6]:
            chapter_map[6] = insert_before_end(chapter_map[6], 6, chap6_addition)

    # 2. Enhance Chapter 11 (Modular Monolith Architecture)
    if 11 in chapter_map:
        chap11_addition = r"""
---

# 11.10 Domain-Driven Modular Monolith Architecture Standard (ADR-002)

### ARCH-MONO-001: Modular Monolith Topology Specification
In accordance with **ADR-002**, Mediverse is architected and deployed as a **Domain-Driven Modular Monolith** in Spring Boot 3.4 and Java 21 (`com.curiolearn.*`).

```text
com.curiolearn/
├── auth/           # Identity, JWT bearer authentication, SecurityConfig
├── curriculum/     # Curriculum taxonomy, Lesson content blocks, CMS Review Controller
├── simulation/     # Simulation catalog, calculate API, mathematical parameter models
├── aitutor/        # Socratic AI tutor, SSE streaming controller, RAG service
├── quiz/           # Clinical vignette question banks, exam scoring, submissions
├── progress/       # Student mastery tracking, bookmarks, spaced repetition
├── admin/          # Institutional user governance, system metrics, audit reporting
└── common/         # Global exception handlers, response envelopes, pagination
```

### ARCH-MONO-002: Architectural Benefits & Boundary Invariants
* **Zero Inter-Process Latency:** Sub-millisecond intra-process communication for curriculum retrieval, quiz evaluation, and simulation parameter checks.
* **Strict Package Encapsulation:** Cross-domain communication restricted to public Service interfaces or published Spring Application Events; direct cross-domain JPA entity references are prohibited.
* **Microservices Extraction Readiness:** Each bounded context maintains isolated database tables and independent service interfaces, enabling clean extraction into standalone microservices if institutional multi-region scale warrants.
"""
        if "# 11.10 Domain-Driven Modular Monolith" not in chapter_map[11]:
            chapter_map[11] = insert_before_end(chapter_map[11], 11, chap11_addition)

    # 3. Enhance Chapter 13 (C4 Container & Frontend Architecture)
    if 13 in chapter_map:
        chap13_addition = r"""
---

# 13.10 Next.js 14 App Router & Vanilla CSS Design Token Architecture

### ARCH-FE-001: Next.js 14 App Router Architecture
The web client container is built on Next.js 14 utilizing the App Router (`app/`) and React 18, leveraging React Server Components (RSC) for initial curriculum page loads and Client Components (`"use client"`) for interactive WebGL canvases, real-time math sliders, and Socratic chat drawers.

### ARCH-FE-002: Vanilla CSS & CSS Modules Design System
In accordance with **ADR-023**, all component styling is authored using scoped **CSS Modules (`*.module.css`)** and centralized semantic CSS custom properties (`globals.css`), avoiding utility-class clutter and ensuring bespoke medical UI craftsmanship.

### ARCH-FE-003: High-Performance Solver State Architecture
Global state is restricted to authentication (`AuthContext`) and notifications (`ToastContext`), while high-frequency physiological simulation solvers leverage local component state (`useState`, `useReducer`) and custom mathematical hooks (`cardiacSolver`, `renalSolver`, `acidBaseSolver`) to guarantee continuous 60 FPS slider reactivity.
"""
        if "# 13.10 Next.js 14 App Router" not in chapter_map[13]:
            chapter_map[13] = insert_before_end(chapter_map[13], 13, chap13_addition)

    # 4. Enhance Chapter 14 (Component Architecture & CMS State Machine)
    if 14 in chapter_map:
        chap14_addition = r"""
---

# 14.10 Role-Based Medical Curriculum CMS Review State Machine

### ARCH-CMS-001: 5-Stage Content Governance State Machine
Medical curriculum lessons adhere to a strict state transition lifecycle:
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

### ARCH-CMS-002: Component Interaction & Audit Schema
* **Controller:** `CmsReviewController.java` (`GET /api/v1/cms/lessons`, `POST /submit`, `POST /review`, `GET /history`).
* **Service:** `CmsReviewService.java` managing state transitions, version incrementation, and role authorization.
* **Audit Table:** `content_reviews` (`V24__cms_content_review_workflow.sql`) storing immutable reviewer decisions, timestamps, and required rejection rationale.
"""
        if "# 14.10 Role-Based Medical Curriculum" not in chapter_map[14]:
            chapter_map[14] = insert_before_end(chapter_map[14], 14, chap14_addition)

    # 5. Enhance Chapter 17 (Database Architecture & Flyway Schema)
    if 17 in chapter_map:
        chap17_addition = r"""
---

# 17.10 PostgreSQL Schema Evolution & Flyway Migration Inventory (V1–V26)

### ARCH-DB-001: Relational Schema & Migration Register
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
        if "# 17.10 PostgreSQL Schema Evolution" not in chapter_map[17]:
            chapter_map[17] = insert_before_end(chapter_map[17], 17, chap17_addition)

    # 6. Enhance Chapter 30 (Integration & LTI 1.3)
    if 30 in chapter_map:
        chap30_addition = r"""
---

# 30.10 IMS Global LTI 1.3 Advantage Integration Architecture

### ARCH-LTI-001: LTI 1.3 Core OIDC Launch Architecture
The platform integrates with university LMS platforms (Canvas, Blackboard, Moodle, Brightspace) via IMS Global LTI 1.3 Advantage, utilizing OpenID Connect (OIDC) third-party launch flows with RS256 asymmetric signed JWT tokens.

### ARCH-LTI-002: LTI Services Integration Suite
* **Assignment and Grade Services (AGS v2.0):** Automated bidirectional grade passback from Mediverse clinical exams into university LMS gradebooks.
* **Names and Role Provisioning Services (NRPS v2.0):** Secure course roster and student membership synchronization.
* **Deep Linking (DL v2.0):** Direct embedding of 3D dissection presets and simulation labs into university course modules.
"""
        if "# 30.10 IMS Global LTI 1.3" not in chapter_map[30]:
            chapter_map[30] = insert_before_end(chapter_map[30], 30, chap30_addition)

    # 7. Enhance Chapter 31 (AI Platform & Socratic Tutoring)
    if 31 in chapter_map:
        chap31_addition = r"""
---

# 31.10 Socratic AI Server-Sent Events (SSE) Streaming & KaTeX Rendering Architecture

### ARCH-AI-001: Streamed Socratic Tutoring Architecture
The AI companion utilizes a hybrid architecture featuring Spring AI Server-Sent Events (SSE) streaming controllers (`AITutorApiController.java`, `POST /api/v1/ai-tutor/chat/stream`), delivering token chunks over `text/event-stream;charset=UTF-8` to the client hook `useSocraticChatStream.ts`.

### ARCH-AI-002: KaTeX Mathematical Rendering & Grounding Guardrails
* **KaTeX Rendering:** High-fidelity LaTeX biomedical and physiological equation formatting within `GlobalSocraticAssistant.tsx`.
* **Grounding Guardrails:** System prompts grounded in standard medical reference textbooks (Guyton & Hall, Costanzo) with strict clinical triage safety boundaries.
"""
        if "# 31.10 Socratic AI Server-Sent" not in chapter_map[31]:
            chapter_map[31] = insert_before_end(chapter_map[31], 31, chap31_addition)

    # 8. Enhance Chapter 32 (ADR Master Registry)
    if 32 in chapter_map:
        chap32_addition = r"""
---

# 32.10 Master Architecture Decision Records (ADR) Registry (ADR-001 to ADR-107)

### ARCH-GOV-001: Master ADR Structure Across Parts I–X
In accordance with [`docs/ADR.md`](file:///F:/Mediverse-app/docs/ADR.md), the enterprise architecture is governed by 107 authoritative Architecture Decision Records organized into 10 structural parts:

| ADR Part | Category & Scope | Key Foundation Decisions |
|---|---|---|
| **Part I** | Enterprise Architecture Foundations | `ADR-001` (Vision), `ADR-002` (Modular Monolith) |
| **Part II** | Technology Stack Decisions | `ADR-020` (Next.js 14), `ADR-022` (State), `ADR-023` (Vanilla CSS), `ADR-028` (JWT/RBAC) |
| **Part III** | Cloud Infrastructure & Deployment | `ADR-031`–`040` (Kubernetes, Terraform, Multi-Region) |
| **Part IV** | Data Platform & Storage | `ADR-041`–`050` (PostgreSQL 16, Redis, Flyway) |
| **Part V** | Microservices, Integration & APIs | `ADR-051`–`060` (REST, OpenAPI 3.1, Rate Limiting) |
| **Part VI** | Security, Identity & Compliance | `ADR-061`–`070` (Zero Trust, BCrypt, FERPA, GDPR) |
| **Part VII** | Reliability, SRE & Observability | `ADR-071`–`080` (Prometheus, Grafana, SLOs) |
| **Part VIII**| AI Platform & Intelligence | `ADR-081`–`090` (RAG Pipeline, Guardrails) |
| **Part IX** | Enterprise Governance & Quality | `ADR-091`–`100` (EAB Governance, Capstone Standard) |
| **Part X** | Mediverse Core 3D & Simulation | `ADR-101` (Three.js), `ADR-103` (Math Solvers), `ADR-104` (Socratic AI), `ADR-105` (LTI 1.3), `ADR-107` (CMS Review) |
"""
        if "# 32.10 Master Architecture Decision" not in chapter_map[32]:
            chapter_map[32] = insert_before_end(chapter_map[32], 32, chap32_addition)

    # Reassemble complete SAD.md
    output_parts = [chapter_map[i] for i in sorted(chapter_map.keys())]
    final_sad = "\n".join(output_parts)

    print(f"Final SAD.md length: {len(final_sad)} characters")
    with open('docs/SAD.md', 'w', encoding='utf-8') as f:
        f.write(final_sad)
    print("Successfully updated docs/SAD.md with all remediated architectural specifications!")

if __name__ == '__main__':
    main()
