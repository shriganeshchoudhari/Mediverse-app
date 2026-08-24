package com.curiolearn.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class EmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(EmbeddingService.class);
    
    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final String GEMINI_EMBEDDING_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public EmbeddingService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
    }

    public List<Double> getEmbedding(String text) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("your_api_key_here") || geminiApiKey.contains("${")) {
            log.warn("Gemini API Key is not configured. Returning empty embedding.");
            return Collections.emptyList();
        }

        try {
            String url = GEMINI_EMBEDDING_API_URL + geminiApiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ObjectNode root = objectMapper.createObjectNode();
            root.put("model", "models/text-embedding-004");
            ObjectNode content = root.putObject("content");
            ArrayNode parts = content.putArray("parts");
            parts.addObject().put("text", text);

            HttpEntity<String> request = new HttpEntity<>(root.toString(), headers);
            String responseStr = restTemplate.postForObject(url, request, String.class);
            JsonNode response = objectMapper.readTree(responseStr);

            JsonNode values = response.at("/embedding/values");
            List<Double> embedding = new ArrayList<>();
            if (values.isArray()) {
                for (JsonNode val : values) {
                    embedding.add(val.asDouble());
                }
            }
            return embedding;
        } catch (Exception e) {
            log.error("Failed to generate embedding from Gemini API: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
