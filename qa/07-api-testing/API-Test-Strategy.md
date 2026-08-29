# API Test Strategy

```text
Document ID:       QA-API-001
Title:             REST API Test Strategy & Contract Verification
Version:           1.0.0
Status:            APPROVED
Owner:             SDET Lead
```

---

## 1. Verification Layers
1. **Contract & Schema Testing:** Verifying response against OpenAPI 3.0 specification.
2. **Business Flow Testing:** Chained API execution (Register -> Login -> Book -> Pay -> Verify Invoice).
3. **Negative & Security API Testing:** 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Rate Limited.
