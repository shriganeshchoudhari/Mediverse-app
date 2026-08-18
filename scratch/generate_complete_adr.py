import re
import os

def clean_section(text):
    # Remove redundant Part headers inside individual section text
    text = re.sub(r'^#\s+Part\s+[IVXLCDM]+[^\n]*\n+', '', text).strip()
    
    # Remove prompt/chat artifacts
    text = re.sub(r'\n#+\s*Next\s*[—–-]\s*ADR-[^\n]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n#+\s*Next\s*\?\s*ADR-[^\n]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n#+\s*Part\s+[IVXLCDM]+\s+(?:Complete|Progress)[^\n]*[\s\S]*?(?=\n#|\Z)', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n#+\s*(?:Final Status|What You Have Built|What Is Still Missing\?|If This Were a Real Fortune|Recommended Next Phase)[^\n]*[\s\S]*?(?=\n#|\Z)', '', text, flags=re.IGNORECASE)
    
    # Clean up broken unicode characters if any
    text = re.sub(r'#\s+(ADR-\d+)\s+-\s+Part\s+\d+\s+Complete[^\n]*', r'# \1', text)
    text = re.sub(r'#\s+(ADR-\d+)\s+-\s+COMPLETE\s*\??[^\n]*', r'# \1', text)
    
    return text.strip()

def build_replacement_adrs():
    replacements = {}

    replacements['ADR-001'] = r"""# ADR-001 — Enterprise Architecture Vision

**Document Version:** 2.0
**ADR ID:** ADR-001
**Status:** Accepted (Updated)
**Date:** 2026-08-15
**Owner:** Enterprise Architecture Board
**Approvers:** Chief Architect, CTO, Medical Education Board

---

# 1. Executive Summary

This Architecture Decision Record establishes the **Enterprise Architecture Vision** for **Mediverse — Medical Education & Simulation Platform**. Mediverse is an advanced, interactive digital medical learning platform providing comprehensive medical education across 19 MBBS preclinical and paraclinical disciplines, 12 postgraduate residency tracks, interactive 3D multi-organ anatomical dissection, real-time mathematical physiology simulation solvers, timed clinical board examinations (USMLE Step 1 / NMC CBME), and an AI-driven Socratic tutor.

# 2. Decision Statement

Adopt a **Cloud-Native, Domain-Driven, Modular Monolith (with Cloud-Native Microservices Migration Readiness), API-First, WebGL-Enabled, and AI-Augmented Architecture**. The platform shall support:
* Interactive 3D anatomical organ dissection with cross-sectional clipping planes and clinical landmark pinning.
* High-performance, zero-latency mathematical physiology simulation labs (cardiac PV loops, acid-base Davenport diagrams, Starling renal filtration, nerve membrane potentials).
* High-yield clinical board vignette examinations with Bloom's taxonomy radar mastery analytics.
* Role-based curriculum Content Management System (CMS) with an auditable peer-review governance workflow.
* Socratic AI tutoring with streamed real-time dialog, LaTeX formula rendering, and clinical case simulations.
* University LMS integration via IMS Global LTI 1.3 Advantage.

# 3. Decision Drivers

* **Interactive Pedagogy:** Medical education requires visual 3D multi-sensory and real-time interactive experiences rather than static textbook reading.
* **Low Latency & High Frame Rates:** Real-time physiological parameter manipulation requires continuous 60 FPS feedback and < 5ms calculation times.
* **Curricular Breadth:** Complete coverage of 19 MBBS disciplines, 12 PG residency tracks, and 60 specialized clinical guides.
* **Security & Academic Integrity:** Secure timed exam execution, role-based content review, and audit logging.
* **Institutional Interoperability:** Frictionless single-sign-on and grade passback with university LMS environments (Canvas, Blackboard, Moodle).

# 4. Options Considered

* **Option 1: Distributed Microservices from Day 1:** High operational overhead, network serialization latency for complex simulation state, and high infrastructure costs for educational traffic.
* **Option 2: Traditional Monolith with Server-Rendered HTML:** Incapable of delivering rich 60 FPS WebGL rendering, continuous slider reactivity, and interactive clinical simulations.
* **Option 3: Modern Hybrid Architecture (Selected):** High-performance Spring Boot backend with domain-driven package modularity, paired with a Next.js 14 frontend, client-side Three.js WebGL canvas, and local mathematical solvers.

# 5. Decision Outcome

**Selected Option 3.** Mediverse adopts a modern, clean modular monolith architecture for the backend (Spring Boot 3.4 on Java 21) with PostgreSQL and Redis, and a Next.js 14 App Router frontend with Vanilla CSS / CSS Modules and Three.js 3D WebGL visualization.

# 6. Pros and Cons

### Pros
* Single, highly coherent codebase with clear domain boundaries (`auth`, `user`, `curriculum`, `quiz`, `simulation`, `progress`, `aitutor`, `admin`).
* Sub-millisecond simulation slider reactivity with zero network latency penalty for real-time math calculations.
* Seamless developer experience and rapid deployment velocity.
* Clear migration path to distributed microservices as institutional tenancy and traffic scale.

### Cons
* Single backend deployment unit requires disciplined internal domain boundary enforcement via ArchUnit tests.

# 7. Implementation Strategy

* Organize backend domain packages strictly by bounded context (`com.curiolearn.*`).
* Enforce automated architecture linting and IEEE 829 test suites across all layers.
* Provide clean OpenAPI 3.1 specifications (`/swagger-ui/index.html`) and executable REST contracts.

# 8. Architectural Consequences & Compliance

* All future architecture decisions must align with this medical education and clinical simulation vision.
* Direct hospital administrative/billing systems are explicitly out of scope for the core learning platform.
"""

    replacements['ADR-002'] = r"""# ADR-002 — Modular Monolith vs Distributed Microservices Architecture

**Document Version:** 1.0
**ADR ID:** ADR-002
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** Core Architecture Team
**Approvers:** Enterprise Architecture Board, CTO

---

# 1. Executive Summary

This ADR establishes the architectural structure of the Mediverse backend platform, evaluating a distributed microservices topology versus a Domain-Driven Modular Monolith.

# 2. Decision Statement

Adopt a **Domain-Driven Modular Monolith** architecture implemented in Spring Boot 3.4 and Java 21, structured into strictly decoupled domain modules (`com.curiolearn.auth`, `com.curiolearn.curriculum`, `com.curiolearn.simulation`, `com.curiolearn.quiz`, `com.curiolearn.progress`, `com.curiolearn.aitutor`, `com.curiolearn.admin`).

# 3. Decision Drivers

* Operational simplicity and single-binary deployment for local development and institutional on-premise deployments.
* Low memory footprint and instant local transaction consistency without distributed 2PC or Saga overhead.
* High intra-process throughput for curriculum retrieval, quiz evaluation, and simulation catalog queries.
* Strict modularity allowing individual domains to be extracted into standalone microservices if scale warrants.

# 4. Options Considered

* **Option 1: 15+ Microservices with Kafka & gRPC:** Significant DevOps complexity, distributed tracing overhead, and complex local developer setup.
* **Option 2: Unstructured Monolith:** High risk of spaghetti code, circular dependencies, and tangled data models.
* **Option 3: Domain-Driven Modular Monolith (Selected):** Strict package-level encapsulation, independent database schemas/tables per domain, and internal service interfaces.

# 5. Decision Outcome

**Selected Option 3.** The backend operates as a single deployable Spring Boot application with strictly enforced architectural rules prohibiting cross-domain entity leaks.

# 6. Pros and Cons

### Pros
* Simple local build and boot in seconds (`./gradlew bootRun`).
* 100% test suite execution speed (< 15 seconds for unit/integration suites).
* Zero distributed transaction complexity or eventual consistency lag for student exams.

### Cons
* Shared JVM heap memory across domains, mitigated by JVM container limits and monitoring.

# 7. Implementation Strategy

* Enforce package separation with ArchUnit rules (`ArchitectureTest.java`).
* Manage database schema evolution through versioned Flyway migrations (`db/migration/V1__...`).
* Cache high-traffic curriculum and quiz queries in Redis.

# 8. Architectural Consequences & Compliance

* Modules must communicate across domain boundaries only via public Service interfaces or published Spring Application Events.
"""

    replacements['ADR-020'] = r"""# ADR-020 — Next.js 14 App Router & React 18 Web Architecture

**Document Version:** 2.0
**ADR ID:** ADR-020
**Status:** Accepted (Updated)
**Date:** 2026-08-15
**Owner:** Frontend Platform Guild
**Approvers:** Principal Frontend Architect, CTO

---

# 1. Executive Summary

This ADR defines the web framework and rendering architecture for the Mediverse student, educator, and administrator portal.

# 2. Decision Statement

Adopt **Next.js 14 with the App Router (`app/`)** and **React 18** as the foundational web application platform. The platform leverages React Server Components (RSC) for initial page loads and Client Components (`"use client"`) for interactive WebGL 3D scenes, real-time math solvers, and Socratic chat drawers.

# 3. Decision Drivers

* High-performance initial page loads and SEO optimization for medical curriculum reference guides.
* Native file-system routing supporting deeply nested curriculum taxonomies (`/subjects/[subjectId]/[chapterId]`).
* Seamless client-side state hydration for interactive WebGL canvases and dynamic simulation sliders.
* TypeScript strict-mode integration with compile-time type safety.

# 4. Options Considered

* **Option 1: Single Page Application (Vite + React Router):** Lacks built-in SSR, resulting in slower initial loads for large curriculum guides and weaker SEO.
* **Option 2: Next.js Pages Router (Legacy):** Outdated routing paradigm lacking Server Components and nested layout ergonomics.
* **Option 3: Next.js 14 App Router (Selected):** Full support for React Server Components, nested streaming layouts, Suspense boundaries, and modern Web APIs.

# 5. Decision Outcome

**Selected Option 3.** Next.js 14 App Router is standardized across all frontend routes (`frontend/app/`).

# 6. Pros and Cons

### Pros
* Instant rendering of complex medical guides with server-side generation (SSG) and incremental revalidation.
* Declarative route-based error boundaries and loading states (`loading.tsx`, `error.tsx`).
* Modern ecosystem integration with Three.js, Lucide icons, and KaTeX math engines.

### Cons
* Requires understanding of the Client/Server component boundary.

# 7. Implementation Strategy

* Place static marketing and curriculum scaffolding in Server Components.
* Designate interactive widgets (3D Organ Viewer, Simulation Solvers, Quiz Runner, Socratic Assistant) with `"use client"`.
"""

    replacements['ADR-022'] = r"""# ADR-022 — State Management: React Context, Custom Hooks & Solver Stores

**Document Version:** 2.0
**ADR ID:** ADR-022
**Status:** Accepted (Updated)
**Date:** 2026-08-15
**Owner:** Frontend Platform Guild
**Approvers:** Lead Frontend Engineer, Chief Architect

---

# 1. Executive Summary

This ADR defines the state management strategy for Mediverse, prioritizing lightweight, reactive state models tailored to real-time 60 FPS physiological simulations over monolithic global stores.

# 2. Decision Statement

Adopt **React Context and Custom React Hooks** for global session and UI states (`AuthContext`, `ToastContext`), combined with **local component state (`useState`, `useReducer`) and custom mathematical simulation hooks** (`useCurriculumCatalog`, `useQuizRunner`) for simulation solvers. Avoid monolithic global state containers (such as heavy Redux stores) that introduce unnecessary boilerplate and frame-render overhead.

# 3. Decision Drivers

* Ultra-low latency state updates during continuous slider interactions (e.g. changing heart rate from 60 to 180 bpm).
* High modularity: each physiological solver operates as an independent mathematical sandbox.
* Minimal bundle footprint and fast initial compilation.

# 4. Options Considered

* **Option 1: Redux Toolkit (RTK) Global Store:** Heavy boilerplate with action creators, dispatchers, and unnecessary serialization overhead for high-frequency 60 FPS slider events.
* **Option 2: React Context + Custom Hooks + Local Reducers (Selected):** Idiomatic, zero-dependency, granular state scoping with zero rerender propagation across unrelated components.

# 5. Decision Outcome

**Selected Option 2.** Scoped React Context for authentication and notifications; localized mathematical simulation hooks for interactive physiological solvers.

# 6. Pros and Cons

### Pros
* Zero extraneous bundle weight.
* Unmatched 60 FPS slider rendering performance without Redux action dispatch bottlenecks.
* Clean separation of concerns between simulation state and session state.

### Cons
* Deeply nested prop passing avoided by co-locating state in domain widgets.
"""

    replacements['ADR-023'] = r"""# ADR-023 — Styling Architecture: Vanilla CSS, CSS Modules & Design Tokens

**Document Version:** 2.0
**ADR ID:** ADR-023
**Status:** Accepted (Updated)
**Date:** 2026-08-15
**Owner:** Design System & UI Guild
**Approvers:** Principal Designer, Frontend Architect

---

# 1. Executive Summary

This ADR establishes the styling architecture for Mediverse, mandating **Vanilla CSS and CSS Modules** paired with a unified **Design Token System** to ensure maximum aesthetic control, micro-animations, and visual excellence without utility-class bloat.

# 2. Decision Statement

Adopt **Vanilla CSS and CSS Modules (`*.module.css`)** alongside centralized CSS custom properties (`globals.css`) for all custom UI components and simulation viewers. Tailwind CSS is avoided in accordance with Mediverse engineering rules to prioritize custom bespoke medical UI craftsmanship, balanced whitespace, curated HSL color scales, and fluid responsive containers.

# 3. Decision Drivers

* Complete control over CSS layout, micro-interactions, hardware-accelerated animations, and responsive breakpoints.
* Elimination of CSS utility class clumping on complex medical data cards and 3D overlay controls.
* High aesthetic standards: bespoke glassmorphism badges, custom SVG vector emblems, and crisp typographic hierarchy.

# 4. Options Considered

* **Option 1: Tailwind CSS Utility Framework:** Produces cluttered JSX markup, generic preset styles, and limits fine-tuned animation and custom canvas styling.
* **Option 2: CSS-in-JS (Styled Components / Emotion):** Runtime performance overhead and compatibility friction with React Server Components.
* **Option 3: Vanilla CSS & CSS Modules with Design Tokens (Selected):** Zero runtime overhead, full RSC compatibility, scoped class names, and total styling flexibility.

# 5. Decision Outcome

**Selected Option 3.** All custom simulation lab viewers, dissection HUDs, and exam runners utilize scoped CSS Modules with shared semantic CSS variables.

# 6. Pros and Cons

### Pros
* Pristine, readable JSX markup with semantic CSS class names.
* Zero runtime CSS-in-JS evaluation cost.
* Perfect support for responsive design tokens and dark/light medical themes.

### Cons
* Requires disciplined authoring of modular CSS files.
"""

    replacements['ADR-024'] = r"""# ADR-024 — Frontend Build & Asset Compilation Architecture

**Document Version:** 2.0
**ADR ID:** ADR-024
**Status:** Accepted (Updated)
**Date:** 2026-08-15
**Owner:** Frontend Platform Guild
**Approvers:** Chief Architect, DevOps Lead

---

# 1. Executive Summary

This ADR defines the build toolchain and asset compilation architecture for the Mediverse Next.js web application.

# 2. Decision Statement

Adopt the **Next.js Integrated Compiler (powered by SWC and Webpack/Turbopack)** for fast TypeScript compilation, minification, tree-shaking, and bundling of client and server assets.

# 3. Decision Drivers

* High-speed incremental compilation and Hot Module Replacement (HMR) during 3D model and simulation development.
* Native optimization of web fonts, SVG vector graphics, and KaTeX mathematical stylesheets.
* Automated bundle analysis and code splitting per route.

# 4. Implementation Strategy

* Configure Next.js compiler settings in `next.config.mjs`.
* Integrate Jest with `ts-jest` / SWC for sub-second unit test execution across 190+ test suites.
* Package production builds via `npm run build` targeting standalone containerization.
"""

    replacements['ADR-028'] = r"""# ADR-028 — Identity, Authentication & Role-Based Access Control Architecture

**Document Version:** 1.0
**ADR ID:** ADR-028
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** Security & Identity Guild
**Approvers:** Chief Information Security Officer, CTO

---

# 1. Executive Summary

This ADR establishes the identity, authentication, and role-based authorization architecture for Mediverse users across student, faculty, reviewer, and administrator personas.

# 2. Decision Statement

Adopt a **Stateless JWT (JSON Web Token) Bearer Authentication** scheme combined with **Spring Security 6.2** method-level authorization (`@PreAuthorize`) on the backend, with client-side token management via `AuthContext` and secure HTTP headers.

# 3. Role Hierarchy & Access Matrix

* `ROLE_STUDENT` / `ROLE_USER`: Access to 3D dissection, curriculum guides, simulation solvers, practice exams, and Socratic AI assistant.
* `ROLE_FACULTY` / `ROLE_CONTENT_WRITER`: Access to draft curriculum lessons and submit content to the CMS review queue.
* `ROLE_MEDICAL_REVIEWER` / `ROLE_EDITOR`: Access to the CMS review queue to approve or reject lesson content with audit comments.
* `ROLE_ADMIN` / `ROLE_SUPER_ADMIN`: Full administrative console access (`/admin`), user management, exam bank governance, and system metrics.

# 4. Security Enforcement

* Passwords hashed using industry-standard **BCrypt** with salt factor 12.
* JWT tokens signed using HMAC-SHA256 with 24-hour expiration.
* OpenAPI 3.1 Swagger documentation secured via `bearerAuth` security scheme.
"""

    replacements['ADR-101'] = r"""# ADR-101 — 3D WebGL Multi-Organ Graphics Engine: Three.js Architecture

**Document Version:** 1.0
**ADR ID:** ADR-101
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** 3D Visualization & Graphics Guild
**Approvers:** Chief Architect, CTO, Medical Education Board

---

# 1. Executive Summary

Mediverse requires a high-performance, cross-platform 3D WebGL graphics engine to render multi-organ anatomical structures (Cardiovascular, Respiratory, Renal, Neurophysiology, Gastrointestinal, Endocrine) with interactive landmark pinning, cross-sectional clipping planes, and real-time camera framing.

# 2. Decision Statement

Adopt **Three.js** as the core 3D WebGL rendering abstraction, integrated with Next.js through structured canvas components (`frontend/components/3d/ThreeCanvas.tsx`) and predefined clinical landmark datasets (`frontend/.gemini/skills/3d/OrganPresets.ts`).

# 3. Decision Drivers

* **Interactive Dissection:** Students must be able to rotate, pan, zoom, and slice through organs in real-time.
* **Cross-Sectional Clipping:** Dynamic sagittal, coronal, and transverse clipping planes to reveal internal anatomical chambers (e.g. Left Ventricle, SA Node, Glomerulus).
* **Memory Management & Mobile Safety:** Strict VRAM and GPU resource disposal upon component unmount to prevent browser tab crashes on mobile/tablet devices.
* **Declarative Pinning:** High-yield clinical landmark markers with hover tooltips and rich diagnostic descriptions.

# 4. Options Considered

* **Option 1: Raw WebGL2 / WebGPU:** Unnecessary boilerplate for matrix math, lighting, camera controls, and texture loading.
* **Option 2: Babylon.js:** Powerful engine but has a larger bundle footprint and less flexible React component ergonomics for medical overlays.
* **Option 3: Three.js (Selected):** Industry-standard, lightweight, modular WebGL library with rich shader support, OrbitControls, and custom clipping plane capabilities.

# 5. Decision Outcome

**Selected Option 3.** Three.js is standardized across all anatomical dissection and organ visualization modules.

# 6. Implementation Architecture

* Scene graph lifecycle managed via React `useEffect` hooks with explicit `renderer.dispose()`, `geometry.dispose()`, and `material.dispose()`.
* Multi-organ preset catalog with predefined camera vectors and clinical pins (`OrganPresets.ts`).
* Configurable local clipping planes with stencil buffer capping for solid organ cross-sections.

# 7. Architectural Consequences & Compliance

* All 3D viewer components must implement unmount cleanup routines to pass browser memory leak tests.
"""

    replacements['ADR-102'] = r"""# ADR-102 — 3D Asset Packaging & Draco/KTX2 Compression Pipeline

**Document Version:** 1.0
**ADR ID:** ADR-102
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** 3D Asset Engineering & Graphics Guild
**Approvers:** Principal 3D Artist, Frontend Architect

---

# 1. Executive Summary

This ADR establishes the packaging, geometry compression, and texture compression standards for all 3D anatomical models and organ meshes in Mediverse.

# 2. Decision Statement

Standardize on binary **GLTF 2.0 (`.glb`)** as the universal container format, compressed using **Google Draco** for geometry meshes and **KTX2 / Basis Universal** for texture maps.

# 3. Decision Drivers

* Target network payload budget: $< 15\text{ MB}$ per complete multi-organ anatomical system model.
* Fast parsing and GPU transmission over 4G/5G mobile connections in clinical and educational settings.
* Direct GPU decompression for texture maps, freeing main-thread CPU cycles for simulation math.

# 4. Architectural Rules

* All anatomical meshes must pass GLTF validation with manifold geometry.
* Procedural fallback geometry (parametric organ shapes) is rendered when high-res binary meshes are loading.
"""

    replacements['ADR-103'] = r"""# ADR-103 — Real-Time Client-Side Physiological Simulation Solvers

**Document Version:** 1.0
**ADR ID:** ADR-103
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** Physiological Modeling & Simulation Guild
**Approvers:** Head of Physiology, Chief Architect, CTO

---

# 1. Executive Summary

This ADR defines the computational architecture for real-time mathematical physiology simulation solvers in Mediverse, enabling medical students to manipulate physiological parameters with instant continuous visual feedback.

# 2. Decision Statement

Execute all real-time physiological differential equations and algebraic solvers **Client-Side in TypeScript** (with WebAssembly optimization for multi-compartment numerical integration) to achieve zero network latency and smooth 60 FPS slider reactivity.

# 3. Supported Simulation Solvers

1. **Cardiac Hemodynamics (Suga-Sagawa PV-Loops):** Solves time-varying elastance $E(t)$, End-Systolic PV Relationship (ESPVR), End-Diastolic PV Relationship (EDPVR), Stroke Work, and Ejection Fraction.
2. **Acid-Base Balance (Davenport Nomogram):** Henderson-Hasselbalch solver ($pH = 6.1 + \log_{10}\frac{[\text{HCO}_3^-]}{0.03 \cdot \text{PaCO}_2}$), Anion Gap, Winter's respiratory compensation, and non-bicarbonate buffer lines.
3. **Renal Microvascular Filtration (Starling Model):** Solves Glomerular Filtration Rate ($\text{GFR} = K_f \cdot [(P_{gc} - P_{bs}) - (\pi_{gc} - \pi_{bs})]$), Inulin/Creatinine clearance, and fractional sodium excretion ($\text{FeNa}$).
4. **Neurophysiology & Electrophysiology:** Goldman-Hodgkin-Katz membrane potential solver and Nernst equilibrium calculations.
5. **Respiratory Mechanics:** Alveolar Gas Equation ($\text{PAO}_2$), $V/Q$ mismatch, dynamic compliance, and airway resistance.

# 4. Performance & Accuracy Targets

* Calculation latency $< 1.0\text{ ms}$ per parameter evaluation.
* 100% mathematical unit test coverage with clinical boundary validation (e.g. extreme DKA, severe aortic stenosis, acute renal failure).
"""

    replacements['ADR-104'] = r"""# ADR-104 — Socratic AI Companion & Streamed Tutoring Architecture

**Document Version:** 1.0
**ADR ID:** ADR-104
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** AI & Cognitive Engineering Guild
**Approvers:** Chief AI Scientist, Medical Director, CTO

---

# 1. Executive Summary

This ADR defines the architectural pattern for the **Global Socratic AI Assistant**, providing context-aware medical tutoring, guided clinical inquiry, and LaTeX mathematical formula rendering without hallucination.

# 2. Decision Statement

Implement a hybrid AI architecture utilizing **Spring Boot streaming controllers (`/api/v1/ai-tutor/chat/stream`)** with **Server-Sent Events (SSE)** and client-side slide-over UI drawers (`GlobalSocraticAssistant.tsx`), rendering mathematical output via **KaTeX** and sanitizing Markdown content.

# 3. Decision Drivers

* Socratic pedagogy: The AI guides students through physiological deductions rather than providing direct answers.
* Route & Context Awareness: Automatically detects the current curriculum subject, organ system, or simulation lab.
* Mathematical & Chemical Precision: Proper rendering of formulas (e.g. Henderson-Hasselbalch, Starling forces, Nernst equation) using LaTeX.

# 4. Security & Safety Controls

* Strict prompt sandboxing restricting tutor dialog to biomedical science and medical clinical education.
* Client-side input sanitization and XSS prevention via sanitized React Markdown rendering.
"""

    replacements['ADR-105'] = r"""# ADR-105 — Medical University LMS Interoperability: IMS Global LTI 1.3 Advantage

**Document Version:** 1.0
**ADR ID:** ADR-105
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** Enterprise Integration Guild
**Approvers:** Chief Architect, Director of Institutional Partnerships

---

# 1. Executive Summary

This ADR establishes the standard for integrating Mediverse with university Learning Management Systems (Canvas, Blackboard, Moodle, Brightspace, D2L).

# 2. Decision Statement

Adopt **IMS Global LTI 1.3 Advantage** (Learning Tools Interoperability) supporting:
* **LTI 1.3 Core:** OpenID Connect (OIDC) third-party launch with RS256 asymmetric signed JWT tokens.
* **Assignment and Grade Services (AGS v2.0):** Automated bidirectional grade passback from Mediverse clinical exams into university gradebooks.
* **Names and Role Provisioning Services (NRPS v2.0):** Secure synchronization of student rosters and course enrollments.
* **Deep Linking (DL v2.0):** Enabling professors to embed specific 3D dissection modules or simulation labs directly into LMS course modules.
"""

    replacements['ADR-106'] = r"""# ADR-106 — Client-Side Offline Caching & Progressive Web App Architecture

**Document Version:** 1.0
**ADR ID:** ADR-106
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** Web & Mobile Platform Guild
**Approvers:** Principal Frontend Architect, CTO

---

# 1. Executive Summary

This ADR defines the offline-first caching strategy enabling medical students to study curriculum guides, explore 3D organ structures, and complete practice exams in hospital or transit environments with intermittent network connectivity.

# 2. Decision Statement

Implement **Progressive Web App (PWA)** caching using **Service Workers (Workbox)** with **Cache Storage API** for static application bundles and compressed 3D `.glb` organ models, paired with **IndexedDB** for local progress and queued exam submissions.

# 3. Architectural Rules

* Background synchronization queue automatically retries pending exam submissions when online connectivity is restored.
* Cache-first strategy for immutable static 3D anatomical assets; Network-first with cache fallback for curriculum guides.
"""

    replacements['ADR-107'] = r"""# ADR-107 — Role-Based Medical Curriculum CMS & Review Governance State Machine

**Document Version:** 1.0
**ADR ID:** ADR-107
**Status:** Accepted
**Date:** 2026-08-15
**Owner:** Curriculum Governance & Content Operations Board
**Approvers:** Chief Medical Editor, Head of Curriculum, CTO

---

# 1. Executive Summary

This ADR defines the role-based Content Management System (CMS) and peer-review state machine for authoring, reviewing, approving, and publishing medical curriculum lessons and clinical cases.

# 2. Decision Statement

Enforce a strict 5-state lifecycle state machine:
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
* **Database Audit Log:** All decisions recorded in `content_reviews` table with reviewer ID, timestamp, decision, version reviewed, and comments.
* **Security Rules:** Role-Based Access Control via Spring Security `@PreAuthorize` restricting review actions to `ROLE_MEDICAL_REVIEWER`, `ROLE_FACULTY`, and `ROLE_EDITOR`.
* **Frontend Review Hub:** Dedicated `/cms` review queue and `/cms/[lessonId]` preview with WYSIWYG `ContentBlockRenderer`.
"""

    return replacements

def main():
    with open('docs/ADR.md', 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    pattern = r'(?=(?:^|\n)(?:#\s+Part\s+[IVXLCDM]+[^\n]*\n+)?#\s+ADR-\d+\s+[—–-][^\n]+)'
    raw_sections = [s.strip() for s in re.split(pattern, text) if s.strip()]

    by_id = {}
    for sec in raw_sections:
        m = re.search(r'#\s+(ADR-\d+)\s+[—–-]\s*([^\n]+)', sec)
        if m:
            adr_id = m.group(1)
            title = m.group(2).strip()
            title = re.sub(r'\s*-\s*Part\s+\d+\s+Complete.*$', '', title, flags=re.IGNORECASE)
            title = re.sub(r'\s*COMPLETE\s*\??', '', title, flags=re.IGNORECASE).strip()
            if adr_id not in by_id:
                by_id[adr_id] = []
            by_id[adr_id].append((title, len(sec), sec))

    replacements = build_replacement_adrs()

    # Standard Part mappings
    parts = {
        'Part I — Enterprise Architecture Foundations': list(range(1, 11)),
        'Part II — Technology Stack Decisions': list(range(11, 31)),
        'Part III — Cloud Infrastructure & Deployment Architecture': list(range(31, 41)),
        'Part IV — Data Platform & Storage Architecture': list(range(41, 51)),
        'Part V — Microservices, Integration & API Architecture': list(range(51, 61)),
        'Part VI — Security, Identity & Compliance Architecture': list(range(61, 71)),
        'Part VII — Reliability, SRE & Observability Architecture': list(range(71, 81)),
        'Part VIII — AI Platform, Analytics & Intelligence Architecture': list(range(81, 91)),
        'Part IX — Enterprise Governance, Quality & Developer Platform': list(range(91, 101)),
        'Part X — Mediverse Core 3D Physiology, Simulation & Content Architecture': list(range(101, 108)),
    }

    output_lines = [
        "# Architecture Decision Records (ADR)",
        "",
        "> Master Single Source of Truth Architecture Decision Records for the Mediverse Medical Education & Simulation Platform.",
        "",
        "---",
        ""
    ]

    for part_title, adr_nums in parts.items():
        output_lines.append(f"# {part_title}")
        output_lines.append("")
        for num in adr_nums:
            adr_key = f"ADR-{num:03d}"
            if adr_key in replacements:
                output_lines.append(clean_section(replacements[adr_key]))
                output_lines.append("")
                output_lines.append("---")
                output_lines.append("")
            elif adr_key in by_id:
                best_sec = sorted(by_id[adr_key], key=lambda x: x[1], reverse=True)[0][2]
                cleaned = clean_section(best_sec)
                output_lines.append(cleaned)
                output_lines.append("")
                output_lines.append("---")
                output_lines.append("")
            else:
                print(f"Warning: {adr_key} not found anywhere!")

    final_content = "\n".join(output_lines)
    print(f"Final generated ADR.md length: {len(final_content)} characters across {len(output_lines)} lines.")

    with open('docs/ADR.md', 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Successfully wrote deduplicated and cleaned docs/ADR.md!")

if __name__ == '__main__':
    main()
