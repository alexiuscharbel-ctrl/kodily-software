import type { Ticket } from "./types";

export interface DuplicateSuggestion {
  ticketId: string;
  duplicateOfTicketId: string;
  reason: string;
  transactionReference: string;
}

export interface DuplicateMatchOptions {
  /** Tickets created more than this many hours apart are never matched. */
  windowHours: number;
  /** Evaluated at this instant; defaults to now. Mainly for tests. */
  now?: Date;
}

/**
 * Conservative duplicate-case matcher.
 *
 * A pair of tickets is suggested as duplicates only when ALL hold:
 * - same tenant
 * - same customer
 * - identical, non-empty transaction reference
 * - created within the configured time window of each other
 *
 * This only *suggests* links for human review. It never merges,
 * closes, or mutates tickets, and it never matches on fuzzy text,
 * names, or amounts (see AGENTS.md).
 */
export function suggestDuplicateTickets(
  tickets: Ticket[],
  options: DuplicateMatchOptions,
): DuplicateSuggestion[] {
  const windowMs = options.windowHours * 60 * 60 * 1000;
  if (!Number.isFinite(windowMs) || windowMs <= 0) return [];

  const suggestions: DuplicateSuggestion[] = [];
  const sorted = [...tickets].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );

  for (let i = 0; i < sorted.length; i += 1) {
    for (let j = i + 1; j < sorted.length; j += 1) {
      const earlier = sorted[i];
      const later = sorted[j];

      if (earlier.tenantId !== later.tenantId) continue;
      if (earlier.customerId !== later.customerId) continue;

      const ref = earlier.transactionReference?.trim();
      if (!ref || ref !== later.transactionReference?.trim()) continue;

      const gapMs = Math.abs(
        Date.parse(later.createdAt) - Date.parse(earlier.createdAt),
      );
      if (Number.isNaN(gapMs) || gapMs > windowMs) continue;

      suggestions.push({
        ticketId: later.id,
        duplicateOfTicketId: earlier.id,
        reason:
          "Same tenant, customer, and transaction reference within " +
          `${options.windowHours}h window. Requires human confirmation.`,
        transactionReference: ref,
      });
    }
  }

  return suggestions;
}
