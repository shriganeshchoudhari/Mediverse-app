# Playwright Framework Design

```text
Document ID:       QA-AUT-003
Title:             Playwright Framework Engineering Standards
Version:           1.0.0
Status:            APPROVED
Owner:             SDET Lead
```

---

## 1. Core Engineering Tenets
1. **Authentication Storage State:** Use `storageState` to bypass repetitive UI logins across regression tests.
2. **Page Object & Component Object Separation:** Reusable elements (Header, Navbar, Patient Card) belong in `components/`.
3. **Deterministic Synchronization:** Utilize web-first assertions (`expect(locator).toBeVisible()`). Zero static sleeps.
