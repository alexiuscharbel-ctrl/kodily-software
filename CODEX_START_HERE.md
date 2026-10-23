# Start here in Codex

Open this folder as the Codex project/repository. Then use the prompts below in order.

## Prompt 1 — audit and validate the scaffold

```text
Read AGENTS.md, README.md, docs/product-brief.md, and docs/architecture-notes.md first.

Inspect this repository as it exists. Do not replace the stack or start adding features yet.

1. Check package scripts and source structure.
2. Install dependencies if needed.
3. Run typecheck, lint, unit tests, Prisma schema validation, and a production build where possible.
4. Fix straightforward scaffold errors, keeping changes small. Do not add live payment-provider integrations or real credentials.
5. Check that demo data is explicitly fictional and that no endpoint or action is mistakenly presented as production-ready.
6. Report checks run and their exact outcomes. Do not claim a check passed unless you ran it.
7. Create/update docs/implementation-plan.md with a staged plan and risks, prioritizing authentication and server-side tenant isolation before persistent customer data.

Stop after the audit and validation. Explain any remaining blockers clearly.
```

## Prompt 2 — implement authentication and tenant isolation

Use this after Prompt 1 and review the audit results.

```text
Read AGENTS.md and the implementation plan. Implement the first secure vertical slice: authentication, tenant membership, and server-side authorization for tenant-owned data.

Requirements:
- Choose a maintained authentication approach that fits this existing Next.js/TypeScript stack. Explain the choice before adding dependencies.
- Never treat a tenant ID supplied by the browser as proof of authorization. Derive the active user and permitted tenant membership from a verified server-side session.
- Protect every new server action, API route, and data-access function. Default to deny when there is no authenticated user or valid tenant membership.
- Add a safe local development seed with fictional users and tenants only. Do not hard-code a production password or add a public demo login.
- Check tenant consistency for related records (for example, a ticket's customer, payment connection, transaction, and incident must belong to the same tenant).
- Add tests showing that a user in tenant A cannot read or mutate tenant B's records, including attempts to change request parameters or IDs.
- Keep payment provider integrations mocked. Do not implement refunds, reversals, transfers, or other money-moving actions.
- Update setup documentation and .env.example with variable names only, never real secrets.
- Run typecheck, lint, tests, Prisma validation, and build. Report any checks you could not run.

Make small, reviewable changes and explain security-sensitive decisions. Do not claim production readiness until the full security and operational review is complete.
```

## What is intentionally incomplete

This is a starter source repository, not a finished helpdesk. The current dashboard uses fictional local fixtures. No sign-in flow, ticket persistence, live provider connection, webhook receiver, channel integration, or production deployment is active. This is deliberate: tenant authorization and trustworthy payment-event handling need to be implemented and tested before real customer data is introduced.
