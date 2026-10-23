import type {
  Customer,
  Incident,
  PaymentTransaction,
  Ticket,
} from "./types";

/**
 * FICTIONAL DEMO DATA ONLY.
 *
 * Every person, business, phone number, and transaction reference below is
 * invented for UI development. No real customer or payment data is stored
 * anywhere in this repository (see AGENTS.md).
 */

export const DEMO_TENANT_ID = "tenant-demo-kioska";

export const demoCustomers: Customer[] = [
  {
    id: "cus-001",
    tenantId: DEMO_TENANT_ID,
    fullName: "Adaeze Okonkwo",
    phone: "+234 800 000 0001",
    email: "adaeze@example.test",
  },
  {
    id: "cus-002",
    tenantId: DEMO_TENANT_ID,
    fullName: "Kwame Mensah",
    phone: "+233 200 000 002",
    email: null,
  },
  {
    id: "cus-003",
    tenantId: DEMO_TENANT_ID,
    fullName: "Fatima Diallo",
    phone: "+221 770 000 003",
    email: "fatima@example.test",
  },
  {
    id: "cus-004",
    tenantId: DEMO_TENANT_ID,
    fullName: "Tendai Moyo",
    phone: "+263 710 000 004",
    email: null,
  },
];

export const demoTransactions: PaymentTransaction[] = [
  {
    id: "txn-001",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-001",
    reference: "KDS-DEMO-10001",
    provider: "mockpay",
    providerStatus: "success",
    normalizedStatus: "successful",
    amountMinor: 1850000,
    currency: "NGN",
    occurredAt: "2026-10-20T09:14:00Z",
  },
  {
    id: "txn-002",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-002",
    reference: "KDS-DEMO-10002",
    provider: "mockpay",
    providerStatus: "processing",
    normalizedStatus: "pending",
    amountMinor: 420000,
    currency: "GHS",
    occurredAt: "2026-10-21T15:40:00Z",
  },
  {
    id: "txn-003",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-003",
    reference: "KDS-DEMO-10003",
    provider: "mockpay",
    providerStatus: "failed",
    normalizedStatus: "failed",
    amountMinor: 990000,
    currency: "XOF",
    occurredAt: "2026-10-19T11:02:00Z",
  },
  {
    id: "txn-004",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-004",
    reference: "KDS-DEMO-10004",
    provider: "mockpay",
    providerStatus: "unrecognized_state",
    normalizedStatus: "unknown",
    amountMinor: 150000,
    currency: "USD",
    occurredAt: "2026-10-22T08:27:00Z",
  },
];

export const demoTickets: Ticket[] = [
  {
    id: "tkt-1001",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-001",
    subject: "Customer charged but order not confirmed",
    channel: "whatsapp",
    status: "open",
    priority: "high",
    transactionReference: "KDS-DEMO-10001",
    createdAt: "2026-10-20T09:31:00Z",
    updatedAt: "2026-10-20T09:31:00Z",
  },
  {
    id: "tkt-1002",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-001",
    subject: "Follow-up: payment still not reflected",
    channel: "email",
    status: "open",
    priority: "high",
    transactionReference: "KDS-DEMO-10001",
    createdAt: "2026-10-20T14:05:00Z",
    updatedAt: "2026-10-20T14:05:00Z",
  },
  {
    id: "tkt-1003",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-002",
    subject: "Mobile money debit pending for 2 days",
    channel: "phone",
    status: "pending",
    priority: "medium",
    transactionReference: "KDS-DEMO-10002",
    createdAt: "2026-10-21T16:12:00Z",
    updatedAt: "2026-10-22T08:00:00Z",
  },
  {
    id: "tkt-1004",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-003",
    subject: "Checkout failed but card was debited",
    channel: "web",
    status: "open",
    priority: "urgent",
    transactionReference: "KDS-DEMO-10003",
    createdAt: "2026-10-19T11:20:00Z",
    updatedAt: "2026-10-19T11:20:00Z",
  },
  {
    id: "tkt-1005",
    tenantId: DEMO_TENANT_ID,
    customerId: "cus-004",
    subject: "Receipt shows different amount than order",
    channel: "whatsapp",
    status: "resolved",
    priority: "low",
    transactionReference: "KDS-DEMO-10004",
    createdAt: "2026-10-18T10:00:00Z",
    updatedAt: "2026-10-19T09:00:00Z",
  },
];

export const demoIncidents: Incident[] = [
  {
    id: "inc-001",
    tenantId: DEMO_TENANT_ID,
    title: "Delayed confirmations on card checkouts",
    summary:
      "Cluster of tickets where customers report debits without order " +
      "confirmation. Provider webhooks are arriving later than usual in " +
      "the demo timeline.",
    status: "investigating",
    ticketIds: ["tkt-1001", "tkt-1002", "tkt-1004"],
    openedAt: "2026-10-20T10:00:00Z",
  },
];
