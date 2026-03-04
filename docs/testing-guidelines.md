# Testing Guidelines

## Overview

This document outlines the testing principles and conventions to be followed when building the ToDo application to ensure code quality, reliability, and maintainability.

## General Principles

- All new features must include appropriate tests.
- All tests must be isolated and independent — each test should set up its own data and not rely on other tests.
- Setup and teardown hooks are required to ensure tests succeed across multiple runs.
- Tests should be maintainable and follow best practices.

---

## Unit Tests

**Framework:** [Jest](https://jestjs.io/)

Unit tests are used to test individual functions and React components in isolation.

### Conventions

- File naming convention: `*.test.js` or `*.test.ts`
- Name unit test files to match the file they are testing (e.g., `app.test.js` for testing `app.js`).

### Directory Structure

| Scope    | Directory                                  |
|----------|--------------------------------------------|
| Backend  | `packages/backend/__tests__/`              |
| Frontend | `packages/frontend/src/__tests__/`         |

---

## Integration Tests

**Framework:** [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest)

Integration tests are used to test backend API endpoints with real HTTP requests.

### Conventions

- File naming convention: `*.test.js` or `*.test.ts`
- Name integration test files based on what they test (e.g., `todos-api.test.js` for TODO API endpoints).

### Directory Structure

| Scope    | Directory                                          |
|----------|----------------------------------------------------|
| Backend  | `packages/backend/__tests__/integration/`          |

---

## End-to-End (E2E) Tests

**Framework:** [Playwright](https://playwright.dev/) *(required)*

E2E tests are used to test complete UI workflows through browser automation.

### Conventions

- File naming convention: `*.spec.js` or `*.spec.ts`
- Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`).
- Playwright tests must use **one browser only**.
- Playwright tests must follow the **Page Object Model (POM)** pattern for maintainability.
- Limit E2E tests to **5–8 critical user journeys** — focus on happy paths and key edge cases, not exhaustive coverage.

### Directory Structure

| Scope | Directory      |
|-------|----------------|
| E2E   | `tests/e2e/`   |

---

## Port Configuration

Always use environment variables with sensible defaults for port configuration to allow CI/CD workflows to dynamically detect ports.

| Service  | Configuration                                        |
|----------|------------------------------------------------------|
| Backend  | `const PORT = process.env.PORT \|\| 3030;`           |
| Frontend | React's default port is `3000`, but can be overridden with the `PORT` environment variable. |
