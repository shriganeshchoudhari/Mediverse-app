package com.curiolearn.curriculum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

/** Row shape for the CMS review queue (GET /api/v1/cms/lessons?status=...). */
@Getter
@Builder
@AllArgsConstructor
public class LessonQueueItemDto {
    private UUID id;
    private String title;
    private String status;
    private int version;
    private LocalDateTime createdAt;
    private UUID conceptId;
    private String breadcrumb; // "Subject > Chapter > Topic > Concept"

    static LessonQueueItemDto from(Lesson lesson) {
        Concept concept = lesson.getConcept();
        Topic topic = concept != null ? concept.getTopic() : null;
        Chapter chapter = topic != null ? topic.getChapter() : null;
        Subject subject = null; // Unit -> Subject requires one more hop; resolved defensively below
        String breadcrumb;
        try {
            var unit = chapter != null ? chapter.getUnit() : null;
            subject = unit != null ? unit.getSubject() : null;
            breadcrumb = String.join(" > ",
                    subject != null ? subject.getTitle() : "?",
                    chapter != null ? chapter.getTitle() : "?",
                    topic != null ? topic.getTitle() : "?",
                    concept != null ? concept.getTitle() : "?");
        } catch (Exception e) {
            breadcrumb = concept != null ? concept.getTitle() : "Unknown";
        }

        return LessonQueueItemDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .status(lesson.getStatus())
                .version(lesson.getVersion())
                .createdAt(lesson.getCreatedAt())
                .conceptId(concept != null ? concept.getId() : null)
                .breadcrumb(breadcrumb)
                .build();
    }
}
