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

## Development Workflow

1. **Local Setup**: Refer to `README.md` and use the local docker configurations to start the dependencies.
2. **Feature Branching**: Prefix your git branch with standard descriptors:
   * `feat/` for new features or simulators
   * `fix/` for bug resolution
   * `docs/` for educational content and documentation adjustments
3. **Lint & Test**: Ensure code compiles without warnings and all automated test suites pass before submitting pull requests.
