# Instructions for Codex and coding agents

## Product objective
Build a payment-aware customer-support platform that helps authorized businesses verify payment status, identify repeat contacts about the same transaction, group incidents, and escalate unresolved cases safely.

## Before changing code
1. Read `README.md` and `docs/product-brief.md`.
2. Inspect the current structure and dependencies before proposing major changes.
3. State assumptions, identify security implications, and make changes in small reviewable stages.
4. Do not replace the stack or add services without explaining why.

## Non-negotiable safety and product rules
- **No production deployment yet.** Authentication, authorization, and server-side tenant isolation must be implemented and tested before any customer data is used.
- Enforce tenant scope on the server/database access path. Never trust a client-supplied `tenantId` as authorization.
- Use mock payment providers and deterministic fixtures until a pilot merchant's real provider access is confirmed.
- Never report a payment as successful solely from a customer screenshot or an unverified webhook body.
- Treat timeouts, missing data, conflicting states, and failed lookups as `unknown`/unresolved, not as success or failure.
- Verify provider events according to that provider's documented authentication/signature rules. Process duplicate events idempotently and test retries and out-of-order events.
- Never implement refunds, reversals, transfers, or any other money-moving operation in the MVP.
- Never collect or expose payment PINs, OTPs, passwords, or card security codes.
- Do not put API secrets in source files, browser code, logs, fixtures, or committed `.env` files. Update `.env.example` with variable names only.
- Avoid logging personal data or full webhook payloads by default. Use redacted, minimized audit records.
- Duplicate matching is a **suggestion** only. Match on tenant, customer, exact transaction reference, and a configured time window; require human confirmation before linking/merging in the first release.
- Keep provider-specific behavior behind adapter interfaces.
- Add or update tests with each functional change. Run `npm run typecheck`, `npm test`, and `npm run build` when feasible; report any checks that could not be run.
- Do not claim compliance, production security, market validation, or superiority to Freshdesk without evidence.

## Suggested sequence
1. Review scaffold and record architecture plan.
2. Implement authentication and tenant membership/authorization.
3. Add tenant-isolation tests for every data access path.
4. Add ticket create/list/update services, validation, and audit events.
5. Add mock payment verification and idempotent event ingestion.
6. Add confirmed duplicate suggestions and incident grouping.
7. Add metrics with explicit formulas and tests.
8. Only then plan a real payment-provider sandbox integration with the pilot merchant.
