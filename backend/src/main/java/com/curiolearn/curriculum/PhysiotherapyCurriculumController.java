package com.curiolearn.curriculum;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/physiotherapy")
public class PhysiotherapyCurriculumController {

    @GetMapping("/bpt/subjects")
    public List<Map<String, Object>> getBPTSubjects() {
        return Collections.emptyList();
    }

    @GetMapping("/bpt/subjects/{id}")
    public Map<String, Object> getBPTSubjectById(@PathVariable String id) {
        return Collections.emptyMap();
    }

    @GetMapping("/mpt/specialties")
    public List<Map<String, Object>> getMPTSpecialties() {
        return Collections.emptyList();
    }

    @GetMapping("/competencies")
    public List<Map<String, Object>> getCompetencies() {
        return Collections.emptyList();
    }

    @GetMapping("/tests")
    public List<Map<String, Object>> getTests() {
        return Collections.emptyList();
    }
}
