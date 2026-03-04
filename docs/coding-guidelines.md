# Coding Guidelines

## Overview

This document outlines the coding style and quality principles to be followed when building the ToDo application to ensure a clean, maintainable, secure, and consistent codebase.

---

## 1. General Formatting Rules

- Use consistent indentation: **2 spaces** for JavaScript/TypeScript and JSX/TSX files.
- Maximum line length: **100 characters**.
- Use single quotes `'` for strings in JavaScript/TypeScript (unless JSX attributes, which use double quotes).
- Always include a newline at the end of a file.
- Remove trailing whitespace.
- Use semicolons at the end of statements.
- Use `const` by default; use `let` only when reassignment is necessary. Never use `var`.
- Prefer arrow functions for callbacks and anonymous functions.
- Use template literals over string concatenation.

---

## 2. Import Organisation

- Group imports in the following order, separated by a blank line:
  1. External library imports (e.g., React, MUI)
  2. Internal module imports (e.g., components, utilities, hooks)
  3. Style imports (e.g., CSS, SCSS)
- Sort imports alphabetically within each group.
- Use named imports where possible; avoid wildcard imports (`import * as`).
- Remove unused imports.

```js
// 1. External libraries
import React, { useState } from 'react';
import { Button } from '@mui/material';

// 2. Internal modules
import TodoList from './components/TodoList';
import { formatDate } from './utils/dateUtils';

// 3. Styles
import './App.css';
```

---

## 3. Linting

- Use [ESLint](https://eslint.org/) to enforce code style and catch common errors.
- All code must pass linting before being merged.
- Configure ESLint rules in a shared config file to ensure consistency across the project.
- Linting should be integrated into the CI/CD pipeline and run on every pull request.
- Do not disable ESLint rules inline unless absolutely necessary, and always add a comment explaining why.

---

## 4. DRY Principle (Don't Repeat Yourself)

- Avoid duplicating logic — extract repeated code into reusable functions, hooks, or components.
- If the same logic appears in more than one place, refactor it into a shared utility or abstraction.
- Centralise configuration values (e.g., API base URLs, status enums) rather than hardcoding them in multiple places.

---

## 5. KISS Principle (Keep It Simple, Stupid)

- Favour simple, straightforward solutions over clever or complex ones.
- Write code that is easy to read and understand at a glance.
- Avoid unnecessary abstractions or layers of indirection.
- If a simpler approach solves the problem, choose it.

---

## 6. YAGNI Principle (You Aren't Gonna Need It)

- Do not add functionality or abstractions until they are actually required.
- Avoid speculative generalisation — only build what is needed for the current requirements.
- Remove dead code and unused features promptly.

---

## 7. Documentation and Comments

- Write self-documenting code — use descriptive names for variables, functions, and components.
- Add comments to explain **why** something is done, not **what** it does.
- Document all public functions, hooks, and components with JSDoc-style comments.
- Keep comments up to date — outdated comments are worse than no comments.
- Use `TODO:` and `FIXME:` prefixes for inline notes that require follow-up.

```js
/**
 * Formats a date object to a human-readable string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string (e.g., "4 March 2026").
 */
const formatDate = (date) => { ... };
```

---

## 8. SOLID Principles

Follow the SOLID principles when designing components, services, and modules:

- **S — Single Responsibility**: Each function, component, or module should have one clear responsibility.
- **O — Open/Closed**: Code should be open for extension but closed for modification.
- **L — Liskov Substitution**: Subtypes should be substitutable for their base types without altering behaviour.
- **I — Interface Segregation**: Prefer small, focused interfaces over large, general-purpose ones.
- **D — Dependency Inversion**: Depend on abstractions, not concrete implementations. Inject dependencies where possible.

---

## 9. Design Patterns — Use, But Don't Over-Design

- Apply well-known design patterns (e.g., Factory, Observer, Strategy, Repository) where they provide clear value.
- Do not force patterns onto simple problems — over-engineering reduces readability and maintainability.
- For React specifically:
  - Use the **Container/Presentational** pattern to separate logic from UI.
  - Use the **Page Object Model (POM)** pattern for E2E tests.
  - Use **custom hooks** to encapsulate and reuse stateful logic.

---

## 10. Reduce Global Dependencies

- Avoid relying on global state or global variables wherever possible.
- Use dependency injection or React context to pass shared state explicitly.
- Limit the scope of variables and functions to where they are needed.
- Prefer local state management before reaching for global state solutions.

---

## 11. Continuous Refactoring

- Refactor code regularly as part of normal development — do not let technical debt accumulate.
- Follow the **Boy Scout Rule**: leave the code cleaner than you found it.
- Refactoring must be covered by tests to ensure no regressions are introduced.
- Raise code quality issues during code reviews and address them promptly.

---

## 12. Security First

- Security is the **top priority** and must be considered from the start, not as an afterthought.
- Never store sensitive data (e.g., API keys, secrets) in source code — use environment variables.
- Validate and sanitise all user inputs on both the frontend and backend.
- Protect against common vulnerabilities (e.g., XSS, CSRF, SQL/NoSQL injection).
- Keep dependencies up to date and audit them regularly for known vulnerabilities (`npm audit`).
- Follow the principle of least privilege when designing access controls.

---

## 13. Make Testing Easy

- Write code with testability in mind from the start.
- Keep functions small and focused so they are easy to unit test in isolation.
- Avoid tight coupling between components and external dependencies — use dependency injection or mocking.
- Avoid side effects in pure functions.
- Follow the testing guidelines defined in [Testing Guidelines](./testing-guidelines.md).
