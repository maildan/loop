
# `.github/copilot-instructions.md` (Project-specific)

````markdown
---
description: Custom Copilot Instructions for Author Wordprocessor App
applyTo: '**'
---

# 🖋 Project Instructions — Author Wordprocessor App

## Overview
This repository is an **Electron-based wordprocessor app** designed for professional authors.  
Goal: help writers focus only on writing, improving quality and reducing distractions.  
Development principle: **stability, single responsibility, type safety, reproducibility**.

---

## Core Structure

### Main process (`src/main`)
- **Entry**: `main/index.ts` (minimal entrypoint).  
- **Core**: `core/ApplicationBootstrapper.ts` and related bootstrap logic.  
- **Preload**: `src/preload` for secure context bridging.  
- **Submodules**:  
  - `handlers/` – event handling, IPC  
  - `managers/` – process & state orchestration  
  - `services/` – business logic, external integrations  
  - `settings/` – config and persistent preferences  
  - `types/` – main-specific types (separate from `/shared`)  

### Renderer (`src/renderer`)
- **App**: main app logic (`app/`)  
  - `ai/` – AI-assisted writing  
  - `analyses/` – writing analysis features  
  - `dashboard/` – overview UI  
  - `projects/` – project management  
  - `settings/` – user settings UI  
- **Components**: reusable UI parts (`components/`)  
  - `projects/` – project-specific UI  
- **Contexts**: React context providers  
- **Hooks**: React hooks, typed, reusable  

### Shared (`src/shared`)
- Types, DTOs, utilities common to main and renderer.  
- IPC contracts defined here.  

---

## Development Principles
1. **SRP & Singletons**  
   - Each module must serve a single responsibility.  
   - Shared state in main process managed via singletons, not global mutable objects.  

2. **Type Safety**  
   - Strict TypeScript (`strict: true`).  
   - No `any`. Always validate and narrow unknown values.  

3. **IPC Security**  
   - Typed IPC channels defined in `/shared`.  
   - Renderer accesses system APIs only through preload + `contextBridge`.  

4. **Renderer (Next.js style)**  
   - Functional React components only.  
   - TailwindCSS v4 utilities for styling.  
   - Hooks and contexts for state management.  

5. **Stability First**  
   - When editing code, review **related modules** (handlers, managers, services).  
   - Modifications must not introduce side effects or instability.  
   - Favor incremental, tested changes.  

6. **Testing**  
   - Vitest for unit/integration tests.  
   - Playwright for renderer/E2E.  
   - Every new feature requires corresponding tests.  

---

## Contribution Workflow
- **Package manager**: `pnpm` only.  
- Common commands:  
  ```sh
  pnpm install    # install deps
  pnpm dev        # run app in dev mode
  pnpm build      # build for production
  pnpm test       # run tests
  pnpm lint       # lint all code
````

* **Branching**:

  * `feat/feature-name`, `fix/bug-name`, `chore/task-name`.
* **Commits**: Conventional Commits format.

---

## Example Prompts (for Copilot)

1. *"Add a new service under `src/main/services/` for autosave, using singleton pattern and type-safe IPC."*
   → Copilot must create a service class, expose it via ApplicationBootstrapper, and add IPC contracts in `/shared`.

2. *"Extend `src/renderer/app/projects/` with a typed React hook to fetch project metadata via IPC."*
   → Copilot must define the IPC contract in `/shared`, update preload, and return a typed hook.

3. *"Update `src/main/settings/` to persist editor theme preference and reflect it in `src/renderer/app/settings/`."*
   → Copilot must modify main + renderer consistently, ensuring no direct state leakage.

---

## Rules

* Never generate CommonJS (`require`).
* Never bypass preload for Node APIs.
* No inline CSS, only TailwindCSS v4.
* Always provide typed examples, modularized.
* All changes must be stable, tested, and reviewed in relation to other modules.

---

```

---

