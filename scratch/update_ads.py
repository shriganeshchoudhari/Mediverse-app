import re
import os

def read_ads():
    with open('docs/ADS.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_ads()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total parsed chapters in ADS.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            chapter_map[num] = c

    # 1. Enhance Chapter 11 (JWT Authentication Architecture)
    if 11 in chapter_map:
        chap11_addition = r"""
---

# 11.10 Mediverse Enterprise JWT Token Schema & RBAC Claims Specification

### API-168: Mediverse JWT Token Claims Specification
All security tokens issued by the Mediverse authentication authority (`/api/v1/auth/login`) shall adhere to the RFC 7519 JSON Web Token specification with the following standardized payload schema:

```json
{
  "sub": "student.physio@mediverse.edu",
  "roles": [
    "ROLE_STUDENT"
  ],
  "userId": "1001",
  "institutionId": "med-uni-01",
  "iat": 1723700000,
  "exp": 1723786400,
  "iss": "mediverse-backend"
}
```

### API-169: Cryptographic Standards & Token Lifecycle
* **Signing Algorithm:** HMAC-SHA256 (`HS256`) with minimum 256-bit cryptographically secure secret.
* **Token Lifetime:** 24 Hours (86,400 seconds) standard expiration.
* **Transmission Protocol:** HTTP `Authorization` Header using the standard `Bearer` scheme (`Authorization: Bearer <jwt-token>`).

### API-170: Role Hierarchy & Method-Level Security Matrix
The platform enforces role-based access control via Spring Security method annotations (`@PreAuthorize`):

| Role Identifier | Permissions & Accessible API Domains | Example Spring Security Expression |
|---|---|---|
| `ROLE_STUDENT` / `ROLE_USER` | Interactive 3D dissection, simulation calculations, quiz attempts, Socratic AI tutor, progress tracking | `@PreAuthorize("hasAnyRole('STUDENT', 'USER', 'FACULTY', 'ADMIN')")` |
| `ROLE_FACULTY` / `ROLE_CONTENT_WRITER` | Authoring curriculum content, drafting lessons, submitting lessons to review queue | `@PreAuthorize("hasAnyRole('FACULTY', 'CONTENT_WRITER', 'ADMIN')")` |
| `ROLE_MEDICAL_REVIEWER` / `ROLE_EDITOR` | Reviewing pending curriculum content, approving/rejecting lessons with audit comments | `@PreAuthorize("hasAnyRole('MEDICAL_REVIEWER', 'FACULTY', 'EDITOR', 'ADMIN')")` |
| `ROLE_ADMIN` / `ROLE_SUPER_ADMIN` | User management, role modification, global system telemetry, exam governance | `@PreAuthorize("hasRole('ADMIN')")` |
"""
        end_marker = r'\n---\s*\n\s*\*\*End of Chapter 11\*\*'
        if "# 11.10 Mediverse Enterprise JWT" not in chapter_map[11]:
            if re.search(end_marker, chapter_map[11]):
                chapter_map[11] = re.sub(end_marker, chap11_addition + "\n---\n\n**End of Chapter 11**", chapter_map[11])
            else:
                chapter_map[11] = chapter_map[11].strip() + "\n" + chap11_addition

    # 2. Enhance Chapter 27 (OpenAPI Specification & Endpoints)
    if 27 in chapter_map:
        chap27_addition = r"""
---

# 27.10 Mediverse Core REST API Endpoints Specification

### API-446: OpenAPI 3.1 & Interactive Documentation Endpoints
The Mediverse backend provides live, self-documenting OpenAPI 3.1 metadata and interactive developer interfaces:
* **Interactive Swagger UI:** `http://localhost:8085/swagger-ui/index.html`
* **OpenAPI 3.1 JSON Schema:** `http://localhost:8085/v3/api-docs`
* **Master Executable REST Requests:** [`docs/mediverse.api`](file:///F:/Mediverse-app/docs/mediverse.api) and [`mediverse.api`](file:///F:/Mediverse-app/mediverse.api)

### API-447: Master Domain REST Controller Catalog

#### 1. Authentication Controller (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue JWT bearer token | Public |
| `GET` | `/api/v1/auth/me` | Retrieve authenticated user profile and roles | Bearer JWT |

#### 2. Curriculum Controller (`/api/v1/curriculum`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/curriculum/subjects` | List all 19 MBBS and 12 PG residency subjects | Bearer JWT |
| `GET` | `/api/v1/curriculum/subjects/{subjectId}` | Retrieve subject details, modules, and chapters | Bearer JWT |
| `GET` | `/api/v1/curriculum/chapters/{chapterId}` | Retrieve chapter topics and lesson catalog | Bearer JWT |
| `GET` | `/api/v1/curriculum/lessons/{lessonId}` | Retrieve full lesson with structured content blocks | Bearer JWT |

#### 3. CMS Content Review Controller (`/api/v1/cms`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/cms/lessons` | List lessons filtered by review status (`DRAFT`, `IN_REVIEW`, etc.) | `FACULTY`, `REVIEWER`, `ADMIN` |
| `POST` | `/api/v1/cms/lessons/{lessonId}/submit` | Submit draft lesson to review queue | `FACULTY`, `ADMIN` |
| `POST` | `/api/v1/cms/lessons/{lessonId}/review` | Approve or reject lesson with review commentary | `REVIEWER`, `FACULTY`, `EDITOR` |
| `GET` | `/api/v1/cms/lessons/{lessonId}/history` | Retrieve chronological review decision audit log | `FACULTY`, `REVIEWER`, `ADMIN` |

#### 4. Simulation Calculation Controller (`/api/v1/simulations`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/simulations/catalog` | List all active mathematical physiology simulation labs | Bearer JWT |
| `POST` | `/api/v1/simulations/calculate` | Execute server-side physiological differential equation calculation | Bearer JWT |

#### 5. Socratic AI Tutor Controller (`/api/v1/ai-tutor`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/ai-tutor/chat/stream` | Stream Socratic inquiry tokens via Server-Sent Events (`text/event-stream`) | Bearer JWT |

#### 6. Quiz & Clinical Assessment Controller (`/api/v1/quizzes`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/quizzes` | List available quizzes filtered by subject and competency | Bearer JWT |
| `GET` | `/api/v1/quizzes/{id}` | Retrieve quiz questions with randomized vignette items | Bearer JWT |
| `POST` | `/api/v1/quizzes/{id}/submit` | Submit exam answers for automated grading and feedback | Bearer JWT |
| `GET` | `/api/v1/quizzes/results/{submissionId}` | Retrieve score, rationales, and competency mastery breakdown | Bearer JWT |

#### 7. Student Progress & Bookmarks Controller (`/api/v1/progress`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/progress/summary` | Retrieve student overall completion percentage and stats | Bearer JWT |
| `POST` | `/api/v1/progress/bookmarks` | Bookmark a lesson or 3D organ preset for quick revision | Bearer JWT |
| `GET` | `/api/v1/progress/revision-plans` | Retrieve spaced-repetition revision schedules | Bearer JWT |

#### 8. Administrative Operations Controller (`/api/v1/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/admin/users` | List platform users with role filtering | `ADMIN` |
| `PUT` | `/api/v1/admin/users/{id}/role` | Update user role assignments | `ADMIN` |
| `GET` | `/api/v1/admin/metrics` | Retrieve platform-wide telemetry and performance metrics | `ADMIN` |
"""
        end_marker = r'\n---\s*\n\s*\*\*End of Chapter 27\*\*'
        if "# 27.10 Mediverse Core REST" not in chapter_map[27]:
            if re.search(end_marker, chapter_map[27]):
                chapter_map[27] = re.sub(end_marker, chap27_addition + "\n---\n\n**End of Chapter 27**", chapter_map[27])
            else:
                chapter_map[27] = chapter_map[27].strip() + "\n" + chap27_addition

    # 3. Enhance Chapter 33 (Streaming APIs & Server-Sent Events)
    if 33 in chapter_map:
        chap33_addition = r"""
---

# 33.10 Socratic AI Assistant Server-Sent Events (SSE) Streaming Contract

### API-558: Socratic AI Streaming Endpoint Specification
The Mediverse Socratic AI Companion provides low-latency, real-time streamed responses over HTTP/1.1 and HTTP/2 utilizing the W3C Server-Sent Events (`text/event-stream`) protocol.

#### Request Specification
```http
POST /api/v1/ai-tutor/chat/stream HTTP/1.1
Host: localhost:8085
Authorization: Bearer <jwt-token>
Content-Type: application/json
Accept: text/event-stream

{
  "message": "Explain the physiological consequences of severe aortic stenosis on left ventricular PV loops.",
  "context": "cardiac-cycle",
  "subject": "Physiology",
  "temperature": 0.7
}
```

#### Event Stream Response Format
The server responds with `Content-Type: text/event-stream;charset=UTF-8` and emits sequential data frames containing token chunks and completion metadata:

```text
data: {"token": "In", "done": false}

data: {"token": " severe aortic", "done": false}

data: {"token": " stenosis, the left ventricle", "done": false}

data: {"token": " must generate much higher peak pressures to overcome the fixed valvular resistance.", "done": false}

data: {"token": " This results in a taller and narrower PV loop with increased stroke work.", "done": false}

data: {"done": true, "citations": ["Guyton & Hall Textbook of Medical Physiology, 14th Ed, Ch. 22"]}
```

### API-559: Streaming Error Handling & Fallbacks
If an upstream AI provider timeout occurs, the server shall emit an SSE error event:
```text
event: error
data: {"code": "AI_INFERENCE_TIMEOUT", "message": "Socratic assistant is currently experiencing high load. Falling back to local textbook knowledge base.", "retryable": true}
```
"""
        end_marker = r'\n---\s*\n\s*\*\*End of Chapter 33\*\*'
        if "# 33.10 Socratic AI Assistant" not in chapter_map[33]:
            if re.search(end_marker, chapter_map[33]):
                chapter_map[33] = re.sub(end_marker, chap33_addition + "\n---\n\n**End of Chapter 33**", chapter_map[33])
            else:
                chapter_map[33] = chapter_map[33].strip() + "\n" + chap33_addition

    # 4. Enhance Chapter 55 (Enterprise Reference Architecture & Schemas)
    if 55 in chapter_map:
        chap55_addition = r"""
---

# 55.10 Mediverse Simulation Calculation Request/Response Schemas

### API-1002: Mathematical Physiology Calculation API Contract
The simulation calculation endpoint (`POST /api/v1/simulations/calculate`) accepts parametric boundary models and returns calculated hemodynamic, gas exchange, or electrophysiological values.

#### 1. Cardiac PV-Loop Calculation Request Schema (`CARDIAC_PV`)
```json
{
  "simulationType": "CARDIAC_PV",
  "parameters": {
    "heartRate": 75.0,
    "endDiastolicVolume": 120.0,
    "contractility": 1.0,
    "systemicVascularResistance": 1.0,
    "aorticCompliance": 1.0
  }
}
```

#### Calculated Output Response
```json
{
  "status": "SUCCESS",
  "simulationType": "CARDIAC_PV",
  "results": {
    "strokeVolume": 70.0,
    "cardiacOutput": 5.25,
    "ejectionFraction": 58.33,
    "peakSystolicPressure": 120.0,
    "endSystolicPressure": 100.0,
    "strokeWork": 0.85
  },
  "executionTimeMs": 0.42
}
```

#### 2. Acid-Base Davenport Calculation Request Schema (`ACID_BASE`)
```json
{
  "simulationType": "ACID_BASE",
  "parameters": {
    "paco2": 60.0,
    "hco3": 32.0,
    "sodium": 140.0,
    "chloride": 98.0
  }
}
```

#### Calculated Output Response
```json
{
  "status": "SUCCESS",
  "simulationType": "ACID_BASE",
  "results": {
    "ph": 7.35,
    "anionGap": 10.0,
    "disorder": "Compensated Respiratory Acidosis",
    "compensationStatus": "Chronic Respiratory Acidosis with Renal Bicarbonate Retention",
    "expectedHco3": 32.0
  },
  "executionTimeMs": 0.18
}
```
"""
        end_marker = r'\n---\s*\n\s*## Next Section'
        if "# 55.10 Mediverse Simulation" not in chapter_map[55]:
            if re.search(end_marker, chapter_map[55]):
                chapter_map[55] = re.sub(end_marker, chap55_addition + "\n---\n\n## Next Section", chapter_map[55])
            else:
                chapter_map[55] = chapter_map[55].strip() + "\n" + chap55_addition

    # Reassemble complete ADS.md
    output_parts = [chapter_map[i] for i in sorted(chapter_map.keys())]
    final_ads = "\n".join(output_parts)

    print(f"Final ADS.md length: {len(final_ads)} characters")
    with open('docs/ADS.md', 'w', encoding='utf-8') as f:
        f.write(final_ads)
    print("Successfully updated docs/ADS.md with all remediated API specifications!")

if __name__ == '__main__':
    main()
