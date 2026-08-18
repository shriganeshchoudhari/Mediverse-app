package com.curiolearn.curriculum;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/** Full lesson detail for the CMS review screen, including content blocks and breadcrumb. */
@Getter
@Builder
public class LessonDetailDto {
    private UUID id;
    private String title;
    private String status;
    private int version;
    private LocalDateTime createdAt;
    private String breadcrumb;
    private List<ContentBlock> contentBlocks;

    static LessonDetailDto from(Lesson lesson) {
        LessonQueueItemDto queueItem = LessonQueueItemDto.from(lesson);
        return LessonDetailDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .status(lesson.getStatus())
                .version(lesson.getVersion())
                .createdAt(lesson.getCreatedAt())
                .breadcrumb(queueItem.getBreadcrumb())
                .contentBlocks(lesson.getContentBlocks())
                .build();
    }
}
