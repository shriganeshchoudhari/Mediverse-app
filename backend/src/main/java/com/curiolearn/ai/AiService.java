package com.curiolearn.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class AiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final RagService ragService;

    // Matches genuine personal emergency distress cues rather than academic/curriculum exam questions
    private static final Pattern CRISIS_PATTERN = Pattern.compile(
            "\\b(i am having|i have|help me|i feel like|i took)\\b.*\\b(chest pain|heart attack|suicidal|kill myself|cannot breathe|overdose|heavy bleeding)\\b",
            Pattern.CASE_INSENSITIVE
    );

    public AiService(RagService ragService) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
        this.ragService = ragService;
    }

    private boolean isEmergency(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) return false;
        String lower = prompt.toLowerCase();
        if (lower.contains("i want to die") || lower.contains("i want to kill myself") || lower.contains("i feel suicidal")) {
            return true;
        }
        return CRISIS_PATTERN.matcher(prompt).find();
    }

    public String askTutor(String prompt, String context, List<AiController.ChatMessage> history) {
        if (isEmergency(prompt)) {
            return "**CRITICAL SAFETY NOTICE**: If you or someone else is experiencing an acute medical emergency or crisis, please contact your local emergency services (112 / 911 / emergency dispatch) or present to the nearest hospital immediately. This AI Socratic Tutor is strictly for academic and professional study and cannot provide personal medical care.";
        }

        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("your_api_key_here") || geminiApiKey.contains("${")) {
            return "AI Tutor is currently offline. Please configure your GEMINI_API_KEY environment variable to enable live generative responses.";
        }

        try {
            String url = GEMINI_API_URL + geminiApiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String systemInstruction = "You are an expert AI Medical and Healthcare Sciences Socratic Tutor assisting students across all statutory healthcare disciplines (Allopathic Medicine/MBBS, Dental/BDS, AYUSH/BAMS, Pharmacy, Nursing, Physiotherapy, Allied Health, Veterinary, and Public Health).\n" +
                    "The student is currently studying: " + (context != null && !context.isEmpty() ? context : "Healthcare Sciences Curriculum") + ".\n\n" +
                    "PEDAGOGICAL & CLINICAL SAFETY GUIDELINES:\n" +
                    "1. Socratic Teaching: Guide the student with structured conceptual reasoning, physiological mechanisms, and clinical correlations.\n" +
                    "2. Academic Grounding: Ground answers in the curriculum reference material provided below, citing relevant subjects, chapters, and competency codes.\n" +
                    "3. Concise and Clear: Structure answers under 3-4 paragraphs using markdown bolding and bullet points for high-yield clarity.\n" +
                    "4. Strict Safety: This platform is exclusively for academic education. Do not provide real-time patient diagnosis or clinical prescribing advice.";

            // Hybrid RAG: Fetch relevant curriculum chunks from Elasticsearch + Vector store based on the user's prompt
            String ragContext = ragService.searchRelevantContext(prompt);
            if (!ragContext.isEmpty()) {
                systemInstruction += "\n\n" + ragContext + "\nAnswer the student's question using the above verified curriculum content where applicable, citing the source chapter.";
            }

            ObjectNode requestBody = objectMapper.createObjectNode();

            // system_instruction for Gemini 1.5
            ObjectNode sysInst = requestBody.putObject("system_instruction");
            ArrayNode sysParts = sysInst.putArray("parts");
            sysParts.addObject().put("text", systemInstruction);

            // contents array
            ArrayNode contents = requestBody.putArray("contents");

            if (history != null && !history.isEmpty()) {
                for (AiController.ChatMessage msg : history) {
                    ObjectNode contentObj = contents.addObject();
                    contentObj.put("role", msg.getRole());
                    ArrayNode parts = contentObj.putArray("parts");
                    parts.addObject().put("text", msg.getText());
                }
            } else {
                ObjectNode contentObj = contents.addObject();
                contentObj.put("role", "user");
                ArrayNode parts = contentObj.putArray("parts");
                parts.addObject().put("text", prompt);
            }

            HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

            String response = restTemplate.postForObject(url, request, String.class);

            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");

            if (textNode != null && !textNode.isMissingNode()) {
                return textNode.asText();
            }

            return "Unable to generate a response at this time. Please try again.";

        } catch (Exception e) {
            return "AI Tutor service temporarily unavailable: " + e.getMessage();
        }
    }
}
