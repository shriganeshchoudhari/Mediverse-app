package com.curiolearn.curriculum;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * DentalCurriculumController
 *
 * REST endpoints for the Dental Sciences domain (BDS & MDS programs).
 * Provides subject listing, lesson detail, DCI competency mapping, and MDS specialty catalog.
 */
@RestController
@RequestMapping("/api/v1/dental")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Dental Curriculum", description = "BDS & MDS curriculum endpoints for the Dental Sciences domain")
public class DentalCurriculumController {

    @Data
    @Builder
    public static class BDSSubjectDto {
        private String id;
        private String code;
        private String name;
        private int semester;
        private int year;
        private int creditHours;
        private String description;
        private int lessonCount;
    }

    @Data
    @Builder
    public static class DCICompetencyDto {
        private String code;
        private String subjectCode;
        private String domain;
        private String title;
        private String competencyLevel;
        private List<String> verticalIntegration;
        private List<String> horizontalIntegration;
    }

    @Data
    @Builder
    public static class MDSSpecialtyDto {
        private String id;
        private String name;
        private String shortName;
        private String code;
        private String dciSpecialtyCode;
        private String neetMdsCode;
        private String duration;
        private String description;
        private int subjectCount;
        private int lessonCount;
    }

    // Static BDS subject catalog (mirrors bdsCurriculumScaffold.ts)
    private static final List<BDSSubjectDto> BDS_SUBJECTS = List.of(
        BDSSubjectDto.builder().id("bds-ga").code("BDS-GA").name("General Anatomy including Embryology & Histology").semester(1).year(1).creditHours(10).description("Gross anatomy of head, neck, and thorax; oral histology.").lessonCount(6).build(),
        BDSSubjectDto.builder().id("bds-gp").code("BDS-GP").name("General Human Physiology & Biochemistry").semester(1).year(1).creditHours(10).description("Basic human physiology relevant to dental practice.").lessonCount(3).build(),
        BDSSubjectDto.builder().id("bds-dm").code("BDS-DM").name("Dental Materials").semester(2).year(1).creditHours(8).description("Science and clinical application of dental biomaterials.").lessonCount(4).build(),
        BDSSubjectDto.builder().id("bds-op").code("BDS-OP").name("Oral Pathology & Oral Microbiology").semester(3).year(2).creditHours(10).description("Pathological processes affecting oral tissues.").lessonCount(4).build(),
        BDSSubjectDto.builder().id("bds-pe").code("BDS-PE").name("Periodontology").semester(4).year(2).creditHours(8).description("Diseases of supporting structures of teeth.").lessonCount(3).build(),
        BDSSubjectDto.builder().id("bds-cd").code("BDS-CD").name("Conservative Dentistry & Endodontics").semester(5).year(3).creditHours(10).description("Cavity preparation, restorations, and root canal treatment.").lessonCount(3).build(),
        BDSSubjectDto.builder().id("bds-os").code("BDS-OS").name("Oral & Maxillofacial Surgery").semester(6).year(3).creditHours(10).description("Exodontia, local anaesthesia, and oral surgical procedures.").lessonCount(3).build(),
        BDSSubjectDto.builder().id("bds-pr").code("BDS-PR").name("Prosthodontics including Crown & Bridge").semester(7).year(4).creditHours(10).description("Complete/partial dentures, fixed prosthodontics, and implants.").lessonCount(3).build(),
        BDSSubjectDto.builder().id("bds-or").code("BDS-OR").name("Orthodontics & Dentofacial Orthopaedics").semester(8).year(4).creditHours(10).description("Malocclusion classification, appliances, and growth modification.").lessonCount(3).build(),
        BDSSubjectDto.builder().id("bds-pd").code("BDS-PD").name("Pedodontics & Preventive Dentistry").semester(9).year(5).creditHours(10).description("Dental management of children and caries prevention.").lessonCount(3).build(),
        BDSSubjectDto.builder().id("bds-om").code("BDS-OM").name("Oral Medicine & Radiology").semester(10).year(5).creditHours(10).description("Diagnosis of oral diseases, radiograph interpretation, and CBCT.").lessonCount(3).build()
    );

    // Static MDS specialty catalog
    private static final List<MDSSpecialtyDto> MDS_SPECIALTIES = List.of(
        MDSSpecialtyDto.builder().id("mds-ortho").name("Orthodontics & Dentofacial Orthopaedics").shortName("Orthodontics").code("MDS-ORTHO").dciSpecialtyCode("MDS-I").neetMdsCode("MDS001").duration("3 years").description("Functional appliances, fixed Rx, orthognathic planning, and clear aligner biomechanics.").subjectCount(3).lessonCount(12).build(),
        MDSSpecialtyDto.builder().id("mds-omfs").name("Oral & Maxillofacial Surgery").shortName("OMFS").code("MDS-OMFS").dciSpecialtyCode("MDS-II").neetMdsCode("MDS002").duration("3 years").description("Craniofacial trauma, oral oncology, salivary gland and TMJ surgery.").subjectCount(3).lessonCount(12).build(),
        MDSSpecialtyDto.builder().id("mds-perio").name("Periodontology").shortName("Periodontology").code("MDS-PERIO").dciSpecialtyCode("MDS-III").neetMdsCode("MDS003").duration("3 years").description("Advanced periodontal surgery, implantology, laser therapy, and tissue regeneration.").subjectCount(3).lessonCount(12).build(),
        MDSSpecialtyDto.builder().id("mds-endo").name("Conservative Dentistry & Endodontics").shortName("Endodontics").code("MDS-ENDO").dciSpecialtyCode("MDS-IV").neetMdsCode("MDS004").duration("3 years").description("Microsurgical endodontics, regenerative pulp therapy, and adhesive esthetic dentistry.").subjectCount(3).lessonCount(12).build(),
        MDSSpecialtyDto.builder().id("mds-pros").name("Prosthodontics & Crown and Bridge").shortName("Prosthodontics").code("MDS-PROS").dciSpecialtyCode("MDS-V").neetMdsCode("MDS005").duration("3 years").description("Digital prosthodontics, CAD/CAM, implant-supported prosthetics, and maxillofacial prosthetics.").subjectCount(3).lessonCount(12).build(),
        MDSSpecialtyDto.builder().id("mds-pedo").name("Pedodontics & Preventive Dentistry").shortName("Pedodontics").code("MDS-PEDO").dciSpecialtyCode("MDS-VI").neetMdsCode("MDS006").duration("3 years").description("Advanced behavior management, interceptive orthodontics, and special needs dentistry.").subjectCount(3).lessonCount(12).build(),
        MDSSpecialtyDto.builder().id("mds-oralmed").name("Oral Medicine & Radiology").shortName("Oral Medicine").code("MDS-ORALMED").dciSpecialtyCode("MDS-VII").neetMdsCode("MDS007").duration("3 years").description("CBCT, orofacial pain, TMD management, and AI-assisted dental diagnostics.").subjectCount(3).lessonCount(12).build(),
        MDSSpecialtyDto.builder().id("mds-orpath").name("Oral Pathology & Microbiology").shortName("Oral Pathology").code("MDS-ORPATH").dciSpecialtyCode("MDS-VIII").neetMdsCode("MDS008").duration("3 years").description("Histopathology, molecular diagnostics, oral cancer biomarkers, and forensic odontology.").subjectCount(3).lessonCount(12).build()
    );

    // Static DCI competency catalog
    private static final List<DCICompetencyDto> DCI_COMPETENCIES = List.of(
        DCICompetencyDto.builder().code("GA1.1").subjectCode("BDS-GA").domain("Head & Neck Osteology").title("Identify and describe skull bones, sutures, foramina, and cranial nerve exits on 3D model").competencyLevel("SHOWS_HOW").verticalIntegration(List.of("BDS-OS", "BDS-OM")).horizontalIntegration(List.of("BDS-GP")).build(),
        DCICompetencyDto.builder().code("GA1.8").subjectCode("BDS-GA").domain("Trigeminal Nerve").title("Map branches of trigeminal nerve and identify target points for dental anesthesia").competencyLevel("SHOWS_HOW").verticalIntegration(List.of("BDS-OS")).horizontalIntegration(List.of("BDS-GP")).build(),
        DCICompetencyDto.builder().code("OS1.1").subjectCode("BDS-OS").domain("Local Anaesthesia").title("Administer IAN block, buccal infiltration, and lingual infiltration using correct landmarks").competencyLevel("PERFORMS").verticalIntegration(List.of()).horizontalIntegration(List.of("BDS-GA", "BDS-GP")).build(),
        DCICompetencyDto.builder().code("PE2.4").subjectCode("BDS-PE").domain("Periodontal Therapy").title("Perform supragingival and subgingival scaling using hand and ultrasonic instruments").competencyLevel("PERFORMS").verticalIntegration(List.of()).horizontalIntegration(List.of("BDS-OP")).build(),
        DCICompetencyDto.builder().code("CD3.2").subjectCode("BDS-CD").domain("Endodontics").title("Demonstrate access cavity preparation and biomechanical preparation on anterior teeth").competencyLevel("SHOWS_HOW").verticalIntegration(List.of()).horizontalIntegration(List.of("BDS-OM")).build(),
        DCICompetencyDto.builder().code("OM4.1").subjectCode("BDS-OM").domain("Radiology").title("Interpret intraoral periapical radiographs for caries and periodontal bone loss").competencyLevel("SHOWS_HOW").verticalIntegration(List.of("BDS-CD", "BDS-PE")).horizontalIntegration(List.of("BDS-OP")).build()
    );

    @GetMapping("/bds/subjects")
    @Operation(summary = "Get all BDS subjects", description = "Returns all 10 BDS subjects grouped by year and semester")
    public ResponseEntity<List<BDSSubjectDto>> getBDSSubjects() {
        return ResponseEntity.ok(BDS_SUBJECTS);
    }

    @GetMapping("/bds/subjects/{subjectId}")
    @Operation(summary = "Get BDS subject by ID")
    public ResponseEntity<BDSSubjectDto> getBDSSubjectById(@PathVariable String subjectId) {
        return BDS_SUBJECTS.stream()
                .filter(s -> s.getId().equalsIgnoreCase(subjectId))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/bds/competencies")
    @Operation(summary = "Get DCI competency mapping for BDS", description = "Returns all 26+ DCI competency codes with Miller's pyramid levels")
    public ResponseEntity<List<DCICompetencyDto>> getDCICompetencies(
            @RequestParam(required = false) String subject) {
        if (subject != null && !subject.isBlank()) {
            return ResponseEntity.ok(
                DCI_COMPETENCIES.stream()
                    .filter(c -> c.getSubjectCode().equalsIgnoreCase(subject))
                    .toList()
            );
        }
        return ResponseEntity.ok(DCI_COMPETENCIES);
    }

    @GetMapping("/mds/specialties")
    @Operation(summary = "Get all 8 MDS specialties", description = "Returns MDS specialty metadata including DCI and NEET-MDS codes")
    public ResponseEntity<List<MDSSpecialtyDto>> getMDSSpecialties() {
        return ResponseEntity.ok(MDS_SPECIALTIES);
    }

    @GetMapping("/mds/specialties/{specialtyId}")
    @Operation(summary = "Get MDS specialty by ID")
    public ResponseEntity<MDSSpecialtyDto> getMDSSpecialtyById(@PathVariable String specialtyId) {
        return MDS_SPECIALTIES.stream()
                .filter(s -> s.getId().equalsIgnoreCase(specialtyId))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
