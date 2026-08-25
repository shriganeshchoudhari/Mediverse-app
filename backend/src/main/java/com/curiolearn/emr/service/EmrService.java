package com.curiolearn.emr.service;

import com.curiolearn.emr.model.Patient;
import com.curiolearn.emr.model.ClinicalNote;
import com.curiolearn.emr.model.LabResult;
import com.curiolearn.emr.repository.PatientRepository;
import com.curiolearn.emr.repository.ClinicalNoteRepository;
import com.curiolearn.emr.repository.LabResultRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@Service
public class EmrService {
    private final PatientRepository patientRepository;
    private final ClinicalNoteRepository noteRepository;
    private final LabResultRepository labRepository;
    
    public EmrService(PatientRepository patientRepository, ClinicalNoteRepository noteRepository, LabResultRepository labRepository) {
        this.patientRepository = patientRepository;
        this.noteRepository = noteRepository;
        this.labRepository = labRepository;
    }
    
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    public Map<String, Object> getPatientChart(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
            
        Map<String, Object> chart = new HashMap<>();
        chart.put("patient", patient);
        chart.put("notes", noteRepository.findByPatientIdOrderByCreatedAtDesc(patientId));
        chart.put("labs", labRepository.findByPatientIdOrderByResultTimeDesc(patientId));
        return chart;
    }
    
    public ClinicalNote addNote(UUID patientId, ClinicalNote note) {
        note.setPatientId(patientId);
        return noteRepository.save(note);
    }
}
