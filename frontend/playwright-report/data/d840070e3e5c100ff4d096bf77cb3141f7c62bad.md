# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 14_cms_curriculum_authoring.spec.ts >> SPEC 14: CMS Lesson Editor & Taxonomy Tree >> CMS-001 & CMS-002: Curriculum Anchor Modal Workflow
- Location: e2e\specs\14_cms_curriculum_authoring.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/auth/login
Call log:
  - navigating to "http://127.0.0.1:3000/auth/login", waiting until "load"

```

# Test source

```ts
  1  | import { test as base, Page } from '@playwright/test';
  2  | 
  3  | export interface AuthFixtures {
  4  |   authenticatedPage: Page;
  5  |   adminPage: Page;
  6  | }
  7  | 
  8  | export const test = base.extend<AuthFixtures>({
  9  |   authenticatedPage: async ({ page }, use) => {
  10 |     await page.goto('/auth/login');
  11 |     await page.evaluate(() => {
  12 |       localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50QG1lZGl2ZXJzZS5lZHUiLCJleHAiOjk5OTk5OTk5OTl9.mockStudentSignature');
  13 |       localStorage.setItem('user', JSON.stringify({
  14 |         userId: 'student-e2e-01',
  15 |         email: 'student@mediverse.edu',
  16 |         firstName: 'Dr. Alex',
  17 |         lastName: 'Sharma',
  18 |         role: 'STUDENT',
  19 |         enrolledProgram: 'MBBS',
  20 |         healthcareDomain: 'ALLOPATHIC',
  21 |       }));
  22 |     });
  23 |     await page.goto('/dashboard');
  24 |     await use(page);
  25 |   },
  26 | 
  27 |   adminPage: async ({ page }, use) => {
> 28 |     await page.goto('/auth/login');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/auth/login
  29 |     await page.evaluate(() => {
  30 |       localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBtZWRpdmVyc2UuZWR1IiwiZXhwIjo5OTk5OTk5OTk5fQ.mockAdminSignature');
  31 |       localStorage.setItem('user', JSON.stringify({
  32 |         userId: 'admin-e2e-01',
  33 |         email: 'admin@mediverse.edu',
  34 |         firstName: 'Prof. Sarah',
  35 |         lastName: 'Vance',
  36 |         role: 'ADMIN',
  37 |         enrolledProgram: 'ALLOPATHIC',
  38 |         healthcareDomain: 'ALLOPATHIC',
  39 |       }));
  40 |     });
  41 |     await page.goto('/dashboard');
  42 |     await use(page);
  43 |   },
  44 | });
  45 | 
  46 | export { expect } from '@playwright/test';
  47 | 
```