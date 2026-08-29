# HIPAA / PHI Test Checklist — Mediverse Platform

```text
Document ID:       QA-CMP-005
Title:             HIPAA / Protected Health Information Test Checklist
Version:           1.0.0
Status:            APPROVED
Owner:             Security Engineer / QA Architect
Reviewer:          CTO, Legal/Compliance
Approver:          CTO
Created Date:      2026-08-29
Last Updated:      2026-08-29
Review Frequency:  Every Release + Quarterly
Change History:    v1.0.0 — Initial checklist
```

> **Scope:** Mediverse is a medical education platform. While it does not directly process patient PHI in a clinical setting, it does handle student PII, exam records, performance data, and AI-generated clinical content that must be protected in alignment with HIPAA principles and applicable data protection standards.

---

## 1. PHI / PII Data Identification

### 1.1 Data Categories Requiring Protection

| Data Type | Classification | Storage Location | Encryption Required |
|---|---|---|---|
| Student name + email | PII | PostgreSQL `users` table | ✅ At rest (pgcrypto) |
| Student exam scores | Sensitive PII | PostgreSQL `exam_results` | ✅ At rest |
| OSCE station performance | Sensitive PII | PostgreSQL `osce_sessions` | ✅ At rest |
| AI tutor conversation history | Sensitive PII | PostgreSQL + pgvector | ✅ At rest |
| Medical case study content | Clinical Data | Curriculum DB | ✅ At rest |
| Student profile image | PII | Object storage | ✅ At rest |
| Session tokens | Auth credential | Redis (TTL 24h) | ✅ In memory only |
| Password hashes | Auth credential | PostgreSQL | ✅ BCrypt/Argon2 |

### 1.2 Data NOT Stored (Zero-Tolerance)

The following real-world PHI must **never** be stored or transmitted by Mediverse:

- ❌ Real patient names, dates of birth, SSN, or medical record numbers
- ❌ Real clinical diagnoses, prescriptions, or treatment records
- ❌ Real insurance or billing information
- ❌ HIPAA-covered entity patient data of any kind

---

## 2. API Response PHI Scan Tests

### 2.1 Prohibited Fields in API Responses (Auto-tested via Newman)

Every API response is scanned for the following prohibited plaintext patterns. These are asserted in the Postman collection post-response scripts:

```javascript
// Postman test snippet — run on every response
const forbiddenPatterns = [
  /\bssn\b/i,
  /\bsocial.?security/i,
  /\bdate.?of.?birth\b/i,
  /\bmedical.?record.?number\b/i,
  /\bpatient.?id\b/i,
  /\bdiagnosis\b.*\bplaintext\b/i,
  /password/i,  // passwords never in response body
  /\btoken\b.*\bsecret\b/i,
];
forbiddenPatterns.forEach(pattern => {
  pm.test(`Response must not contain PHI pattern: ${pattern}`, () => {
    pm.expect(pm.response.text()).to.not.match(pattern);
  });
});
```

### 2.2 API Endpoint PHI Checklist

| # | Endpoint | Test | Expected |
|---|---|---|---|
| 1 | `GET /api/users/me` | No PII fields beyond profile | `password`, `ssn` absent |
| 2 | `GET /api/exam-results/{id}` | Results for authenticated user only | 401 for unauthenticated |
| 3 | `GET /api/osce/sessions` | Sessions scoped to student | Foreign student sessions = 403 |
| 4 | `GET /api/ai-tutor/history` | History scoped to session | Cross-session isolation verified |
| 5 | `GET /api/curriculum/**` | Clinical content — no real patient data | Content review assertion |
| 6 | `POST /api/auth/login` | Password not in response | `password` field absent in 200 |
| 7 | `GET /actuator/prometheus` | Metrics — no PII in labels | Metric label scan |
| 8 | Any 500 error response | Stack traces hidden in production | No `at com.` stack trace in 500 |

---

## 3. Authentication & Authorization Tests

| # | Test | Pass Criteria |
|---|---|---|
| 3.1 | JWT token expiry enforced | Expired token → 401 Unauthorized |
| 3.2 | Role-based access: student cannot access admin endpoints | Admin routes → 403 for student role |
| 3.3 | Role-based access: instructor cannot access other instructor's classes | Cross-instructor isolation → 403 |
| 3.4 | Password reset token single-use | Second use of reset token → 400/401 |
| 3.5 | Session invalidation on logout | Subsequent API call with old token → 401 |
| 3.6 | Brute force protection | 10 failed logins → account lock / 429 |
| 3.7 | OAuth state parameter validated | CSRF on OAuth flow prevented |
| 3.8 | Refresh token rotation | Refresh token single-use; old token invalidated |

---

## 4. Data Encryption Tests

| # | Test | Pass Criteria |
|---|---|---|
| 4.1 | HTTPS enforced in all environments | HTTP redirect to HTTPS; HSTS header present |
| 4.2 | TLS version ≥ 1.2 | TLS 1.0/1.1 rejected |
| 4.3 | Database credentials not in environment logs | `POSTGRES_PASSWORD` absent in Docker logs |
| 4.4 | Redis data not persisted to disk in QA | Redis `appendonly no` or encrypted persistence |
| 4.5 | S3/object storage bucket not publicly accessible | Bucket policy = private |
| 4.6 | Exam results not cached in browser localStorage | `localStorage.getItem('examResult')` = null |

---

## 5. Data Minimization Tests

| # | Test | Pass Criteria |
|---|---|---|
| 5.1 | Registration form only collects required fields | No SSN, DoB, or medical ID field in registration |
| 5.2 | AI tutor logs do not include full conversation in plaintext analytics | Conversation body absent from analytics events |
| 5.3 | Error logging anonymizes user identifiers | Logs contain user hash, not email address |
| 5.4 | Audit trail records action, not data content | Audit log: `user_id + action + timestamp` only |

---

## 6. Audit Logging Tests

| # | Test | Pass Criteria |
|---|---|---|
| 6.1 | Login events logged | `event=LOGIN, user_id=..., timestamp=...` in audit log |
| 6.2 | Failed login attempts logged | `event=LOGIN_FAILED, ip=..., timestamp=...` |
| 6.3 | Exam access logged | `event=EXAM_ACCESSED, student_id=..., exam_id=...` |
| 6.4 | Admin data access logged | Admin `GET /api/users/*` creates audit record |
| 6.5 | Audit log immutable | `DELETE /api/audit-log/*` → 405 Method Not Allowed |
| 6.6 | Audit log retention ≥ 1 year | Logs not purged within 12 months |

---

## 7. Release Gate: PHI Compliance Sign-Off

Before any production release, the following must be verified and signed:

| Checklist Item | Verified By | Date | Status |
|---|---|---|---|
| All Newman PHI pattern tests passing | SDET Lead | | ☐ |
| Authentication test suite 100% green | SDET Lead | | ☐ |
| Encryption tests 100% green | Security Eng | | ☐ |
| No HIGH/CRITICAL SAST findings related to data exposure | Security Eng | | ☐ |
| DAST scan completed (no data leakage findings) | Security Eng | | ☐ |
| Audit logging verified end-to-end | QA Architect | | ☐ |
| Production environment variables confirmed via secrets manager | SRE | | ☐ |
| No real PHI used in test data (verified by test data review) | QA Architect | | ☐ |

**Sign-off:** ___________________________ **Date:** _______________
**Role:** QA Architect / Security Engineer
