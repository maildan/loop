---
description: Sequential Thinking execution protocol (GIGA-CHAD mode)
applyTo: '**'
---

# 🔹 Sequential Thinking Rules

## Trigger
Only execute when `edit_file` or `reapply` occurs.

## Critical Gate A — 3-Round Sequential Thinking

### Round 1 — Problem Analysis
- Identify the true request
- Define constraints and requirements
- Detect edge cases or hidden gotchas

### Round 2 — Solution Validation
- Ensure compliance with latest best practices
- Align solution with stack & architecture
- Evaluate performance & security implications

### Round 3 — Knowledge Assessment
- Confirm sufficient knowledge
- Check for recent API changes or deprecations
- Decide if external search (Exa, Context7) is required

---

## Enforcement
- Always perform **exactly 3 rounds** before any file edit.
- Produce a compact **Reasoning Log** (no raw chain-of-thought).

### Reasoning Log Template
```md
[Reasoning Log]
R1 Summary: …
R2 Summary: …
R3 Summary: … (Search needed? yes/no; why)
Decision: Selected approach X because …
