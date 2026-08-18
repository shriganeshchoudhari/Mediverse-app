# Mediverse Administrator Guide,mnbvdcsxazt567uy6trewsqa (AG)

This 75-chapter guide provides comprehensive instructions for Platform Administrators, Customer Success Managers, and Institutional IT Staff. It defines how to manage tenants, users, AI limitations, educational content, and billing through the Mediverse Admin UI and Admin REST APIs.

---

---

### Chapter 1: Purpose and Scope of the Administrator Guide

**Administrative Procedure & Policy:**
- Covers non-infrastructure platform management via the UI (`admin.mediverse.com`) and REST API.
- Target Audience: Customer Success, Content Editors, University IT Admins.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 2: Administrative Personas & RBAC Authorization Matrix

**Administrative Procedure & Policy:**
* **Super Admin (`ROLE_ADMIN`):** Full platform control, institutional tenant onboarding, global system telemetry, exam bank governance.
* **Tenant Admin (`ROLE_ADMIN`):** University IT administrator managing student rosters, SAML/OIDC SSO, and LTI 1.3 Advantage deployments within their institution.
* **Medical Reviewer / Editor (`ROLE_MEDICAL_REVIEWER`, `ROLE_EDITOR`):** Medical education board members evaluating pending curriculum lessons, approving/rejecting submissions in the CMS review queue (`/cms`), and auditing version histories.
* **Faculty Content Writer (`ROLE_FACULTY`):** Medical professors authoring curriculum lessons, drafting clinical case vignettes, and submitting content for peer review.
* **Student Learner (`ROLE_STUDENT`):** Medical students accessing 3D organ dissection, interactive simulation solvers, timed board exams, and Socratic AI tutoring.

**Institutional Governance & Security Controls:**
* Method-level authorization enforced via Spring Security `@PreAuthorize` across all domain REST controllers.
* Immutable audit trail logging all role modifications and administrative actions in the `audit_logs` table.

---

### Chapter 3: Accessing the Mediverse Admin Control Center

**Administrative Procedure & Policy:**
- URL: `https://admin.mediverse.com`.
- Login strictly requires corporate SSO (Google Workspace or Azure AD).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 4: Navigating the Admin Dashboard UI

**Administrative Procedure & Policy:**
- Global navigation bar contains: Tenants, Users, Content, AI Ops, Billing, Reports, Settings.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 5: Setting up Admin Multi-Factor Authentication (MFA)

**Administrative Procedure & Policy:**
- All Admin roles require hardware security keys (YubiKey) or Authenticator App TOTP.
- SMS-based 2FA is explicitly disabled for administrative accounts.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 6: Using the Admin REST API for Bulk Operations

**Administrative Procedure & Policy:**
- Generate an API Key under `Settings -> Developer`.
- Authentication: Bearer Token. Rate Limit: 100 requests / minute.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 7: Understanding Admin Action Audit Logs

**Administrative Procedure & Policy:**
- Every action (e.g., deleting a user, changing a price) is logged immutably.
- Access logs via `Settings -> Audit Trail`. Cannot be deleted by any admin.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 8: Onboarding a New Institutional Tenant

**Administrative Procedure & Policy:**
- Navigate to `Tenants -> Create New`.
- Required fields: Institution Name, Contact Email, Tier (Basic/Pro/Enterprise), and Seat Limit.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 9: Configuring Tenant-Specific Branding

**Administrative Procedure & Policy:**
- Navigate to `Tenant -> Branding`.
- Upload Primary Logo (SVG preferred), set Primary and Secondary Hex color codes for the student portal.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 10: Setting up Tenant Single Sign-On (SAML/OIDC)

**Administrative Procedure & Policy:**
- Supports Okta, Azure AD, Shibboleth.
- Input IdP Metadata XML URL. Map IdP `email` and `roles` claims to Mediverse user attributes.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 11: Defining Tenant-level Feature Toggles

**Administrative Procedure & Policy:**
- Enable or disable features like `AI_TUTOR_ENABLED` or `3D_ANATOMY_MODULE` per tenant contract.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 12: Setting Tenant Seat Limits & Active User Quotas

**Administrative Procedure & Policy:**
- Hard limit vs Soft limit. If soft limit exceeded, allow login but flag for Account Manager to upsell.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 13: Managing Tenant-Specific Sub-domains

**Administrative Procedure & Policy:**
- E.g., `harvard.mediverse.com`.
- Requires coordination with DevOps to provision Route53 CNAME and Let's Encrypt certificates.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 14: Offboarding a Tenant & Initiating Data Deletion

**Administrative Procedure & Policy:**
- Click `Deactivate Tenant`. Triggers 90-day grace period (Read-Only).
- After 90 days, GDPR cascading hard deletion executes automatically.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 15: Suspending a Tenant for Billing Delinquency

**Administrative Procedure & Policy:**
- Automated via Stripe webhook, or manual override via UI.
- Restricts student access but allows Tenant Admin login to update payment methods.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 16: The Role-Based Access Control (RBAC) Hierarchy

**Administrative Procedure & Policy:**
- Roles: `Student`, `Instructor`, `Institution_Admin`.
- Roles determine visibility of analytics and ability to manage other users.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 17: Inviting Users via Email or Bulk CSV Upload

**Administrative Procedure & Policy:**
- For non-SSO tenants. Download CSV template, populate emails/roles, upload to batch processor.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 18: Managing Custom User Groups and Cohorts

**Administrative Procedure & Policy:**
- Create 'Cohorts' (e.g., 'Nursing Class 2026') to assign specific courses and exams in bulk.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 19: Resetting User Passwords & Forcing MFA

**Administrative Procedure & Policy:**
- Action: `Send Password Reset Link`. Admins cannot see or set raw passwords.
- Action: `Revoke MFA Devices` if user loses phone.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 20: Suspending or Banning Abusive Users

**Administrative Procedure & Policy:**
- Action: `Suspend User`. Instantly revokes JWT tokens and drops active WebSockets. Useful for cheating or AI prompt abuse.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 21: Medical Curriculum Content Management & Review Lifecycle

**Administrative Procedure & Policy:**
* Mediverse enforces a strict **5-stage peer-review state machine** for all curriculum lessons:
  `[ DRAFT ]` ──(submitForReview)──► `[ IN_REVIEW ]` ──► `[ APPROVED ]` ──► `[ PUBLISHED ]` (or `[ REJECTED ]` ──► `[ DRAFT ]`).
* Content Writers submit drafts to the central review queue. Medical Reviewers evaluate lessons at `/cms` before approving for publication.
* All decisions generate immutable audit records in the `content_reviews` table (`V24__cms_content_review_workflow.sql`).

**Operational REST Commands:**
* List pending lessons: `GET /api/v1/cms/lessons?status=IN_REVIEW`
* Submit draft for review: `POST /api/v1/cms/lessons/{lessonId}/submit`
* Approve/Reject lesson: `POST /api/v1/cms/lessons/{lessonId}/review` with `{"decision": "APPROVED", "comments": "Peer-reviewed and verified against NMC CBME."}`

---

### Chapter 22: Operating the CMS Review Queue & WYSIWYG Evaluation

**Administrative Procedure & Policy:**
* Navigate to `https://mediverse.edu/cms` and select the **"In Review"** tab.
* Click on any pending lesson to open the WYSIWYG evaluation interface (`/cms/[lessonId]`).
* Inspect rendered Markdown content, LaTeX mathematical equations, and clinical case vignettes rendered by `ContentBlockRenderer`.
* Click **"Approve"** to transition the lesson to `APPROVED` / `PUBLISHED`, or click **"Reject"** and provide mandatory pedagogical feedback comments.

**Institutional Governance & Security Controls:**
* Rejection feedback is mandatory; empty rejection submissions are blocked by backend validation (`CmsReviewService.java`).
* Reviewers must possess `ROLE_MEDICAL_REVIEWER`, `ROLE_FACULTY`, or `ROLE_EDITOR` credentials.

---

### Chapter 23: Managing Guest and Alumni Access Expirations

**Administrative Procedure & Policy:**
- Set `Account Expiry Date`. Automatically downgrades account to 'Alumni' (Read-only access to past certificates) after graduation.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 24: The Course Creation Workflow

**Administrative Procedure & Policy:**
- Navigate to `Content -> Courses -> New`.
- Define modules, attach videos, insert quizzes, and set passing grade thresholds.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 25: Uploading and Transcoding Surgical Videos

**Administrative Procedure & Policy:**
- Supports `.mp4`, `.mov` up to 10GB.
- AWS MediaConvert automatically transcodes to HLS streams for adaptive bitrate playback.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 26: Clinical Vignette Question Bank & USMLE/NMC CBME Governance

**Administrative Procedure & Policy:**
* Clinical assessment items must adhere to standard USMLE Step 1 / NMC CBME vignette structure: patient history, physical examination, diagnostic lab findings, and 4–5 single-best-answer distractors.
* Manage questions in the central repository (`clinicalExamQuestions.ts` and `quiz_questions` database table).
* Every question must include comprehensive rationale explanations for both the correct answer and all incorrect distractors.

**Institutional Governance & Security Controls:**
* All questions require dual-faculty peer review before activation in student board examination pools.

---

### Chapter 27: NMC CBME Competency & Bloom's Taxonomy Mapping

**Administrative Procedure & Policy:**
* Tag every curriculum lesson and clinical question with standardized National Medical Commission competency codes:
  - `PY1.1`–`PY1.9`: General Physiology & Cellular Transport
  - `PY2.1`–`PY2.13`: Hematology & Immunology
  - `PY3.1`–`PY3.18`: Nerve-Muscle Physiology
  - `PY4.1`–`PY4.10`: Gastrointestinal System
  - `PY5.1`–`PY5.14`: Cardiovascular System
  - `PY6.1`–`PY6.10`: Respiratory System
  - `PY7.1`–`PY7.9`: Renal Physiology & Acid-Base Balance
  - `PY8.1`–`PY8.6`: Endocrine System
  - `PY9.1`–`PY9.12`: Reproductive System
  - `PY10.1`–`PY10.20`: Neurophysiology & Special Senses
* Tag Bloom's cognitive taxonomy levels (Recall, Comprehension, Application, Analysis) to drive the interactive Radar Chart mastery analytics (`ExamSummaryView.tsx`, `nmcMapping.ts`).

---

### Chapter 28: Managing Content Tags, Metadata, and Taxonomy

**Administrative Procedure & Policy:**
- Enforce standardized medical taxonomy (e.g., SNOMED CT, MeSH) for all content tagging to power search.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 29: Publishing vs. Archiving Content

**Administrative Procedure & Policy:**
- Published content is visible to students.
- Archiving hides the content but preserves historical grades tied to it.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 30: Resolving Content Flagged by Users

**Administrative Procedure & Policy:**
- Review student feedback (e.g., 'Typo in question 4').
- Edit question and optionally recalculate grades for affected students.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 31: 3D WebGL Multi-Organ Presets & Anatomical Landmark Administration

**Administrative Procedure & Policy:**
* Manage 3D anatomical organ models and landmark beacon metadata in `OrganPresets.ts`:
  - Cardiovascular (Left Ventricle, Aortic Valve, SA Node, Interventricular Septum)
  - Respiratory (Main Bronchus, Alveolar Sac, Pulmonary Capillary, Diaphragm)
  - Renal (Glomerulus, Bowman's Capsule, Proximal Convoluted Tubule, Loop of Henle)
  - Neurophysiology (Axon Hillock, Myelin Sheath, Synaptic Cleft)
  - Gastrointestinal (Gastric Parietal Cell, Villi, Crypt of Lieberkuhn)
  - Endocrine (Pancreatic Beta Cell, Adrenal Cortex, Thyroid Follicle)
* Configure default camera position vectors, zoom limits, and clinical correlation diagnostic popover text.

**Institutional Governance & Security Controls:**
* Ensure all 3D canvas components bind to `useThreeMemoryCleanup.ts` to execute `renderer.dispose()` and prevent client VRAM memory leaks.

---

### Chapter 32: Generating Course Completion Certificates

**Administrative Procedure & Policy:**
- Upload PDF templates. System automatically maps `$USER_NAME`, `$COURSE_NAME`, and `$DATE`.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 33: Understanding the AI Tutor Role in Mediverse

**Administrative Procedure & Policy:**
- The AI acts as a Socratic tutor, never giving direct exam answers, but guiding the student to the conclusion.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 34: Allocating AI Token Budgets per Tenant

**Administrative Procedure & Policy:**
- Set monthly token limits (e.g., 50M tokens/month).
- Overrides require Customer Success Manager approval.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 35: Monitoring Tenant AI Usage and Forecasting Overage

**Administrative Procedure & Policy:**
- View the `AI Ops -> Token Burn` dashboard.
- Automated emails sent to Tenant Admin at 80%, 90%, and 100% capacity.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 36: Real-Time Physiological Simulation Solvers Calibration

**Administrative Procedure & Policy:**
* Calibrate mathematical differential equation solvers to maintain clinical fidelity across physiological extremes:
  - **Cardiac Suga-Sagawa Solver (`cardiacSolver.ts`):** Left ventricular time-varying elastance $E(t)$, ESPVR, EDPVR, Stroke Volume, and Ejection Fraction.
  - **Acid-Base Davenport Solver (`acidBaseSolver.ts`):** Henderson-Hasselbalch solver ($pH = 6.1 + \log_{10}\frac{[\text{HCO}_3^-]}{0.03 \cdot \text{PaCO}_2}$), Anion Gap, Winter's formula, and Davenport buffer lines.
  - **Renal Starling Solver (`renalSolver.ts`):** Glomerular filtration rate ($\text{GFR} = K_f \cdot [(P_{gc} - P_{bs}) - (\pi_{gc} - \pi_{bs})]$), Inulin/Creatinine clearance, and fractional sodium excretion ($\text{FeNa}$).
  - **Electrophysiology Solver (`membraneSolver.ts`):** Goldman-Hodgkin-Katz membrane voltage equation.
* Verify calculation API latency ($< 1.0\text{ms}$) via `SimulationApiController.java` (`POST /api/v1/simulations/calculate`).

---

### Chapter 37: Overriding AI Safety Guardrails

**Administrative Procedure & Policy:**
- Extreme caution: Can allow the AI to discuss off-label drug uses for advanced pharmacology courses. Requires explicit Legal opt-in.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 38: Uploading Documents to the RAG Knowledge Base

**Administrative Procedure & Policy:**
- Upload PDFs/PPTs. System chunks, embeds, and syncs to pgvector automatically.
- 'Resync' required if original document changes.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 39: Reviewing Flagged AI Hallucinations

**Administrative Procedure & Policy:**
- Students can 'thumbs down' an AI response.
- Admin UI shows the prompt, the retrieved context, and the generated response for human review.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 40: Blacklisting Specific Topics from AI Responses

**Administrative Procedure & Policy:**
- Add keywords to the global Denylist (e.g., 'political opinions', 'non-medical advice').

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 41: Socratic AI Companion Prompt Sandboxing & Safety Governance

**Administrative Procedure & Policy:**
* Configure the Socratic AI system prompt in `AITutorService.java` to enforce Socratic inquiry rather than providing direct exam answers.
* Mandate reference textbook citation grounding (Guyton & Hall Textbook of Medical Physiology, Costanzo Physiology).
* Enforce clinical emergency triage guardrails: automated refusal of live-patient diagnostic inquiries with medical emergency disclaimers.

**Operational Telemetry & Rate Limits:**
* Stream Socratic tokens via Server-Sent Events (`POST /api/v1/ai-tutor/chat/stream`).
* Configure per-student token quotas (30 requests/minute) managed via Redis token buckets.

---

### Chapter 42: Updating Stripe Pricing Tables

**Administrative Procedure & Policy:**
- Mediverse UI syncs with Stripe Products.
- Changing prices only affects new sign-ups; legacy users are grandfathered unless manually migrated.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 43: Generating Custom Invoices for Enterprise Tenants

**Administrative Procedure & Policy:**
- For B2B sales (Net-30 terms). Generate PDF invoice and send payment link via Stripe Billing.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 44: Issuing Refunds and Prorated Credits

**Administrative Procedure & Policy:**
- Search User -> Billing Tab -> Click `Refund Charge`.
- Requires reason code (e.g., 'Accidental charge', 'Unsatisfied').

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 45: Managing Discount Codes and Promotional Campaigns

**Administrative Procedure & Policy:**
- Generate bulk codes (e.g., `FALL2026`) with expiration dates and redemption limits.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 46: Handling Failed Credit Card Charges (Dunning)

**Administrative Procedure & Policy:**
- System auto-emails user 3 times over 7 days.
- Subscription auto-cancels on day 8. Admins can manually extend the grace period.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 47: Exporting Monthly Revenue Recognition Reports

**Administrative Procedure & Policy:**
- Essential for Accounting. Exports recognized vs deferred revenue based on annual vs monthly billing cycles.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 48: Navigating the Global Usage Analytics Dashboard

**Administrative Procedure & Policy:**
- View Daily Active Users (DAU), Monthly Active Users (MAU), and average session length.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 49: Generating Student Engagement & Drop-off Reports

**Administrative Procedure & Policy:**
- Funnel analysis: See where students abandon long courses or complex 3D modules.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 50: Exporting Exam Performance Averages by Cohort

**Administrative Procedure & Policy:**
- Identify systemic knowledge gaps (e.g., '70% of Cohort A failed the Cardiology section').

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 51: Tracking Video Viewership and 3D Interactivity

**Administrative Procedure & Policy:**
- Heatmaps showing which parts of a video are re-watched most often (indicates complex concepts requiring better explanation).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 52: Scheduling Automated Weekly Reports

**Administrative Procedure & Policy:**
- Configure system to email a PDF summary to the University Dean every Friday morning.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 53: Building Custom Metabase Dashboards

**Administrative Procedure & Policy:**
- Super Admins can write custom SQL queries against the read-replica to build new visualizations.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 54: Exporting Raw Data via the Data Warehouse API

**Administrative Procedure & Policy:**
- Allow enterprise tenants to pull raw event streams into their own Snowflake/BigQuery instances.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 55: Handling GDPR Data Subject Access Requests (DSAR)

**Administrative Procedure & Policy:**
- Click `Export User Data` on user profile. Generates a ZIP file of all logs, exams, and chats within 72 hours.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 56: Executing a 'Right to be Forgotten' Request

**Administrative Procedure & Policy:**
- Click `Hard Delete User`.
- Irreversible. Removes PII but anonymizes exam data to preserve cohort statistical averages.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 57: Exporting HIPAA Compliance Access Logs

**Administrative Procedure & Policy:**
- Used during audits to prove exactly which Admins viewed a specific student's PHI or grade history.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 58: Managing User Consent and Privacy Policy Agreements

**Administrative Procedure & Policy:**
- Force all users to re-accept a new Terms of Service upon next login when policies change.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 59: Identifying and Remediating PII Data Spills

**Administrative Procedure & Policy:**
- If a user pastes patient data into the AI chat, use the `Scrub PII` tool to permanently overwrite the chat log.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 60: Setting Data Retention Policies

**Administrative Procedure & Policy:**
- Global configs (e.g., Chat history deleted after 1 year, Exam scores kept for 7 years).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 61: Conducting a Platform Access Audit

**Administrative Procedure & Policy:**
- Generate a report showing all active Super Admins and their last login dates. Revoke dormant admins.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 62: Configuring LTI (Learning Tools Interoperability)

**Administrative Procedure & Policy:**
- Generate LTI 1.3 Key and Secret to integrate Mediverse directly into a university's Canvas or Blackboard portal.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 63: Syncing Grades back to External LMS Platforms

**Administrative Procedure & Policy:**
- Define grade pass-back rules (e.g., sync highest score vs latest score).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 64: Setting up Outbound Webhooks

**Administrative Procedure & Policy:**
- Navigate to `Tenant -> Integrations -> Webhooks`.
- Register endpoints to receive JSON payloads for `exam.completed` or `user.created` events.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 65: IMS Global LTI 1.3 Advantage LMS Registration & Key Rotation

**Administrative Procedure & Policy:**
* Register institutional LMS deployments (Canvas, Blackboard, Moodle, Brightspace):
  - Generate Platform Client ID, Deployment ID, and OIDC Authorization Endpoint.
  - Public Key Set URL (JWKS): `https://mediverse.edu/.well-known/jwks.json` using RS256 asymmetric keys.
* Enable Assignment and Grade Services (AGS v2.0) for automated grade passback from Mediverse clinical exams into university gradebooks.
* Enable Names and Role Provisioning Services (NRPS v2.0) for automated student roster and course enrollment synchronization.
* Enable LTI Deep Linking (DL v2.0) allowing professors to embed specific 3D dissection presets or simulation labs into LMS course modules.

---

### Chapter 66: Viewing Webhook Delivery Failures and DLQs

**Administrative Procedure & Policy:**
- View failed webhook deliveries. Click `Replay Payload` if the customer's receiving server was down.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 67: Integrating Zoom or Teams for Live Lectures

**Administrative Procedure & Policy:**
- Authenticate Mediverse via OAuth to automatically create meeting links for live scheduled courses.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 68: Managing API Keys for Custom Integrations

**Administrative Procedure & Policy:**
- Tenant Admins can generate API keys scoped strictly to their own tenant data.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 69: Interpreting User Error Codes in the Support Portal

**Administrative Procedure & Policy:**
- Look up correlation IDs provided by users (e.g., `ERR-5928`) to find the exact database error in logs.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 70: Assuming a User's Identity (Impersonation Mode)

**Administrative Procedure & Policy:**
- Feature to log in *as* the student to reproduce UI bugs.
- Leaves a strict audit trail. Excludes access to billing information.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 71: Escalating a Bug to L2 SRE / Engineering

**Administrative Procedure & Policy:**
- Click `Escalate to Jira` directly from the user's support ticket inside the Admin UI.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 72: Reviewing the Platform Status Page

**Administrative Procedure & Policy:**
- Admins can draft and publish maintenance notices directly to `status.mediverse.com`.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 73: Handling SLA Breach Customer Communications

**Administrative Procedure & Policy:**
- Use Mailgun integration to mass-email all Tenant Admins if a P0 outage exceeds SLA thresholds.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 74: Requesting Temporary API Rate Limit Increases

**Administrative Procedure & Policy:**
- Approve temporary burst capacity for tenants running end-of-semester mass grade exports.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

---

### Chapter 75: End-of-Life (EOL) Notices and Deprecation

**Administrative Procedure & Policy:**
- Manage the communication timeline for deprecating old API versions (v1 -> v2).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---