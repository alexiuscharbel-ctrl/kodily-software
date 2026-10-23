# Product brief — Africa Payment Support Platform

## Problem
Businesses that accept digital payments (cards, bank transfer, mobile money)
receive a large share of support contacts that are really payment-status
questions: "I was debited but got no confirmation", "Is my payment through?",
"Why was I charged twice?". Agents waste time switching between the helpdesk
and payment dashboards, repeat contacts about the same transaction arrive
through multiple channels, and unresolved payment issues escalate late.

## Product hypothesis
Payment verification, repeat-contact linking, and incident grouping inside
the support queue can reduce payment-related support congestion for these
businesses.

## Scope of this scaffold (MVP)

Included now:
- Dashboard (overview, tickets, payments, incidents) running on clearly
  labelled fictional fixture data.
- PostgreSQL + Prisma schema for tenant-aware support and payment records.
- Provider-agnostic payment status normalization (`src/lib/payments/status.ts`).
- Mock payment provider adapter (`src/lib/payments/mock-provider.ts`).
- Conservative duplicate-case suggestion helper (`src/lib/duplicates.ts`).
- Unit tests for status mapping and duplicate matching.

Deliberately not included yet:
- Authentication, tenant membership, and server-side authorization.
- Persistence of tickets or live payment-provider connections.
- Webhook ingestion with signature verification and idempotent processing.
- Any money-moving action (refunds, reversals, transfers) — permanently out
  of scope for the MVP.

## Non-goals and safety rules
See `AGENTS.md`. Highlights: tenant scope enforced server-side, unknown or
conflicting payment states never shown as success, duplicate matching is a
suggestion requiring human confirmation, no secrets in source control, no
claims of production readiness until the security review is complete.
