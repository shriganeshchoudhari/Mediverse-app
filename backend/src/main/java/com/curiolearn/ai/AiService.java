package com.curiolearn.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final RagService ragService;

    public AiService(RagService ragService) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.ragService = ragService;
    }

    private boolean isEmergency(String prompt) {
        if (prompt == null) return false;
        String lower = prompt.toLowerCase();
        return lower.contains("chest pain") || lower.contains("heart attack") || 
               lower.contains("cardiac arrest") || lower.contains("stroke") || 
               lower.contains("difficulty breathing") || lower.contains("shortness of breath") || 
               lower.contains("anaphylaxis") || lower.contains("severe bleeding") || 
               lower.contains("unresponsive") || lower.contains("suicidal") ||
               lower.contains("poisoning") || lower.contains("emergency");
    }

    public String askTutor(String prompt, String context, java.util.List<AiController.ChatMessage> history) {
        if (isEmergency(prompt)) {
            return "**CRITICAL WARNING**: If you or someone else is experiencing a medical emergency, please call your local emergency services (e.g., 911 or 112) or go to the nearest emergency room immediately. This AI tutor is strictly for educational purposes and cannot provide medical advice, triage, or clinical management.";
        }

        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("your_api_key_here") || geminiApiKey.contains("${")) {
            return "AI Tutor is currently offline. Please configure your GEMINI_API_KEY to enable AI assistance.";
        }

        try {
            String url = GEMINI_API_URL + geminiApiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String systemInstruction = "You are an expert AI Physiology Tutor. The user is currently studying the context: " + context + ".\n" +
                "CRITICAL CLINICAL SAFETY NOTICE: This AI tutor is strictly for educational/academic study of physiological principles and is NOT a clinical tool or diagnostic aid. You must never offer medical advice, treatment recommendations, or diagnostic decisions for patient care. If a user asks for clinical advice, you must refuse and direct them to consult a qualified physician.\n\n" +
                "INSTRUCTIONS:\n" +
                "1. Provide a clear, medically accurate, and concise explanation (under 3 paragraphs) emphasizing the physiological mechanisms.\n" +
                "2. Do not use overly complex jargon without explaining it.\n" +
                "3. Cite specific chapters or sections from the provided reference material when grounding your answers.";
            
            // BM25 RAG: Fetch relevant curriculum chunks from Elasticsearch based on the user's prompt
            String ragContext = ragService.searchRelevantContext(prompt);
            if (!ragContext.isEmpty()) {
                systemInstruction += "\n\n" + ragContext + "\nAnswer the user's question using the above local syllabus content where possible, citing the source chapter.";
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
            
            if (textNode.isMissingNode()) {
                return "I'm sorry, I couldn't process that right now.";
            }
            return textNode.asText();

        } catch (Exception e) {
            e.printStackTrace();
            return "An error occurred while connecting to the AI Tutor. Please try again later.";
        }
    }
}

