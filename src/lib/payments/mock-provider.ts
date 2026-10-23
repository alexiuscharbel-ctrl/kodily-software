import type { NormalizedPaymentStatus, PaymentTransaction } from "../types";
import { normalizePaymentStatus } from "./status";

export interface PaymentLookupResult {
  found: boolean;
  reference: string;
  provider: string;
  rawStatus: string | null;
  normalizedStatus: NormalizedPaymentStatus;
  amountMinor: number | null;
  currency: string | null;
  occurredAt: string | null;
  note: string;
}

export interface PaymentProvider {
  readonly name: string;
  lookupByReference(
    tenantId: string,
    reference: string,
  ): Promise<PaymentLookupResult>;
}

/**
 * Deterministic in-memory provider for demos and tests.
 *
 * It never moves money and never marks a payment successful unless the
 * fixture transaction itself carries a success-mapped provider status.
 * Timeouts, conflicts, and missing records all surface as "unknown" or
 * not-found results, matching the safety rules in AGENTS.md.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mockpay";

  constructor(private readonly transactions: PaymentTransaction[]) {}

  async lookupByReference(
    tenantId: string,
    reference: string,
  ): Promise<PaymentLookupResult> {
    const trimmed = reference.trim();
    const matches = this.transactions.filter(
      (tx) => tx.tenantId === tenantId && tx.reference === trimmed,
    );

    if (matches.length === 0) {
      return {
        found: false,
        reference: trimmed,
        provider: this.name,
        rawStatus: null,
        normalizedStatus: "unknown",
        amountMinor: null,
        currency: null,
        occurredAt: null,
        note: "No transaction with this reference for the current tenant.",
      };
    }

    if (matches.length > 1) {
      return {
        found: true,
        reference: trimmed,
        provider: this.name,
        rawStatus: "conflicting_records",
        normalizedStatus: "unknown",
        amountMinor: null,
        currency: null,
        occurredAt: null,
        note: "Conflicting records for this reference; treated as unresolved.",
      };
    }

    const tx = matches[0];
    return {
      found: true,
      reference: tx.reference,
      provider: tx.provider,
      rawStatus: tx.providerStatus,
      normalizedStatus: normalizePaymentStatus(tx.provider, tx.providerStatus),
      amountMinor: tx.amountMinor,
      currency: tx.currency,
      occurredAt: tx.occurredAt,
      note: "Lookup from mock provider fixture.",
    };
  }
}
