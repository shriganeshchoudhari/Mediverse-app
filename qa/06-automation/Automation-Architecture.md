# Automation Architecture Blueprint

```text
Document ID:       QA-AUT-002
Title:             Playwright & Newman Automation Architecture
Version:           1.0.0
Status:            APPROVED
Owner:             SDET Lead
```

---

```text
automation/
├── playwright/
│   ├── tests/
│   │   ├── smoke/            # @smoke suite (<3 min)
│   │   ├── regression/       # @regression suite
│   │   ├── integration/      # Multi-system workflows
│   │   ├── e2e/              # Critical user journeys
│   │   └── synthetic/        # Production synthetic monitors
│   ├── pages/                # Page Object Models
│   ├── components/           # Reusable UI component models
│   ├── fixtures/             # Auth state and test fixtures
│   ├── utils/                # API helpers and data generators
│   ├── test-data/            # Synthetic data schemas
│   ├── config/               # Multi-env configurations
│   ├── reporters/            # Custom metrics and Allure listeners
│   └── playwright.config.ts  # Master Playwright configuration
│
└── postman/
    ├── collections/          # API Test suites (JSON)
    ├── environments/         # QA / Staging / Prod envs (JSON)
    ├── data/                 # Data-driven CSV/JSON fixtures
    ├── scripts/              # Newman execution shell scripts
    └── reports/              # Allure and JUnit XML outputs
```
