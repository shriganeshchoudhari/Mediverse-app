package com.curiolearn.curriculum;

/**
 * Valid values for {@link Lesson#getStatus()}. Kept as a String column
 * (not a JPA enum) for migration safety, but every write MUST use one
 * of these constants.
 *
 * Workflow: DRAFT -> IN_REVIEW -> (APPROVED -> PUBLISHED | REJECTED -> DRAFT)
 */
public final class LessonStatus {
    public static final String DRAFT = "DRAFT";
    public static final String IN_REVIEW = "IN_REVIEW";
    public static final String APPROVED = "APPROVED";
    public static final String REJECTED = "REJECTED";
    public static final String PUBLISHED = "PUBLISHED";

    private LessonStatus() {
    }
}
