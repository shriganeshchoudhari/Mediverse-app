# Contributing Guidelines

Thank you for contributing to the Interactive Physiology Learning Platform. Please follow these guidelines to keep code, documentation, and educational materials production-ready and medically accurate.

---

## Coding Standards

### Frontend (Next.js / React / TypeScript)
- Use **functional components** and Hooks.
- Define explicit **TypeScript interfaces** for all props and state variables.
- Follow a strict component classification:
  * `components/ui/` - Dumb / styling components (e.g. Buttons, Cards, Dialogs).
  * `components/3d/` - Three.js/R3F scenes and visualization components.
  * `components/simulators/` - Mathematical simulation and graphing canvas views.
  * `components/lessons/` - Syllabus rendering, narration, and page-layout controllers.
- Use Tailwind CSS utility classes alongside vanilla CSS custom variables for dark/light mode theming.
- Make all interactive items accessible: follow WCAG AA guidelines (ensure correct ARIA properties and keyboard focus outlines).

### Backend (Spring Boot / Java 21)
- Write code utilizing **Java 21 language features** (e.g., Records, Pattern Matching, Switch Expressions).
- Follow standard MVC layering patterns:
  * `controller/` - REST API and WebSocket endpoints.
  * `service/` - Core business logic and transaction management.
  * `repository/` - Database access interfaces (Spring Data JPA / Elasticsearch).
  * `model/` - Database entities and DTO structures.
- Keep controllers thin; execute business validations inside services or via custom validators using Bean Validation annotations.
- Provide comprehensive unit and integration tests using JUnit 5, Mockito, and Testcontainers.

---

## Content & Medical Accuracy
- All clinical notes, anatomy overviews, and mechanisms must be cross-referenced with standard medical curricula (e.g., Guyton and Hall Textbook of Medical Physiology).
- Avoid simplifying physiological models to the point of clinical inaccuracy. If a detail is omitted for introductory students, state the simplification explicitly.
- Use standard clinical terminology. Provide immediate definitions for all technical terms when first introduced.

---

## Development Workflow & GitFlow Model (DEV-06)

Mediverse follows a structured **GitFlow** branching strategy to ensure high release stability and auditable compliance:

### 1. Branch Taxonomy
- **`main`**: Production releases only. Protected by GitHub Rulesets. Every commit is tagged with a semantic version (`vX.Y.Z`).
- **`develop`**: Integration branch for upcoming releases. All feature and bugfix branches merge here.
- **`feature/<domain>-<description>`**: New features, simulators, or curriculum models (e.g., `feature/cardio-ecg-sim`). Branch off `develop`, merge into `develop`.
- **`bugfix/<ticket>-<description>`**: Non-emergency bug resolutions (e.g., `bugfix/auth-cookie-refresh`). Branch off `develop`, merge into `develop`.
- **`release/<version>`**: Release stabilization branch (e.g., `release/1.2.0`). Allows final testing and metadata fixes before merging into `main` and back into `develop`.
- **`hotfix/<cve-or-issue>`**: Urgent production remediations branched directly off `main` and merged back into both `main` and `develop`.

---

## Commit Message Convention (Conventional Commits)

All commit messages are validated via **Commitlint** and must adhere to the Conventional Commits specification:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Supported Types
| Type | Purpose | Example |
|---|---|---|
| `feat` | Introduces a new feature or simulator | `feat(simulators): add 3D cardiac cycle solver` |
| `fix` | Patches a bug or security vulnerability | `fix(auth): migrate token storage to HttpOnly cookie` |
| `docs` | Documentation changes or additions | `docs(adr): document monolith vs microservice decision` |
| `perf` | Performance improvement or bundle optimization | `perf(frontend): add gzip compression and bundle analyzer` |
| `refactor` | Code restructuring without feature or bug change | `refactor(client): normalize backend API client error handling` |
| `test` | Adding missing tests or refactoring test suites | `test(e2e): expand Playwright matrix to Firefox and WebKit` |
| `ci` | Changes to CI/CD pipelines and workflows | `ci(github): add cross-browser Playwright test matrix` |
| `chore` | Build tasks, package updates, or repo maintenance | `chore(deps): bump capacitor dependencies` |

---

## Pull Request Quality Checklist

Before submitting a Pull Request for review:
1. **Local Build & Test**:
   - Backend: `./gradlew test` passes.
   - Frontend: `npm test` passes with zero failures.
   - Production Build: `npm run build` succeeds cleanly.
2. **Lint & Formatting**:
   - `npm run lint` generates no blocking ESLint errors.
   - Staged files pass `lint-staged` pre-commit checks.
3. **Accessibility**:
   - New components respect WCAG 2.1 AA standards and support `@media (prefers-reduced-motion: reduce)`.
4. **Security**:
   - No sensitive secrets, API keys, or raw JWTs committed in code or git history.
5. **Code Coverage**:
   - Backend changes maintain or increase JaCoCo branch and line coverage.
   - Frontend changes adhere to the 50% Jest coverage threshold.
