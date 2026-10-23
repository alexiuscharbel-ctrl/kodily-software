# Africa Payment Support Platform

A starter repository for a payment-aware customer-support platform. The initial product hypothesis is that payment verification, repeat-contact linking, and incident grouping can help businesses reduce payment-related support congestion.

> **Starter scaffold, not production-ready.** Authentication, tenant authorization, live payment integrations, webhook signature verification, and production deployment controls are not implemented yet. Do not expose this app to the public internet or use real customer/payment data until those controls are implemented and reviewed.

## Included in this source project

- Next.js + TypeScript dashboard starter with clearly labelled demo data.
- PostgreSQL and Prisma schema for tenant-aware support and payment records.
- Payment status normalization utility and mock provider adapter.
- Conservative duplicate-case matching helper (exact transaction reference, same tenant/customer, and time window only).
- Unit tests for payment status mapping and duplicate matching.
- Product brief and Codex instructions.

## Prerequisites

- Node.js 20.9 or newer (Node 22 LTS is recommended).
- npm.
- Docker Desktop or another PostgreSQL 16-compatible database, if you want to use Prisma locally.

## Run the demo UI

```bash
npm install
npm run dev
```

Open http://localhost:3000. The dashboard uses fixture data; it does not read or write to the database.

## Configure PostgreSQL

1. Copy `.env.example` to `.env`.
2. Start the database:

   ```bash
   docker compose up -d db
   ```

3. Generate the Prisma client and apply the initial schema:

   ```bash
   npm run db:generate
   npm run db:migrate -- --name init
   ```

`DATABASE_URL` in `.env.example` is intended for local development only.

## Run checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Start with Codex

Read `CODEX_START_HERE.md` and use its first prompt to audit the scaffold before implementing new features.

## Recommended next Codex task

Ask Codex to inspect `AGENTS.md`, this README, and `docs/product-brief.md`. Its first implementation task should be to propose and implement secure authentication and server-side tenant authorization, with tests that prove tenant A cannot read or mutate tenant B's records. Keep payment integrations mocked until the authorization and event-processing foundations are reviewed.

## Architecture decisions

- The first UI is a web dashboard; channel integrations are not active.
- Payment status handling is provider-agnostic by design. Store the provider's raw status as well as a normalized status.
- Money values use integer minor units (`amountMinor`), not floating-point numbers.
- The first release suggests likely duplicate cases; it must not automatically merge based on fuzzy text or names.
- The MVP must not initiate refunds, reversals, transfers, or other money-moving actions.
- API keys and secrets must never be stored in ordinary source code or committed to Git.
