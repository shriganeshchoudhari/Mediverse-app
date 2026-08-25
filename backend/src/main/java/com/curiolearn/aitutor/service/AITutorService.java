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
    private final com.curiolearn.common.SimpleCircuitBreaker circuitBreaker;

    public AITutorService(RagService ragService) {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(6000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
        this.ragService = ragService;
        this.circuitBreaker = new com.curiolearn.common.SimpleCircuitBreaker("GeminiLLM", 3, 30000);
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
            String responseText = circuitBreaker.execute(
                    () -> {
                        try {
                            return callGemini(prompt, request.getContext(), request.getHistory());
                        } catch (Exception e) {
                            throw new RuntimeException("Gemini API invocation failed", e);
                        }
                    },
                    () -> generateSocraticPedagogicalResponse(prompt, request.getContext())
            );
            emitTokenStream(emitter, responseText);
            return;
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

        // 1. DENTAL DOMAIN
        if (lower.contains("tooth") || lower.contains("dental") || lower.contains("ian block") || lower.contains("periodont") || lower.contains("cephalometric") || ctx.contains("dental") || ctx.contains("bds")) {
            return "### Dental Science & Stomatological Analysis: " + (context != null ? context : "Oral & Maxillofacial Principles") + "\n\n" +
                    "**Clinical Principle**:\n" +
                    "1. **Anatomical Triad**: Dental procedures depend on precise spatial understanding of the alveolar arch, neurovascular pathways (e.g., Inferior Alveolar Nerve entering the mandibular foramen bounded by the lingula), and periodontal ligament proprioception.\n" +
                    "2. **Biomechanics of Mastication**: Occlusal forces are transmitted through the enamel prisms and dentinal tubules to the alveolar bone, governing restorative material selection and orthodontic vector planning.\n" +
                    "3. **Pulp-Dentin Complex**: Odontoblast processes maintain dentin tubule fluid flow; hydrodynamic fluid movement triggers A-delta nerve fiber firing during hypersensitivity.\n\n" +
                    "💡 *Socratic Question for You*: During an Inferior Alveolar Nerve (IAN) block, if you contact bone too early (<15 mm penetration), what anatomical error was made in your syringe orientation across the contralateral premolars?\n\n" +
                    "📖 *References: Wheeler's Dental Anatomy, Physiology and Occlusion; Malamed's Handbook of Local Anesthesia.*";
        }

        // 2. PHARMACY DOMAIN
        if (lower.contains("pkpd") || lower.contains("pharmacokinetics") || lower.contains("half-life") || lower.contains("clearance") || lower.contains("volume of distribution") || lower.contains("cytochrome") || ctx.contains("pharmacy") || ctx.contains("pharmd") || ctx.contains("bpharm")) {
            return "### Pharmacokinetics & Clinical Pharmacology: " + (context != null ? context : "PK/PD Kinetics") + "\n\n" +
                    "**Core Mathematical & Mechanistic Framework**:\n" +
                    "1. **Volume of Distribution ($V_d$)**: Relates total drug amount in the body ($D$) to plasma concentration ($C_p$): $V_d = D / C_p$. High lipophilicity results in extensive tissue sequestration and extremely large apparent $V_d$.\n" +
                    "2. **Elimination Kinetics**: First-order elimination rate constant $k_e = \\text{Clearance} / V_d$, yielding elimination half-life $t_{1/2} = (0.693 \\times V_d) / \\text{CL}$.\n" +
                    "3. **Steady-State ($C_{ss}$)**: Reached after $4-5$ half-lives during constant-rate IV infusion ($C_{ss} = R_0 / \\text{CL}$).\n\n" +
                    "💡 *Socratic Question for You*: If a patient with acute renal failure experiences a 50% drop in renal clearance for a hydrophilic drug that is 100% renally cleared, how must you adjust the maintenance dose and the loading dose?\n\n" +
                    "📖 *References: Goodman & Gilman's The Pharmacological Basis of Therapeutics (14th ed.); Shargel's Applied Biopharmaceutics & Pharmacokinetics.*";
        }

        // 3. NURSING DOMAIN
        if (lower.contains("news2") || lower.contains("iv drip") || lower.contains("braden") || lower.contains("wound staging") || lower.contains("triage") || ctx.contains("nursing") || ctx.contains("bscnursing")) {
            return "### Nursing Clinical Decision-Making: " + (context != null ? context : "Patient Care & Escalation Protocol") + "\n\n" +
                    "**Evidence-Based Clinical Protocol**:\n" +
                    "1. **Vital Sign Synthesis (NEWS2)**: Physiologic deterioration follows predictable trajectories. An aggregate NEWS2 score $\\ge 5$ or a single extreme parameter score of 3 triggers immediate bedside escalation and critical care alert.\n" +
                    "2. **Drip Rate Formula**: For gravity IV infusions: $\\text{Drop Rate (gtt/min)} = [\\text{Volume (mL)} \\times \\text{Drop Factor (gtt/mL)}] / \\text{Time (min)}$.\n" +
                    "3. **Skin Integrity (Braden Scale)**: Quantifies sensory perception, moisture, activity, mobility, nutrition, and friction/shear. Scores $\\le 12$ mandate high-risk pressure injury prevention bundles.\n\n" +
                    "💡 *Socratic Question for You*: In a post-operative patient whose respiratory rate drops to 8 breaths/min with an SpO2 of 88% on room air while receiving patient-controlled analgesia (PCA morphine), what is your immediate first nursing action before calling the rapid response team?\n\n" +
                    "📖 *References: Potter & Perry's Fundamentals of Nursing; Royal College of Physicians NEWS2 Standard.*";
        }

        // 4. PHYSIOTHERAPY DOMAIN
        if (lower.contains("gait") || lower.contains("biomechanics") || lower.contains("joint kinematics") || lower.contains("pnf") || lower.contains("trendelenburg") || ctx.contains("physiotherapy") || ctx.contains("bpt") || ctx.contains("mpt")) {
            return "### Physiotherapy & Kinesiological Biomechanics: " + (context != null ? context : "Movement & Rehabilitation Science") + "\n\n" +
                    "**Movement Science Framework**:\n" +
                    "1. **Gait Cycle Phases**: Stance (60%) and Swing (40%) phases require synchronized concentric acceleration, eccentric deceleration, and isometric stabilization.\n" +
                    "2. **Pathomechanics**: Weakness in the gluteus medius produces a **Trendelenburg gait** (pelvic drop of the contralateral unweighted limb during single-leg stance).\n" +
                    "3. **Proprioceptive Neuromuscular Facilitation (PNF)**: Uses spiral and diagonal movement patterns combined with reciprocal innervation to restore motor control.\n\n" +
                    "💡 *Socratic Question for You*: In a patient post-stroke exhibiting right-sided foot drop due to anterior tibialis paresis, which abnormal compensatory gait deviation (e.g. circumduction or high-steppage) prevents toe dragging during swing phase?\n\n" +
                    "📖 *References: Magee's Orthopedic Physical Assessment; Perry's Gait Analysis: Normal and Pathological Function.*";
        }

        // 5. AYUSH DOMAIN
        if (lower.contains("dosha") || lower.contains("prakriti") || lower.contains("vata") || lower.contains("pitta") || lower.contains("kapha") || lower.contains("panchakarma") || lower.contains("marma") || ctx.contains("ayush") || ctx.contains("bams") || ctx.contains("bhms")) {
            return "### AYUSH Holistic Science & Tridosha Dynamics: " + (context != null ? context : "Fundamental Ayurvedic Principles") + "\n\n" +
                    "**Classical Pedagogical Framework**:\n" +
                    "1. **Tridosha Equilibrium**: Health (*Swastha*) is defined by balanced functional energies: *Vata* (kinetic/neuronal), *Pitta* (thermal/metabolic), and *Kapha* (structural/anabolic).\n" +
                    "2. **Dravyaguna Pharmacology**: Herbs and formulations are evaluated based on *Rasa* (taste), *Guna* (qualities), *Virya* (potency/energy), *Vipaka* (post-digestive effect), and *Prabhava* (specific therapeutic affinity).\n" +
                    "3. **Panchakarma Detoxification**: Sequential preparatory (*Purvakarma*: Snehana, Swedana), main eliminative (*Pradhanakarma*: Vamana, Virechana, Basti, Nasya, Raktamokshana), and post-procedural dietary rehabilitation (*Paschatkarma*).\n\n" +
                    "💡 *Socratic Question for You*: In an individual with chronic joint stiffness that worsens in cold and windy conditions (aggravated *Vata*), which quality (*Guna*) and temperature (*Virya*) of therapeutic oil must be chosen for Abhyanga?\n\n" +
                    "📖 *References: Charaka Samhita (Sutra Sthana); Sushruta Samhita (Sharira Sthana); CCIM Curriculum Framework.*";
        }

        // 6. ALLIED HEALTH DOMAIN
        if (lower.contains("ecmo") || lower.contains("dialysis") || lower.contains("kt/v") || lower.contains("hounsfield") || lower.contains("ct window") || lower.contains("sterilization") || ctx.contains("allied") || ctx.contains("ot") || ctx.contains("perfusion")) {
            return "### Allied Health & Clinical Technology: " + (context != null ? context : "Advanced Technology & Instrumentation") + "\n\n" +
                    "**Instrumentation & Quantitative Mechanics**:\n" +
                    "1. **Extracorporeal Circuits (ECMO/CPB)**: VA-ECMO provides hemodynamic cardiac support + gas exchange; VV-ECMO provides isolated pulmonary gas exchange. Flow is determined by cannulation resistance and pump RPM.\n" +
                    "2. **Hemodialysis Clearance ($Kt/V$)**: Measures fractional urea clearance ($K = \\text{dialyzer clearance mL/min}, t = \\text{treatment time min}, V = \\text{urea distribution volume}$). Target single-pool $Kt/V \\ge 1.2$.\n" +
                    "3. **Radiological Hounsfield Units (HU)**: Quantifies tissue x-ray attenuation relative to water (0 HU), bone (+1000 HU), and air (-1000 HU).\n\n" +
                    "💡 *Socratic Question for You*: During a brain CT scan, why is a narrow Window Width (WW: 80, WL: 40) chosen for soft tissue stroke evaluation rather than the wide window used for bone fracture assessment (WW: 2000, WL: 500)?\n\n" +
                    "📖 *References: Daugirdas' Handbook of Dialysis; Gravlee's Cardiopulmonary Bypass: Principles and Practice.*";
        }

        // 7. VETERINARY DOMAIN
        if (lower.contains("ruminant") || lower.contains("rumen") || lower.contains("reticulum") || lower.contains("bovine") || lower.contains("equine") || lower.contains("canine") || lower.contains("zoonosis") || ctx.contains("veterinary") || ctx.contains("bvsc") || ctx.contains("mvsc")) {
            return "### Veterinary Medical Science: " + (context != null ? context : "Comparative Physiology & One Health") + "\n\n" +
                    "**Comparative & Clinical Principles**:\n" +
                    "1. **Ruminant Digestion**: Microbial fermentation in the reticulorumen produces Volatile Fatty Acids (acetate, propionate, butyrate) as primary energy substrates. Forage-concentrate ratios dictate rumen pH and prevent Subacute Ruminal Acidosis (SARA, pH < 5.5).\n" +
                    "2. **Comparative Anatomy**: Monogastric carnivores (canine/feline) possess a zonary placenta and simple stomach; equines are hindgut cecal fermenters prone to pelvic flexure colic; bovines utilize a 4-chambered stomach and cotyledonary placenta.\n" +
                    "3. **One Health & Zoonotic Transmission**: Cross-species spillover (Rabies, Anthrax, Brucellosis, Avian Influenza) requires strict biosecurity, vector control, and vaccination.\n\n" +
                    "💡 *Socratic Question for You*: In a high-producing dairy cow transitioned rapidly to high-starch concentrate grain, what biochemical shift in the acetate:propionate ratio occurs, and how does lactic acid accumulation precipitate ruminitis?\n\n" +
                    "📖 *References: Cunningham's Textbook of Veterinary Physiology (6th ed.); Radostits' Veterinary Medicine (10th ed.).*";
        }

        // 8. PUBLIC HEALTH DOMAIN
        if (lower.contains("epidemiol") || lower.contains("r0") || lower.contains("seir") || lower.contains("ayushman") || lower.contains("pm-jay") || lower.contains("icer") || lower.contains("qaly") || lower.contains("nabh") || ctx.contains("public-health") || ctx.contains("mph") || ctx.contains("mha")) {
            return "### Public Health & Health Systems Administration: " + (context != null ? context : "Epidemiology & Policy Science") + "\n\n" +
                    "**Epidemiological & Economic Principles**:\n" +
                    "1. **Mathematical Infectious Disease Modeling (SEIR)**: Basic Reproduction Number ($R_0$) defines the average secondary infections from an index case in a fully susceptible population. Herd Immunity Threshold = $1 - 1/R_0$.\n" +
                    "2. **Health Economics (ICER)**: Incremental Cost-Effectiveness Ratio $\\text{ICER} = (\\text{Cost}_B - \\text{Cost}_A) / (\\text{QALY}_B - \\text{QALY}_A)$. Interventions with $\\text{ICER} < 1 \\times \\text{GDP per capita}$ are highly cost-effective.\n" +
                    "3. **Universal Health Coverage (PM-JAY)**: Pre-authorized tertiary care packages and cashless hospital network accreditation (NABH standards) mitigate catastrophic health expenditures.\n\n" +
                    "💡 *Socratic Question for You*: If a novel respiratory pathogen has an $R_0 = 4.0$, what percentage of the population must be effectively immunized to achieve herd immunity and halt epidemic transmission in the absence of non-pharmaceutical interventions?\n\n" +
                    "📖 *References: Gordis Epidemiology (6th ed.); Drummond's Methods for the Economic Evaluation of Health Care Programmes.*";
        }

        // 9. ALLOPATHIC / MBBS CARDIOPULMONARY & PHYSIOLOGICAL PRINCIPLES
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
        return "### Medical & Health Sciences Pedagogical Analysis: " + (context != null ? context : "Healthcare Sciences") + "\n\n" +
                "Let us analyze this clinical and scientific concept step-by-step:\n\n" +
                "1. **First-Principles Foundation**: Every biological and health system operates through fundamental chemical, physiological, or pathological equilibrium states.\n" +
                "2. **Systemic Mechanism**: When analyzing (*\"" + prompt.replace("\n", " ") + "\"*), consider how structural morphology, functional kinetics, and regulatory homeostatic loops interact.\n" +
                "3. **Clinical Application**: Deviations from baseline parameters produce characteristic clinical signs, laboratory alterations, and diagnostic indicators.\n\n" +
                "💡 *Socratic Exploration*: What is the primary underlying anatomical, pharmacological, or physiological variable governing this presentation?\n\n" +
                "📖 *References: Standard Competency Curriculum Guidelines (NMC, DCI, PCI, INC, IAP, NCAHP, VCI, CCIM).*";
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
