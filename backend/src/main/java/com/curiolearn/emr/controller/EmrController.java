package com.curiolearn.emr.controller;

import com.curiolearn.emr.model.Patient;
import com.curiolearn.emr.model.ClinicalNote;
import com.curiolearn.emr.service.EmrService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/emr")
@PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN')")
public class EmrController {
    private final EmrService emrService;
    
    public EmrController(EmrService emrService) {
        this.emrService = emrService;
    }
    
    @GetMapping("/patients")
    public List<Patient> getPatients() {
        return emrService.getAllPatients();
    }
    
    @GetMapping("/patients/{id}/chart")
    public Map<String, Object> getChart(@PathVariable UUID id) {
        return emrService.getPatientChart(id);
    }
    
    @PostMapping("/patients/{id}/notes")
    public ClinicalNote addNote(@PathVariable UUID id, @Valid @RequestBody ClinicalNote note, Authentication authentication) {
        // Always derive authorId from the authenticated principal, never from client input
        note.setAuthorId(authentication.getName());
        return emrService.addNote(id, note);
    }
}
