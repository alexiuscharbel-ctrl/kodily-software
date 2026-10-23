# Architecture notes

## Stack
- Next.js (App Router) + TypeScript + React 19.
- Prisma + PostgreSQL 16 for tenant-aware persistence (schema only for now;
  the demo UI reads fixture data, not the database).
- Vitest for unit tests, ESLint flat config for linting.

## Layout
- `src/app/` — dashboard routes: `/` overview, `/tickets`, `/payments`,
  `/incidents`. Server components by default; the payment lookup widget is a
  client component calling the mock adapter in-memory.
- `src/lib/` — domain logic, framework-free and unit-testable:
  - `payments/status.ts` — raw provider status → normalized status.
    Unrecognized input always maps to `unknown`.
  - `payments/mock-provider.ts` — deterministic `PaymentProvider`
    implementation for demos/tests. Conflicts and misses resolve to
    `unknown`/not-found.
  - `duplicates.ts` — exact-match duplicate suggestions (tenant + customer +
    reference + time window). Suggestion only; never mutates.
  - `fixtures.ts` — fictional demo data, the only data source of the UI.
- `prisma/schema.prisma` — tenant-scoped data model. Money is integer minor
  units (`amountMinor`). Provider raw status and normalized status are both
  stored. `PaymentEvent` has a unique key on
  `(transactionId, providerEventId)` to support idempotent event processing.

## Design decisions
- Provider-specific behavior lives behind the `PaymentProvider` interface so
  real providers (Paystack, Flutterwave, mobile money) can be added as
  adapters without touching domain logic.
- The UI derives every payment badge from the normalization layer, so a raw
  provider string can never be displayed as "successful" by accident.
- No authentication yet: every page therefore reads only bundled fictional
  fixtures, and nothing accepts or persists user input.

## Next steps
See `docs/implementation-plan.md`.
