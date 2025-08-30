## TypeScript Improvement Guide (Loop)

Actionable TS practices for large Electron/React codebases.

### 1) Compiler options (strictness)
Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "exactOptionalPropertyTypes": true,
    "useUnknownInCatchVariables": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "incremental": true
  }
}
```

### 2) Typing patterns
- Discriminated unions for variant logic; exhaustive `switch` with `never` guard.
- Type predicates for runtime narrowing: `function isX(v: unknown): v is X`.
- Branded types for IDs: `type UserId = string & { readonly __brand: 'UserId' }`.
- Immutability: `readonly` fields and `Readonly<T>`; favor pure functions.
- Utility types: `Partial`, `Pick`, `Omit`, `Record`, `Awaited`, `ReturnType`.
- `satisfies` and `as const` to maintain literal precision without widening.

### 3) React + TS
- Components: explicit props interfaces; avoid overusing `React.FC` when inference suffices.
- Events: `ChangeEvent<HTMLInputElement>`, `MouseEvent<HTMLButtonElement>` generics.
- State: `useState<Type>` generics; derive state from props carefully.
- Ensure exhaustive branching; prefer discriminated unions for view states.

### 4) Linting & quality gates
`eslint` + `@typescript-eslint`:

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```

### 5) Build performance & DX
- Project References for multi-package or layered apps.
- Narrow `include` globs; exclude heavy dirs; enable `incremental` with `tsBuildInfoFile`.
- Prefer ESBuild/Vite for renderer; keep `isolatedModules` true.
- Prune unused type deps; align editor TS version with workspace.

### Quick checklist
- [ ] strict flags enabled
- [ ] unions/predicates/brands in critical domains
- [ ] exhaustive UI logic
- [ ] TS-ESLint enforced in CI
- [ ] fast builds (incremental, references) and lean includes


