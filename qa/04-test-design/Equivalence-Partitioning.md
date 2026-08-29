# Equivalence Partitioning (EP) Standards

```text
Document ID:       QA-EP-001
Title:             Equivalence Partitioning Modeling & Specifications
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. Equivalence Partition Modeling for Authentication Password Strength

| Partition ID | Partition Description | Sample Representative Input | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **EP-PASS-01** | Valid Strong Password (>=8 chars, 1 Upper, 1 Lower, 1 Digit, 1 Special) | `Mediverse#2026!` | VALID (Accepted) |
| **EP-PASS-02** | Invalid Too Short (<8 characters) | `Med#1!` | INVALID (400 Bad Request) |
| **EP-PASS-03** | Invalid Missing Uppercase Letter | `mediverse#2026!` | INVALID (400 Bad Request) |
| **EP-PASS-04** | Invalid Missing Number | `Mediverse#Pass!` | INVALID (400 Bad Request) |
| **EP-PASS-05** | Invalid Missing Special Character | `Mediverse2026` | INVALID (400 Bad Request) |
| **EP-PASS-06** | Invalid Null / Empty String | `""` or `null` | INVALID (400 Bad Request) |
