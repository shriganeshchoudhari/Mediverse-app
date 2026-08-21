package com.curiolearn.curriculum;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public-health")
public class PublicHealthCurriculumController {

    @GetMapping("/mph/subjects")
    public List<Map<String, Object>> getMPHSubjects() {
        return List.of(
            Map.of("id", "sub-mph-01", "name", "Principles of Epidemiology", "year", 1)
        );
    }

    @GetMapping("/mha/subjects")
    public List<Map<String, Object>> getMHASubjects() {
        return List.of(
            Map.of("id", "sub-mha-01", "name", "Hospital Planning & Design", "year", 1)
        );
    }

    @GetMapping("/competencies")
    public List<Map<String, Object>> getCompetencies() {
        return List.of(
            Map.of("id", "comp-1", "description", "Public Health Competency")
        );
    }

    @GetMapping("/policies")
    public List<Map<String, Object>> getPolicies() {
        return List.of(
            Map.of("id", "pol-1", "name", "National Health Policy")
        );
    }
}
