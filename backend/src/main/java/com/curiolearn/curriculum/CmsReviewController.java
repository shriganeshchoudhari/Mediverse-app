package com.curiolearn.curriculum;

import com.curiolearn.user.Roles;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * CMS content-review workflow endpoints.
 * Authoring (submit for review) is restricted to Roles.CONTENT_AUTHORS;
 * approve/reject is restricted to Roles.CONTENT_REVIEWERS.
 */
@RestController
@RequestMapping("/api/v1/cms/lessons")
public class CmsReviewController {

    private final CmsReviewService cmsReviewService;

    public CmsReviewController(CmsReviewService cmsReviewService) {
        this.cmsReviewService = cmsReviewService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','CONTENT_WRITER','MEDICAL_REVIEWER','EDITOR')")
    public ResponseEntity<List<LessonQueueItemDto>> listByStatus(
            @RequestParam(defaultValue = "IN_REVIEW") String status) {
        return ResponseEntity.ok(cmsReviewService.listByStatus(status));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','CONTENT_WRITER')")
    public ResponseEntity<Lesson> createLesson(@RequestBody CreateLessonRequestDto request) {
        return ResponseEntity.ok(cmsReviewService.createLesson(request));
    }

    @GetMapping("/{lessonId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','CONTENT_WRITER','MEDICAL_REVIEWER','EDITOR')")
    public ResponseEntity<LessonDetailDto> getDetail(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(cmsReviewService.getDetail(lessonId));
    }

    @PostMapping("/{lessonId}/submit-for-review")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','CONTENT_WRITER')")
    public ResponseEntity<Lesson> submitForReview(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(cmsReviewService.submitForReview(lessonId));
    }

    @PostMapping("/{lessonId}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','MEDICAL_REVIEWER','EDITOR')")
    public ResponseEntity<Lesson> approve(
            @PathVariable UUID lessonId,
            @RequestBody(required = false) ReviewDecisionRequest request,
            @AuthenticationPrincipal UserDetails reviewer) {
        String comments = request != null ? request.getComments() : null;
        return ResponseEntity.ok(cmsReviewService.approve(lessonId, reviewer.getUsername(), comments));
    }

    @PostMapping("/{lessonId}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','MEDICAL_REVIEWER','EDITOR')")
    public ResponseEntity<Lesson> reject(
            @PathVariable UUID lessonId,
            @RequestBody(required = false) ReviewDecisionRequest request,
            @AuthenticationPrincipal UserDetails reviewer) {
        String comments = request != null ? request.getComments() : null;
        return ResponseEntity.ok(cmsReviewService.reject(lessonId, reviewer.getUsername(), comments));
    }

    @PostMapping("/{lessonId}/rollback")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','MEDICAL_REVIEWER','EDITOR')")
    public ResponseEntity<Lesson> rollback(
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal UserDetails reviewer) {
        return ResponseEntity.ok(cmsReviewService.rollback(lessonId, reviewer.getUsername()));
    }

    @GetMapping("/{lessonId}/history")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','CONTENT_WRITER','MEDICAL_REVIEWER','EDITOR')")
    public ResponseEntity<List<ContentReview>> history(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(cmsReviewService.history(lessonId));
    }
}
