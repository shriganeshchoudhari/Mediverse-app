# WCAG 2.1 AA Accessibility Test Checklist — Mediverse Platform

```text
Document ID:       QA-CMP-006
Title:             WCAG 2.1 AA Accessibility Test Checklist
Version:           1.0.0
Status:            APPROVED
Owner:             QA Architect / Frontend Lead
Reviewer:          Engineering Manager, SDET Lead
Approver:          CTO
Created Date:      2026-08-29
Last Updated:      2026-08-29
Review Frequency:  Every Release + Quarterly
Change History:    v1.0.0 — Initial checklist
```

> **Standard:** WCAG 2.1 Level AA  
> **Tool:** `@axe-core/playwright` integrated in spec `15_accessibility_and_responsive.spec.ts`  
> **Scope:** All 15 Mediverse frontend modules across 9 medical domains

---

## 1. WCAG Principle 1 — Perceivable

### 1.1 Text Alternatives (WCAG 1.1.1 — Level A)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 1.1.1 | All `<img>` elements have non-empty `alt` text | axe-core | 0 violations |
| 1.1.2 | Decorative images have `alt=""` or `role="presentation"` | axe-core | 0 violations |
| 1.1.3 | 3D anatomy model (React Three Fiber canvas) has text description | Manual | `aria-label` or adjacent description present |
| 1.1.4 | ECG simulator graph has accessible data table alternative | Manual | Data table present or linked |
| 1.1.5 | Medical diagrams in curriculum have descriptive alt text | Manual + axe | All diagram `alt` text reviewed |

### 1.2 Captions and Audio Description (WCAG 1.2 — Level AA)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 1.2.1 | Video content has captions | Manual | CC available or not applicable |
| 1.2.2 | Audio content has transcripts | Manual | Transcript present or N/A |

### 1.3 Adaptable Content (WCAG 1.3 — Level A)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 1.3.1 | Semantic HTML used — headings, lists, tables | axe-core | 0 landmark violations |
| 1.3.2 | OSCE timer countdown has `role="timer"` and `aria-live="polite"` | Manual + axe | Correct ARIA role present |
| 1.3.3 | Form error messages linked via `aria-describedby` | axe-core | 0 form violations |
| 1.3.4 | MCQ radio buttons in aria group | axe-core | `role="group"` with `aria-labelledby` |
| 1.3.5 | Input purpose identified (autocomplete attributes) | axe-core | Autocomplete correct on login, registration |

### 1.4 Distinguishable (WCAG 1.4 — Level AA)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 1.4.1 | Color alone not used to convey information | Manual | Status indicators have text/icon supplement |
| 1.4.2 | Text contrast ratio ≥ 4.5:1 (normal text) | axe-core | 0 color-contrast violations |
| 1.4.3 | Large text contrast ratio ≥ 3:1 | axe-core | 0 color-contrast violations |
| 1.4.4 | Text resizes to 200% without loss of content | Manual / Playwright viewport | No overflow or truncation at 200% |
| 1.4.5 | Images of text avoided (except logos) | Manual | No screenshots of text used as UI |
| 1.4.10 | Content reflows at 320px width without horizontal scroll | Playwright Mobile viewport | No horizontal scroll at 320px |
| 1.4.11 | Non-text contrast ≥ 3:1 (borders, icons) | axe-core | 0 violations |
| 1.4.12 | Text spacing overrides do not break layout | Manual CSS override | Content readable with 1.5× line height |
| 1.4.13 | Hover/focus content (tooltips) dismissible and persistent | Manual | Tooltip stays on hover; dismissible via ESC |

---

## 2. WCAG Principle 2 — Operable

### 2.1 Keyboard Accessible (WCAG 2.1 — Level A)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 2.1.1 | All interactive elements keyboard accessible | Manual + axe | Tab reaches every control |
| 2.1.2 | No keyboard trap (focus doesn't get stuck) | Manual | ESC or Tab can exit modal/focus |
| 2.1.3 | OSCE timer pause/resume keyboard accessible | Manual | Keyboard shortcut documented |
| 2.1.4 | Custom keyboard shortcuts documented | Docs check | Shortcut reference in help page |

### 2.2 Timing (WCAG 2.2 — Level A)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 2.2.1 | OSCE timer extendable by user (if allowed) | Playwright | Extension request option present |
| 2.2.2 | Auto-rotating content has pause control | Manual | Carousel/slideshow has pause button |
| 2.2.3 | Session timeout warning ≥ 20 second warning | Playwright | Warning dialog appears before logout |

### 2.3 Seizures (WCAG 2.3 — Level A)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 2.3.1 | No content flashes > 3 times per second | Manual review | No animation exceeds threshold |

### 2.4 Navigable (WCAG 2.4 — Level AA)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 2.4.1 | Skip navigation link present | axe-core + Manual | "Skip to main content" link at top |
| 2.4.2 | Pages have descriptive `<title>` | axe-core | Title = "Module — Mediverse" pattern |
| 2.4.3 | Focus order logical (top→bottom, left→right) | Manual keyboard nav | Tab order matches visual order |
| 2.4.4 | Link text descriptive (no "click here") | axe-core | 0 ambiguous link violations |
| 2.4.5 | Multiple navigation paths available | Manual | Breadcrumb + menu + search |
| 2.4.6 | Headings and labels descriptive | axe-core | H1→H2→H3 hierarchy correct |
| 2.4.7 | Keyboard focus visible | axe-core + Manual | Focus ring visible on all interactive elements |

### 2.5 Input Modalities (WCAG 2.5 — Level A/AA)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 2.5.1 | Pointer gestures have single-pointer alternative | Manual | No pinch-only interactions |
| 2.5.3 | Button label matches visible text | axe-core | 0 label mismatch violations |
| 2.5.4 | Motion-activated features have button alternative | Manual | Shake/motion: not applicable or has button |

---

## 3. WCAG Principle 3 — Understandable

### 3.1 Readable (WCAG 3.1 — Level A)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 3.1.1 | HTML lang attribute set correctly | axe-core | `<html lang="en">` present |
| 3.1.2 | Language of parts marked when switching | axe-core | Medical Latin terms marked `lang="la"` if appropriate |

### 3.2 Predictable (WCAG 3.2 — Level A/AA)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 3.2.1 | Focus does not trigger unexpected context change | Manual | Focusing a field doesn't submit form |
| 3.2.2 | Changing input value doesn't submit without confirmation | Manual | Domain selector change has confirm dialog |
| 3.2.3 | Navigation consistent across all 9 domain portals | Playwright | Navbar structure identical across domains |
| 3.2.4 | Consistent component identification | Manual | "Submit" button labeled identically throughout |

### 3.3 Input Assistance (WCAG 3.3 — Level A/AA)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 3.3.1 | Form errors identified in text | axe-core | Error message text present (not color only) |
| 3.3.2 | Labels for all form fields | axe-core | 0 label violations |
| 3.3.3 | Error suggestions provided | Manual | Error message explains how to fix |
| 3.3.4 | Reversible submissions for exam answers | Manual | Review page before OSCE submit |

---

## 4. WCAG Principle 4 — Robust

### 4.1 Compatible (WCAG 4.1 — Level A/AA)

| # | Test | Tool | Pass Criteria |
|---|---|---|---|
| 4.1.1 | Valid HTML parsing — no duplicate IDs | axe-core | 0 duplicate-id violations |
| 4.1.2 | ARIA roles and properties correctly used | axe-core | 0 aria-* violations |
| 4.1.3 | Status messages use `aria-live` | axe-core + Manual | Toast/alert = `role="status"` or `aria-live="polite"` |

---

## 5. Automated Playwright / axe-core Integration

```typescript
// Example: accessibility audit in every E2E test
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.1 AA — Dashboard', () => {
  test('Dashboard page has no accessibility violations', async ({ page }) => {
    await page.goto('/dashboard');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
```

---

## 6. Browser / AT Compatibility Matrix

| Browser | Assistive Technology | Must Pass |
|---|---|---|
| Chrome | NVDA (Windows) | ✅ Required |
| Chrome | VoiceOver (macOS) | ✅ Required |
| Firefox | NVDA (Windows) | ✅ Required |
| Safari | VoiceOver (iOS) | ✅ Required |
| Edge | Narrator (Windows) | ⚠️ Recommended |

---

## 7. Release Gate: Accessibility Sign-Off

| Checklist Item | Verified By | Date | Status |
|---|---|---|---|
| axe-core violations = 0 across all 15 specs | SDET Lead | | ☐ |
| Keyboard navigation tested on all modals and forms | QA Architect | | ☐ |
| Color contrast verified on both Light and Dark themes | FE Lead | | ☐ |
| OSCE timer and MCQ accessible via keyboard only | SDET Lead | | ☐ |
| Screen reader tested on NVDA + Chrome | QA Architect | | ☐ |
| Mobile viewport reflow verified at 320px | SDET Lead | | ☐ |
| Skip navigation link present on all pages | FE Lead | | ☐ |

**Sign-off:** ___________________________ **Date:** _______________  
**Role:** QA Architect / Frontend Lead
