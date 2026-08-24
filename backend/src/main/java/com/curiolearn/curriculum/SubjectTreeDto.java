package com.curiolearn.curriculum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectTreeDto {
    private UUID id;
    private String title;
    private String code;
    private String category;
    private List<UnitTreeDto> units;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnitTreeDto {
        private UUID id;
        private String title;
        private Integer sortOrder;
        private List<ChapterTreeDto> chapters;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChapterTreeDto {
        private UUID id;
        private String title;
        private Integer sortOrder;
        private List<TopicTreeDto> topics;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicTreeDto {
        private UUID id;
        private String title;
        private Integer sortOrder;
        private List<ConceptTreeDto> concepts;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConceptTreeDto {
        private UUID id;
        private String title;
        private Integer sortOrder;
        private Lesson lesson;
    }
}
