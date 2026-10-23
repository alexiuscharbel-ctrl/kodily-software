"use client";

import { useState } from "react";
import { DEMO_TENANT_ID, demoTransactions } from "@/lib/fixtures";
import { formatDateTime, formatMinorUnits } from "@/lib/format";
import {
  MockPaymentProvider,
  type PaymentLookupResult,
} from "@/lib/payments/mock-provider";
import { STATUS_LABELS } from "@/lib/payments/status";

const STATUS_BADGE: Record<string, string> = {
  successful: "badge badge-success",
  pending: "badge badge-pending",
  failed: "badge badge-failed",
  reversed: "badge badge-info",
  unknown: "badge badge-unknown",
};

const provider = new MockPaymentProvider(demoTransactions);

export function PaymentLookup() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<PaymentLookupResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!reference.trim()) return;
    setBusy(true);
    try {
      setResult(await provider.lookupByReference(DEMO_TENANT_ID, reference));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form className="lookup-form" onSubmit={onSubmit}>
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Transaction reference, e.g. KDS-DEMO-10001"
          aria-label="Transaction reference"
        />
        <button type="submit" disabled={busy}>
          {busy ? "Checking…" : "Verify"}
        </button>
      </form>

      {result && (
        <div className="result-card">
          {result.found ? (
            <dl>
              <dt>Reference</dt>
              <dd>{result.reference}</dd>
              <dt>Status</dt>
              <dd>
                <span className={STATUS_BADGE[result.normalizedStatus]}>
                  {STATUS_LABELS[result.normalizedStatus]}
                </span>{" "}
                <span className="muted">(provider raw: {result.rawStatus})</span>
              </dd>
              <dt>Amount</dt>
              <dd>
                {result.amountMinor !== null && result.currency
                  ? formatMinorUnits(result.amountMinor, result.currency)
                  : "—"}
              </dd>
              <dt>Occurred</dt>
              <dd>{result.occurredAt ? formatDateTime(result.occurredAt) : "—"}</dd>
              <dt>Note</dt>
              <dd className="muted">{result.note}</dd>
            </dl>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              {result.note} Status is recorded as{" "}
              <strong>unknown</strong>, not as success or failure.
            </p>
          )}
        </div>
      )}
    </>
  );
}
