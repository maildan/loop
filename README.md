# Author Wordprocessor App

A desktop wordprocessor application built with **Electron 38 LTS**, designed for professional authors to focus solely on writing, enhancing quality and minimizing distractions. This app emphasizes stability, type safety, and reproducibility through strict TypeScript and modular architecture.

## Tech Stack

- **Electron**: 38 LTS for the main process (startup, IPC, system integration).
- **VITE**: renderer (UI, App Router).
- **TailwindCSS**: v3 for utility-first styling.
- **TypeScript**: Strict mode enforced.
- **Package Manager**: pnpm (workspace-aware, lockfile required).
- **Testing**: Vitest for unit/integration, Playwright for E2E.
- **Tooling**: ESLint, Prettier, GitHub Actions for CI/CD.

## Project Structure

```
/main       → Electron main process (startup, windows, IPC)
/renderer   → VITE app (UI, routes, TailwindCSS)
/shared     → Cross-cutting types, DTOs, utilities
/tests      → Unit, integration, and E2E tests
```

## Getting Started

### Prerequisites

- Node.js LTS (20.x recommended, install via [nvm](https://github.com/nvm-sh/nvm) or fnm).
- pnpm: Install globally with `npm install -g pnpm`.

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### Development

Run the app in development mode:

```bash
pnpm dev
```

This starts the Electron app with hot-reloading for both main and renderer processes.

### Building

Build for production:

```bash
pnpm build
```

### Testing

Run all tests:

```bash
pnpm test
```

Run linting:

```bash
pnpm lint
```

## Development Principles

- **Type Safety**: Strict TypeScript, no `any`.
- **IPC Security**: Typed channels via `/shared`, using `contextBridge`.
- **Modularity**: Single responsibility per module, singleton patterns for state.
- **Stability**: Incremental changes, no side effects.
- **Contributions**: Follow [CONTRIBUTING.instructions.md](./.github/instructions/CONTRIBUTING.instructions.md) for workflow, branching, and commits.

## Learn More

- [Electron Documentation](https://www.electronjs.org/docs) - Core framework details.
- [VITE Guide](https://vitejs.dev/guide/) - Build tool for renderer.
- [TailwindCSS Docs](https://tailwindcss.com/docs) - Styling utilities.

## Contributing

See [CONTRIBUTING.instructions.md](./.github/instructions/CONTRIBUTING.instructions.md) for guidelines. All PRs must pass CI, include tests, and follow conventional commits.

## License

[Add license here if applicable]
