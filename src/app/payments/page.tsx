import type { Metadata } from "next";
import { formatDateTime, formatMinorUnits } from "@/lib/format";
import { DEMO_TENANT_ID, demoTransactions } from "@/lib/fixtures";
import { STATUS_LABELS } from "@/lib/payments/status";
import { PaymentLookup } from "./payment-lookup";

export const metadata: Metadata = { title: "Payments — Kodily Support" };

const STATUS_BADGE: Record<string, string> = {
  successful: "badge badge-success",
  pending: "badge badge-pending",
  failed: "badge badge-failed",
  reversed: "badge badge-info",
  unknown: "badge badge-unknown",
};

export default function PaymentsPage() {
  const transactions = demoTransactions.filter(
    (tx) => tx.tenantId === DEMO_TENANT_ID,
  );

  return (
    <>
      <header className="page-header">
        <h1>Payment verification</h1>
        <p>
          Look up a transaction by reference. Results come from the mock
          provider adapter — unknown and conflicting states are always shown
          as unresolved, never guessed.
        </p>
      </header>

      <div className="alert">
        This MVP never initiates refunds, reversals, transfers, or any other
        money-moving action. Verification is read-only.
      </div>

      <section className="panel">
        <h2>Verify a transaction</h2>
        <PaymentLookup />
      </section>

      <section className="panel">
        <h2>Recent transactions (demo)</h2>
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Provider</th>
              <th>Raw status</th>
              <th>Normalized</th>
              <th>Amount</th>
              <th>Occurred</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.reference}</td>
                <td className="muted">{tx.provider}</td>
                <td className="muted">{tx.providerStatus}</td>
                <td>
                  <span className={STATUS_BADGE[tx.normalizedStatus]}>
                    {STATUS_LABELS[tx.normalizedStatus]}
                  </span>
                </td>
                <td>{formatMinorUnits(tx.amountMinor, tx.currency)}</td>
                <td className="muted">{formatDateTime(tx.occurredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
