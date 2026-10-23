import type { NormalizedPaymentStatus } from "../types";

/**
 * Maps raw provider-specific payment statuses to a normalized status.
 *
 * Safety rules (see AGENTS.md):
 * - Anything unrecognized, ambiguous, or conflicting maps to "unknown".
 * - We never guess "successful" from partial evidence.
 */
const STATUS_TABLES: Record<string, Record<string, NormalizedPaymentStatus>> = {
  mockpay: {
    initiated: "pending",
    processing: "pending",
    authorized: "pending",
    success: "successful",
    completed: "successful",
    settled: "successful",
    failed: "failed",
    declined: "failed",
    cancelled: "failed",
    expired: "failed",
    reversed: "reversed",
    chargeback: "reversed",
  },
  paystack: {
    pending: "pending",
    ongoing: "pending",
    processing: "pending",
    queued: "pending",
    success: "successful",
    failed: "failed",
    abandoned: "failed",
    reversed: "reversed",
  },
  flutterwave: {
    pending: "pending",
    processing: "pending",
    successful: "successful",
    success: "successful",
    failed: "failed",
    cancelled: "failed",
    reversed: "reversed",
  },
  mtn_momo: {
    pending: "pending",
    successful: "successful",
    failed: "failed",
    rejected: "failed",
    timeout: "unknown",
    refunded: "reversed",
  },
};

export function normalizePaymentStatus(
  provider: string,
  rawStatus: string | null | undefined,
): NormalizedPaymentStatus {
  if (!rawStatus) return "unknown";
  const providerTable = STATUS_TABLES[provider.trim().toLowerCase()];
  if (!providerTable) return "unknown";
  return providerTable[rawStatus.trim().toLowerCase()] ?? "unknown";
}

export const STATUS_LABELS: Record<NormalizedPaymentStatus, string> = {
  pending: "Pending",
  successful: "Successful",
  failed: "Failed",
  reversed: "Reversed",
  unknown: "Unknown",
};
