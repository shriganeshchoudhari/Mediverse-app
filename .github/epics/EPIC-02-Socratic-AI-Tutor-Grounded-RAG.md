# [EPIC-02] Socratic AI Tutor & Grounded Clinical RAG Engine

- **Domain:** `domain: socratic-ai`
- **Lead Architect:** AI Systems Lead & SDET Lead
- **Status:** APPROVED / ACTIVE

## 1. Executive Summary
Implement the intelligent Socratic pedagogical assistant that guides medical students through diagnostic inquiry without prematurely revealing answers. Backed by PostgreSQL pgvector embeddings and Spring Boot RAG services.

## 2. Child User Stories
- [x] **STORY-010 (SOC-001):** Floating Socratic Assistant Drawer & Starter Inquiry Prompts (`02_global_search_socratic.spec.ts`)
- [x] **STORY-011 (SOC-002):** Real-time Streaming Socratic Dialogue with Citation References (`02_global_search_socratic.spec.ts`)
- [x] **STORY-012 (AI-001):** Grounded MCQ Quiz Generator from Clinical Case Notes (`backend/postman`)
- [ ] **STORY-013 (AI-002):** SOAP Note Automated Clinical Charting Evaluation Engine

## 3. QA & Quality Gate Verification
- Unit Tests: `AiContentGeneratorControllerTest.java`, `RagServiceTest.java`, `AITutorApiControllerTest.java`
- Playwright Spec: `02_global_search_socratic.spec.ts`
