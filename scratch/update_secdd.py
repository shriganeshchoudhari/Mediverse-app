import re
import os

def read_secdd():
    with open('docs/SecDD.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=#\s+Security Design Document|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def main():
    text = read_secdd()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total raw parsed chapters in SecDD.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            # If already seen, keep the longer one (deduplication)
            if num not in chapter_map or len(c) > len(chapter_map[num]):
                chapter_map[num] = c

    print(f"Unique chapters after deduplication: {len(chapter_map)} (expected 70)")

    # 1. Enhance Chapter 3 (Regulatory Register)
    if 3 in chapter_map:
        chap3_addition = r"""
---

# 3.10 Mediverse Regulatory Compliance & Governance Register

### SDR-0045: Enterprise Regulatory Compliance Mapping
The Mediverse platform establishes formal traceability to the following regulatory instruments:

| Identifier | Standard / Regulation | Territorial Scope | Mandatory Security Controls & Traceability | Verification Method |
|---|---|---|---|---|
| **REG-NMC** | **NMC CBME MBBS Guidelines** | India (National) | Physiology competencies `PY1.1`–`PY11.14` mapped to curriculum, logbooks, and assessments. | Academic Audit & Syllabus Mapping |
| **REG-USMLE** | **USMLE Step 1 / FSMB-NBME** | United States / Global | Clinical vignette integrity, distractor analysis, and Bloom's taxonomy scoring. | Clinical Question Review |
| **REG-FERPA** | **Family Educational Rights & Privacy Act** | United States (Federal) | Strict privacy of student educational records, grades, exam attempts, and audit logs. | Access Control & Audit Log Review |
| **REG-GDPR** | **General Data Protection Regulation** | European Union / Global | Articles 15–22 Data Subject Rights (Access, Erasure, Portability), DPA logging, lawful basis. | Data Protection Impact Assessment (DPIA) |
| **REG-DPDPA** | **Digital Personal Data Protection Act 2023** | India (National) | Granular consent management, purpose limitation, data fiduciary obligations, minor protections. | Privacy Compliance Audit |
| **REG-WCAG** | **W3C WCAG 2.1 Level AA** | International | Keyboard navigation, high-contrast color ratios $\ge 4.5:1$, screen reader ARIA landmarks. | Automated Accessibility Audits |
"""
        if "# 3.10 Mediverse Regulatory" not in chapter_map[3]:
            chapter_map[3] = insert_before_end(chapter_map[3], chap3_addition)

    # 2. Enhance Chapter 12 (Authentication & Credentials)
    if 12 in chapter_map:
        chap12_addition = r"""
---

# 12.10 Cryptographic Credential & Password Policy Baseline

### SDR-0175: Password Security & Lockout Policy
* **Password Hashing:** Industry-standard **BCrypt** with salt cost factor $\ge 12$.
* **Complexity Requirements:** Minimum 12 characters containing uppercase, lowercase, numeric, and special characters.
* **Account Lockout:** 5 consecutive failed login attempts trigger an automated 15-minute temporary lockout.

### SDR-0176: Multi-Factor Authentication (MFA) Standard
* **Mandatory MFA:** Enforced for all `ROLE_ADMIN` and `ROLE_MEDICAL_REVIEWER` accounts.
* **MFA Protocol:** Standard RFC 6238 TOTP (Time-based One-Time Password) with a 30-second window tolerance.
"""
        if "# 12.10 Cryptographic Credential" not in chapter_map[12]:
            chapter_map[12] = insert_before_end(chapter_map[12], chap12_addition)

    # 3. Enhance Chapter 15 (Session & Token Management)
    if 15 in chapter_map:
        chap15_addition = r"""
---

# 15.10 Mediverse JWT Token Policy & Session Lifecycle Parameters

### SDR-0225: JWT Token Specification
All authentication tokens issued by `/api/v1/auth/login` conform to RFC 7519 JSON Web Tokens:

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

### SDR-0226: Cryptographic Lifecycle & Revocation
* **Signing Algorithm:** HMAC-SHA256 (`HS256`) with minimum 256-bit cryptographically secure key.
* **Token Lifetime:** 24 Hours (86,400 seconds) standard expiration.
* **Header Convention:** `Authorization: Bearer <jwt-token>`.
* **Revocation Triggers:** Immediate token invalidation upon user password reset or role modification.
"""
        if "# 15.10 Mediverse JWT Token" not in chapter_map[15]:
            chapter_map[15] = insert_before_end(chapter_map[15], chap15_addition)

    # 4. Enhance Chapter 21 (API Security & Rate Limiting)
    if 21 in chapter_map:
        chap21_addition = r"""
---

# 21.10 Quantitative Rate Limiting & Throttling Tiers

### SDR-0315: API Rate Limiting Thresholds
The platform enforces the following rate limiting tiers managed via Redis token buckets:

| Endpoint Domain | Rate Limit Threshold | Burst Capacity | Lockout Threshold |
|---|---|---|---|
| **Authentication APIs** (`/api/v1/auth/*`) | 5 req/min per IP | 10 req | 15-minute temporary IP block on 3x breach |
| **General Curriculum APIs** (`/api/v1/curriculum/*`) | 100 req/min per user | 150 req | HTTP 429 Too Many Requests |
| **Simulation Calculation API** (`/api/v1/simulations/calculate`) | 60 req/min per user | 90 req | HTTP 429 Too Many Requests |
| **Socratic AI Streaming** (`/api/v1/ai-tutor/chat/stream`) | 30 req/min per user | 45 req | HTTP 429 with retry-after header |
| **Admin Operations** (`/api/v1/admin/*`) | 20 req/min per user | 30 req | HTTP 429 Too Many Requests |
"""
        if "# 21.10 Quantitative Rate Limiting" not in chapter_map[21]:
            chapter_map[21] = insert_before_end(chapter_map[21], chap21_addition)

    # 5. Enhance Chapter 22 (Method-Level Authorization & CMS Security)
    if 22 in chapter_map:
        chap22_addition = r"""
---

# 22.10 Role-Based Access Control (RBAC) & Spring Security Matrix

### SDR-0330: Spring Security Method-Level Access Matrix
The platform enforces role-based access control via Spring Security `@PreAuthorize` annotations:

| Role Identifier | Accessible API Domains | Mandatory Security Expression |
|---|---|---|
| `ROLE_STUDENT` / `ROLE_USER` | 3D organ dissection, simulation solvers, practice exams, Socratic tutor | `@PreAuthorize("hasAnyRole('STUDENT', 'USER', 'FACULTY', 'ADMIN')")` |
| `ROLE_FACULTY` / `ROLE_CONTENT_WRITER` | Authoring lessons, drafting curriculum, submitting to review queue | `@PreAuthorize("hasAnyRole('FACULTY', 'CONTENT_WRITER', 'ADMIN')")` |
| `ROLE_MEDICAL_REVIEWER` / `ROLE_EDITOR` | Reviewing pending curriculum lessons, approving/rejecting with audit logs | `@PreAuthorize("hasAnyRole('MEDICAL_REVIEWER', 'FACULTY', 'EDITOR', 'ADMIN')")` |
| `ROLE_ADMIN` / `ROLE_SUPER_ADMIN` | User management, role modification, global telemetry, tenant config | `@PreAuthorize("hasRole('ADMIN')")` |

### SDR-0331: CMS Review Audit Trail Immutability
All curriculum review decisions are recorded in the `content_reviews` database table (`V24__cms_content_review_workflow.sql`) capturing reviewer identity, timestamp, decision, lesson version, and required feedback commentary.
"""
        if "# 22.10 Role-Based Access Control" not in chapter_map[22]:
            chapter_map[22] = insert_before_end(chapter_map[22], chap22_addition)

    # 6. Enhance Chapter 32 (AI / LLM Security)
    if 32 in chapter_map:
        chap32_addition = r"""
---

# 32.10 Socratic AI Security, Prompt Sandboxing & KaTeX Sanitization

### SDR-0480: Socratic AI Prompt Sandboxing & Safety Guardrails
* **System Prompt Sandboxing:** Restricts LLM dialog strictly to biomedical sciences and medical education, preventing jailbreaks and prompt injection.
* **Clinical Triage Guardrails:** Automatically refuses requests for live-patient clinical diagnosis and emits standard medical emergency disclaimers.
* **KaTeX & Markdown Sanitization:** Client-side XSS prevention via sanitized React Markdown rendering (`rehype-katex`, `remark-math`).
"""
        if "# 32.10 Socratic AI Security" not in chapter_map[32]:
            chapter_map[32] = insert_before_end(chapter_map[32], chap32_addition)

    # 7. Enhance Chapter 53 (Vulnerability Management SLAs)
    if 53 in chapter_map:
        chap53_addition = r"""
---

# 53.10 Vulnerability Remediation SLAs & Automated DAST Gates

### SDR-0795: Vulnerability Remediation SLAs
Security vulnerabilities identified through SAST, DAST, SCA, or penetration testing adhere to strict remediation SLAs:

| Severity Level | CVSS v3.1 Score | Remediation SLA | Release Gate Policy |
|---|---|---|---|
| **Critical** | $9.0 - 10.0$ | $\le 24\text{ hours}$ | Blocks production promotion immediately |
| **High** | $7.0 - 8.9$ | $\le 7\text{ days}$ | Blocks production promotion |
| **Medium** | $4.0 - 6.9$ | $\le 30\text{ days}$ | Monitored in release backlog |
| **Low** | $0.1 - 3.9$ | $\le 90\text{ days}$ | Scheduled routine maintenance |

### SDR-0796: Automated DAST CI/CD Release Gate
The CI/CD pipeline executes automated Dynamic Application Security Testing (DAST) scans against pre-production staging environments on every release candidate. Zero Critical or High vulnerabilities are required to pass the release gate.
"""
        if "# 53.10 Vulnerability Remediation" not in chapter_map[53]:
            chapter_map[53] = insert_before_end(chapter_map[53], chap53_addition)

    # Reassemble complete SecDD.md
    output_parts = [chapter_map[i] for i in sorted(chapter_map.keys())]
    final_secdd = "\n".join(output_parts)

    print(f"Final SecDD.md length: {len(final_secdd)} characters across {len(output_parts)} chapters.")
    with open('docs/SecDD.md', 'w', encoding='utf-8') as f:
        f.write(final_secdd)
    print("Successfully updated docs/SecDD.md with all remediated security specifications!")

if __name__ == '__main__':
    main()
