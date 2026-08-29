# Postman Collection Standards

```text
Document ID:       QA-API-002
Title:             Postman Authoring & Variable Management Standards
Version:           1.0.0
Status:            APPROVED
Owner:             SDET Lead
```

---

## 1. Standard Collection Structure
- Folder-based isolation per microservice/resource (`/auth`, `/patients`, `/doctors`, `/appointments`, `/billing`).
- Environment variable masking: Secrets stored in environment with `current value` never committed to git.
