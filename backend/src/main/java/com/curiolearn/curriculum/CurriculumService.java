package com.curiolearn.curriculum;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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
}

