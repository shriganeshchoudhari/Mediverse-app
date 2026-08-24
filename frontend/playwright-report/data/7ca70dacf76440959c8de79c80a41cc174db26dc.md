# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 11_domain_public_health.spec.ts >> SPEC 11: Domain 9 — Public Health & Hospital Admin (MPH / MHA) >> PUB-001 & PUB-003: MPH portal and Epidemic Outbreak SEIR simulator
- Location: e2e\specs\11_domain_public_health.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/public-health/epidemic-outbreak
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/public-health/epidemic-outbreak", waiting until "load"

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test.describe('SPEC 11: Domain 9 — Public Health & Hospital Admin (MPH / MHA)', () => {
  4 |   test('PUB-001 & PUB-003: MPH portal and Epidemic Outbreak SEIR simulator', async ({ page }) => {
> 5 |     await page.goto('/healthcare/public-health/epidemic-outbreak');
    |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/public-health/epidemic-outbreak
  6 |     await expect(page.locator('h1, h2').first()).toContainText(/Epidemic|Outbreak/i);
  7 |   });
  8 | });
  9 | 
```