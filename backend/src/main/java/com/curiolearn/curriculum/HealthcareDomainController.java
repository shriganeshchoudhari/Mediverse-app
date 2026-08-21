package com.curiolearn.curriculum;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * HealthcareDomainController
 *
 * Exposes REST endpoints for the 9-Domain Healthcare Education Landscape.
 * Provides metadata, program details, tier classifications, and curriculum statistics.
 */
@RestController
@RequestMapping("/api/v1/healthcare")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Healthcare Landscape", description = "Endpoints for the 9-Domain Healthcare Education Landscape")
public class HealthcareDomainController {

    @Data
    @Builder
    public static class ProgramDto {
        private String id;
        private String name;
        private String fullName;
        private String duration;
        private String description;
        private String regulatoryBody;
        private String competencyPrefix;
        private String routePath;
        private boolean available;
    }

    @Data
    @Builder
    public static class DomainDto {
        private String id;
        private String name;
        private String shortName;
        private String icon;
        private String color;
        private String accentColor;
        private String description;
        private String longDescription;
        private int tier;
        private String routePath;
        private int lessonCount;
        private List<String> keyHighlights;
        private List<ProgramDto> programs;
    }

    private static final List<DomainDto> DOMAINS = new ArrayList<>();

    static {
        // Domain 1: Allopathic
        DOMAINS.add(DomainDto.builder()
                .id("allopathic")
                .name("Allopathic Medicine & Super-Specialties")
                .shortName("Allopathic")
                .icon("🩺")
                .color("#3B82F6")
                .accentColor("#1D4ED8")
                .description("MBBS, MD, MS, DM, MCh — evidence-based medicine across 19 core disciplines and 12 PG residency tracks.")
                .longDescription("The foundation of modern medicine covering preclinical, paraclinical, and clinical rotations to super-specialty residency tracks.")
                .tier(1)
                .routePath("/healthcare/allopathic")
                .lessonCount(620)
                .keyHighlights(List.of(
                        "3D Multi-Organ WebGL Dissection",
                        "Cardiac PV-Loop & Acid-Base Solvers",
                        "NMC CBME Vignette Exam Runner",
                        "12 Postgraduate Residency Tracks",
                        "Socratic AI Tutor with KaTeX"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("mbbs")
                                .name("MBBS")
                                .fullName("Bachelor of Medicine, Bachelor of Surgery")
                                .duration("5.5 years")
                                .description("19 core disciplines across 9 semesters with NMC CBME curriculum.")
                                .regulatoryBody("NMC (National Medical Commission)")
                                .competencyPrefix("PY / AN / BI / PA / MI / PH / FM / CM")
                                .routePath("/subjects")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("md-ms")
                                .name("MD / MS")
                                .fullName("Doctor of Medicine / Master of Surgery")
                                .duration("3 years")
                                .description("Postgraduate residency across 12 super-specialties.")
                                .regulatoryBody("NMC")
                                .competencyPrefix("PG")
                                .routePath("/healthcare/allopathic")
                                .available(true)
                                .build()
                ))
                .build());

        // Domain 2: Dental
        DOMAINS.add(DomainDto.builder()
                .id("dental")
                .name("Dental Sciences")
                .shortName("Dental")
                .icon("🦷")
                .color("#10B981")
                .accentColor("#059669")
                .description("BDS, MDS — Oral anatomy, maxillofacial surgery, orthodontics, periodontics with 3D tooth morphology.")
                .longDescription("Bachelor of Dental Surgery programs covering the full spectrum of oral health sciences and nerve block simulation.")
                .tier(1)
                .routePath("/healthcare/dental")
                .lessonCount(80)
                .keyHighlights(List.of(
                        "3D Maxillofacial Anatomy & Tooth Morphology",
                        "Nerve Block Simulation (IAN, Mental, Infraorbital)",
                        "Orthodontic Force System Visualizer",
                        "DCI Competency-Mapped Modules",
                        "Dental Materials Property Charts"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("bds")
                                .name("BDS")
                                .fullName("Bachelor of Dental Surgery")
                                .duration("5 years")
                                .description("10-semester program covering oral anatomy, dental materials, oral pathology, periodontology, and oral surgery.")
                                .regulatoryBody("DCI (Dental Council of India)")
                                .competencyPrefix("BDS")
                                .routePath("/healthcare/dental/bds")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("mds")
                                .name("MDS")
                                .fullName("Master of Dental Surgery")
                                .duration("3 years")
                                .description("Postgraduate specialization across 8 DCI-recognized specialties including Orthodontics, OMFS, Periodontology, Endodontics, Prosthodontics, Pedodontics, Oral Medicine & Oral Pathology.")
                                .regulatoryBody("DCI (Dental Council of India)")
                                .competencyPrefix("MDS")
                                .routePath("/healthcare/dental/mds")
                                .available(true)
                                .build()
                ))
                .build());

        // Domain 3: AYUSH
        DOMAINS.add(DomainDto.builder()
                .id("ayush")
                .name("AYUSH Traditional & Integrative Systems")
                .shortName("AYUSH")
                .icon("🌿")
                .color("#F59E0B")
                .accentColor("#D97706")
                .description("BAMS, BHMS, BUMS, BNYS — Ayurveda, Homeopathy with 3D 107 Marma Point map and Tridosha-ANS correlation.")
                .longDescription("The AYUSH systems of traditional medicine featuring the iconic 3D 107 Marma Points interactive map and CCIM competency mapping.")
                .tier(1)
                .routePath("/healthcare/ayush")
                .lessonCount(90)
                .keyHighlights(List.of(
                        "3D 107 Marma Points Interactive Map",
                        "Tridosha–ANS Correlation Modules",
                        "Panchakarma Procedure Guides",
                        "Dravyaguna Herb-Drug Interaction Charts",
                        "CCIM Competency Mapping"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("bams")
                                .name("BAMS")
                                .fullName("Bachelor of Ayurvedic Medicine & Surgery")
                                .duration("5.5 years")
                                .description("Samhita Sanskrit, Kriya Sharira, Rachana Sharira with 107 Marma Points, Dravyaguna, and Shalya Tantra.")
                                .regulatoryBody("CCIM (Central Council of Indian Medicine)")
                                .competencyPrefix("BAMS")
                                .routePath("/healthcare/ayush/bams")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("md-ayurveda")
                                .name("MD/MS Ayurveda")
                                .fullName("Doctor of Medicine / Master of Surgery in Ayurveda")
                                .duration("3 years")
                                .description("Postgraduate degree in Ayurvedic specialties.")
                                .regulatoryBody("CCIM")
                                .competencyPrefix("MD-AYU")
                                .routePath("/healthcare/ayush/md-ayurveda")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("bhms")
                                .name("BHMS")
                                .fullName("Bachelor of Homeopathic Medicine & Surgery")
                                .duration("5.5 years")
                                .description("Homeopathic Materia Medica, Organon of Medicine, Repertory, and clinical case-taking modules.")
                                .regulatoryBody("CCH (Central Council of Homeopathy)")
                                .competencyPrefix("BHMS")
                                .routePath("/healthcare/ayush/bhms")
                                .available(true)
                                .build()
                ))
                .build());

        // Domain 4: Pharmacy
        DOMAINS.add(DomainDto.builder()
                .id("pharmacy")
                .name("Pharmacy & Clinical Pharmacotherapy")
                .shortName("Pharmacy")
                .icon("💊")
                .color("#8B5CF6")
                .accentColor("#7C3AED")
                .description("Pharm.D, B.Pharm, M.Pharm — Clinical pharmacokinetics, therapeutic drug monitoring, and pharmacovigilance.")
                .longDescription("Pharmaceutical sciences through clinical pharmacy practice and therapeutic drug monitoring.")
                .tier(1)
                .routePath("/healthcare/pharmacy")
                .lessonCount(60)
                .keyHighlights(List.of(
                        "Pharmacokinetics PK/PD Simulation",
                        "Therapeutic Drug Monitoring Dashboard",
                        "Drug–Drug Interaction Checker",
                        "Pharmacovigilance Case Reports"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("pharmd")
                                .name("Pharm.D")
                                .fullName("Doctor of Pharmacy")
                                .duration("6 years")
                                .description("Clinical pharmacy practice with hospital rotations.")
                                .regulatoryBody("PCI (Pharmacy Council of India)")
                                .competencyPrefix("PHARMD")
                                .routePath("/healthcare/pharmacy/pharmd")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("bpharm")
                                .name("B.Pharm")
                                .fullName("Bachelor of Pharmacy")
                                .duration("4 years")
                                .description("Pharmaceutical chemistry, pharmacognosy, pharmaceutics.")
                                .regulatoryBody("PCI")
                                .competencyPrefix("BPHARM")
                                .routePath("/healthcare/pharmacy/bpharm")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("mpharm")
                                .name("M.Pharm")
                                .fullName("Master of Pharmacy")
                                .duration("2 years")
                                .description("Postgraduate specialization in Pharmaceutics, Pharmacology, etc.")
                                .regulatoryBody("PCI")
                                .competencyPrefix("MPHARM")
                                .routePath("/healthcare/pharmacy/mpharm")
                                .available(true)
                                .build()
                ))
                .build());

        // Domain 5: Nursing
        DOMAINS.add(DomainDto.builder()
                .id("nursing")
                .name("Nursing & Advanced Practice Nursing")
                .shortName("Nursing")
                .icon("🏥")
                .color("#EC4899")
                .accentColor("#DB2777")
                .description("B.Sc Nursing, M.Sc Nursing — ICU critical care protocols, OSCE nursing stations, and wound care.")
                .longDescription("Comprehensive nursing education from fundamental care skills to advanced practice critical care.")
                .tier(2)
                .routePath("/healthcare/nursing")
                .lessonCount(50)
                .keyHighlights(List.of(
                        "ICU Critical Care Nursing Protocols",
                        "Medication Administration Safety",
                        "OSCE Nursing Skill Stations",
                        "Wound Care & Dressing Modules"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("bsc-nursing")
                                .name("B.Sc Nursing")
                                .fullName("Bachelor of Science in Nursing")
                                .duration("4 years")
                                .description("Fundamental nursing, medical-surgical nursing, and critical care.")
                                .regulatoryBody("INC (Indian Nursing Council)")
                                .competencyPrefix("NURSING")
                                .routePath("/healthcare/nursing/bscnursing")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("msc-nursing")
                                .name("M.Sc Nursing")
                                .fullName("Master of Science in Nursing")
                                .duration("2 years")
                                .description("Advanced practice nursing specializations including critical care, oncology, and neonatal nursing.")
                                .regulatoryBody("INC")
                                .competencyPrefix("MNURSING")
                                .routePath("/healthcare/nursing/mscnursing")
                                .available(true)
                                .build()
                ))
                .build());

        // Domain 6: Physiotherapy
        DOMAINS.add(DomainDto.builder()
                .id("physiotherapy")
                .name("Physiotherapy & Rehabilitation Sciences")
                .shortName("Physiotherapy")
                .icon("🦾")
                .color("#06B6D4")
                .accentColor("#0891B2")
                .description("BPT, MPT — 3D joint biomechanics, ROM measurement, gait analysis, and neurorehab protocols.")
                .longDescription("Physiotherapy programs covering musculoskeletal, neurological, and cardiopulmonary rehabilitation.")
                .tier(2)
                .routePath("/healthcare/physiotherapy")
                .lessonCount(45)
                .keyHighlights(List.of(
                        "3D Joint Biomechanics Visualizer",
                        "ROM & Gait Analysis Modules",
                        "Neurorehabilitation Protocols (Bobath, PNF)",
                        "Sports Physiotherapy Case Studies"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("bpt")
                                .name("BPT")
                                .fullName("Bachelor of Physiotherapy")
                                .duration("4.5 years")
                                .description("Musculoskeletal, neurological, pediatric, and cardiopulmonary physiotherapy.")
                                .regulatoryBody("IAP (Indian Association of Physiotherapists)")
                                .competencyPrefix("BPT")
                                .routePath("/healthcare/physiotherapy/bpt")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("mpt")
                                .name("MPT")
                                .fullName("Master of Physiotherapy")
                                .duration("2 years")
                                .description("Specialization in orthopedics, neurology, sports, cardiopulmonary, or pediatric physiotherapy.")
                                .regulatoryBody("IAP (Indian Association of Physiotherapists)")
                                .competencyPrefix("MPT")
                                .routePath("/healthcare/physiotherapy/mpt")
                                .available(true)
                                .build()
                ))
                .build());

        // Domain 7: Allied Health
        DOMAINS.add(DomainDto.builder()
                .id("allied")
                .name("Allied Health Sciences & High-Tech Clinical Technologies")
                .shortName("Allied Health")
                .icon("🔬")
                .color("#F97316")
                .accentColor("#EA580C")
                .description("B.Sc Perfusion, Radiology, OT Tech, Dialysis — ECMO/CPB circuits, CT/MRI 3D slice explorer.")
                .longDescription("High-technology allied health programs training specialist paramedical teams for modern hospitals.")
                .tier(2)
                .routePath("/healthcare/allied")
                .lessonCount(40)
                .keyHighlights(List.of(
                        "ECMO / CPB Circuit Simulation",
                        "CT / MRI 3D Slice Explorer",
                        "Operation Theatre Workflow Modules",
                        "Dialysis Machine Setup Protocols"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("perfusion")
                                .name("B.Sc Perfusion")
                                .fullName("B.Sc Cardiovascular Perfusion Technology")
                                .duration("3 years")
                                .description("Cardiopulmonary bypass, ECMO, and intra-aortic balloon pump management.")
                                .regulatoryBody("NCAHP / MCI recognized")
                                .competencyPrefix("PERF")
                                .routePath("/healthcare/allied/curriculum?major=BSCPERF")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("radiology-tech")
                                .name("B.Sc Radiology")
                                .fullName("B.Sc Radiology & Imaging Technology")
                                .duration("3 years")
                                .description("X-ray, CT, MRI, ultrasound, nuclear medicine imaging principles and radiation protection.")
                                .regulatoryBody("NCAHP / AERB recognized")
                                .competencyPrefix("RADIO")
                                .routePath("/healthcare/allied/curriculum?major=BSCRIT")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("ot-technology")
                                .name("B.Sc OT Tech")
                                .fullName("B.Sc Operation Theatre & Anaesthesia Technology")
                                .duration("3 years")
                                .description("Operation theatre instrumentation, anesthesia workstations, and sterile processing.")
                                .regulatoryBody("NCAHP recognized")
                                .competencyPrefix("OTT")
                                .routePath("/healthcare/allied/curriculum?major=BSCOTT")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("dialysis-tech")
                                .name("B.Sc Dialysis")
                                .fullName("B.Sc Renal Dialysis Technology")
                                .duration("3 years")
                                .description("Hemodialysis, CRRT, peritoneal dialysis, and water treatment systems.")
                                .regulatoryBody("NCAHP recognized")
                                .competencyPrefix("DIAL")
                                .routePath("/healthcare/allied/curriculum?major=BSCDIAL")
                                .available(true)
                                .build()
                ))
                .build());

        // Domain 8: Veterinary
        DOMAINS.add(DomainDto.builder()
                .id("veterinary")
                .name("Veterinary & Comparative Medicine")
                .shortName("Veterinary")
                .icon("🐾")
                .color("#84CC16")
                .accentColor("#65A30D")
                .description("BVSc & AH, MVSc — Comparative anatomy, zoonotic diseases, and One Health epidemiology.")
                .longDescription("Veterinary Medicine programs covering small and large animal medicine and comparative anatomy.")
                .tier(3)
                .routePath("/healthcare/veterinary")
                .lessonCount(30)
                .keyHighlights(List.of(
                        "Comparative Anatomy (Human vs Animal)",
                        "Zoonotic Disease One Health Modules",
                        "Large & Small Animal Surgery Guides"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("bvsc")
                                .name("BVSc & AH")
                                .fullName("Bachelor of Veterinary Science & Animal Husbandry")
                                .duration("5.5 years")
                                .description("Companion animals, livestock, wildlife, and public veterinary health.")
                                .regulatoryBody("VCI (Veterinary Council of India)")
                                .competencyPrefix("BVSC")
                                .routePath("/healthcare/veterinary/bvsc")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("mvsc")
                                .name("MVSc")
                                .fullName("Master of Veterinary Science")
                                .duration("2 years")
                                .description("Postgraduate specialization in veterinary surgery, medicine, gynaecology, pathology, and public health.")
                                .regulatoryBody("VCI (Veterinary Council of India)")
                                .competencyPrefix("MVSC")
                                .routePath("/healthcare/veterinary/mvsc")
                                .available(true)
                                .build()
                ))
                .build());

        // Domain 9: Public Health
        DOMAINS.add(DomainDto.builder()
                .id("public-health")
                .name("Public Health & Healthcare Administration")
                .shortName("Public Health")
                .icon("🌍")
                .color("#6366F1")
                .accentColor("#4F46E5")
                .description("MPH, MHA — Epidemiology, biostatistics, Ayushman Bharat policy, and hospital operations.")
                .longDescription("Graduate programs in Public Health, epidemiology, and healthcare administration.")
                .tier(3)
                .routePath("/healthcare/public-health")
                .lessonCount(35)
                .keyHighlights(List.of(
                        "Epidemiology & Biostatistics Modules",
                        "Ayushman Bharat / PMJAY Policy",
                        "Hospital Operations Management",
                        "Health Economics & Budget Analysis"
                ))
                .programs(List.of(
                        ProgramDto.builder()
                                .id("mph")
                                .name("MPH")
                                .fullName("Master of Public Health")
                                .duration("2 years")
                                .description("Epidemiology, biostatistics, health policy, and global health practice.")
                                .regulatoryBody("NMC / UGC recognized")
                                .competencyPrefix("MPH")
                                .routePath("/healthcare/public-health/mph")
                                .available(true)
                                .build(),
                        ProgramDto.builder()
                                .id("mha")
                                .name("MHA")
                                .fullName("Master of Hospital Administration")
                                .duration("2 years")
                                .description("Hospital operations, financial management, HR, quality (NABH/JCI), and healthcare technology administration.")
                                .regulatoryBody("UGC recognized")
                                .competencyPrefix("MHA")
                                .routePath("/healthcare/public-health/mha")
                                .available(true)
                                .build()
                ))
                .build());
    }

    @GetMapping("/domains")
    @Operation(summary = "Get all 9 healthcare education domains", description = "Returns metadata, tier, highlights, and program lists for all 9 domains")
    public ResponseEntity<List<DomainDto>> getAllDomains() {
        return ResponseEntity.ok(DOMAINS);
    }

    @GetMapping("/domains/{domainId}")
    @Operation(summary = "Get healthcare domain by ID", description = "Returns detailed domain information and program list")
    public ResponseEntity<DomainDto> getDomainById(@PathVariable String domainId) {
        return DOMAINS.stream()
                .filter(d -> d.getId().equalsIgnoreCase(domainId))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tiers/{tier}")
    @Operation(summary = "Get domains by tier", description = "Returns domains classified under Tier 1, 2, or 3")
    public ResponseEntity<List<DomainDto>> getDomainsByTier(@PathVariable int tier) {
        List<DomainDto> filtered = DOMAINS.stream()
                .filter(d -> d.getTier() == tier)
                .toList();
        return ResponseEntity.ok(filtered);
    }
}
