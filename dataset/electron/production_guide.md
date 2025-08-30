## Electron Production Best Practices (Loop)

This document condenses external best practices and Loop-specific rules for secure, performant Electron apps.

### 1) Security & IPC (must)
- Set in `BrowserWindow.webPreferences`:
  - `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` (where compatible), `webSecurity: true`
- Expose only narrow APIs via `contextBridge.exposeInMainWorld`, never raw `ipcRenderer`.
- Validate IPC arguments/senders on the main side; whitelist channels.
- Do not use `remote` (or use `@electron/remote` only with strict scoping).
- Prefer safe protocols over `file://`. See: [Security Tutorial](https://www.electronjs.org/docs/latest/tutorial/security) · [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)

### 2) Preload patterns (Loop alignment)
- Preload path: ensure `window.ts` points to `dist/preload/preload.js` after build.
- Keep the surface small: only expose methods/types needed by renderer.
- No business logic or heavy I/O in preload; defer to main via IPC.
- Avoid leaking globals; export a single `electronAPI` namespace.

### 3) Common pitfalls (and fixes)
- Tray GC: hold `new Tray()` in a module/global variable; clear on quit. Docs: [Tray](https://www.electronjs.org/docs/latest/api/tray)
- Window lifecycle: call `win.destroy()`/nullify refs on `closed`.
- Risky flags: avoid `allowRunningInsecureContent`, `experimentalFeatures`, `enableRemoteModule`.

### 4) Performance guidelines
- Measure first: Chrome DevTools Performance/Memory, Tracing. Docs: [Performance](https://www.electronjs.org/docs/latest/tutorial/performance)
- Renderer: bundle with tree-shaking/minification; code-split; lazy-load non-critical features.
- Main process: avoid blocking I/O; use async fs/network; offload heavy work to `child_process`/workers.
- GPU: keep hardware acceleration on by default; toggle via `app.disableHardwareAcceleration()` only if issues.

### 5) Testing strategy
- E2E: Playwright or WebdriverIO Electron service.
- Unit/integration: Jest/Mocha; mock `ipcMain`, `ipcRenderer`, `nativeImage`.
- Separate pure logic from Electron APIs to enable fast unit tests. Docs: [Testing](https://www.electronjs.org/docs/latest/tutorial/automated-testing)

### 6) Packaging & distribution
- Use Electron Builder/Forge; enable `asar: true`; unpack native modules as needed.
- Keep explicit `files`/`extraResources` to minimize bundle; exclude devDependencies.
- Code signing (macOS notarization, Windows certificate) and auto-update channels.
- Typical output: `dist/{mac,win-unpacked,linux}/...`. Docs: [Electron Forge](https://www.electronforge.io/) · [electron-builder](https://www.electron.build/)

### 7) macOS permissions & UX (Loop)
- Accessibility permission: if missing, guide user to System Settings; keep monitoring disabled until granted.
- Tray/Dock icons: use Template PNGs (black silhouette, transparent bkg), `nativeImage.setTemplateImage(true)`. Dock uses `app.icns`.

### Quick checklist
- [ ] contextIsolation on; nodeIntegration off; sandbox on (if possible)
- [ ] Preload exposes minimal API via contextBridge
- [ ] IPC channels validated; no raw exposes
- [ ] Tray/Window references held and cleaned up
- [ ] Renderer optimized; main non-blocking; lazy-loaded features
- [ ] E2E + unit tests in CI
- [ ] Builder config with asar, resources, signing, updates


