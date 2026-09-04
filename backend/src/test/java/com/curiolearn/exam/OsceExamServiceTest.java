package com.curiolearn.exam;

import com.curiolearn.exam.dto.OsceEvaluationRequest;
import com.curiolearn.exam.dto.OsceEvaluationResponse;
import com.curiolearn.exam.service.OsceExamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class OsceExamServiceTest {

    private OsceExamService osceExamService;

    @BeforeEach
    void setUp() {
        osceExamService = new OsceExamService();
    }

    @Test
    void testEvaluateExam_PassingWithoutContraindications() {
        OsceEvaluationRequest request = OsceEvaluationRequest.builder()
                .scenarioId("osce-stemi-cardiology")
                .timeRemainingSeconds(180)
                .actions(List.of(
                        OsceEvaluationRequest.ActionEntry.builder()
                                .stationId("station-1")
                                .actionType("QUESTION")
                                .detail("Time of onset")
                                .isContraindicated(false)
                                .build(),
                        OsceEvaluationRequest.ActionEntry.builder()
                                .stationId("station-2")
                                .actionType("EXAM")
                                .detail("Auscultate Apex S3")
                                .isContraindicated(false)
                                .build(),
                        OsceEvaluationRequest.ActionEntry.builder()
                                .stationId("station-3")
                                .actionType("INVESTIGATION")
                                .detail("12-Lead ECG")
                                .isContraindicated(false)
                                .build(),
                        OsceEvaluationRequest.ActionEntry.builder()
                                .stationId("station-4")
                                .actionType("PRESCRIPTION")
                                .detail("Aspirin 300mg chewable")
                                .isContraindicated(false)
                                .build(),
                        OsceEvaluationRequest.ActionEntry.builder()
                                .stationId("station-4")
                                .actionType("PRESCRIPTION")
                                .detail("Ticagrelor 180mg")
                                .isContraindicated(false)
                                .build(),
                        OsceEvaluationRequest.ActionEntry.builder()
                                .stationId("station-5")
                                .actionType("VIVA")
                                .detail("Identify LAD culprit")
                                .isContraindicated(false)
                                .build()
                ))
                .build();

        OsceEvaluationResponse response = osceExamService.evaluateExam(request);

        assertNotNull(response);
        assertEquals("osce-stemi-cardiology", response.getScenarioId());
        assertTrue(response.isPassed());
        assertTrue(response.getTotalScore() >= 70);
        assertEquals(95, response.getSafetyScore());
        assertEquals(5, response.getStationResults().size());
        assertTrue(response.getAttendingFeedback().contains("Honors Pass"));
    }

    @Test
    void testEvaluateExam_FailsWhenContraindicationTriggered() {
        OsceEvaluationRequest request = OsceEvaluationRequest.builder()
                .scenarioId("osce-stemi-cardiology")
                .timeRemainingSeconds(30)
                .actions(List.of(
                        OsceEvaluationRequest.ActionEntry.builder()
                                .stationId("station-4")
                                .actionType("PRESCRIPTION")
                                .detail("Nitroglycerin in severe hypotension")
                                .isContraindicated(true)
                                .build()
                ))
                .build();

        OsceEvaluationResponse response = osceExamService.evaluateExam(request);

        assertNotNull(response);
        assertFalse(response.isPassed());
        assertEquals(40, response.getSafetyScore());
        assertTrue(response.getAttendingFeedback().contains("Remediation Recommended"));
    }
}
