# Mediverse Administrator Guide (AG)

This 75-chapter guide provides comprehensive instructions for Platform Administrators, Customer Success Managers, and Institutional IT Staff. It defines how to manage tenants, users, AI limitations, educational content, and billing through the Mediverse Admin UI and Admin REST APIs.

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

### Chapter 2: Administrative Personas

**Administrative Procedure & Policy:**
- **Super Admin**: Mediverse staff. Can view all tenants and billing.
- **Tenant Admin**: University IT. Can manage users and SSO within their own tenant.
- **Content Creator**: Medical faculty. Can upload videos and create quizzes.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 4: Navigating the Admin Dashboard UI

**Administrative Procedure & Policy:**
- Global navigation bar contains: Tenants, Users, Content, AI Ops, Billing, Reports, Settings.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 11: Defining Tenant-level Feature Toggles

**Administrative Procedure & Policy:**
- Enable or disable features like `AI_TUTOR_ENABLED` or `3D_ANATOMY_MODULE` per tenant contract.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 17: Inviting Users via Email or Bulk CSV Upload

**Administrative Procedure & Policy:**
- For non-SSO tenants. Download CSV template, populate emails/roles, upload to batch processor.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 20: Suspending or Banning Abusive Users

**Administrative Procedure & Policy:**
- Action: `Suspend User`. Instantly revokes JWT tokens and drops active WebSockets. Useful for cheating or AI prompt abuse.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

### Chapter 21: Investigating 'Impossible Travel' Security Flags

**Administrative Procedure & Policy:**
- Review user login history Map in profile.
- If false positive (VPN use), click `Dismiss Alert`.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

### Chapter 22: Merging Duplicate User Accounts

**Administrative Procedure & Policy:**
- Tool to merge `john.doe@gmail.com` with `jdoe@university.edu`.
- Consolidates exam history and course progress.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 26: Creating and Managing Interactive 3D Anatomy Models

**Administrative Procedure & Policy:**
- Upload `.gltf` or `.obj` assets.
- Use the visual editor to define clickable 'hotspots' (e.g., 'Aortic Valve') with text popups.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

### Chapter 27: Designing Adaptive Quizzes and Exam Banks

**Administrative Procedure & Policy:**
- Create Question Banks tagged by difficulty and organ system.
- Enable 'Adaptive Mode' so subsequent questions adjust based on prior answers.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 31: Setting up Content Drip-Schedules for Cohorts

**Administrative Procedure & Policy:**
- Unlock Module 2 only after Module 1 is complete, or on a specific calendar date (e.g., 'Oct 15th').

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 33: Understanding the AI Tutor Role in Mediverse

**Administrative Procedure & Policy:**
- The AI acts as a Socratic tutor, never giving direct exam answers, but guiding the student to the conclusion.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 36: Adjusting AI Tutor Persona Guidelines

**Administrative Procedure & Policy:**
- Modify the System Prompt globally or per tenant (e.g., 'Explain concepts at a 1st-year nursing level vs 4th-year surgical resident level').

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 40: Blacklisting Specific Topics from AI Responses

**Administrative Procedure & Policy:**
- Add keywords to the global Denylist (e.g., 'political opinions', 'non-medical advice').

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---

### Chapter 41: Managing Subscription Tiers

**Administrative Procedure & Policy:**
- Define feature access mapping for Basic (No AI), Pro (AI Tutor), and Enterprise (SSO + Custom Branding).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 43: Generating Custom Invoices for Enterprise Tenants

**Administrative Procedure & Policy:**
- For B2B sales (Net-30 terms). Generate PDF invoice and send payment link via Stripe Billing.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 45: Managing Discount Codes and Promotional Campaigns

**Administrative Procedure & Policy:**
- Generate bulk codes (e.g., `FALL2026`) with expiration dates and redemption limits.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 47: Exporting Monthly Revenue Recognition Reports

**Administrative Procedure & Policy:**
- Essential for Accounting. Exports recognized vs deferred revenue based on annual vs monthly billing cycles.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 49: Generating Student Engagement & Drop-off Reports

**Administrative Procedure & Policy:**
- Funnel analysis: See where students abandon long courses or complex 3D modules.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 51: Tracking Video Viewership and 3D Interactivity

**Administrative Procedure & Policy:**
- Heatmaps showing which parts of a video are re-watched most often (indicates complex concepts requiring better explanation).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 53: Building Custom Metabase Dashboards

**Administrative Procedure & Policy:**
- Super Admins can write custom SQL queries against the read-replica to build new visualizations.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 55: Handling GDPR Data Subject Access Requests (DSAR)

**Administrative Procedure & Policy:**
- Click `Export User Data` on user profile. Generates a ZIP file of all logs, exams, and chats within 72 hours.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 57: Exporting HIPAA Compliance Access Logs

**Administrative Procedure & Policy:**
- Used during audits to prove exactly which Admins viewed a specific student's PHI or grade history.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 59: Identifying and Remediating PII Data Spills

**Administrative Procedure & Policy:**
- If a user pastes patient data into the AI chat, use the `Scrub PII` tool to permanently overwrite the chat log.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 61: Conducting a Platform Access Audit

**Administrative Procedure & Policy:**
- Generate a report showing all active Super Admins and their last login dates. Revoke dormant admins.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 63: Syncing Grades back to External LMS Platforms

**Administrative Procedure & Policy:**
- Define grade pass-back rules (e.g., sync highest score vs latest score).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 65: Managing Webhook HMAC Signing Secrets

**Administrative Procedure & Policy:**
- Admins must provide the HMAC secret to their developers to verify payload authenticity.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 67: Integrating Zoom or Teams for Live Lectures

**Administrative Procedure & Policy:**
- Authenticate Mediverse via OAuth to automatically create meeting links for live scheduled courses.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 69: Interpreting User Error Codes in the Support Portal

**Administrative Procedure & Policy:**
- Look up correlation IDs provided by users (e.g., `ERR-5928`) to find the exact database error in logs.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 71: Escalating a Bug to L2 SRE / Engineering

**Administrative Procedure & Policy:**
- Click `Escalate to Jira` directly from the user's support ticket inside the Admin UI.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 73: Handling SLA Breach Customer Communications

**Administrative Procedure & Policy:**
- Use Mailgun integration to mass-email all Tenant Admins if a P0 outage exceeds SLA thresholds.

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

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

### Chapter 75: End-of-Life (EOL) Notices and Deprecation

**Administrative Procedure & Policy:**
- Manage the communication timeline for deprecating old API versions (v1 -> v2).

**Institutional Governance & Security Controls:**
- **Tenant Management:** Provision institutional medical college tenants with dedicated subdomains (college.mediverse.edu), custom branding, and DPDPA 2023 data localization (ap-south-1).
- **SSO & Directory Sync:** Configure SAML 2.0 / OIDC Single Sign-On and enable SCIM 2.0 directory provisioning for automated student/faculty lifecycle management.
- **LTI 1.3 Integration:** Register institutional LMS platforms (Canvas, Moodle, Blackboard) with asymmetric RSA-256 JWKS key sets.
- **AI Governance & Quotas:** Allocate student cohort AI Socratic Tutor token budgets, enforce rate limits, and maintain immutable audit logs for regulatory compliance.

---
