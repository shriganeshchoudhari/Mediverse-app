package com.curiolearn.curriculum;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/curriculum")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CurriculumController {

    private final CurriculumService curriculumService;

    @GetMapping("/{code}")
    public ResponseEntity<Curriculum> getCurriculum(@PathVariable String code) {
        return curriculumService.getCurriculumByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{curriculumId}/years")
    public ResponseEntity<List<CurriculumYear>> getYears(@PathVariable UUID curriculumId) {
        return ResponseEntity.ok(curriculumService.getYears(curriculumId));
    }

    @GetMapping("/years/{yearId}/semesters")
    public ResponseEntity<List<Semester>> getSemesters(@PathVariable UUID yearId) {
        return ResponseEntity.ok(curriculumService.getSemesters(yearId));
    }

    @GetMapping("/semesters/{semesterId}/subjects")
    public ResponseEntity<List<Subject>> getSubjects(@PathVariable UUID semesterId) {
        return ResponseEntity.ok(curriculumService.getSubjects(semesterId));
    }

    @GetMapping("/subjects/{subjectId}/units")
    public ResponseEntity<List<Unit>> getUnits(@PathVariable UUID subjectId) {
        return ResponseEntity.ok(curriculumService.getUnits(subjectId));
    }

    @GetMapping("/units/{unitId}/chapters")
    public ResponseEntity<List<Chapter>> getChapters(@PathVariable UUID unitId) {
        return ResponseEntity.ok(curriculumService.getChapters(unitId));
    }

    @GetMapping("/chapters/{chapterId}/topics")
    public ResponseEntity<List<Topic>> getTopics(@PathVariable UUID chapterId) {
        return ResponseEntity.ok(curriculumService.getTopics(chapterId));
    }

    @GetMapping("/topics/{topicId}/concepts")
    public ResponseEntity<List<Concept>> getConcepts(@PathVariable UUID topicId) {
        return ResponseEntity.ok(curriculumService.getConcepts(topicId));
    }

    @GetMapping("/concepts/{conceptId}/learning-objects")
    public ResponseEntity<List<LearningObject>> getLearningObjects(@PathVariable UUID conceptId) {
        return ResponseEntity.ok(curriculumService.getLearningObjects(conceptId));
    }

    @GetMapping("/chapters/{chapterId}")
    public ResponseEntity<Chapter> getChapter(@PathVariable UUID chapterId) {
        return curriculumService.getChapter(chapterId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/concepts/{conceptId}/lesson")
    public ResponseEntity<Lesson> getLesson(@PathVariable UUID conceptId) {
        return curriculumService.getLessonByConceptId(conceptId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/concepts/{conceptId}/clinical-cases")
    public ResponseEntity<List<ClinicalCase>> getClinicalCases(@PathVariable UUID conceptId) {
        return ResponseEntity.ok(curriculumService.getClinicalCases(conceptId));
    }

    @GetMapping("/concepts/{conceptId}/references")
    public ResponseEntity<List<Reference>> getReferences(@PathVariable UUID conceptId) {
        return ResponseEntity.ok(curriculumService.getReferences(conceptId));
    }
}

