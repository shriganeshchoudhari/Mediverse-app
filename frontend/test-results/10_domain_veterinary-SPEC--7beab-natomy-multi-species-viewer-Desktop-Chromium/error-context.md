# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 10_domain_veterinary.spec.ts >> SPEC 10: Domain 8 — Veterinary Science (BVSc & AH / MVSc) >> VET-001 & VET-003: BVSc portal and Comparative Anatomy multi-species viewer
- Location: e2e\specs\10_domain_veterinary.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/veterinary/comparative-anatomy
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/veterinary/comparative-anatomy", waiting until "load"

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test.describe('SPEC 10: Domain 8 — Veterinary Science (BVSc & AH / MVSc)', () => {
  4 |   test('VET-001 & VET-003: BVSc portal and Comparative Anatomy multi-species viewer', async ({ page }) => {
> 5 |     await page.goto('/healthcare/veterinary/comparative-anatomy');
    |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/veterinary/comparative-anatomy
  6 |     await expect(page.locator('h1, h2').first()).toContainText(/Comparative.*Anatomy|Veterinary/i);
  7 |   });
  8 | });
  9 | 
```