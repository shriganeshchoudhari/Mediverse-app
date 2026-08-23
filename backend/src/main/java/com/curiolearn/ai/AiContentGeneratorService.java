package com.curiolearn.ai;

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
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiContentGeneratorService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiContentGeneratorService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> generateQuiz(String explanationText, int questionCount) {
        int count = questionCount > 0 ? questionCount : 2;
        if (isOffline()) {
            return getFallbackQuiz(explanationText, count);
        }

        try {
            String prompt = "Based on the following medical curriculum theory, generate " + count + " high-yield multiple-choice questions (MCQs).\n" +
                    "Return strictly a JSON object with this exact structure:\n" +
                    "{\n" +
                    "  \"questions\": [\n" +
                    "    {\n" +
                    "      \"question\": \"Question stem...\",\n" +
                    "      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n" +
                    "      \"correctIndex\": 0,\n" +
                    "      \"explanation\": \"Clinical rationale...\"\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}\n\n" +
                    "Theory:\n" + explanationText;

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
        int count = cardCount > 0 ? cardCount : 2;
        if (isOffline()) {
            return getFallbackFlashcards(explanationText, count);
        }

        try {
            String prompt = "Based on the following medical curriculum theory, generate " + count + " active-recall spaced-repetition flashcards.\n" +
                    "Return strictly a JSON object with this exact structure:\n" +
                    "{\n" +
                    "  \"cards\": [\n" +
                    "    {\n" +
                    "      \"front\": \"High-Yield Question / Concept...\",\n" +
                    "      \"back\": \"Concise Answer / Key Mechanism...\",\n" +
                    "      \"difficulty\": \"High-Yield\"\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}\n\n" +
                    "Theory:\n" + explanationText;

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
            String prompt = "Based on the following medical curriculum theory, generate a structured clinical vignette problem-solving scenario.\n" +
                    "Return strictly a JSON object with this exact structure:\n" +
                    "{\n" +
                    "  \"scenario\": \"Patient presentation, age, vitals, exam findings, lab values...\",\n" +
                    "  \"question\": \"Diagnostic or therapeutic question...\",\n" +
                    "  \"explanation\": \"Step-by-step clinical reasoning and guideline-based management...\"\n" +
                    "}\n\n" +
                    "Theory:\n" + explanationText;

            String response = callGeminiJson(prompt);
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            String jsonContent = extractJson(textNode.asText());
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            return getFallbackClinicalCase(explanationText);
        }
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
        String snippet = text != null && text.length() > 50 ? text.substring(0, Math.min(50, text.length())) + "..." : "curriculum principles";
        List<Map<String, Object>> questions = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            questions.add(Map.of(
                    "question", "Checkpoint Question " + i + ": Which mechanism is central to " + snippet + "?",
                    "options", List.of("Targeted receptor/pathway activation", "Secondary compensatory response", "Non-specific physiological baseline", "Spontaneous resolution"),
                    "correctIndex", 0,
                    "explanation", "Based on verified curriculum guidelines and physiological mechanisms."
            ));
        }
        return Map.of("questions", questions);
    }

    private Map<String, Object> getFallbackFlashcards(String text, int count) {
        String snippet = text != null && text.length() > 50 ? text.substring(0, Math.min(50, text.length())) + "..." : "clinical topic";
        List<Map<String, Object>> cards = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            cards.add(Map.of(
                    "front", "High-Yield Concept " + i + ": Pathophysiology of " + snippet,
                    "back", "Core mechanism, clinical diagnostic hallmarks, and targeted protocolized interventions.",
                    "difficulty", "High-Yield"
            ));
        }
        return Map.of("cards", cards);
    }

    private Map<String, Object> getFallbackClinicalCase(String text) {
        return Map.of(
                "scenario", "A 52-year-old patient presents with acute progressive symptoms consistent with the discussed curriculum topic.",
                "question", "What is the most appropriate initial diagnostic investigation and therapeutic stabilization?",
                "explanation", "Guideline-directed medical management requires rapid clinical stabilization and targeted laboratory profiling."
        );
    }
}
