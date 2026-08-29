# QA Metrics Strategy & Mathematical Formulations

```text
Document ID:       QA-MET-001
Title:             Enterprise Quality Engineering Metrics & Mathematical Models
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. Core Mathematical Formulations

### 1.1 Requirement Coverage ($RC$)
$$RC = \left( \frac{\text{Total Requirements with at least 1 Test Case}}{\text{Total Approved Requirements}} \right) \times 100$$
- **Target:** $100\%$ for P1/P2 requirements, $\ge 95\%$ overall.

### 1.2 Automation Coverage ($AC$)
$$AC = \left( \frac{\text{Total Automated Test Cases}}{\text{Total Automatable Test Cases}} \right) \times 100$$
- **Target:** $\ge 85\%$ across all regression suites; $100\%$ for smoke suites.

### 1.3 Defect Density ($DD$)
$$DD = \frac{\text{Total Verified Defects}}{\text{Kilo Lines of Code (KLoC)} \text{ or Story Points}}$$
- **Target:** $\le 1.5$ defects per KLoC or $\le 0.25$ defects per Story Point.

### 1.4 Defect Escape Rate ($DER$)
$$DER = \left( \frac{\text{Defects Discovered in Production}}{\text{Total Defects Found (Pre-Release + Production)}} \right) \times 100$$
- **Target:** $< 2.0\%$.

### 1.5 Flaky Test Rate ($FTR$)
$$FTR = \left( \frac{\text{Number of Flaky Test Executions}}{\text{Total Automated Test Executions}} \right) \times 100$$
- **Target:** $< 1.0\%$. Quarantined if $> 2.0\%$.

### 1.6 Mean Time to Resolution ($MTTR$)
$$MTTR = \frac{\sum (\text{Defect Resolution Timestamp} - \text{Defect Creation Timestamp})}{\text{Total Resolved Defects}}$$
- **Target:** S1 $< 4$ Hours, S2 $< 24$ Hours.

### 1.7 Test Automation ROI ($ROI$)
$$ROI = \frac{(\text{Manual Execution Time} - \text{Automated Execution Time}) \times \text{Runs} - \text{Maintenance Cost}}{\text{Automation Development Cost}}$$
