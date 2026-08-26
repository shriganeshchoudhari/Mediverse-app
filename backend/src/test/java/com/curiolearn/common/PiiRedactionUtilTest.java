package com.curiolearn.common;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PiiRedactionUtilTest {

    @Test
    public void testEmailRedaction() {
        String input = "Please contact me at student.doctor@mediverse.edu or test@gmail.com";
        String redacted = PiiRedactionUtil.redact(input);
        assertFalse(redacted.contains("student.doctor@mediverse.edu"));
        assertFalse(redacted.contains("test@gmail.com"));
        assertTrue(redacted.contains("[REDACTED_EMAIL]"));
    }

    @Test
    public void testPhoneRedaction() {
        String input = "Call the attending physician at +91 9876543210 or 555-123-4567";
        String redacted = PiiRedactionUtil.redact(input);
        assertFalse(redacted.contains("9876543210"));
        assertTrue(redacted.contains("[REDACTED_PHONE]"));
    }

    @Test
    public void testPatientIdAndNameRedaction() {
        String input = "Patient Name: Rahul Sharma, MRN: MED-987654. Examined by Dr. Smith";
        String redacted = PiiRedactionUtil.redact(input);
        assertFalse(redacted.contains("Rahul Sharma"));
        assertFalse(redacted.contains("MED-987654"));
        assertTrue(redacted.contains("[REDACTED_PATIENT_NAME]"));
        assertTrue(redacted.contains("[REDACTED_MRN]"));
    }

    @Test
    public void testNationalIdRedaction() {
        String input = "Patient Aadhaar: 1234 5678 9012, SSN: 123-45-6789";
        String redacted = PiiRedactionUtil.redact(input);
        assertFalse(redacted.contains("1234 5678 9012"));
        assertFalse(redacted.contains("123-45-6789"));
        assertTrue(redacted.contains("[REDACTED_AADHAAR]"));
        assertTrue(redacted.contains("[REDACTED_SSN]"));
    }
}