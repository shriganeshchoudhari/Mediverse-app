package com.curiolearn.exam.service;

import com.curiolearn.exam.dto.OsceEvaluationRequest;
import com.curiolearn.exam.dto.OsceEvaluationResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class OsceExamService {

    public OsceEvaluationResponse evaluateExam(OsceEvaluationRequest request) {
        int actionCount = request.getActions() != null ? request.getActions().size() : 0;
        long contraindicationCount = request.getActions() != null
                ? request.getActions().stream().filter(OsceEvaluationRequest.ActionEntry::isContraindicated).count()
                : 0;

        int baseScore = Math.min(100, Math.max(30, actionCount * 12));
        int safetyPenalty = (int) (contraindicationCount * 25);
        int finalScore = Math.max(0, Math.min(100, baseScore - safetyPenalty));
        boolean passed = finalScore >= 70 && contraindicationCount == 0;

        List<OsceEvaluationResponse.StationResult> stationResults = new ArrayList<>();
        stationResults.add(OsceEvaluationResponse.StationResult.builder()
                .stationNumber(1)
                .title("History & Risk Stratification")
                .score(Math.min(100, finalScore + 5))
                .feedback(List.of("Rapid chest pain history conducted with cardiovascular risk assessment."))
                .safetyViolations(new ArrayList<>())
                .build());

        stationResults.add(OsceEvaluationResponse.StationResult.builder()
                .stationNumber(2)
                .title("Auscultation & Physical Exam")
                .score(finalScore)
                .feedback(List.of("Auscultation of heart sounds and crackles completed."))
                .safetyViolations(new ArrayList<>())
                .build());

        stationResults.add(OsceEvaluationResponse.StationResult.builder()
                .stationNumber(3)
                .title("Emergency Diagnostics")
                .score(Math.min(100, finalScore + 2))
                .feedback(List.of("12-Lead ECG prioritized appropriately."))
                .safetyViolations(new ArrayList<>())
                .build());

        stationResults.add(OsceEvaluationResponse.StationResult.builder()
                .stationNumber(4)
                .title("Pharmacotherapy & Cath Lab Activation")
                .score(Math.max(0, finalScore - safetyPenalty))
                .feedback(List.of(contraindicationCount > 0 ? "Contraindication triggered in medication selection." : "Appropriate dual antiplatelet therapy prescribed."))
                .safetyViolations(contraindicationCount > 0 ? List.of("Administered contraindicated vasodilator/inotropes during hemodynamic instability") : new ArrayList<>())
                .build());

        stationResults.add(OsceEvaluationResponse.StationResult.builder()
                .stationNumber(5)
                .title("Attending Viva Defense")
                .score(Math.min(100, finalScore + 4))
                .feedback(List.of("Defended clinical rationale and reperfusion goals."))
                .safetyViolations(new ArrayList<>())
                .build());

        String feedback = passed
                ? "Honors Pass: Candidate demonstrated outstanding clinical judgment, rapid triage, and strict avoidance of contraindicated therapeutics."
                : "Remediation Recommended: Action plan must focus on hemodynamic stabilization protocols and emergency contraindications.";

        return OsceEvaluationResponse.builder()
                .scenarioId(request.getScenarioId())
                .totalScore(finalScore)
                .passed(passed)
                .communicationScore(Math.min(100, finalScore + 2))
                .diagnosticPrecisionScore(Math.min(100, finalScore + 4))
                .safetyScore(contraindicationCount > 0 ? 40 : 95)
                .timeManagementScore(request.getTimeRemainingSeconds() > 0 ? 90 : 65)
                .stationResults(stationResults)
                .attendingFeedback(feedback)
                .build();
    }
}
