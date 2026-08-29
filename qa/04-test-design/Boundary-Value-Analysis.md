# Boundary Value Analysis (BVA) Standards

```text
Document ID:       QA-BVA-001
Title:             Boundary Value Analysis Specification & Worked Examples
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. 2-Point and 3-Point BVA Models

```text
2-Point BVA:  [ Boundary Value ] and [ Boundary Value ± 1 ]
3-Point BVA:  [ Boundary Value - 1 ], [ Exact Boundary Value ], [ Boundary Value + 1 ]
```

---

## 2. Concrete Worked Examples in Mediverse

### Example 1: Patient Consultation Note Length (Allowed: 10 to 5,000 Characters)
| Test Point | Input Character Count | Expected Result | Classification |
| :--- | :---: | :--- | :--- |
| **Below Min** | 9 characters | 400 Bad Request ("Note must be at least 10 characters") | Invalid Boundary |
| **Exact Min** | 10 characters | 200 OK (Note saved successfully) | Valid Boundary |
| **Above Min** | 11 characters | 200 OK (Note saved successfully) | Valid Interior |
| **Below Max** | 4,999 characters | 200 OK (Note saved successfully) | Valid Interior |
| **Exact Max** | 5,000 characters | 200 OK (Note saved successfully) | Valid Boundary |
| **Above Max** | 5,001 characters | 400 Bad Request ("Note cannot exceed 5000 characters") | Invalid Boundary |

### Example 2: Patient Age at Registration (Allowed: 0 to 125 Years)
| Test Point | Input Age | Expected Result | Classification |
| :--- | :---: | :--- | :--- |
| **Negative Age** | -1 | 422 Unprocessable Entity ("Age cannot be negative") | Invalid Boundary |
| **Minimum Age** | 0 (Newborn) | 201 Created (Requires Guardian details) | Valid Boundary |
| **Maximum Age** | 125 | 201 Created | Valid Boundary |
| **Exceeding Age**| 126 | 422 Unprocessable Entity ("Invalid age specified") | Invalid Boundary |
