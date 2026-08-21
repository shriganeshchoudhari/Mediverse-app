package com.curiolearn.curriculum;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/veterinary")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Veterinary Curriculum", description = "Endpoints for BVSc & MVSc curriculum, competencies, and skills")
public class VeterinaryCurriculumController {

    @Data
    @Builder
    public static class BVSCLessonDto {
        private String id;
        private String title;
        private String vciCode;
        private int year;
        private boolean hasSimulation;
        private boolean isHighTech;
        private String description;
    }

    @Data
    @Builder
    public static class BVSCSubjectDto {
        private String id;
        private String name;
        private String code;
        private int year;
        private int creditHours;
        private String description;
        private List<BVSCLessonDto> lessons;
    }

    @Data
    @Builder
    public static class BVSCYearDto {
        private int year;
        private String title;
        private List<BVSCSubjectDto> subjects;
    }

    @Data
    @Builder
    public static class MVSCCourseDto {
        private String id;
        private String title;
        private int creditHours;
    }

    @Data
    @Builder
    public static class MVSCSpecialtyDto {
        private String id;
        private String name;
        private String description;
        private String duration;
        private List<MVSCCourseDto> courses;
    }

    @Data
    @Builder
    public static class CompetencyDto {
        private String id;
        private String code;
        private String description;
        private String subject;
        private String level;
        private boolean integrated;
    }

    @Data
    @Builder
    public static class SkillDto {
        private String id;
        private String name;
        private String category;
        private boolean simulationAvailable;
    }

    private static final List<BVSCYearDto> BVSC_CURRICULUM = new ArrayList<>();
    private static final List<MVSCSpecialtyDto> MVSC_CURRICULUM = new ArrayList<>();
    private static final List<CompetencyDto> COMPETENCIES = new ArrayList<>();
    private static final List<SkillDto> SKILLS = new ArrayList<>();

    static {
        // Initialize dummy data similar to the TS scaffold
        BVSC_CURRICULUM.add(BVSCYearDto.builder()
                .year(1)
                .title("First Professional Year")
                .subjects(List.of(
                        BVSCSubjectDto.builder()
                                .id("vet-van")
                                .name("Veterinary Anatomy & Histology")
                                .code("VET-VAN")
                                .year(1)
                                .creditHours(4)
                                .description("Gross anatomy, histology, and embryology of domestic animals.")
                                .lessons(List.of())
                                .build()
                ))
                .build());

        MVSC_CURRICULUM.add(MVSCSpecialtyDto.builder()
                .id("mvsc-surg")
                .name("Veterinary Surgery & Radiology")
                .description("Advanced surgical techniques, orthopedics, and advanced imaging modalities.")
                .duration("2 years")
                .courses(List.of(
                        MVSCCourseDto.builder().id("surg-1").title("Advanced Soft Tissue Surgery").creditHours(3).build()
                ))
                .build());

        COMPETENCIES.add(CompetencyDto.builder()
                .id("1")
                .code("VAN-101.1")
                .description("Describe the osteology of the forelimb.")
                .subject("VET-VAN")
                .level("KNOWS")
                .integrated(false)
                .build());

        SKILLS.add(SkillDto.builder()
                .id("1")
                .name("Endotracheal Intubation")
                .category("Surgery")
                .simulationAvailable(true)
                .build());
    }

    @GetMapping("/bvsc/subjects")
    @Operation(summary = "Get full BVSc curriculum", description = "Returns all years, subjects, and lessons for BVSc")
    public ResponseEntity<List<BVSCYearDto>> getBVSCCurriculum() {
        return ResponseEntity.ok(BVSC_CURRICULUM);
    }

    @GetMapping("/bvsc/subjects/{id}")
    @Operation(summary = "Get BVSc subject by ID", description = "Returns specific subject details and lessons")
    public ResponseEntity<BVSCSubjectDto> getBVSCSubjectById(@PathVariable String id) {
        for (BVSCYearDto year : BVSC_CURRICULUM) {
            for (BVSCSubjectDto subject : year.getSubjects()) {
                if (subject.getId().equalsIgnoreCase(id)) {
                    return ResponseEntity.ok(subject);
                }
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/mvsc/specialties")
    @Operation(summary = "Get MVSc specialties", description = "Returns all MVSc postgraduate specialties and their courses")
    public ResponseEntity<List<MVSCSpecialtyDto>> getMVSCSpecialties() {
        return ResponseEntity.ok(MVSC_CURRICULUM);
    }

    @GetMapping("/competencies")
    @Operation(summary = "Get all VCI competencies", description = "Returns all mapped competencies for the VCI curriculum")
    public ResponseEntity<List<CompetencyDto>> getCompetencies() {
        return ResponseEntity.ok(COMPETENCIES);
    }

    @GetMapping("/skills")
    @Operation(summary = "Get all veterinary clinical skills", description = "Returns list of clinical skills and simulation availability")
    public ResponseEntity<List<SkillDto>> getSkills() {
        return ResponseEntity.ok(SKILLS);
    }
}
