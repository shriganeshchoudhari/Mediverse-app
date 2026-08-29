# Production Validation Strategy

```text
Document ID:       QA-MON-002
Title:             Production Smoke & Live Validation Policy
Version:           1.0.0
Status:            APPROVED
Owner:             QA Lead & SRE
```

---

## 1. Zero-Impact Production Rules
1. Never create persistent state that alters real financial or clinical records.
2. Use dedicated synthetic test tenant (`tenant_id = 'synthetic_test_org'`).
3. Immediate automatic teardown of any transient test records.
