package com.curiolearn.user;

/**
 * Canonical set of platform roles.
 *
 * User.role remains a plain String column (not a JPA enum) to avoid a
 * risky column-type migration on existing data — but every role written
 * to that column MUST come from this list so authorization checks
 * (hasRole(...)) and the CMS workflow stay consistent.
 *
 * ROLE_ prefix is added automatically by Spring Security
 * (see CustomUserDetailsService) — do not include it here.
 */
public final class Roles {

    /** Full platform administrator — user management, system config. */
    public static final String SUPER_ADMIN = "SUPER_ADMIN";

    /** Legacy/general admin role, kept for backwards compatibility with existing seeded admins. */
    public static final String ADMIN = "ADMIN";

    /** Subject-matter faculty — can author and review content for their subject. */
    public static final String FACULTY = "FACULTY";

    /** Writes draft lesson/content-block content; cannot publish directly. */
    public static final String CONTENT_WRITER = "CONTENT_WRITER";

    /** Reviews content for clinical/medical accuracy before publish. */
    public static final String MEDICAL_REVIEWER = "MEDICAL_REVIEWER";

    /** Reviews content for language, structure, and pedagogy before publish. */
    public static final String EDITOR = "EDITOR";

    /** Default role for learners. */
    public static final String STUDENT = "STUDENT";

    /** Roles allowed to move a Lesson out of DRAFT into the review workflow. */
    public static final String[] CONTENT_AUTHORS = { SUPER_ADMIN, ADMIN, FACULTY, CONTENT_WRITER };

    /** Roles allowed to approve/reject content in review. */
    public static final String[] CONTENT_REVIEWERS = { SUPER_ADMIN, ADMIN, FACULTY, MEDICAL_REVIEWER, EDITOR };

    /** Roles with full CMS/admin console access. */
    public static final String[] CMS_ADMINS = { SUPER_ADMIN, ADMIN };

    private Roles() {
    }
}
