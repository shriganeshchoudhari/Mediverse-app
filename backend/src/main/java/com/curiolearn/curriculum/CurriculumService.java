package com.curiolearn.curriculum;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CurriculumService {

    private final CurriculumRepository curriculumRepository;
    private final CurriculumYearRepository curriculumYearRepository;
    private final SemesterRepository semesterRepository;
    private final SubjectRepository subjectRepository;
    private final UnitRepository unitRepository;
    private final ChapterRepository chapterRepository;
    private final TopicRepository topicRepository;
    private final ConceptRepository conceptRepository;
    private final LearningObjectRepository learningObjectRepository;
    private final LessonRepository lessonRepository;
    private final ClinicalCaseRepository clinicalCaseRepository;
    private final ReferenceRepository referenceRepository;

    public Optional<Curriculum> getCurriculumByCode(String code) {
        return curriculumRepository.findByCode(code);
    }

    public List<CurriculumYear> getYears(UUID curriculumId) {
        return curriculumYearRepository.findByCurriculumId(curriculumId);
    }

    public List<Semester> getSemesters(UUID yearId) {
        return semesterRepository.findByYearId(yearId);
    }

    public List<Subject> getSubjects(UUID semesterId) {
        return subjectRepository.findBySemesterId(semesterId);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public List<Unit> getUnits(UUID subjectId) {
        return unitRepository.findBySubjectIdOrderBySortOrderAsc(subjectId);
    }

    public List<Chapter> getChapters(UUID unitId) {
        return chapterRepository.findByUnitIdOrderBySortOrderAsc(unitId);
    }

    public List<Topic> getTopics(UUID chapterId) {
        return topicRepository.findByChapterIdOrderBySortOrderAsc(chapterId);
    }

    public List<Concept> getConcepts(UUID topicId) {
        return conceptRepository.findByTopicIdOrderBySortOrderAsc(topicId);
    }

    public List<LearningObject> getLearningObjects(UUID conceptId) {
        return learningObjectRepository.findByConceptIdOrderBySortOrderAsc(conceptId);
    }

    public Optional<Chapter> getChapter(UUID chapterId) {
        return chapterRepository.findById(chapterId);
    }

    public Optional<Lesson> getLessonByConceptId(UUID conceptId) {
        return lessonRepository.findByConceptId(conceptId);
    }

    public List<ClinicalCase> getClinicalCases(UUID conceptId) {
        return clinicalCaseRepository.findByConceptId(conceptId);
    }

    public List<Reference> getReferences(UUID conceptId) {
        return referenceRepository.findByConceptId(conceptId);
    }

    public Optional<SubjectTreeDto> getSubjectTreeByCode(String code) {
        return subjectRepository.findByCodeIgnoreCase(code)
                .or(() -> subjectRepository.findByTitleIgnoreCase(code))
                .map(this::buildSubjectTree);
    }

    public Optional<SubjectTreeDto> getSubjectTreeById(UUID subjectId) {
        return subjectRepository.findById(subjectId)
                .map(this::buildSubjectTree);
    }

    private SubjectTreeDto buildSubjectTree(Subject subject) {
        List<Unit> units = unitRepository.findBySubjectIdOrderBySortOrderAsc(subject.getId());
        if (units.isEmpty()) {
            return SubjectTreeDto.builder()
                    .id(subject.getId())
                    .title(subject.getTitle())
                    .code(subject.getCode())
                    .category(subject.getCategory())
                    .units(Collections.emptyList())
                    .build();
        }

        List<UUID> unitIds = units.stream().map(Unit::getId).toList();
        List<Chapter> allChapters = chapterRepository.findByUnitIdInOrderBySortOrderAsc(unitIds);
        Map<UUID, List<Chapter>> chaptersByUnit = allChapters.stream()
                .collect(Collectors.groupingBy(c -> c.getUnit().getId()));

        List<UUID> chapterIds = allChapters.stream().map(Chapter::getId).toList();
        List<Topic> allTopics = chapterIds.isEmpty() ? Collections.emptyList() : topicRepository.findByChapterIdInOrderBySortOrderAsc(chapterIds);
        Map<UUID, List<Topic>> topicsByChapter = allTopics.stream()
                .collect(Collectors.groupingBy(t -> t.getChapter().getId()));

        List<UUID> topicIds = allTopics.stream().map(Topic::getId).toList();
        List<Concept> allConcepts = topicIds.isEmpty() ? Collections.emptyList() : conceptRepository.findByTopicIdInOrderBySortOrderAsc(topicIds);
        Map<UUID, List<Concept>> conceptsByTopic = allConcepts.stream()
                .collect(Collectors.groupingBy(c -> c.getTopic().getId()));

        List<UUID> conceptIds = allConcepts.stream().map(Concept::getId).toList();
        List<Lesson> allLessons = conceptIds.isEmpty() ? Collections.emptyList() : lessonRepository.findByConceptIdIn(conceptIds);
        Map<UUID, Lesson> lessonByConcept = allLessons.stream()
                .filter(l -> l.getConcept() != null)
                .collect(Collectors.toMap(l -> l.getConcept().getId(), l -> l, (existing, replacement) -> existing));

        List<SubjectTreeDto.UnitTreeDto> unitDtos = new ArrayList<>();

        for (Unit unit : units) {
            List<Chapter> chapters = chaptersByUnit.getOrDefault(unit.getId(), Collections.emptyList());
            List<SubjectTreeDto.ChapterTreeDto> chapterDtos = new ArrayList<>();

            for (Chapter chapter : chapters) {
                List<Topic> topics = topicsByChapter.getOrDefault(chapter.getId(), Collections.emptyList());
                List<SubjectTreeDto.TopicTreeDto> topicDtos = new ArrayList<>();

                for (Topic topic : topics) {
                    List<Concept> concepts = conceptsByTopic.getOrDefault(topic.getId(), Collections.emptyList());
                    List<SubjectTreeDto.ConceptTreeDto> conceptDtos = new ArrayList<>();

                    for (Concept concept : concepts) {
                        Lesson lesson = lessonByConcept.get(concept.getId());
                        conceptDtos.add(SubjectTreeDto.ConceptTreeDto.builder()
                                .id(concept.getId())
                                .title(concept.getTitle())
                                .sortOrder(concept.getSortOrder())
                                .lesson(lesson)
                                .build());
                    }

                    topicDtos.add(SubjectTreeDto.TopicTreeDto.builder()
                            .id(topic.getId())
                            .title(topic.getTitle())
                            .sortOrder(topic.getSortOrder())
                            .concepts(conceptDtos)
                            .build());
                }

                chapterDtos.add(SubjectTreeDto.ChapterTreeDto.builder()
                        .id(chapter.getId())
                        .title(chapter.getTitle())
                        .sortOrder(chapter.getSortOrder())
                        .topics(topicDtos)
                        .build());
            }

            unitDtos.add(SubjectTreeDto.UnitTreeDto.builder()
                    .id(unit.getId())
                    .title(unit.getTitle())
                    .sortOrder(unit.getSortOrder())
                    .chapters(chapterDtos)
                    .build());
        }

        return SubjectTreeDto.builder()
                .id(subject.getId())
                .title(subject.getTitle())
                .code(subject.getCode())
                .category(subject.getCategory())
                .units(unitDtos)
                .build();
    }
}


