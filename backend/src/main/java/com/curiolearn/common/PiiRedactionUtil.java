package com.curiolearn.common;

import java.util.regex.Pattern;

/**
 * Utility for sanitizing and redacting Personally Identifiable Information (PII)
 * such as patient/student names, MRNs, phone numbers, emails, and government IDs
 * prior to dispatching prompts to external cloud LLM APIs.
 */
public final class PiiRedactionUtil {

    private PiiRedactionUtil() {}

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "\\b(?:\\+91[-.\\s]?)?[6-9]\\d{9}\\b|\\b\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b"
    );

    private static final Pattern AADHAAR_PATTERN = Pattern.compile(
            "\\b\\d{4}[-\\s]\\d{4}[-\\s]\\d{4}\\b"
    );

    private static final Pattern SSN_PATTERN = Pattern.compile(
            "\\b\\d{3}-\\d{2}-\\d{4}\\b"
    );

    private static final Pattern MRN_PATTERN = Pattern.compile(
            "(?i)\\b(?:MRN|Medical Record Number|Hospital ID|UHID|Patient ID)[\\s:#-]+[A-Za-z0-9-]{4,20}\\b"
    );

    private static final Pattern PATIENT_NAME_PATTERN = Pattern.compile(
            "(?i)\\b(?:Patient Name|Patient's Name|Pt Name)[\\s:#]+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)+)\\b"
    );

    private static final Pattern SALUTATION_NAME_PATTERN = Pattern.compile(
            "\\b(?:Mr\\.|Mrs\\.|Ms\\.)\\s+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)+)\\b"
    );

    public static String redact(String text) {
        if (text == null || text.isBlank()) {
            return text;
        }

        String result = text;
        result = MRN_PATTERN.matcher(result).replaceAll("MRN: [REDACTED_MRN]");
        result = PATIENT_NAME_PATTERN.matcher(result).replaceAll("Patient Name: [REDACTED_PATIENT_NAME]");
        result = SALUTATION_NAME_PATTERN.matcher(result).replaceAll("[REDACTED_NAME]");
        result = EMAIL_PATTERN.matcher(result).replaceAll("[REDACTED_EMAIL]");
        result = PHONE_PATTERN.matcher(result).replaceAll("[REDACTED_PHONE]");
        result = AADHAAR_PATTERN.matcher(result).replaceAll("[REDACTED_AADHAAR]");
        result = SSN_PATTERN.matcher(result).replaceAll("[REDACTED_SSN]");

        return result;
    }
}