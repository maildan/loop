# Loop Documentation

Welcome to the Loop documentation! This guide will help you understand, develop, and contribute to Loop.

---

## 📚 Table of Contents

### 🏗️ [Architecture](architecture/README.md)
Deep dive into Loop's 3-layer Electron architecture, design patterns, and system components.

- **[Architecture Overview](architecture/README.md)** - System design and core principles
- **[Electron Bootstrap](architecture/electron-bootstrap.md)** - 3-phase initialization and manager coordination
- **[IPC Architecture](architecture/ipc-architecture.md)** - Type-safe communication between processes
- **[AI Systems](architecture/ai-systems.md)** - Dual AI integration (OpenAI + Gemini)
- **[State Management](architecture/state-management.md)** - Hybrid approach with Zustand and Prisma
- **[Security Architecture](architecture/security.md)** - 5-layer security system

### 💾 [Database](database/schema.md)
Complete guide to Loop's data layer with Prisma and SQLite.

- **[Schema Documentation](database/schema.md)** - 17 models across 4 domains
- **[Optimization Guide](database/optimization.md)** - 6 improvement areas with performance impact
- **[Migrations](database/migrations.md)** - Database evolution and rollback strategies

### 🛠 [Development](development/setup.md)
Everything you need to start developing Loop.

- **[Setup Guide](development/setup.md)** - Environment configuration and first run
- **[Debugging](development/debugging.md)** - Tools and techniques for main/renderer debugging
- **[Testing](development/testing.md)** - Unit, integration, and E2E testing strategies
- **[Performance](development/performance.md)** - Memory management and 6-level optimization

### 📖 [Guides](guides/contributing.md)
Best practices and processes for contributing to Loop.

- **[Contributing](guides/contributing.md)** - How to contribute code, docs, and issues
- **[Coding Standards](guides/coding-standards.md)** - TypeScript patterns and conventions
- **[Release Process](guides/release-process.md)** - Versioning, building, and deployment

### 🔧 [Troubleshooting](troubleshooting.md)
Common issues and solutions.

---

## 🚀 Quick Start

New to Loop development? Start here:

1. **[Setup Guide](development/setup.md)** - Install dependencies and configure environment
2. **[Architecture Overview](architecture/README.md)** - Understand the 3-layer system
3. **[IPC Architecture](architecture/ipc-architecture.md)** - Learn how processes communicate
4. **[Contributing Guide](guides/contributing.md)** - Make your first contribution

---

## 🎯 Key Concepts

### 3-Layer Architecture

Loop uses a strict separation between processes:

```
Renderer (React) → Preload (contextBridge) → Main (Electron)
```

- **Renderer**: React 19 UI with React Router DOM 7
- **Preload**: Security layer using contextBridge for API exposure
- **Main**: Node.js process with 16 managers, IPC handlers, and services

[Learn more →](architecture/README.md)

### Type-Safe IPC

All communication between processes is strongly typed:

```typescript
// Renderer
const project = await window.electronAPI.projects.create(data);

// Preload exposes typed API
// Main handles with type checking
```

[Learn more →](architecture/ipc-architecture.md)

### Hybrid State Management

Loop uses a pragmatic approach to state:

- **Zustand**: Minimal (1 store for ProjectStructure)
- **useState**: Server-driven lists (always fresh from DB)
- **Prisma**: Single source of truth

[Learn more →](architecture/state-management.md)

### Dual AI System

Two specialized AI systems:

- **OpenAI**: Real-time chat and writing assistance
- **Gemini**: Deep project analysis (timeline, outline, mindmap)

[Learn more →](architecture/ai-systems.md)

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Total Files | ~170 |
| Total Lines | ~40,000 |
| Main Process | ~15,000 lines |
| Renderer | ~20,000 lines |
| Shared | ~5,000 lines |
| IPC Handlers | 32 (22 Project + 10 AI) |
| Managers | 16 |
| Database Models | 17 |
| Routes | 7 |

---

## 🔗 External Resources

- **[Electron Documentation](https://www.electronjs.org/docs)** - Official Electron docs
- **[React Documentation](https://react.dev/)** - React 19 documentation
- **[Prisma Documentation](https://www.prisma.io/docs)** - Prisma ORM guide
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript reference

---

## 🤝 Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/maildan/loop/issues)
- **Pull Requests**: [Contribute code](https://github.com/maildan/loop/pulls)
- **Discussions**: [Ask questions and share ideas](https://github.com/maildan/loop/discussions)

---

## 📝 Documentation Status

| Section | Status | Last Updated |
|---------|--------|--------------|
| Architecture | ✅ Complete | 2025-10-01 |
| Database | ✅ Complete | 2025-10-01 |
| Development | ✅ Complete | 2025-10-01 |
| Guides | ✅ Complete | 2025-10-01 |
| Troubleshooting | ✅ Complete | 2024-12-15 |

---

## 💡 Need Help?

1. Check [Troubleshooting](troubleshooting.md) for common issues
2. Search [GitHub Issues](https://github.com/maildan/loop/issues)
3. Read relevant architecture docs
4. Ask in [Discussions](https://github.com/maildan/loop/discussions)

---

<div align="center">

**Happy coding! 🚀**

[← Back to Main README](../README.md)

</div>
