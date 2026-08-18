package com.curiolearn.aitutor.service;

import com.curiolearn.ai.RagService;
import com.curiolearn.aitutor.dto.AITutorChatRequest;
import com.curiolearn.aitutor.dto.ChatMessageDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;

import java.io.IOException;
import java.util.List;

@Service
public class AITutorService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final RagService ragService;

    public AITutorService(RagService ragService) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.ragService = ragService;
    }

    public boolean isEmergency(String prompt) {
        if (prompt == null) return false;
        String lower = prompt.toLowerCase();
        return lower.contains("chest pain") || lower.contains("heart attack") ||
                lower.contains("cardiac arrest") || lower.contains("stroke") ||
                lower.contains("difficulty breathing") || lower.contains("shortness of breath") ||
                lower.contains("anaphylaxis") || lower.contains("severe bleeding") ||
                lower.contains("unresponsive") || lower.contains("suicidal") ||
                lower.contains("poisoning") || lower.contains("overdose");
    }

    public void streamSocraticResponse(AITutorChatRequest request, ResponseBodyEmitter emitter) throws IOException {
        String prompt = request.getMessage() != null ? request.getMessage() : request.getPrompt();
        if (prompt == null || prompt.trim().isEmpty()) {
            emitChunk(emitter, "Please ask a question about medical physiology mechanisms, equations, or clinical correlations.");
            return;
        }

        // Emergency medical safety screening
        if (isEmergency(prompt)) {
            String emergencyNotice = "⚠️ **CRITICAL CLINICAL SAFETY WARNING**:\n\n" +
                    "If you or someone nearby is experiencing acute medical distress (e.g., chest pain, shortness of breath, anaphylaxis, sudden neurological deficits), immediately contact your local Emergency Medical Services (**911**, **112**, or your national emergency number) or go to the nearest emergency department.\n\n" +
                    "*This AI Socratic Tutor is strictly an academic physiology learning companion and cannot provide medical triage, clinical diagnosis, or treatment recommendations.*";
            emitTokenStream(emitter, emergencyNotice);
            return;
        }

        // Check if Gemini API key is valid
        if (geminiApiKey != null && !geminiApiKey.isEmpty() && !geminiApiKey.equals("your_api_key_here") && !geminiApiKey.contains("${")) {
            try {
                String geminiResponse = callGemini(prompt, request.getContext(), request.getHistory());
                emitTokenStream(emitter, geminiResponse);
                return;
            } catch (Exception e) {
                // Fall back to built-in Socratic engine on connection failure
            }
        }

        // Built-in intelligent Socratic reasoning engine
        String socraticAnswer = generateSocraticPedagogicalResponse(prompt, request.getContext());
        emitTokenStream(emitter, socraticAnswer);
    }

    private String callGemini(String prompt, String context, List<ChatMessageDto> history) throws Exception {
        String url = GEMINI_API_URL + geminiApiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String topicContext = context != null ? context : "General Medical Physiology";
        String systemInstruction = "You are the Mediverse AI Socratic Tutor, an expert physiology professor.\n" +
                "The student is currently learning: " + topicContext + ".\n\n" +
                "PEDAGOGICAL GUIDELINES:\n" +
                "1. Adopt a Socratic teaching style: Explain the core physiological mechanism step-by-step, then ask a guiding question to test their understanding.\n" +
                "2. Ground explanations in fundamental physical & chemical principles (e.g., Starling equations, Ohm's law analog for hemodynamics, Henderson-Hasselbalch, Nernst potentials).\n" +
                "3. Emphasize cause-and-effect relationships and feedback loops.\n" +
                "4. Keep the response focused and concise (2-4 structured paragraphs).\n" +
                "5. Include textbook reference citations (e.g., Guyton & Hall, Costanzo Physiology, West's Respiratory Physiology).\n" +
                "6. NEVER provide clinical medical advice for real patients.";

        try {
            String ragContext = ragService.searchRelevantContext(prompt);
            if (ragContext != null && !ragContext.isEmpty()) {
                systemInstruction += "\n\n" + ragContext;
            }
        } catch (Exception ignored) {}

        ObjectNode requestBody = objectMapper.createObjectNode();
        ObjectNode sysInst = requestBody.putObject("system_instruction");
        ArrayNode sysParts = sysInst.putArray("parts");
        sysParts.addObject().put("text", systemInstruction);

        ArrayNode contents = requestBody.putArray("contents");
        if (history != null && !history.isEmpty()) {
            for (ChatMessageDto msg : history) {
                ObjectNode contentObj = contents.addObject();
                contentObj.put("role", "user".equalsIgnoreCase(msg.getRole()) ? "user" : "model");
                ArrayNode parts = contentObj.putArray("parts");
                String text = msg.getContent() != null ? msg.getContent() : msg.getText();
                parts.addObject().put("text", text != null ? text : "");
            }
        }

        ObjectNode currentUserMsg = contents.addObject();
        currentUserMsg.put("role", "user");
        currentUserMsg.putArray("parts").addObject().put("text", prompt);

        HttpEntity<String> httpEntity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
        String jsonResponse = restTemplate.postForObject(url, httpEntity, String.class);

        JsonNode root = objectMapper.readTree(jsonResponse);
        JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");

        if (textNode.isMissingNode()) {
            return generateSocraticPedagogicalResponse(prompt, context);
        }
        return textNode.asText();
    }

    private String generateSocraticPedagogicalResponse(String prompt, String context) {
        String lower = prompt.toLowerCase();
        String ctx = (context != null) ? context.toLowerCase() : "";

        if (lower.contains("frank-starling") || lower.contains("starling") || lower.contains("preload") || lower.contains("edv")) {
            return "### The Frank-Starling Law of the Heart & Preload\n\n" +
                    "The **Frank-Starling mechanism** establishes that the force of ventricular contraction is directly proportional to the initial length of the cardiac muscle fibers (sarcomeres) at the end of diastole (**End-Diastolic Volume / Preload**).\n\n" +
                    "**Underlying Mechanism**:\n" +
                    "1. Increased venous return stretches cardiac myocytes toward optimal actin-myosin filament overlap (~2.2 μm).\n" +
                    "2. Stretching increases the **calcium sensitivity of troponin C**, allowing greater cross-bridge cycling and higher tension generation.\n" +
                    "3. In systolic heart failure, the ventricular compliance curve flattens and shifts downward-right, meaning increasing preload yields diminishing stroke volume increments.\n\n" +
                    "💡 *Socratic Question for You*: If a patient is administered a pure venodilator (e.g., nitroglycerin), what happens to their left ventricular operating point on the Frank-Starling curve, and why?\n\n" +
                    "📖 *References: Guyton and Hall Textbook of Medical Physiology (14th ed.), Ch. 9; Costanzo Physiology (7th ed.), Cardiovascular System.*";
        }

        if (lower.contains("afterload") || lower.contains("svr") || lower.contains("pv loop") || lower.contains("pressure-volume")) {
            return "### Pressure-Volume Loops & Ventricular Afterload\n\n" +
                    "**Afterload** represents the load or tension that the ventricle must overcome to eject blood into the systemic circulation, quantified clinically by effective arterial elastance ($E_a$) and systemic vascular resistance (SVR).\n\n" +
                    "**Hemodynamic Effects on PV Loop**:\n" +
                    "1. **Isovolumetric Contraction**: The aortic valve opens at a higher pressure, truncating the ejection phase.\n" +
                    "2. **Ejection Phase**: Left ventricular pressure climbs higher, but **End-Systolic Volume (ESV)** increases because the ventricle ejects against higher impedance.\n" +
                    "3. **Outcome**: Stroke volume ($SV = EDV - ESV$) and ejection fraction decrease, while myocardial oxygen consumption ($MVO_2$) increases substantially.\n\n" +
                    "💡 *Socratic Question for You*: In chronic aortic stenosis, how does the left ventricle remodel its geometry (concentric vs eccentric hypertrophy) to normalize wall stress according to Laplace's Law ($σ = P \\cdot r / 2h$)?\n\n" +
                    "📖 *References: Lilly's Pathophysiology of Heart Disease (7th ed.), Ch. 1 & 8; Costanzo Physiology, Ch. 4.*";
        }

        if (lower.contains("acid") || lower.contains("base") || lower.contains("ph") || lower.contains("bicarbonate") || lower.contains("anion gap") || ctx.contains("acid-base")) {
            return "### Acid-Base Balance & Physiological Compensation\n\n" +
                    "Systemic pH is governed by the **Henderson-Hasselbalch equation**:\n" +
                    "$$\\text{pH} = 6.1 + \\log_{10}\\left(\\frac{[\\text{HCO}_3^-]}{0.03 \\times P_{\\text{aCO}_2}}\\right)$$\n\n" +
                    "**Systemic Defense Hierarchy**:\n" +
                    "1. **Chemical Buffers (Immediate)**: Extracellular bicarbonate ($HCO_3^-$) and intracellular proteins/phosphates buffer $H^+$ ions within seconds.\n" +
                    "2. **Respiratory Compensation (Minutes to Hours)**: Peripheral and central chemoreceptors modulate alveolar ventilation to rapidly alter $P_{\\text{aCO}_2}$.\n" +
                    "3. **Renal Compensation (Days)**: Proximal tubule $H^+$ secretion/$HCO_3^-$ reabsorption and collecting duct intercalated cell ammoniagenesis restore base reserves.\n\n" +
                    "💡 *Socratic Question for You*: In a patient with severe diabetic ketoacidosis ($pH = 7.15, HCO_3^- = 8\\text{ mEq/L}$), what respiratory pattern (Kussmaul breathing) do you expect to observe, and how does this affect arterial $P_{\\text{aCO}_2}$?\n\n" +
                    "📖 *References: West's Respiratory Physiology, Ch. 6; Guyton and Hall, Ch. 31.*";
        }

        if (lower.contains("action potential") || lower.contains("depolarization") || lower.contains("sodium") || lower.contains("potassium") || lower.contains("hodgkin") || ctx.contains("nerve")) {
            return "### Ionic Foundations of the Action Potential\n\n" +
                    "The neuronal and cardiac action potential reflects dynamic, time- and voltage-dependent alterations in membrane permeability ($P_{Na}, P_K, P_{Ca}$):\n\n" +
                    "**Step-by-Step Sequence**:\n" +
                    "1. **Resting State (Phase 4)**: Resting membrane potential (~-70 to -90 mV) is predominantly established by high resting $K^+$ conductance ($K_{ir}$ channels) and $Na^+/K^+$ ATPase electrogenic pumping.\n" +
                    "2. **Upstroke (Phase 0)**: Threshold depolarization opens voltage-gated $Na^+$ channels ($Na_V1.5$ in myocardium, $Na_V1.1-1.6$ in neurons), triggering a regenerative inward $Na^+$ current.\n" +
                    "3. **Repolarization (Phase 3)**: $Na^+$ channel inactivation gates close, while delayed rectifier $K^+$ channels ($K_V$) open to drive outward $K^+$ current, repolarizing the cell.\n\n" +
                    "💡 *Socratic Question for You*: Why does severe hyperkalemia ([K+]out > 7.0 mM) paradoxical cause cardiac inexcitability and conduction block even though it brings the resting potential closer to threshold?\n\n" +
                    "📖 *References: Costanzo Physiology, Ch. 1; Berne & Levy Physiology (8th ed.), Ch. 3.*";
        }

        if (lower.contains("gfr") || lower.contains("renal") || lower.contains("glomerul") || lower.contains("filtration") || ctx.contains("renal")) {
            return "### Glomerular Filtration Dynamics & Starling Forces\n\n" +
                    "**Glomerular Filtration Rate (GFR)** is determined by the ultrafiltration coefficient ($K_f$) and the net Starling ultrafiltration pressure:\n" +
                    "$$\\text{GFR} = K_f \\times \\left[ (P_{gc} - P_{bs}) - (\\pi_{gc} - \\pi_{bs}) \\right]$$\n\n" +
                    "**Arteriolar Regulation**:\n" +
                    "- **Afferent Arteriolar Constriction** (e.g., NSAIDs inhibiting prostaglandins): Reduces $P_{gc}$, decreasing both GFR and Renal Plasma Flow (RPF).\n" +
                    "- **Efferent Arteriolar Constriction** (e.g., Angiotensin II): Elevates $P_{gc}$ to preserve GFR even when RPF falls, raising the **Filtration Fraction** ($FF = GFR / RPF$).\n\n" +
                    "💡 *Socratic Question for You*: If a patient with bilateral ureteral stones develops acute hydronephrosis, which Starling force is elevated ($P_{bs}$ or $\\pi_{gc}$), and how does that impact net ultrafiltration?\n\n" +
                    "📖 *References: Vander's Renal Physiology (9th ed.), Ch. 2; Guyton and Hall, Ch. 26.*";
        }

        if (lower.contains("spirometry") || lower.contains("fev1") || lower.contains("fvc") || lower.contains("lung") || lower.contains("compliance") || ctx.contains("respiratory")) {
            return "### Pulmonary Volumes & Spirometric Interpretation\n\n" +
                    "Pulmonary function tests distinguish between **Obstructive** and **Restrictive** ventilatory defects:\n\n" +
                    "| Parameter | Obstructive (e.g. COPD, Asthma) | Restrictive (e.g. Pulmonary Fibrosis) |\n" +
                    "| :--- | :--- | :--- |\n" +
                    "| **FEV1** | Significantly Reduced ($< 80\\%$) | Reduced in proportion to FVC |\n" +
                    "| **FVC** | Normal or Mildly Reduced | Significantly Reduced ($< 80\\%$) |\n" +
                    "| **FEV1/FVC Ratio** | **Reduced ($< 0.70$)** | **Normal or Increased ($> 0.75$)** |\n" +
                    "| **Total Lung Capacity** | Normal or Increased (Air Trapping) | Reduced ($< 80\\%$) |\n\n" +
                    "💡 *Socratic Question for You*: Why does radial traction from fibrous tissue in interstitial pulmonary fibrosis actually increase expiratory airflow rates at given lung volumes compared to normal?\n\n" +
                    "📖 *References: West's Respiratory Physiology: The Essentials (11th ed.), Ch. 7 & 8.*";
        }

        // Default Socratic response
        return "### Physiological Analysis: " + (context != null ? context : "Medical Physiology") + "\n\n" +
                "Let us analyze this physiological question step-by-step:\n\n" +
                "1. **Homeostatic Principle**: Every physiological system operates through tightly coupled sensory afferents, central integrating controllers, and effector organs utilizing negative feedback.\n" +
                "2. **Governing Biophysical Law**: When analyzing your question (*\"" + prompt.replace("\n", " ") + "\"*), consider how fluid dynamics, electrochemical gradients, and membrane transport kinetics govern the response.\n" +
                "3. **Clinical Correlation**: Alterations in these basal mechanisms lead directly to characteristic pathophysiological compensation states.\n\n" +
                "💡 *Socratic Exploration*: What is the primary initial stimulus or variable being perturbed here, and what is the body's immediate counter-regulatory reflex?\n\n" +
                "📖 *References: Guyton and Hall Textbook of Medical Physiology (14th ed.); Costanzo Physiology (7th ed.).*";
    }

    private void emitTokenStream(ResponseBodyEmitter emitter, String fullText) throws IOException {
        // Break into natural word/sentence tokens to provide smooth streaming
        String[] tokens = fullText.split("(?<=\\s)|(?<=\\n)");
        for (String token : tokens) {
            emitChunk(emitter, token);
        }
    }

    private void emitChunk(ResponseBodyEmitter emitter, String chunk) throws IOException {
        emitter.send(chunk);
    }
}
