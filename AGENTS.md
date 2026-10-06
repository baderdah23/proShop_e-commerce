# AGENTS.md

> The engineering constitution for this repository. Read this in full before planning, writing, editing, or deleting any code. Every future feature, refactor, bug fix, and architectural decision is expected to comply with it.

**Version:** 1.1 · **Status:** Active · **Applies to:** every AI-assisted and human contribution to this codebase

**Changelog:**
- **1.1** — Added Section 1.6 (Verify, Don't Assume), Section 22 (Dependency Policy), and Section 23 (Change Impact & API Stability). Strengthened the diff-review checklist (1.2), obsolete-code removal (3), the pre-completion checklist (20), and several AI Agent Operating Protocol rules (21) with more specific, actionable detail.
- **1.0** — Initial release.

---

## How to Use This Document

- **Audience**: any AI coding agent, and any human, working in this repository.
- **Stack assumption**: this document is written for a **TypeScript + React** frontend and a **Supabase (Postgres)** backend, matching the technologies referenced throughout. If the real stack differs, apply the underlying principle and translate the framework-specific detail — the rule is what's mandatory, not the specific API it's illustrated with.
- **Precedence**: an explicit, specific instruction from the user in a given task overrides this document *for that task*. Silence is not an override — if the user hasn't said otherwise, this document governs by default. An instruction that would violate Section 1 (secrets, security) should be flagged rather than silently followed.
- **This is a living document.** When a real decision here goes stale, update this file in the same change that changes the practice — don't let the code and the doc drift apart.

## Table of Contents

1. [Prime Directives (Non-Negotiable)](#1-prime-directives-non-negotiable)
2. [Engineering Principles](#2-engineering-principles)
3. [Code Quality Rules](#3-code-quality-rules)
4. [Architecture & Folder Structure](#4-architecture--folder-structure)
5. [Scalability Rules](#5-scalability-rules)
6. [Maintainability Rules](#6-maintainability-rules)
7. [Performance Rules](#7-performance-rules)
8. [Security Rules](#8-security-rules)
9. [Clean Code Rules](#9-clean-code-rules)
10. [Documentation & Comments](#10-documentation--comments)
11. [React Best Practices](#11-react-best-practices)
12. [TypeScript Rules](#12-typescript-rules)
13. [API Design](#13-api-design)
14. [Database Rules](#14-database-rules)
15. [Logging & Observability](#15-logging--observability)
16. [Git Workflow](#16-git-workflow)
17. [Testing Philosophy](#17-testing-philosophy)
18. [Accessibility](#18-accessibility)
19. [SEO Rules](#19-seo-rules)
20. [Pre-Completion Code Review Checklist](#20-pre-completion-code-review-checklist)
21. [AI Agent Operating Protocol](#21-ai-agent-operating-protocol)
22. [Dependency Policy](#22-dependency-policy)
23. [Change Impact & API Stability](#23-change-impact--api-stability)

---

## 1. Prime Directives (Non-Negotiable)

These five rules override convenience, speed, and any framing that conflicts with them. They apply on every task, every file, every turn — no exceptions.

### 1.1 Continuous Self-Questioning

Before planning, before writing code, before modifying any file, after every significant change, and before declaring a task complete, stop and answer honestly:

1. Am I following every rule defined in this document?
2. Is this implementation actually production-ready?
3. Can this implementation be improved?
4. Am I introducing unnecessary complexity?
5. Is there a cleaner solution?
6. Am I following the project's architecture and best practices?

**If the honest answer to any of these is "no," stop. Rethink. Fix it before continuing.** There is no later cleanup pass — this is the pass.

### 1.2 Mandatory Rule-Compliance Review

Every time code is written, edited, deleted, refactored, created, or removed, it is followed by a complete review against this entire document before the change counts as done. A task is not complete because it runs — it's complete when it also survives this review. Read your own diff the way a skeptical senior reviewer would, not the way a hopeful author would.

Concretely, before calling anything finished, review the entire diff and confirm:

- every change is necessary — nothing is there "just in case"
- nothing unrelated changed
- architecture stays consistent with Section 4
- naming is consistent with the rest of the codebase
- formatting is consistent — no stray reformatting of untouched code
- comments are meaningful, not filler (Section 10)
- no dead code remains
- no duplicated logic remains

### 1.3 Never Expose Secrets

Absolute. No exceptions, no "temporary," no "it's fine because it's server-only anyway."

**Never place any of the following in frontend code, client bundles, public env vars, or anything shipped to the browser:**

- API keys, secret keys, service-role keys
- Database credentials or connection strings
- JWT signing secrets
- Private tokens, OAuth client secrets
- Encryption keys
- Any credential granting elevated or RLS-bypassing access

**Rule of thumb**: if a key can read or write data a normal user shouldn't be able to, it belongs on the server — an API route, a Supabase Edge Function, a serverless function, or a dedicated backend service — never in client-side JavaScript, never in a client-exposed env var (`NEXT_PUBLIC_*`, `VITE_*`), never hardcoded, never logged, never committed.

If a requested feature seems to require a secret on the client to work, **that's a signal the architecture is wrong — not that this rule should bend.** Redesign around a server endpoint that holds the secret and exposes only the minimal action the client actually needs (e.g., a `/api/send-invoice-email` route instead of shipping an email-provider key to the browser).

### 1.4 Think Before Every Change

Before touching a file, answer for real:

- Is this change necessary?
- Does this follow the architecture?
- Does this violate any existing rule?
- Can I reuse existing code instead of writing new code?
- Can I simplify this implementation?
- Is this secure?
- Is this scalable?
- Is this maintainable?
- Is this performant?

Only proceed once these have honest answers — not assumed ones.

### 1.5 Production-Quality Guarantee

"It works" is not a completion criterion. Every implementation shipped from this repository is:

production-ready · maintainable · scalable · reusable · secure · well-documented · high-performance · SEO-friendly where applicable · accessible · easy to understand · consistent with the project's architecture · fully compliant with this document.

Approach every change the way a Senior Staff Engineer reviews a pull request before approving it — not the way its author hopes it'll pass.

### 1.6 Verify, Don't Assume

Guessing is not an acceptable substitute for checking — this applies to both what already exists in the project and what's true about it.

**Before creating anything new** — a component, hook, utility, helper, service, API route, function, type, interface, SQL function, migration, file, or folder — thoroughly inspect the project first to determine whether an equivalent already exists. Check the relevant feature folder, `shared/`, existing types, and existing services before writing a single line. **Always prefer improving or extending what's there over creating a parallel implementation** — a near-duplicate is a bug waiting to cause drift (Section 21).

**When information needed to proceed is missing**, escalate through these steps in order, and stop at the first one that resolves it:

1. Inspect the project (the relevant feature and its neighbors).
2. Inspect related files (types, schemas, tests, callers).
3. Inspect dependencies (what a library actually exposes, not what seems likely).
4. Inspect existing architecture and conventions (Section 4) for the established pattern.
5. If it's still genuinely unknown after steps 1–4, **ask the user** — don't guess and move on.

**Never invent:**

- APIs or endpoints that haven't been confirmed to exist
- database columns or tables not present in the actual schema
- routes that aren't defined in the project
- folder structures that deviate from Section 4 without a stated reason
- environment variables that aren't documented or already in use
- project conventions that aren't observable in the existing code

An invented detail that happens to be plausible is still wrong — and it's more dangerous than an obvious placeholder, because it looks correct at a glance.

---

## 2. Engineering Principles

Every decision in this codebase is filtered through these principles, in roughly this priority order when they conflict: **correctness and security → maintainability → performance → brevity.**

| Principle | What it means here |
|---|---|
| Production-first mindset | Code is written as if it ships today, to real users, under real load — not as a prototype to be redone later. |
| Long-term maintainability | Optimize for the engineer reading this in 18 months with no context, not for typing speed today. |
| Readability over cleverness | If a reviewer has to pause to decode an expression, rewrite it. Clever one-liners lose to boring, obvious code. |
| Simplicity over unnecessary abstraction | Don't build a plugin system for two call sites. Add abstraction when a real third use case appears — not preemptively. |
| Scalability by design | Structure code so it survives 10x usage and 10x team size without a rewrite — without over-engineering for scale that may never come. |
| Security by default | The secure option is the default option; insecure behavior must be opted into explicitly, never the path of least resistance. |
| Performance first | Consider the performance cost of a design before shipping it, not after users complain. |
| Reliability first | Prefer solutions that fail predictably and recover gracefully over solutions that are merely fast when everything goes right. |
| Developer Experience (DX) | Good naming, good types, good errors, good local tooling. A confused teammate is a bug in the codebase, not just in the docs. |
| User Experience (UX) | Loading, empty, and error states are part of the feature, not optional edge cases. |
| Accessibility | Usable with a keyboard, a screen reader, or low vision, by default — see Section 18. |
| SEO | Public-facing pages are indexable and understandable by search engines by default — see Section 19. |
| Clean Architecture | Business logic doesn't know that React or Supabase exists. Frameworks are details, plugged in at the edges. |
| SOLID | See breakdown below. |
| DRY | Don't duplicate a single source of truth for a business rule. Duplicating *similar-looking* code that will evolve independently is not a DRY violation — premature deduplication creates false coupling. |
| KISS | The simplest design that correctly solves the actual problem wins over the more "impressive" one. |
| YAGNI | Don't build for a requirement that doesn't exist yet. Configurability is added when a second real use case demands it. |
| Separation of Concerns | UI, business logic, and data access are distinct layers with a one-directional dependency (Section 4.3). |
| Composition over inheritance | Prefer small, composable functions/hooks/components over deep class or component inheritance chains. |
| Convention over configuration | Follow the structure and naming in this document so nothing needs a config file to be understood. |

**SOLID, applied to this codebase:**

- **S**ingle Responsibility — a module, hook, or component has one reason to change.
- **O**pen/Closed — extend behavior via composition or new implementations; don't edit a stable module's internals to bolt on an unrelated case.
- **L**iskov Substitution — an interface's implementations must honor its contract; don't return a shape that surprises every existing caller.
- **I**nterface Segregation — small, specific interfaces/prop types over one giant interface every consumer partially implements.
- **D**ependency Inversion — business logic depends on abstractions (an interface, an injected client), not concrete implementations (a specific fetch call, a specific SDK instance) — this is what makes it testable.

---

## 3. Code Quality Rules

### Always

- Write production-ready code — the same standard whether it's a one-line fix or a new feature.
- Reuse existing utilities, hooks, and components before writing new ones. Search the codebase first (Section 1.6).
- Remove dead code, unused imports, unused variables, unused components, hooks, and utilities, unused CSS, obsolete types, obsolete SQL and migrations, and obsolete files **in the same change** that makes them dead — not in a follow-up. When an implementation is replaced, remove the old one completely rather than leaving it alongside the new one, unless backward compatibility explicitly requires keeping it (Section 23).
- Refactor code you touch when a clearly cleaner solution exists, rather than stacking new logic on top of a design you know is wrong.
- Leave every file you touch better organized than you found it, without expanding scope beyond the task.

### Never

- Never write demo code, mock implementations, or placeholder logic (`// TODO: implement later`, fake data, stubbed returns) unless the user explicitly asked for a stub or prototype.
- Never duplicate business logic — extract and share it.
- Never leave commented-out code in a commit; version control remembers it.
- Never leave a `TODO` unless the user asked for one or it tracks a genuine, ticketed follow-up (and even then, reference the ticket).
- Never introduce technical debt to save time on the current task. If a shortcut is unavoidable, say so explicitly and name the cost, rather than presenting it as done.
- Never keep legacy code paths "just in case" — only when backward compatibility is a real, stated requirement (a public API, an old client still in use, a data migration in flight).

**Every change should leave the codebase net-better, not just net-larger.**

---

## 4. Architecture & Folder Structure

### 4.1 Guiding shape

Feature-based, not type-based, at the top level. Group by what the code is *for*, not what kind of file it is — this is what lets the codebase scale from 1 developer to 100 without every feature touching the same three folders.

```
src/
  app/                      # routes / pages / app entry (framework-specific)
  features/
    auth/
      components/           # UI local to this feature
      hooks/                # feature-specific hooks
      api/                  # feature-specific data access (Supabase calls, API calls)
      types.ts              # feature-specific types
      utils.ts              # feature-specific pure helpers
      index.ts              # public exports — this is the feature's only public surface
    billing/
      ...same shape...
    dashboard/
      ...same shape...
  shared/
    components/             # cross-feature, reusable, presentational UI
    hooks/                  # cross-feature reusable hooks
    utils/                  # cross-feature pure utilities
    types/                  # cross-feature shared types
  lib/
    supabase/
      client.ts             # browser client (anon key, RLS-governed)
      server.ts             # server client (service-role key, server-only)
    env.ts                  # typed, validated environment access
  styles/
  config/                   # app-wide constants and configuration
```

### 4.2 Module boundaries

- A feature exposes its public surface through `index.ts` only. Other features import from `features/billing`, never `features/billing/components/InvoiceRow`. This is what makes it safe to refactor a feature's internals without breaking the rest of the app.
- `shared/` may be imported by any feature. Features may not import from each other directly — if two features need the same logic, that logic belongs in `shared/`, not duplicated or cross-imported.

### 4.3 Dependency direction

Dependencies point one way only:

```
UI (components)  →  hooks  →  services / api layer  →  data layer (Supabase / external APIs)
```

- Components call hooks; hooks call services; services talk to Supabase or external APIs.
- A service never imports a component. A hook never contains raw fetch/Supabase calls inline in a component — it's wrapped so the component doesn't know or care where data comes from.
- Business logic (validation rules, pricing calculations, permission checks) lives outside React entirely, in plain, framework-free TypeScript, so it's testable without rendering anything and portable if the frontend framework ever changes.

### 4.4 Organization by concern

| Concern | Lives in | Rule |
|---|---|---|
| UI | `components/` | Presentational where possible; container components that fetch data are named/marked as such. |
| Reusable stateful logic | `hooks/` | One hook, one responsibility. A hook that just wraps a single `useState` isn't worth extracting. |
| Data access | `api/` or `services/` | All Supabase/API calls go through this layer — never directly in a component. |
| Cross-cutting types | `types/` | Shared domain types (e.g., `User`, `Invoice`). Feature-local types stay in the feature. |
| Configuration | `config/` | Constants, feature flags, env-derived config — never scattered magic values in components. |
| Database access rules | migrations + RLS policies | See Section 14. |

New code follows this structure without being asked. If a task doesn't fit cleanly, that's a signal to ask where it belongs rather than guessing and creating a new top-level folder.

---

## 5. Scalability Rules

The codebase must be able to grow from 1 developer to 100 without a rewrite. Concretely:

- **Feature isolation** (Section 4) means two engineers working on unrelated features rarely touch the same file — that's what actually lets a team scale, not tooling.
- **No god files.** A file every feature needs to edit (one giant `types.ts`, one giant `utils.ts`, one giant reducer) becomes a merge-conflict bottleneck as the team grows. Split by domain before this happens, not after.
- **No shared mutable global state** outside a deliberate, documented state layer (e.g., a query cache). Ad hoc module-level `let` state or singletons that features quietly depend on don't scale past one team.
- **APIs and schemas are designed for extension**: additive changes (a new optional field, a new endpoint) shouldn't require touching unrelated code. Avoid designs where adding one feature means editing a giant switch statement in an unrelated file.
- **Think a few months ahead, not a few years ahead.** Speculative architecture for scale the product may never reach is itself a YAGNI violation (Section 2) — the goal is "doesn't block growth," not "pre-solves problems we don't have."
- Record real architectural decisions (why Supabase over a custom backend, why this state-management approach) briefly, in-repo, so the reasoning survives past the person who made the call. A short ADR (Architecture Decision Record) file per major decision is enough.

---

## 6. Maintainability Rules

Prefer, in this order: reusable → composable → modular → isolated → testable → self-documenting code.

**Soft size ceilings** — guidelines, not hard limits. Use judgment, but treat crossing these as a prompt to reconsider structure:

| Unit | Ceiling | Action when exceeded |
|---|---|---|
| Function | ~50 lines | Extract sub-steps into named helper functions. |
| React component | ~200–250 lines | Split into subcomponents or extract logic into a hook. |
| File | ~300–400 lines | Split by responsibility — usually a sign two concerns are living in one file. |
| Function parameters | 3 positional args | Switch to a single options object. |
| Nesting depth | 3 levels | Use early returns / guard clauses instead of nested `if`s. |

- Avoid tightly coupled code: a change in one module shouldn't force edits in unrelated modules. If it does, the dependency direction (Section 4.3) is probably being violated.
- Prefer pure functions for business logic — same input, same output, no hidden side effects — because they're trivial to test and trivial to reason about.
- Self-documenting means good names first, comments second (Section 10). A comment explaining a bad name is a sign to rename, not to comment.

---

## 7. Performance Rules

Performance is designed in up front, not patched in after a complaint. Default to the cheap, correct choice; add complexity (memoization, virtualization, caching) only where a real cost has been identified. The rules below are baseline hygiene, not premature optimization — apply them by default.

### Frontend / React

- Don't wrap everything in `useMemo`/`useCallback` reflexively — it has its own cost and adds noise. Use them when passing a callback to a memoized child, or memoizing a computation that's confirmed expensive, not assumed to be.
- `React.memo` on components that re-render often with unchanged props (list rows, chart components) — not everywhere.
- Virtualize any list that can realistically exceed ~100 rendered rows (`react-window` / `@tanstack/react-virtual`) rather than rendering the full list.
- Code-split by route and by heavy, rarely-used components (rich text editors, charting libraries, large modals) using dynamic `import()` / `React.lazy`.
- Avoid re-renders caused by passing new object/array/function literals as props on every render — hoist stable references out of the render body or memoize them.
- Keep state as local as possible. Lifting state up "just in case" causes every consumer of the parent to re-render on every change.

### Data fetching / server state

- Use a server-state library (React Query, SWR, or equivalent) instead of hand-rolled `useEffect` + `useState` fetching — it gets caching, deduplication, and request cancellation for free, and avoids the request waterfalls that come from naive `useEffect` chains.
- Fetch only the fields a view needs (`select('id, name, status')`, not `select('*')`) — both a performance and a security hygiene rule (Section 8).
- Avoid request waterfalls: fetch independent data in parallel, not one `await` after another when the second doesn't depend on the first's result.

### Bundle & assets

- Tree-shake by using named ESM imports (`import { debounce } from 'lodash-es'`), never a default import for a single function.
- Serve images in modern formats (WebP/AVIF) at the size they're actually displayed, with responsive sizing and lazy-loading for offscreen images.
- Audit bundle size when adding a new dependency — a 200KB library for one utility function is a rejected PR, not an acceptable trade.

### Database / Supabase / Postgres

- Every column used in a `WHERE`, `JOIN`, or `ORDER BY` on a table of meaningful size has an index. Verify with `EXPLAIN ANALYZE`, don't guess.
- Avoid N+1 queries: use Supabase's embedded resource selects (`select('*, author:users(name)')`) or a proper join, not a loop issuing one query per row.
- Paginate everything that can grow unbounded — keyset pagination over offset pagination once a table is large, since offset pagination degrades as the offset grows.
- Use database functions/RPC for multi-step operations that must be atomic, instead of round-tripping several separate client calls.
- Cache aggressively for read-heavy, rarely-changing data (reference tables, public content) and invalidate deliberately on writes — not on a timer alone if correctness matters.

**Rule of thumb**: measure before optimizing anything non-obvious; don't bother measuring before applying the baseline hygiene above — that's cheap enough to just always do.

---

## 8. Security Rules

Security is not a section to review at the end — it's a constraint on every decision above. The rules below are specific applications of Section 1.3 (Never Expose Secrets) and Section 1.1 (Self-Questioning).

### Trust boundary

**Never trust the client.** Every request reaching the server — an API route, an Edge Function, or Postgres via RLS — is treated as potentially hostile, regardless of what the frontend already validated. Client-side validation is a UX nicety; it is never the security control.

### Authentication & Authorization

- Authentication verifies *who*; authorization verifies *what they're allowed to do* — implement and check both, never assume one implies the other.
- Every server endpoint checks the caller's identity and permissions explicitly. "The UI doesn't show that button" is not an access control — hidden UI is not a permission check.
- Use Supabase Row Level Security (RLS) as the actual access-control layer for data, not an extra precaution behind an already-trusted API. Baseline policy pattern:

```sql
-- Users can only read their own rows
create policy "select_own_rows"
  on public.invoices
  for select
  using (auth.uid() = user_id);

-- Users can only insert rows they own
create policy "insert_own_rows"
  on public.invoices
  for insert
  with check (auth.uid() = user_id);
```

- Role-based access control (RBAC): store roles/permissions server-side (a `roles` table or a JWT custom claim), never inferred from client-provided data.
- Apply least privilege everywhere — a service account, API key, or RLS policy gets the minimum access it needs, not broad access "to be safe."

### Input validation & output handling

- Validate all input on the server with a schema library (`zod` or equivalent). A TypeScript type is erased at build time and cannot stop a malformed runtime request.
- Escape/encode all output rendered into HTML. React escapes by default — never introduce `dangerouslySetInnerHTML` without sanitizing the input first (e.g., DOMPurify), and only when there's a genuine reason to render raw HTML at all.
- Use parameterized queries / the query builder's parameter binding for every database call — never string-concatenate user input into SQL.
- CSRF: for cookie-based sessions, use same-site cookies and verify request origin on state-changing requests; token-based auth is inherently less CSRF-exposed but still validate origin where it matters.
- Rate-limit authentication endpoints, password resets, and any expensive or abusable endpoint (search, AI calls, email sends) — per-IP and per-account.

### Secrets & environment

- See Section 1.3 — non-negotiable.
- All secrets load from environment variables server-side only: never committed, never logged, never included in error messages sent to the client.
- Client-exposed env vars (`NEXT_PUBLIC_*`, `VITE_*`) are, by definition, public. Treat anything with that prefix as if it were printed on a billboard — a Supabase project URL and anon key are meant to be public *because RLS is what actually protects the data*, not the key's secrecy.

### File uploads & storage

- Validate file type by content (magic bytes / a server-side library), not by trusting the client-reported MIME type or file extension.
- Enforce a maximum file size server-side, not just in the upload widget.
- Store uploads with unpredictable keys/paths, not user-suppliable filenames, to avoid path traversal and overwrite attacks.
- Set Supabase Storage bucket policies explicitly (public vs. private) and pair private buckets with RLS-governed signed URLs — don't default to public buckets for convenience.

### Secure defaults

New endpoints, tables, and buckets start locked down (deny by default) and are opened deliberately, field by field — never start permissive and lock down later.

---

## 9. Clean Code Rules

- **Functions**: one responsibility, a name that states what it does (`calculateInvoiceTotal`, not `process` or `handleData`), short enough to read without scrolling, predictable — same inputs always produce the same outputs unless the function is explicitly and obviously an effect (e.g., `saveInvoice`, not a `getInvoice` that secretly writes).
- **Variables**: descriptive, spelled-out names (`unsubscribeFromNewsletter`, not `unsubNL`). Short names (`i`, `x`) are fine only in genuinely tiny scopes like a loop index.
- **Booleans**: read like a yes/no question (`isLoading`, `hasPermission`, `canEdit`), not `status` or `flag`.
- **Components**: do one thing well. A component that fetches data, transforms it, and renders three unrelated UI sections is three components wearing a trenchcoat — split it.
- **Hooks**: encapsulate one piece of reusable stateful logic, named for what it provides (`useInvoiceTotals`, not `useLogic`).
- **Files**: one primary export per file as a default; group tightly related small helpers together rather than one file per one-line function.

---

## 10. Documentation & Comments

Comments explain **intent and reasoning** — the "why" a reader can't get from the code itself. They never restate what the code already says.

```ts
// Bad — restates the code
// increment count by 1
count += 1;

// Good — explains the non-obvious reason
// Stripe webhooks can arrive out of order; only advance the counter
// if this event is newer than the last one we processed.
if (event.created > lastProcessedAt) count += 1;
```

### Every exported function gets a doc comment

```ts
/**
 * Calculates the total due on an invoice, including tax and any
 * active discount, in the invoice's currency's minor unit (cents).
 *
 * Exists because this calculation happened in three separate places
 * (invoice detail, PDF export, billing webhook handler) and drifted
 * out of sync twice before being centralized here.
 *
 * @param invoice - The invoice to total. Must have `lineItems` loaded.
 * @param discount - Optional active discount to apply before tax.
 * @returns Total due, in minor units (e.g., cents).
 * @throws {InvalidInvoiceError} If `invoice.lineItems` is empty.
 *
 * @example
 * const total = calculateInvoiceTotal(invoice, activeDiscount);
 */
export function calculateInvoiceTotal(
  invoice: Invoice,
  discount?: Discount
): number { ... }
```

Cover, at minimum: what it does, why it exists, each parameter, the return value, errors it can throw, and one example call.

### Complex logic blocks

Explain, directly above the block: why this logic exists, what problem it solves, and — when the mechanism itself isn't obvious — how it works. This matters most for anything that looks like it could be simplified but can't (a workaround for a third-party bug, a deliberately non-obvious ordering that prevents a race condition).

### New dependencies

Evaluate a new dependency against Section 22 before adding it. Once it's chosen, when introducing a library, package, hook, helper, or API, note — in the PR description, or a short comment at the import site for anything non-obvious:

- why it was chosen over the alternatives (or over writing it in-house)
- what problem it solves
- best practices for using it correctly here
- common mistakes or gotchas future maintainers should avoid

### What not to document

Don't caption obvious code. A wall of comments restating every line is noise that buries the comments that actually matter. If a rename would make a comment unnecessary, rename instead of commenting.

---

## 11. React Best Practices

### Component design

- Separate presentational components (props in, JSX out, no data fetching) from container components (own the data fetching, pass data down) — this split is what makes UI reusable and testable independently of data.
- Default to function components with hooks; no class components in new code.
- Co-locate a component with its own styles, tests, and tightly-coupled subcomponents rather than scattering one feature's files across distant folders (Section 4).

### State

- **Server state** (anything that lives in the database) goes through a server-state library (React Query/SWR), never hand-mirrored into `useState` — that mirror is exactly what goes stale and causes bugs.
- **Client state** (form input, modal open/closed, active tab) uses `useState`/`useReducer` locally. Reach for global state only when multiple, distant components genuinely need the same state — not preemptively.
- **URL state** (filters, pagination, selected tab) belongs in the URL via search params whenever the user should be able to share or refresh the link and keep their place.

### Context

- Context is for low-frequency-change, broadly-needed data (auth session, theme) — not a general state manager. A Context value that changes often re-renders every consumer, which becomes a real performance problem at scale (Section 7).
- Split Context by concern (`AuthContext`, `ThemeContext`) instead of one giant `AppContext`.

### Effects

- `useEffect` synchronizes with something outside React (subscriptions, browser APIs, non-React widgets) — it is not a general "run this after render" hammer.
- Data fetching in `useEffect` is a last resort, not the default — see server state above.
- Every effect that subscribes to something cleans up after itself in the return function, with no exceptions.

### Memoization

See Section 7 for the specific rules on `useMemo`, `useCallback`, and `React.memo` — applied deliberately, not reflexively.

### Forms & validation

- Use a form library (`react-hook-form` or equivalent) with a schema validator (`zod`), sharing the schema between client and server validation where the shape overlaps, so the rules can't drift apart.
- Validate on the server regardless of client validation (Section 8) — client validation is UX, not security.

### Error boundaries & Suspense

- Wrap feature-level sections in an error boundary so one broken widget doesn't blank the whole page.
- Use `Suspense` boundaries around lazy-loaded routes/components with a real loading UI, never a blank screen.

### Routing & code splitting

- Route-level components are lazy-loaded by default so the initial bundle only contains what the landing route needs.
- Route params and search params are the source of truth for anything that should survive a refresh or be shareable via URL.

### Accessibility

Every component follows Section 18 by default — accessibility is not a separate pass done at the end.

---

## 12. TypeScript Rules

- `strict: true` in `tsconfig.json`, always — non-negotiable per Section 1.5.
- No `any`. Use `unknown` and narrow it, or define the actual type. An `any` that can't be avoided gets a comment explaining why, plus a narrower type as soon as one is knowable.
- Let TypeScript infer obvious types (`const count = 0` needs no annotation); annotate function parameters, return types on exported functions, and anything inference can't reasonably determine.
- **Interfaces** for object shapes that might be extended or implemented (component props, API response shapes). **Type aliases** for unions, intersections, tuples, and anything that isn't a plain object contract.
- Use utility types (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`) to derive types from a single source of truth instead of hand-duplicating a similar shape.
- Model state with discriminated unions instead of multiple optional booleans:

```ts
// Avoid — invalid states are representable (loading + error both true?)
type State = { isLoading: boolean; isError: boolean; data?: Data };

// Prefer — only valid states exist
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: Data };
```

- Generics for genuinely reusable logic (a `useQuery<T>`-style hook) — not applied reflexively to functions with one call site.
- Never bypass the type system: no `as any`, no `// @ts-ignore` without a comment explaining exactly why (plus a linked follow-up if it's a real gap), no non-null assertions (`!`) unless the invariant is guaranteed and a runtime check has been genuinely considered and rejected for a stated reason.

---

## 13. API Design

- **Consistent response shape** across every endpoint:

```ts
type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; error: { code: string; message: string } };
```

- **Errors** return a stable, machine-readable `code` (for client logic to branch on) plus a human-readable `message` safe to show a user — never leak stack traces, internal identifiers, or query details in error responses.
- **Validation** happens at the boundary, before any business logic runs, using the same schema library as the frontend forms where the shape overlaps.
- **Versioning**: breaking changes to a public/external API get a new version (`/v2/...`) rather than mutating the contract of `/v1/...` under existing consumers. Internal-only endpoints can evolve with their single consumer but still shouldn't break silently.
- **Idempotency**: mutating endpoints that might be retried (payments, anything triggered by a webhook) accept an idempotency key and return the original result on a duplicate request, rather than double-processing.
- **Pagination**: cursor/keyset-based for anything that can grow large or changes frequently; offset-based is acceptable only for small, stable datasets.
- **Filtering & sorting**: consistent query-param conventions across endpoints (`?sort=-createdAt&status=active`), not a bespoke scheme per endpoint.
- **Rate limiting**: applied per endpoint based on cost/abuse potential, not one blanket limit for everything.
- **Logging & observability**: every request gets a correlation/request ID threaded through logs and returned to the client for support/debugging, without leaking internal details (Section 15).

---

## 14. Database Rules

- **Naming**: `snake_case` for tables and columns; pick one pluralization convention and use it everywhere (e.g., plural table names — `invoices`, not a mix of `invoice` and `users`); foreign keys named `<singular_table>_id` (`user_id`, not `uid` or `userId`).
- **Normalization**: normalize by default; denormalize deliberately, only for a measured read-performance need, with a comment explaining the trade-off and how the duplicated data stays in sync.
- **Indexes**: every foreign key, and every column used in frequent `WHERE`/`JOIN`/`ORDER BY` clauses, is indexed. Composite indexes match actual query patterns (leftmost column = most selective/most-filtered).
- **Constraints**: enforce data integrity in the database, not only in application code — `NOT NULL`, `UNIQUE`, `CHECK`, and foreign keys with an explicit `ON DELETE` policy (`CASCADE`, `RESTRICT`, or `SET NULL`, chosen deliberately per relationship).
- **Migrations**: every schema change is a version-controlled migration file, applied in order, never a manual change against a live database. Migrations are additive/backward-compatible where possible (add a column nullable, backfill, then tighten) so deploys don't require simultaneous app-and-schema changes.
- **Transactions**: multi-step writes that must succeed or fail together (e.g., debit one balance, credit another) are wrapped in a database transaction or an RPC function — never sequential, independently-awaited client calls that can partially fail.
- **RLS**: every table containing user data has Row Level Security enabled, with explicit policies per operation (`select`, `insert`, `update`, `delete`) — see Section 8 for the pattern. A table with RLS disabled "temporarily" is a production incident waiting to happen; don't ship that state.
- **Scalable schema design**: model relationships with proper join tables for many-to-many instead of array/JSON columns standing in for a relationship, unless the "many" side is small, bounded, and genuinely doesn't need to be queried from the other direction.

---

## 15. Logging & Observability

- Log meaningful events: request lifecycle, errors, state transitions that matter for debugging (payment succeeded/failed, auth failures) — not every function entry/exit.
- **Never log**: secrets, tokens, passwords, full card numbers, or anything else classified as sensitive under Section 8. Redact or omit fields; don't rely on remembering to scrub logs later.
- Structure logs (JSON, with consistent fields — timestamp, level, request ID, message, context) so they're queryable, not just human-readable strings.
- Error messages are actionable: state what failed and, where safe, why. "Failed to update invoice: RLS policy denied write for user X" is useful in a log; "Something went wrong" is not — even if that's all the *user* sees, the log itself carries the detail.
- User-facing error messages are generic and non-leaky; the detailed version goes to the log, correlated by request ID, not to the response body.

---

## 16. Git Workflow

- **Atomic commits**: one logical change per commit. A commit that fixes a bug and reformats an unrelated file is two commits.
- **Meaningful messages**: imperative mood, states what changed and why if not obvious (`Fix race condition in webhook idempotency check`, not `fix bug` or `wip`).
- **No unrelated changes**: a PR for one feature or fix doesn't also reformat files it didn't need to touch, upgrade unrelated dependencies, or rename things in passing — that hides the actual change and makes review and rollback harder.
- Prefer conventional-commit-style prefixes (`fix:`, `feat:`, `refactor:`, `chore:`) if the project already uses them; stay consistent with whatever convention already exists in the repo.

---

## 17. Testing Philosophy

- Design for testability from the start: pure functions for business logic, dependencies (a Supabase client, the current time, a random ID generator) passed in rather than reached for globally, so tests can substitute them.
- Favor a healthy pyramid: many fast unit tests on business logic and utilities, a smaller number of integration tests on API routes/RLS policies, a few end-to-end tests on critical user flows (signup, checkout, the core workflow the product exists for).
- Test behavior and contracts, not implementation details — a test shouldn't break because a component was refactored internally while its output stayed identical.
- Mock at the boundary (network, database, time, randomness), not the internals of your own pure functions — pure functions don't need mocking, they need inputs.
- Security-sensitive logic (permission checks, RLS policies, payment calculations) gets explicit test coverage for the failure/denied case, not just the happy path.

---

## 18. Accessibility

Target: WCAG 2.1 AA as the baseline for anything user-facing.

- **Semantic HTML first**: `<button>` for actions, `<a>` for navigation, real heading tags for headings, `<label>` tied to every form input. Reach for ARIA only when semantic HTML genuinely can't express the pattern (a custom combobox, a tab panel) — ARIA on top of the wrong element is worse than no ARIA.
- **Keyboard navigation**: every interactive element is reachable and operable via keyboard alone (Tab, Shift+Tab, Enter, Space, Escape, arrow keys where a pattern calls for them). Nothing works on click-only.
- **Focus management**: moving focus into a modal on open and back to the trigger on close; visible focus indicators are never removed without a replacement (`outline: none` alone is a defect, not a style choice).
- **Screen readers**: meaningful `alt` text on informative images (empty `alt=""` on purely decorative ones), `aria-label`/`aria-labelledby` on icon-only buttons, live regions (`aria-live`) for content that updates without a page navigation (toasts, async validation results).
- **Color contrast**: minimum 4.5:1 for normal text, 3:1 for large text, checked against actual design tokens — not assumed.
- **Reduced motion**: respect `prefers-reduced-motion`; anything with a non-essential animation gets a reduced/no-motion variant.

---

## 19. SEO Rules

Applies to public, indexable pages — authenticated app views don't need most of this.

- **Rendering strategy**: public content is server-rendered or statically generated so it's present in the initial HTML. Content that only appears after client-side JavaScript runs is a risk for indexability and strictly worse for Core Web Vitals.
- **Metadata**: every public page sets a unique, descriptive `<title>` and meta description — not a site-wide default repeated everywhere.
- **Open Graph & Twitter Cards**: `og:title`, `og:description`, `og:image`, `twitter:card` set per page for correct link-preview rendering when shared.
- **Canonical URLs**: every page declares its canonical, especially where the same content is reachable via multiple query-param combinations, to avoid duplicate-content dilution.
- **Structured data**: JSON-LD for content types that map to a known schema.org type (Article, Product, FAQPage, BreadcrumbList, Organization) so results are eligible for rich snippets.
- **Sitemap & robots**: `sitemap.xml` kept in sync with actual public routes; `robots.txt` explicitly allows indexable routes and disallows authenticated/internal ones.
- **Heading hierarchy**: exactly one `<h1>` per page, headings nest logically (no skipping from `h2` to `h4`) — this serves both SEO and accessibility (Section 18) from the same markup.
- **Image SEO**: descriptive filenames and `alt` text (also an accessibility requirement), properly sized and compressed (Section 7).
- **Core Web Vitals**: optimize for the three metrics that define them today — **LCP** (Largest Contentful Paint, target < 2.5s), **INP** (Interaction to Next Paint, target < 200ms — this replaced FID as the responsiveness metric), and **CLS** (Cumulative Layout Shift, target < 0.1, mainly by reserving space for images/embeds before they load).
- **Internal linking**: meaningful, descriptive link text between related public pages — not bare "click here" — both for users and for crawl discovery.
- **Indexability**: no accidental `noindex`, no public pages blocked by `robots.txt`, no content gated behind an interaction a crawler won't perform.

---

## 20. Pre-Completion Code Review Checklist

Run through this before calling any task done. Every box must be honestly checkable — not assumed.

- [ ] Code compiles / builds with no errors
- [ ] Zero TypeScript errors (no new `any`, no suppressed errors)
- [ ] Zero lint errors and warnings
- [ ] No dead code, unused imports, unused variables, or unused files left behind
- [ ] No duplicated logic introduced
- [ ] No unnecessary complexity, poor-fitting abstractions, or over-engineering
- [ ] Edge cases and race conditions in the changed logic have been considered, not just the happy path
- [ ] Production-ready, not a demo/placeholder
- [ ] Secure: input validated server-side, no secrets exposed, RLS/authz checked (Section 8)
- [ ] Accessible: keyboard-operable, labeled, contrast-checked where UI changed (Section 18)
- [ ] SEO-optimized where the change touches a public page (Section 19)
- [ ] Performant: no obvious N+1 queries, unindexed filters, or unnecessary re-renders introduced (Section 7)
- [ ] Maintainable: follows the architecture and naming conventions in this document
- [ ] Scalable: doesn't introduce a bottleneck that blocks team or usage growth (Section 5)
- [ ] Readable: a new engineer could follow it without asking the author
- [ ] Consistent with the rest of the codebase's existing patterns
- [ ] Properly documented per Section 10
- [ ] Only touches files relevant to the task
- [ ] Every call site of anything modified has been checked for breakage (Section 23)
- [ ] No breaking changes unless explicitly requested and called out

---

## 21. AI Agent Operating Protocol

- **Think before coding.** Read the relevant existing code and understand the current architecture, established design patterns, project conventions, and existing abstractions before writing anything new — see Section 1.6 for the full verification protocol.
- **Reuse before creating.** Search for an existing utility, hook, component, or service that already does this (or almost does) before writing a new one. A near-duplicate utility is a bug waiting to cause drift (Section 1.6).
- **Prefer improving existing code over adding more code on top of it** when the task touches code that's already imperfect — leave it better, don't just build alongside it.
- **Stay in scope.** Never edit files unrelated to the task, even if you notice something else that could be improved — note it instead (a comment, a follow-up suggestion), don't fix it unprompted inside an unrelated change.
- **No unrequested breaking changes.** Preserve backward compatibility unless the task explicitly calls for a breaking change, and call it out clearly when it happens. See Section 23 for the full change-impact protocol before modifying anything shared.
- **When multiple valid approaches exist**, choose the simplest production-ready solution with the best long-term maintainability — not the fastest to type, and not the most impressive-looking. Avoid unnecessary abstraction, unnecessary design patterns, premature optimization, and over-engineering.
- **Priority order when trade-offs are unavoidable**: readability first, then performance, then brevity.
- **Write for a 10-year maintenance horizon** — by a large team, most of whom will never talk to whoever wrote the original line. Optimize for readability, maintainability, consistency, and simplicity over short-term convenience.

---

## 22. Dependency Policy

Every dependency is a liability as much as a convenience — it's code the team didn't write but is now responsible for, forever.

- **Never add a new library simply because it's convenient** for the task at hand. A dependency earns its place only when it solves a real, nontrivial problem better than writing it in-house would.
- **Prefer an existing project dependency** over a new one whenever it can reasonably do the job — two libraries doing the same thing is a maintenance and bundle-size cost with no offsetting benefit (Section 7).
- **Never duplicate functionality already available** in the codebase or in an existing dependency.

Before introducing anything new, evaluate:

| Criterion | What to check |
|---|---|
| Maintenance | Is it actively maintained? When was the last release? |
| Bundle size | What does it cost the client bundle relative to what it does (Section 7)? |
| Security | Any known vulnerabilities? A reasonable dependency footprint of its own? |
| Popularity & community | Is it widely used enough that problems have known solutions? |
| Documentation quality | Can a future maintainer actually learn it from the docs? |
| Long-term viability | Is it likely to still be maintained and compatible a few years from now? |

A dependency that fails several of these is a rejected choice even if it's the fastest path to a working demo today. Document the choice per Section 10 once it passes.

---

## 23. Change Impact & API Stability

Anything with more than one consumer is a public contract, whether or not it was designed to be one. Treat it that way.

### Before modifying anything shared

Before modifying any existing file, component, hook, utility, service, or API that other code depends on, **find every place it's used** — every import, every call site, every consumer — before changing it. Confirm the change doesn't introduce a regression or break a feature that wasn't part of the task. "It still compiles" is not the same as "nothing broke": a change can be type-safe and still silently change behavior for an existing caller.

### What counts as a public contract

Never change any of the following without first evaluating every consumer, because each one has callers or renderers that will break silently if the contract shifts underneath them:

- API responses and function signatures
- exported interfaces and types
- public hooks and public components' props
- database schemas (see Section 14 for migration mechanics)

**Breaking changes require explicit user approval.** If a change to one of the above is genuinely necessary, say so explicitly, name what it breaks, and confirm before proceeding rather than making the call unilaterally. Where the contract is a versioned external API, follow Section 13's versioning rule instead of breaking the current version.

Backward compatibility is preserved by default in every case not covered by an explicit exception above.

---

## Notes on This Document

**Stack assumption**: this document assumes TypeScript + React on the frontend and Supabase/Postgres on the backend, based on the technologies referenced throughout the spec it was built from. If that's not the actual stack, Sections 11, 12, and 14 should be translated to the real stack — the surrounding principles apply regardless of framework.

**On length**: this is deliberately the exhaustive version, meant to be read once in full and then used as a reference. If it turns out to be too long to stay in active context during day-to-day sessions, a condensed one-page companion (Prime Directives and the Checklist in full, everything else compressed to one line per rule) is a natural pairing — ask if you'd like one generated.
