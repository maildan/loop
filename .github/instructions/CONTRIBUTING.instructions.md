
# `CONTRIBUTING.instructions.md`

````markdown
---
description: Contribution Workflow and Toolchain
applyTo: '**'
---

# 🛠 CONTRIBUTING Instructions

## Purpose
This document defines the **toolchain, package manager, coding standards, and workflow** required for contributing to this repository.  
Every contributor must follow these instructions to ensure **stability, reproducibility, and efficiency**.

---

## Toolchain

- **Node.js**: LTS (current project uses Node 20.x).  
- **Electron**: 38 LTS (main process).  
- **VITE** ( renderer process ).
- **TailwindCSS**: v3
- **TypeScript**: strict mode.  

Install Node via [nvm](https://github.com/nvm-sh/nvm) or fnm to ensure consistent versioning.  
Lockfile is required for reproducibility.

---

## Package Manager

- Use **pnpm** exclusively.  
- Install globally if not present:

```sh
npm install -g pnpm
````

* Common commands:

```sh
pnpm install        # install dependencies (respecting lockfile)
pnpm dev            # run development servers (Electron + Next.js)
pnpm build          # build all targets
pnpm test           # run unit/integration tests
pnpm lint           # run eslint checks
```

> Do not use `npm` or `yarn`. Contributions using the wrong lockfile will be rejected.

---

## Repository Structure

```
/main       → Electron main process (startup, IPC, system integration)
/renderer   → Next.js 15 app (UI, TailwindCSS v4)
/shared     → Shared types, DTOs, and utilities
/tests      → Unit, integration, and E2E tests
```

---

## Coding Standards

1. **TypeScript strict mode** is enforced.
2. Use **ES Modules** (`import`/`export`). No CommonJS.
3. IPC must be typed via `/shared/ipc/*.ts`.
4. TailwindCSS v4 utility classes only. No inline CSS.
5. All public exports require TSDoc comments.
6. No unused dependencies.
7. No direct Node API access in renderer.

---

## Branching & PR Workflow

* Branch from `main`.
* Naming convention: `feat/feature-name`, `fix/bug-name`, `chore/task-name`.
* Every PR must:

  * Pass **lint**, **type-check**, and **tests**.
  * Include at least one unit test for new functionality.
  * Update relevant docs (`README.md`, `CONTRIBUTING.instructions.md`, etc.) if workflow changes.

---

## Commit Guidelines

* Follow [Conventional Commits](https://www.conventionalcommits.org/):

  * `feat: add IPC for settings`
  * `fix: correct window close handler`
  * `chore: update dependencies`

---

## Testing

* **Vitest** for unit/integration.
* **Playwright** for E2E.
* Run tests locally before opening a PR:

```sh
pnpm test
```

---

## CI/CD

* GitHub Actions runs lint, build, test for every PR.
* Only PRs passing CI will be reviewed.

---

## Security

* Do not introduce unvetted dependencies.
* No `eval`, dynamic `Function`, or unsafe DOM APIs.
* Report vulnerabilities privately before public disclosure.

---

## Enforcement

* Contributions not following these rules will be rejected.
* Maintain consistency with other instruction files:

  * `copilot-instructions.md`
  * `sequentialthinking.instructions.md`

```



```
