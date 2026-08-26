package com.curiolearn.curriculum;

import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Drives the Lesson content-authoring and review workflow:
 * CREATE (DRAFT) -> EDIT -> SUBMIT (IN_REVIEW) -> (APPROVED -> PUBLISHED | REJECTED -> DRAFT)
 */
@Service
@RequiredArgsConstructor
public class CmsReviewService {

    private final LessonRepository lessonRepository;
    private final ContentReviewRepository contentReviewRepository;
    private final UserRepository userRepository;
    private final ConceptRepository conceptRepository;
    private final ContentBlockRepository contentBlockRepository;

    @Transactional
    public Lesson createLesson(CreateLessonRequestDto request) {
        Concept concept = null;
        if (request.getConceptId() != null) {
            concept = conceptRepository.findById(request.getConceptId()).orElse(null);
        }

        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle());
        lesson.setStatus(LessonStatus.DRAFT);
        lesson.setVersion(1);
        lesson.setConcept(concept);

        Lesson saved = lessonRepository.save(lesson);

        if (request.getBlocks() != null && !request.getBlocks().isEmpty()) {
            int order = 1;
            List<ContentBlock> blocks = new ArrayList<>();
            for (CreateLessonRequestDto.BlockPayload b : request.getBlocks()) {
                ContentBlock block = new ContentBlock();
                block.setLesson(saved);
                block.setType(b.getType() != null ? b.getType().toUpperCase() : "EXPLANATION");
                block.setOrderIndex(b.getOrderIndex() > 0 ? b.getOrderIndex() : order++);
                block.setMetadata(b.getMetadata());
                blocks.add(block);
            }
            contentBlockRepository.saveAll(blocks);
            saved.setContentBlocks(blocks);
        }

        return saved;
    }

    @Transactional
    public Lesson submitForReview(UUID lessonId) {
        Lesson lesson = getLesson(lessonId);
        if (!LessonStatus.DRAFT.equals(lesson.getStatus()) && !LessonStatus.REJECTED.equals(lesson.getStatus())) {
            throw new IllegalStateException("Only DRAFT or REJECTED lessons can be submitted for review. Current status: " + lesson.getStatus());
        }
        lesson.setStatus(LessonStatus.IN_REVIEW);
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson approve(UUID lessonId, String reviewerEmail, String comments) {
        Lesson lesson = requireInReview(lessonId);
        recordDecision(lesson, reviewerEmail, LessonStatus.APPROVED, comments);
        lesson.setStatus(LessonStatus.PUBLISHED);
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson reject(UUID lessonId, String reviewerEmail, String comments) {
        Lesson lesson = requireInReview(lessonId);
        recordDecision(lesson, reviewerEmail, LessonStatus.REJECTED, comments);
        lesson.setStatus(LessonStatus.REJECTED);
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson rollback(UUID lessonId, String reviewerEmail) {
        Lesson lesson = getLesson(lessonId);
        recordDecision(lesson, reviewerEmail, "ROLLBACK", "Reverted lesson to prior draft status for corrections");
        lesson.setStatus(LessonStatus.DRAFT);
        return lessonRepository.save(lesson);
    }

    public List<ContentReview> history(UUID lessonId) {
        return contentReviewRepository.findByLessonIdOrderByCreatedAtDesc(lessonId);
    }

    @Transactional(readOnly = true)
    public List<LessonQueueItemDto> listByStatus(String status) {
        return lessonRepository.findByStatusOrderByCreatedAtAsc(status).stream()
                .map(LessonQueueItemDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public LessonDetailDto getDetail(UUID lessonId) {
        return LessonDetailDto.from(getLesson(lessonId));
    }

    private Lesson requireInReview(UUID lessonId) {
        Lesson lesson = getLesson(lessonId);
        if (!LessonStatus.IN_REVIEW.equals(lesson.getStatus())) {
            throw new IllegalStateException("Lesson is not IN_REVIEW. Current status: " + lesson.getStatus());
        }
        return lesson;
    }

    private void recordDecision(Lesson lesson, String reviewerEmail, String decision, String comments) {
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new AccessDeniedException("Reviewer not found: " + reviewerEmail));

        ContentReview review = ContentReview.builder()
                .lesson(lesson)
                .reviewer(reviewer)
                .decision(decision)
                .comments(comments)
                .lessonVersionReviewed(lesson.getVersion())
                .build();
        contentReviewRepository.save(review);
    }

    private Lesson getLesson(UUID lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + lessonId));
    }
}
