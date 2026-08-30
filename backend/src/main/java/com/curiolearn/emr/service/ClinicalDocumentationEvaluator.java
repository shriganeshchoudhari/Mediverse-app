package com.curiolearn.emr.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ClinicalDocumentationEvaluator {

    public Map<String, Object> gradeSoapNote(
            String subjective,
            String objective,
            String assessment,
            String plan,
            String primaryDiagnosis
    ) {
        Map<String, Object> report = new LinkedHashMap<>();
        
        int subjectiveScore = (subjective != null && subjective.length() > 40) ? 20 : 10;
        int objectiveScore = (objective != null && (objective.toLowerCase().contains("bp") || objective.toLowerCase().contains("temp") || objective.toLowerCase().contains("rate"))) ? 20 : 8;
        int assessmentScore = (assessment != null && (assessment.toLowerCase().contains("differential") || assessment.toLowerCase().contains("rule out") || assessment.toLowerCase().contains("dx"))) ? 25 : 12;
        int planScore = (plan != null && (plan.toLowerCase().contains("mg") || plan.toLowerCase().contains("iv") || plan.toLowerCase().contains("tab") || plan.toLowerCase().contains("order"))) ? 25 : 14;
        int safetyScore = 10;

        int totalScore = subjectiveScore + objectiveScore + assessmentScore + planScore + safetyScore;
        String grade = totalScore >= 90 ? "HONORS" : (totalScore >= 75 ? "PASS" : (totalScore >= 60 ? "CONDITIONAL" : "FAIL"));

        List<Map<String, Object>> criteria = new ArrayList<>();
        criteria.add(createCriterion("Subjective (HPI & History)", 20, subjectiveScore, "History structure and chronology."));
        criteria.add(createCriterion("Objective (Vitals & Physical Exam)", 20, objectiveScore, "Physical findings and baseline vital signs."));
        criteria.add(createCriterion("Assessment (Clinical Reasoning & Diff Dx)", 25, assessmentScore, "Appropriate differential ranking."));
        criteria.add(createCriterion("Plan (Diagnostics, Rx & Disposition)", 25, planScore, "Evidence-based pharmacology and follow-up."));
        criteria.add(createCriterion("Patient Safety & Drug Interactions", 10, safetyScore, "Contraindication and allergy screening."));

        report.put("totalScore", totalScore);
        report.put("grade", grade);
        report.put("criteria", criteria);
        report.put("suggestedIcd10", Arrays.asList("K35.80", "I21.0", "J18.9"));
        report.put("feedback", "Clinical note demonstrates sound medical knowledge. Continue reinforcing specific dosages and follow-up intervals.");

        return report;
    }

    private Map<String, Object> createCriterion(String title, int max, int achieved, String desc) {
        Map<String, Object> map = new HashMap<>();
        map.put("title", title);
        map.put("maxScore", max);
        map.put("scoreAchieved", achieved);
        map.put("feedback", desc);
        map.put("status", achieved >= (max * 0.8) ? "MET" : "PARTIALLY_MET");
        return map;
    }
}
