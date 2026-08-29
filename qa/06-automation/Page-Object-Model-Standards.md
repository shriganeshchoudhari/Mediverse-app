# Page Object Model (POM) Standards

```text
Document ID:       QA-AUT-006
Title:             Page Object Model & Component Standards
Version:           1.0.0
Status:            APPROVED
Owner:             Lead SDET
```

---

## 1. Standard POM Structure
Every Page Object must inherit from `BasePage`, encapsulate its locators as private `readonly Locator`, and expose high-level business action methods returning other Page Objects or state.
