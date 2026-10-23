export type NormalizedPaymentStatus =
  | "pending"
  | "successful"
  | "failed"
  | "reversed"
  | "unknown";

export interface Customer {
  id: string;
  tenantId: string;
  fullName: string;
  phone: string;
  email: string | null;
}

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "pending" | "resolved" | "closed";

export interface Ticket {
  id: string;
  tenantId: string;
  customerId: string;
  subject: string;
  channel: "whatsapp" | "email" | "phone" | "web";
  status: TicketStatus;
  priority: TicketPriority;
  transactionReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  tenantId: string;
  customerId: string;
  reference: string;
  provider: string;
  providerStatus: string;
  normalizedStatus: NormalizedPaymentStatus;
  amountMinor: number;
  currency: string;
  occurredAt: string;
}

export interface Incident {
  id: string;
  tenantId: string;
  title: string;
  summary: string;
  status: "investigating" | "monitoring" | "resolved";
  ticketIds: string[];
  openedAt: string;
}
