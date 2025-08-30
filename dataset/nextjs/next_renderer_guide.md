## Next.js (App Router) in Electron Renderer

Concise practices to run Next.js smoothly inside Electron.

### next.config.js
- Remove invalid keys (e.g., `turbopack.memoryLimit` if unsupported). Use official `turbopack` config block only.
- For Electron prod builds, consider:
  - `eslint.ignoreDuringBuilds: true`, `typescript.ignoreBuildErrors: true` (CI still runs strict checks).
  - Adjust asset paths for `file://` or custom protocol.

### Hydration reliability
- Move non-deterministic values (time, random, locale) into Client Components or `useEffect`.
- For dynamic SSR content, set `export const dynamic = 'force-dynamic'` or `revalidate = 0`.
- Avoid server/client divergent branches at render time.

### Performance
- Use `dynamic(() => import('...'), { ssr: false })` for heavy UI modules.
- Memoize expensive computations with `useMemo`/`useCallback`.
- Prefer static image imports; disable remote optimization.

### Electron adaptations
- Avoid server-only features; keep pages client-side if possible.
- Disable `<Link prefetch>` when unnecessary to reduce network noise.
- Serve assets via `file://`/custom protocol; verify paths post-build.

### Security model
- Keep `contextIsolation: true`, `nodeIntegration: false`; expose IPC only via preload `contextBridge`.
- Consider a restrictive CSP meta in `_document`.

### Quick checklist
- [ ] next.config.js has only supported keys
- [ ] Non-deterministic logic isolated to client/useEffect
- [ ] Heavy components loaded with `dynamic()`
- [ ] Static assets resolved under Electron protocol
- [ ] BrowserWindow security flags + preload IPC


