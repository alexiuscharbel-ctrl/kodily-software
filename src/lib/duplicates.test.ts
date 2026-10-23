import { describe, expect, it } from "vitest";
import { suggestDuplicateTickets } from "./duplicates";
import type { Ticket } from "./types";

function ticket(overrides: Partial<Ticket>): Ticket {
  return {
    id: "tkt-x",
    tenantId: "tenant-a",
    customerId: "cus-1",
    subject: "Test ticket",
    channel: "web",
    status: "open",
    priority: "medium",
    transactionReference: "REF-1",
    createdAt: "2026-10-20T10:00:00Z",
    updatedAt: "2026-10-20T10:00:00Z",
    ...overrides,
  };
}

describe("suggestDuplicateTickets", () => {
  it("suggests tickets with same tenant, customer, and reference in window", () => {
    const suggestions = suggestDuplicateTickets(
      [
        ticket({ id: "tkt-1", createdAt: "2026-10-20T10:00:00Z" }),
        ticket({ id: "tkt-2", createdAt: "2026-10-20T12:00:00Z" }),
      ],
      { windowHours: 48 },
    );
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].ticketId).toBe("tkt-2");
    expect(suggestions[0].duplicateOfTicketId).toBe("tkt-1");
  });

  it("never matches across tenants", () => {
    const suggestions = suggestDuplicateTickets(
      [
        ticket({ id: "tkt-1", tenantId: "tenant-a" }),
        ticket({ id: "tkt-2", tenantId: "tenant-b" }),
      ],
      { windowHours: 48 },
    );
    expect(suggestions).toHaveLength(0);
  });

  it("never matches different customers", () => {
    const suggestions = suggestDuplicateTickets(
      [
        ticket({ id: "tkt-1", customerId: "cus-1" }),
        ticket({ id: "tkt-2", customerId: "cus-2" }),
      ],
      { windowHours: 48 },
    );
    expect(suggestions).toHaveLength(0);
  });

  it("never matches different or missing references", () => {
    expect(
      suggestDuplicateTickets(
        [
          ticket({ id: "tkt-1", transactionReference: "REF-1" }),
          ticket({ id: "tkt-2", transactionReference: "REF-2" }),
        ],
        { windowHours: 48 },
      ),
    ).toHaveLength(0);

    expect(
      suggestDuplicateTickets(
        [
          ticket({ id: "tkt-1", transactionReference: null }),
          ticket({ id: "tkt-2", transactionReference: null }),
        ],
        { windowHours: 48 },
      ),
    ).toHaveLength(0);
  });

  it("never matches outside the time window", () => {
    const suggestions = suggestDuplicateTickets(
      [
        ticket({ id: "tkt-1", createdAt: "2026-10-01T10:00:00Z" }),
        ticket({ id: "tkt-2", createdAt: "2026-10-20T10:01:00Z" }),
      ],
      { windowHours: 48 },
    );
    expect(suggestions).toHaveLength(0);
  });

  it("matches exactly at the window boundary", () => {
    const suggestions = suggestDuplicateTickets(
      [
        ticket({ id: "tkt-1", createdAt: "2026-10-20T10:00:00Z" }),
        ticket({ id: "tkt-2", createdAt: "2026-10-22T10:00:00Z" }),
      ],
      { windowHours: 48 },
    );
    expect(suggestions).toHaveLength(1);
  });

  it("rejects invalid windows", () => {
    expect(
      suggestDuplicateTickets([ticket({}), ticket({})], { windowHours: 0 }),
    ).toHaveLength(0);
    expect(
      suggestDuplicateTickets([ticket({}), ticket({})], { windowHours: -5 }),
    ).toHaveLength(0);
  });
});
