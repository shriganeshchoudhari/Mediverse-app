import re
import os

def read_ddd():
    with open('docs/DDD.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=\*\*End of Chapter|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def main():
    text = read_ddd()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total raw parsed chapters in DDD.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            if num not in chapter_map or len(c) > len(chapter_map[num]):
                chapter_map[num] = c

    print(f"Unique chapters found: {len(chapter_map)} (expected 60)")

    # 1. Enhance Chapter 5 (Flyway Migration Inventory)
    if 5 in chapter_map:
        chap5_addition = r"""
---

# 5.10 Production Flyway Database Migration Inventory (V1 to V26)

The Mediverse PostgreSQL 16 schema evolves through 26 automated Flyway migrations:

| Version | Migration Script Name | Target Domain & Relational DDL Scope |
|---|---|---|
| **V1** | `V1__baseline_auth_schema.sql` | Core identity, `auth.users`, `auth.roles`, `auth.tenants` |
| **V2** | `V2__curriculum_schema.sql` | `curriculum.organ_systems`, `curriculum.topics`, `curriculum.lessons` |
| **V3** | `V3__anatomy_models.sql` | 3D mesh references, camera positions, anatomical landmark pins |
| **V4** | `V4__simulation_catalog.sql` | Active physiological simulation modules & parameter boundaries |
| **V5** | `V5__quiz_engine.sql` | `quiz.questions`, multiple-choice distractors, answer keys |
| **V6** | `V6__progress_tracking.sql` | `progress.user_lesson_progress`, topic completion percentages |
| **V7** | `V7__ai_tutor_core.sql` | Socratic conversation sessions, token usage logs |
| **V8** | `V8__nmc_competencies.sql` | National Medical Commission CBME competency codes (`PY1.1`–`PY11.14`) |
| **V9** | `V9__acid_base_lab.sql` | Davenport nomogram presets, ABG diagnostic classifications |
| **V10** | `V10__cardiac_pv_lab.sql` | Suga-Sagawa PV-loop simulation runs & Wiggers curve parameters |
| **V11** | `V11__renal_filtration_lab.sql` | Starling microvascular filtration constants & GFR presets |
| **V12** | `V12__nerve_muscle_lab.sql` | Goldman-Hodgkin-Katz membrane potentials & action potential curves |
| **V13** | `V13__respiratory_lab.sql` | Alveolar gas exchange ($V/Q$) compliance presets |
| **V14** | `V14__clinical_cases.sql` | High-yield USMLE / MBBS clinical vignette patient cases |
| **V15** | `V15__exam_submissions.sql` | Timed examination attempts, strikeout flags, final scores |
| **V16** | `V16__radar_mastery.sql` | Multi-axis Bloom's taxonomy competency mastery analytics |
| **V17** | `V17__tenancy_scim.sql` | University SCIM 2.0 directory sync & SAML/OIDC metadata |
| **V18** | `V18__audit_logs.sql` | Immutable administrative & security event audit trails |
| **V19** | `V19__media_assets.sql` | 3D GLB meshes, audio clips, interactive SVG diagrams |
| **V20** | `V20__user_preferences.sql` | UI color themes, dark mode, high-contrast accessibility settings |
| **V21** | `V21__spaced_repetition.sql` | SuperMemo SM-2 flashcard scheduling & review intervals |
| **V22** | `V22__offline_sync.sql` | PWA IndexedDB offline submission sync queue |
| **V23** | `V23__pgvector_knowledge_base.sql` | `pgvector` 1536-D HNSW cosine index for medical physiology RAG |
| **V24** | `V24__cms_content_review_workflow.sql` | 5-Stage review state machine & `curriculum.content_reviews` |
| **V25** | `V25__ai_tutor_session_memory.sql` | Socratic multi-turn conversation context & textbook citations |
| **V26** | `V26__lti13_advantage.sql` | IMS Global LTI 1.3 Advantage OIDC launch & AGS grade passback |
"""
        if "# 5.10 Production Flyway Database" not in chapter_map[5]:
            chapter_map[5] = insert_before_end(chapter_map[5], chap5_addition)

    # 2. Enhance Chapter 26 (Auth Tables DDL)
    if 26 in chapter_map:
        chap26_addition = r"""
---

# 26.10 Production DDL: Authentication & Multi-Tenancy Tables

```sql
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) NOT NULL UNIQUE,
  custom_domain VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.tenants(id) ON DELETE RESTRICT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'ROLE_STUDENT',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_tenant_email ON auth.users(tenant_id, email);
```
"""
        if "# 26.10 Production DDL" not in chapter_map[26]:
            chapter_map[26] = insert_before_end(chapter_map[26], chap26_addition)

    # 3. Enhance Chapter 28 (Curriculum & 5-Stage CMS Review Workflow DDL)
    if 28 in chapter_map:
        chap28_addition = r"""
---

# 28.10 Production DDL: Curriculum & CMS Content Review Tables

```sql
CREATE SCHEMA IF NOT EXISTS curriculum;

CREATE TABLE curriculum.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content_markdown TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, IN_REVIEW, APPROVED, PUBLISHED, REJECTED
  version_number INT NOT NULL DEFAULT 1,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE curriculum.content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES curriculum.lessons(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  previous_status VARCHAR(30) NOT NULL,
  new_status VARCHAR(30) NOT NULL,
  decision VARCHAR(20) NOT NULL, -- APPROVED, REJECTED
  comments TEXT NOT NULL,
  version_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_reviews_lesson ON curriculum.content_reviews(lesson_id, created_at DESC);
```
"""
        if "# 28.10 Production DDL" not in chapter_map[28]:
            chapter_map[28] = insert_before_end(chapter_map[28], chap28_addition)

    # 4. Enhance Chapter 34 (Question Banks & NMC CBME Tagging DDL)
    if 34 in chapter_map:
        chap34_addition = r"""
---

# 34.10 Production DDL: Question Banks, NMC Competency Tags & Rationales

```sql
CREATE SCHEMA IF NOT EXISTS quiz;

CREATE TABLE quiz.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vignette_text TEXT NOT NULL,
  nmc_competency_code VARCHAR(30) NOT NULL, -- e.g. PY1.1, PY5.2, PY7.1
  bloom_taxonomy_level VARCHAR(30) NOT NULL, -- RECALL, COMPREHENSION, APPLICATION, ANALYSIS
  organ_system VARCHAR(50) NOT NULL,
  correct_option_index INT NOT NULL,
  explanation_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz.distractor_rationales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES quiz.questions(id) ON DELETE CASCADE,
  option_index INT NOT NULL,
  option_text TEXT NOT NULL,
  rationale TEXT NOT NULL
);
CREATE INDEX idx_questions_competency ON quiz.questions(nmc_competency_code);
```
"""
        if "# 34.10 Production DDL" not in chapter_map[34]:
            chapter_map[34] = insert_before_end(chapter_map[34], chap34_addition)

    # 5. Enhance Chapter 37 (Simulation Laboratory Presets DDL)
    if 37 in chapter_map:
        chap37_addition = r"""
---

# 37.10 Production DDL: Simulation Laboratory State & Presets

```sql
CREATE SCHEMA IF NOT EXISTS simulations;

CREATE TABLE simulations.lab_definitions (
  id VARCHAR(50) PRIMARY KEY, -- cardiac-cycle, acid-base, renal-filtration, nerve-muscle
  title VARCHAR(255) NOT NULL,
  organ_system VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  default_parameters JSONB NOT NULL
);

CREATE TABLE simulations.user_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_id VARCHAR(50) NOT NULL REFERENCES simulations.lab_definitions(id),
  preset_name VARCHAR(100) NOT NULL,
  parameter_values JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
"""
        if "# 37.10 Production DDL" not in chapter_map[37]:
            chapter_map[37] = insert_before_end(chapter_map[37], chap37_addition)

    # 6. Enhance Chapter 39 (pgvector Embeddings & Socratic AI Session DDL)
    if 39 in chapter_map:
        chap39_addition = r"""
---

# 39.10 Production DDL: pgvector 1536-D Vector Knowledge Base & Socratic AI Memory

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE SCHEMA IF NOT EXISTS aitutor;

CREATE TABLE aitutor.embeddings_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_source VARCHAR(255) NOT NULL, -- Guyton & Hall, Costanzo Physiology
  chapter_title VARCHAR(255) NOT NULL,
  section_heading VARCHAR(255) NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_embeddings_hnsw ON aitutor.embeddings_metadata USING hnsw (embedding vector_cosine_ops);

CREATE TABLE aitutor.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_context VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE aitutor.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES aitutor.sessions(id) ON DELETE CASCADE,
  sender_role VARCHAR(20) NOT NULL, -- user, assistant, system
  message_text TEXT NOT NULL,
  citations JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_session ON aitutor.messages(session_id, created_at ASC);
```
"""
        if "# 39.10 Production DDL" not in chapter_map[39]:
            chapter_map[39] = insert_before_end(chapter_map[39], chap39_addition)

    # 7. Enhance Chapter 42 (IMS Global LTI 1.3 Advantage DDL)
    if 42 in chapter_map:
        chap42_addition = r"""
---

# 42.10 Production DDL: IMS Global LTI 1.3 Advantage Interoperability

```sql
CREATE SCHEMA IF NOT EXISTS lti;

CREATE TABLE lti.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.tenants(id) ON DELETE CASCADE,
  client_id VARCHAR(255) NOT NULL,
  deployment_id VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  oidc_auth_url VARCHAR(500) NOT NULL,
  jwks_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_lti_deployment UNIQUE (issuer, client_id, deployment_id)
);

CREATE TABLE lti.grade_passbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES lti.deployments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL,
  score_given NUMERIC(5,2) NOT NULL,
  score_maximum NUMERIC(5,2) NOT NULL,
  line_item_url VARCHAR(500) NOT NULL,
  status VARCHAR(30) NOT NULL, -- PENDING, SUCCESS, FAILED
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
"""
        if "# 42.10 Production DDL" not in chapter_map[42]:
            chapter_map[42] = insert_before_end(chapter_map[42], chap42_addition)

    # Reassemble complete DDD.md
    output_parts = [chapter_map[i].strip() for i in sorted(chapter_map.keys())]
    final_ddd = "\n\n---\n\n".join(output_parts)

    print(f"Final DDD.md length: {len(final_ddd)} characters across {len(output_parts)} chapters.")
    with open('docs/DDD.md', 'w', encoding='utf-8') as f:
        f.write(final_ddd)
    print("Successfully updated docs/DDD.md with all DDL and schema enhancements!")

if __name__ == '__main__':
    main()
