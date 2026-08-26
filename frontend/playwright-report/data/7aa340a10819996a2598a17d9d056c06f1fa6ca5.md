# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 13_exam_and_osce.spec.ts >> SPEC 13: Assessment Engine & OSCE Stations >> EXAM-001 & EXAM-003: OSCE Station evaluation and rubric scoring
- Location: e2e\specs\13_exam_and_osce.spec.ts:5:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/exam/osce
Call log:
  - navigating to "http://127.0.0.1:3000/exam/osce", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { ExamEnginePage } from '../pages/ExamEnginePage';
  3  | 
  4  | test.describe('SPEC 13: Assessment Engine & OSCE Stations', () => {
  5  |   test('EXAM-001 & EXAM-003: OSCE Station evaluation and rubric scoring', async ({ page }) => {
> 6  |     await page.goto('/exam/osce');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/exam/osce
  7  |     await expect(page.locator('h1, h2').first()).toContainText(/OSCE/i);
  8  |   });
  9  | });
  10 | 
```