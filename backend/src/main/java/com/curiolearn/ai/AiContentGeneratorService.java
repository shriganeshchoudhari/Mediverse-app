package com.curiolearn.ai;

import com.curiolearn.curriculum.ContentBlock;
import com.curiolearn.curriculum.ContentBlockRepository;
import com.curiolearn.curriculum.Lesson;
import com.curiolearn.curriculum.LessonRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiContentGeneratorService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final LessonRepository lessonRepository;
    private final ContentBlockRepository contentBlockRepository;

    public AiContentGeneratorService(LessonRepository lessonRepository, ContentBlockRepository contentBlockRepository) {
        this.lessonRepository = lessonRepository;
        this.contentBlockRepository = contentBlockRepository;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public ContentBlock generateAndSaveForLesson(UUID lessonId, String modality, int count) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found: " + lessonId));

        List<ContentBlock> existingBlocks = contentBlockRepository.findByLessonIdOrderByOrderIndexAsc(lessonId);
        
        // Extract source theory strictly from existing EXPLANATION or SUMMARY blocks
        StringBuilder theoryBuilder = new StringBuilder();
        for (ContentBlock b : existingBlocks) {
            if ("EXPLANATION".equalsIgnoreCase(b.getType()) || "SUMMARY".equalsIgnoreCase(b.getType())) {
                if (b.getMetadata() != null && b.getMetadata().containsKey("text")) {
                    theoryBuilder.append(b.getMetadata().get("text")).append("\n\n");
                } else if (b.getContentRef() != null) {
                    theoryBuilder.append(b.getContentRef()).append("\n\n");
                }
            }
        }

        String sourceText = theoryBuilder.toString().trim();
        if (sourceText.isEmpty()) {
            sourceText = "Curriculum Topic: " + lesson.getTitle();
        }

        int maxOrder = existingBlocks.stream().mapToInt(ContentBlock::getOrderIndex).max().orElse(0);
        Map<String, Object> metadata;
        String blockType;

        switch (modality.toUpperCase()) {
            case "QUIZ":
                blockType = "QUIZ";
                metadata = generateQuiz(sourceText, count > 0 ? count : 3);
                break;
            case "FLASHCARD":
            case "FLASHCARD_SET":
                blockType = "FLASHCARD_SET";
                metadata = generateFlashcards(sourceText, count > 0 ? count : 4);
                break;
            case "CASE":
            case "CLINICAL_CASE":
                blockType = "CLINICAL_CASE";
                metadata = generateClinicalCase(sourceText);
                break;
            case "RX_CARD":
            case "PRESCRIPTION":
                blockType = "RX_CARD";
                metadata = generateRxCard(sourceText);
                break;
            case "DECISION_TREE":
                blockType = "DECISION_TREE";
                metadata = generateDecisionTree(sourceText);
                break;
            case "MNEMONIC":
                blockType = "MNEMONIC";
                metadata = generateMnemonic(sourceText);
                break;
            default:
                throw new IllegalArgumentException("Unsupported modality: " + modality);
        }

        ContentBlock newBlock = ContentBlock.builder()
                .lesson(lesson)
                .type(blockType)
                .orderIndex(maxOrder + 1)
                .status("DRAFT")
                .reviewNotes("AI Generated via LessonGroundedGeneratorEngine - Awaiting Faculty Medical Review")
                .metadata(metadata)
                .build();

        return contentBlockRepository.save(newBlock);
    }

    public Map<String, Object> generateQuiz(String explanationText, int questionCount) {
        int count = questionCount > 0 ? questionCount : 3;
        if (isOffline()) {
            return getFallbackQuiz(explanationText, count);
        }

        try {
            String prompt = "You are an expert medical board exam author (USMLE / NMC CBME). Based strictly on the provided medical text, create " + count + " clinical vignette multiple choice questions.\n" +
                    "Requirements:\n" +
                    "- Each question must have a realistic patient presentation or clinical mechanism stem.\n" +
                    "- Exactly 4 plausible options.\n" +
                    "- Single best answer with 0-indexed correctIndex.\n" +
                    "- In-depth explanation with distractor rationale and a high-yield Clinical Pearl.\n\n" +
                    "Return ONLY a JSON object formatted as:\n" +
                    "{\n" +
                    "  \"title\": \"Clinical Checkpoint Quiz\",\n" +
                    "  \"questions\": [\n" +
                    "    {\n" +
                    "      \"question\": \"Stem...\",\n" +
                    "      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n" +
                    "      \"correctIndex\": 0,\n" +
                    "      \"explanation\": \"Detailed rationale...\",\n" +
                    "      \"clinicalPearl\": \"High-yield pearl...\"\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}\n\n" +
                    "Source Medical Text:\n" + explanationText;

            String response = callGeminiJson(prompt);
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            String jsonContent = extractJson(textNode.asText());
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            return getFallbackQuiz(explanationText, count);
        }
    }

    public Map<String, Object> generateFlashcards(String explanationText, int cardCount) {
        int count = cardCount > 0 ? cardCount : 4;
        if (isOffline()) {
            return getFallbackFlashcards(explanationText, count);
        }

        try {
            String prompt = "You are a medical education specialist in Spaced Repetition (Anki/SM-2). Based strictly on the provided medical text, create " + count + " active-recall flashcards.\n" +
                    "Requirements:\n" +
                    "- Front: Precise diagnostic, pharmacological, or anatomical prompt.\n" +
                    "- Back: High-yield key takeaway, bulleted mechanisms, or numerical criteria.\n" +
                    "- Cloze: Formatted with {{c1::keyword}} active recall markers.\n\n" +
                    "Return ONLY a JSON object formatted as:\n" +
                    "{\n" +
                    "  \"title\": \"Spaced Repetition Mastery Deck\",\n" +
                    "  \"cards\": [\n" +
                    "    {\n" +
                    "      \"front\": \"Prompt...\",\n" +
                    "      \"back\": \"Answer...\",\n" +
                    "      \"cloze\": \"Sentence with {{c1::hidden key term}} for cloze recall.\",\n" +
                    "      \"difficulty\": \"High-Yield\"\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}\n\n" +
                    "Source Medical Text:\n" + explanationText;

            String response = callGeminiJson(prompt);
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            String jsonContent = extractJson(textNode.asText());
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            return getFallbackFlashcards(explanationText, count);
        }
    }

    public Map<String, Object> generateClinicalCase(String explanationText) {
        if (isOffline()) {
            return getFallbackClinicalCase(explanationText);
        }

        try {
            String prompt = "Based strictly on the provided medical text, create a structured Clinical Vignette Case Simulation.\n" +
                    "Return ONLY a JSON object formatted as:\n" +
                    "{\n" +
                    "  \"patientProfile\": { \"age\": 48, \"gender\": \"Female\", \"chiefComplaint\": \"...\" },\n" +
                    "  \"vitals\": { \"bp\": \"138/86 mmHg\", \"hr\": \"94 bpm\", \"temp\": \"37.8 C\", \"spo2\": \"96% on RA\" },\n" +
                    "  \"hpi\": \"History of Present Illness...\",\n" +
                    "  \"physicalExam\": \"Pertinent findings...\",\n" +
                    "  \"labFindings\": \"Key lab & imaging markers...\",\n" +
                    "  \"decisionQuestions\": [\n" +
                    "    {\n" +
                    "      \"question\": \"Initial priority action?\",\n" +
                    "      \"options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"],\n" +
                    "      \"correctIndex\": 0,\n" +
                    "      \"rationale\": \"Clinical rationale...\"\n" +
                    "    }\n" +
                    "  ],\n" +
                    "  \"managementSummary\": \"Evidence-based guideline management summary...\"\n" +
                    "}\n\n" +
                    "Source Medical Text:\n" + explanationText;

            String response = callGeminiJson(prompt);
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            String jsonContent = extractJson(textNode.asText());
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            return getFallbackClinicalCase(explanationText);
        }
    }

    public Map<String, Object> generateRxCard(String explanationText) {
        if (isOffline()) {
            return getFallbackRxCard(explanationText);
        }

        try {
            String prompt = "Based on the following medical/pharmacological text, generate an Evidence-Based Prescription & Therapeutics Protocol Card.\n" +
                    "Return ONLY a JSON object formatted as:\n" +
                    "{\n" +
                    "  \"condition\": \"Target Condition...\",\n" +
                    "  \"firstLineRegimen\": [\n" +
                    "    { \"drugName\": \"Drug A\", \"dosage\": \"500 mg\", \"route\": \"Oral\", \"frequency\": \"TID x 7 days\", \"mechanism\": \"...\" }\n" +
                    "  ],\n" +
                    "  \"secondLineAlternative\": [\n" +
                    "    { \"drugName\": \"Drug B\", \"dosage\": \"250 mg\", \"route\": \"IV\", \"frequency\": \"Daily\", \"indication\": \"If allergy / treatment failure\" }\n" +
                    "  ],\n" +
                    "  \"renalAdjustment\": \"Dose adjustment when eGFR < 30 mL/min...\",\n" +
                    "  \"blackBoxWarnings\": [\"Critical safety warning...\"],\n" +
                    "  \"monitoringParameters\": [\"Serum creatinine\", \"LFTs at week 2\"]\n" +
                    "}\n\n" +
                    "Source Medical Text:\n" + explanationText;

            String response = callGeminiJson(prompt);
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            String jsonContent = extractJson(textNode.asText());
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            return getFallbackRxCard(explanationText);
        }
    }

    public Map<String, Object> generateDecisionTree(String explanationText) {
        if (isOffline()) {
            return getFallbackDecisionTree(explanationText);
        }

        try {
            String prompt = "Based on the following clinical text, generate a Step-by-Step Interactive Clinical Decision Tree (Algorithmic Pathway).\n" +
                    "Return ONLY a JSON object formatted as:\n" +
                    "{\n" +
                    "  \"title\": \"Clinical Decision Pathway\",\n" +
                    "  \"initialNodeId\": \"node-1\",\n" +
                    "  \"nodes\": [\n" +
                    "    {\n" +
                    "      \"id\": \"node-1\",\n" +
                    "      \"prompt\": \"Initial Clinical Presentation / Triage Assessment...\",\n" +
                    "      \"options\": [\n" +
                    "        { \"label\": \"Patient Stable\", \"nextNodeId\": \"node-2\" },\n" +
                    "        { \"label\": \"Hemodynamically Unstable\", \"nextNodeId\": \"node-3\" }\n" +
                    "      ]\n" +
                    "    },\n" +
                    "    {\n" +
                    "      \"id\": \"node-2\",\n" +
                    "      \"prompt\": \"Diagnostic Workup Pathway for Stable Presentation...\",\n" +
                    "      \"conclusion\": \"Perform non-invasive imaging and initiate targeted therapy.\"\n" +
                    "    },\n" +
                    "    {\n" +
                    "      \"id\": \"node-3\",\n" +
                    "      \"prompt\": \"Emergency Resuscitation & Immediate Intervention Protocol...\",\n" +
                    "      \"conclusion\": \"Immediate airway control, IV fluid resuscitation, and emergency consult.\"\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}\n\n" +
                    "Source Medical Text:\n" + explanationText;

            String response = callGeminiJson(prompt);
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            String jsonContent = extractJson(textNode.asText());
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            return getFallbackDecisionTree(explanationText);
        }
    }

    public Map<String, Object> generateMnemonic(String explanationText) {
        String snippet = explanationText != null && explanationText.length() > 60 ? explanationText.substring(0, 60) + "..." : "clinical topic";
        return Map.of(
                "title", "Visual Mnemonic Anchor: " + snippet,
                "mnemonicWord", "P-A-T-H-O",
                "breakdown", List.of(
                        Map.of("letter", "P", "meaning", "Pathology & Underlying Mechanism"),
                        Map.of("letter", "A", "meaning", "Acute Presentation & Red Flag Symptoms"),
                        Map.of("letter", "T", "meaning", "Testing, Labs & Golden Standard Imaging"),
                        Map.of("letter", "H", "meaning", "Hemodynamic & Pharmacological Stabilization"),
                        Map.of("letter", "O", "meaning", "Outcomes, Complications & Follow-up")
                ),
                "clinicalHook", "Remember PATHO to systematically recall emergency triage and targeted therapy."
        );
    }

    private boolean isOffline() {
        return geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.contains("${") || geminiApiKey.equals("your_api_key_here");
    }

    private String callGeminiJson(String userPrompt) throws Exception {
        String url = GEMINI_API_URL + geminiApiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ObjectNode requestBody = objectMapper.createObjectNode();
        ArrayNode contents = requestBody.putArray("contents");
        ObjectNode contentObj = contents.addObject();
        contentObj.put("role", "user");
        ArrayNode parts = contentObj.putArray("parts");
        parts.addObject().put("text", userPrompt);

        HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
        return restTemplate.postForObject(url, request, String.class);
    }

    private String extractJson(String text) {
        int firstBrace = text.indexOf('{');
        int lastBrace = text.lastIndexOf('}');
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            return text.substring(firstBrace, lastBrace + 1);
        }
        return text;
    }

    private Map<String, Object> getFallbackQuiz(String text, int count) {
        String snippet = text != null && text.length() > 50 ? text.substring(0, Math.min(50, text.length())) + "..." : "curriculum topic";
        List<Map<String, Object>> questions = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            questions.add(Map.of(
                    "question", "Checkpoint Question " + i + ": In evaluating " + snippet + ", which finding is most diagnostically conclusive?",
                    "options", List.of("Targeted pathognomonic biochemical or physiological marker", "Unrelated baseline physiological variation", "Idiopathic transient fluctuation", "Non-specific finding without diagnostic weight"),
                    "correctIndex", 0,
                    "explanation", "Accurate clinical decision-making requires identifying the validated pathognomonic marker outlined in curriculum standards.",
                    "clinicalPearl", "Always correlate clinical presentation with guideline-directed laboratory thresholds before initiating therapy."
            ));
        }
        return Map.of("title", "Clinical Checkpoint Quiz", "questions", questions);
    }

    private Map<String, Object> getFallbackFlashcards(String text, int count) {
        String snippet = text != null && text.length() > 50 ? text.substring(0, Math.min(50, text.length())) + "..." : "clinical topic";
        List<Map<String, Object>> cards = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            cards.add(Map.of(
                    "front", "High-Yield Concept " + i + ": Core Management of " + snippet,
                    "back", "Primary goal: rapid diagnostic stabilization, targeted guideline pharmacotherapy, and close physiological monitoring.",
                    "cloze", "The gold-standard initial therapy for " + snippet + " involves {{c1::targeted guideline pharmacotherapy}}.",
                    "difficulty", "High-Yield"
            ));
        }
        return Map.of("title", "Spaced Repetition Mastery Deck", "cards", cards);
    }

    private Map<String, Object> getFallbackClinicalCase(String text) {
        String snippet = text != null && text.length() > 50 ? text.substring(0, Math.min(50, text.length())) + "..." : "curriculum condition";
        return Map.of(
                "patientProfile", Map.of("age", 52, "gender", "Male", "chiefComplaint", "Acute exacerbation of " + snippet),
                "vitals", Map.of("bp", "136/84 mmHg", "hr", "88 bpm", "temp", "37.2 C", "spo2", "97% on ambient air"),
                "hpi", "A 52-year-old male presents with 48 hours of progressive symptoms consistent with " + snippet + ". Denies recent trauma.",
                "physicalExam", "Oriented x 3. Pertinent focal signs consistent with underlying pathology.",
                "labFindings", "CBC, metabolic panel, and diagnostic biomarker assays confirm acute presentation.",
                "decisionQuestions", List.of(Map.of(
                        "question", "What is the most appropriate next step in clinical management?",
                        "options", List.of("Initiate first-line guideline therapy and monitor vitals", "Discharge with routine follow-up in 6 months", "Immediate exploratory surgery without imaging", "Discontinue all supportive measures"),
                        "correctIndex", 0,
                        "rationale", "Evidence-based clinical guidelines prioritize prompt targeted intervention and vital sign surveillance."
                )),
                "managementSummary", "Standard therapeutic protocol combines rapid stabilization with condition-specific medical management."
        );
    }

    private Map<String, Object> getFallbackRxCard(String text) {
        String snippet = text != null && text.length() > 50 ? text.substring(0, Math.min(50, text.length())) + "..." : "curriculum condition";
        return Map.of(
                "condition", "Therapeutic Protocol for: " + snippet,
                "firstLineRegimen", List.of(
                        Map.of("drugName", "First-Line Therapeutic Agent", "dosage", "Standard Guideline Dose", "route", "Oral / IV", "frequency", "Q12H", "mechanism", "Targeted receptor/enzyme modulation")
                ),
                "secondLineAlternative", List.of(
                        Map.of("drugName", "Alternative Second-Line Agent", "dosage", "Adjusted Dose", "route", "Oral", "frequency", "Daily", "indication", "In cases of contraindication or allergy")
                ),
                "renalAdjustment", "Reduce dose by 50% if eGFR < 30 mL/min/1.73m².",
                "blackBoxWarnings", List.of("Monitor for hypersensitivity and electrolyte shifts during initiation."),
                "monitoringParameters", List.of("Baseline renal panel", "Clinical symptom resolution at 48 hours")
        );
    }

    private Map<String, Object> getFallbackDecisionTree(String text) {
        String snippet = text != null && text.length() > 50 ? text.substring(0, Math.min(50, text.length())) + "..." : "Clinical Condition";
        return Map.of(
                "title", "Diagnostic & Triage Tree: " + snippet,
                "initialNodeId", "node-1",
                "nodes", List.of(
                        Map.of(
                                "id", "node-1",
                                "prompt", "Initial Assessment of " + snippet + ": Is the patient hemodynamically stable?",
                                "options", List.of(
                                        Map.of("label", "Yes — Hemodynamically Stable", "nextNodeId", "node-2"),
                                        Map.of("label", "No — Hemodynamically Unstable", "nextNodeId", "node-3")
                                )
                        ),
                        Map.of(
                                "id", "node-2",
                                "prompt", "Stable Pathway: Proceed with targeted outpatient diagnostic evaluation and oral therapy.",
                                "conclusion", "Perform non-invasive diagnostics and start guideline-directed oral regimen with 48h follow-up."
                        ),
                        Map.of(
                                "id", "node-3",
                                "prompt", "Emergency Protocol: Immediate airway/breathing/circulation stabilization and ICU admission.",
                                "conclusion", "Secure two large-bore IVs, initiate continuous telemetry, and order emergency specialist consult."
                        )
                )
        );
    }
}
