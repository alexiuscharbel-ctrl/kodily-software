# Implementation plan

Staged plan per `AGENTS.md`. Each stage must keep `npm run typecheck`,
`npm run lint`, `npm test`, and `npm run build` green.

## Stage 0 — audit and repair (done in this change)
- Fix invalid `package.json` (missing comma in devDependencies).
- Replace the stub `package-lock.json` (run `npm install` to regenerate a
  real lockfile locally and commit it).
- Implement the source the README described but which did not exist:
  dashboard routes, fixture data, Prisma schema, payment status
  normalization, mock provider adapter, duplicate matcher, unit tests.
- Write `docs/product-brief.md` and `docs/architecture-notes.md`.

## Stage 1 — authentication and tenant isolation (next, highest priority)
- Add session-based authentication (evaluate Auth.js vs. a minimal
  credentials + signed-session approach; document the choice).
- Implement `TenantMembership`-driven authorization helpers. Derive tenant
  from the verified session, never from client-supplied IDs. Default deny.
- Fictional seed users/tenants for local development only; no public demo
  login, no hard-coded production passwords.

## Stage 2 — ticket services with persistence
- Ticket create/list/update via server actions or route handlers, all
  tenant-scoped, with `TicketEvent` audit records.
- Tenant-isolation tests for every data-access path, including ID/parameter
  tampering from tenant A against tenant B records.

## Stage 3 — mock payment verification + event ingestion
- Wire the payment lookup UI to the mock provider through a tenant-scoped
  server path.
- Idempotent `PaymentEvent` ingestion with signature-verification seam;
  tests for retries and out-of-order delivery. Providers stay mocked.

## Stage 4 — duplicates and incidents
- Surface duplicate suggestions with a human-confirm flow.
- Manual incident grouping and status updates.

## Stage 5 — metrics
- Payment-contact rate, repeat-contact rate, time-to-resolution with
  explicit formulas and tests.

## Stage 6 — pilot preparation
- Only after stages 1–5 pass review: plan a sandbox integration with one
  pilot merchant's real provider. Still no money-moving actions.

## Risks
- Auth choices are security-critical; keep dependencies maintained and
  minimal.
- Webhook handling is easy to get wrong (verification, ordering, retries) —
  keep it behind the provider adapter and test adversarially.
