package com.curiolearn.emr;

import com.curiolearn.emr.controller.EmrController;
import com.curiolearn.emr.model.ClinicalNote;
import com.curiolearn.emr.model.Patient;
import com.curiolearn.emr.service.EmrService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class EmrControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EmrService emrService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        EmrController controller = new EmrController(emrService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("TC-API-EMR-001: GET /api/v1/emr/patients returns patient roster")
    void testGetPatients_ReturnsList() throws Exception {
        Patient p = new Patient();
        p.setId(UUID.randomUUID());
        p.setFirstName("John");
        p.setLastName("Doe");

        when(emrService.getAllPatients()).thenReturn(List.of(p));

        mockMvc.perform(get("/api/v1/emr/patients"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[0].lastName", is("Doe")));
    }

    @Test
    @DisplayName("TC-API-EMR-002: GET /api/v1/emr/patients/{id}/chart returns patient chart")
    void testGetChart_ReturnsChartMap() throws Exception {
        UUID patientId = UUID.randomUUID();
        when(emrService.getPatientChart(patientId)).thenReturn(Map.of("vitals", "HR 75, BP 120/80"));

        mockMvc.perform(get("/api/v1/emr/patients/{id}/chart", patientId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vitals", is("HR 75, BP 120/80")));
    }

    @Test
    @DisplayName("TC-API-EMR-003: POST /api/v1/emr/patients/{id}/notes forces authorId from authenticated principal")
    void testAddNote_ForcesAuthorFromPrincipal() throws Exception {
        UUID patientId = UUID.randomUUID();
        ClinicalNote incoming = new ClinicalNote();
        incoming.setNoteType("PROGRESS");
        incoming.setSubjective("Shortness of breath improved.");
        incoming.setAssessment("Acute heart failure resolving.");
        incoming.setAuthorId("spoofed_attacker_id");

        ClinicalNote saved = new ClinicalNote();
        saved.setId(UUID.randomUUID());
        saved.setPatientId(patientId);
        saved.setAuthorId("dr.curie@mediverse.edu");
        saved.setNoteType("PROGRESS");

        when(emrService.addNote(eq(patientId), any(ClinicalNote.class))).thenReturn(saved);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                "dr.curie@mediverse.edu",
                "N/A",
                List.of(new SimpleGrantedAuthority("ROLE_FACULTY"))
        );

        mockMvc.perform(post("/api/v1/emr/patients/{id}/notes", patientId)
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(incoming)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authorId", is("dr.curie@mediverse.edu")));

        verify(emrService).addNote(eq(patientId), argThat(note ->
                "dr.curie@mediverse.edu".equals(note.getAuthorId())
        ));
    }
}
