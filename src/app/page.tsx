import Link from "next/link";
import { formatDateTime, formatMinorUnits } from "@/lib/format";
import {
  DEMO_TENANT_ID,
  demoCustomers,
  demoIncidents,
  demoTickets,
  demoTransactions,
} from "@/lib/fixtures";
import { suggestDuplicateTickets } from "@/lib/duplicates";

const STATUS_BADGE: Record<string, string> = {
  successful: "badge badge-success",
  pending: "badge badge-pending",
  failed: "badge badge-failed",
  reversed: "badge badge-info",
  unknown: "badge badge-unknown",
};

export default function OverviewPage() {
  const tickets = demoTickets.filter((t) => t.tenantId === DEMO_TENANT_ID);
  const openTickets = tickets.filter(
    (t) => t.status === "open" || t.status === "pending",
  );
  const transactions = demoTransactions.filter(
    (tx) => tx.tenantId === DEMO_TENANT_ID,
  );
  const unresolvedPayments = transactions.filter(
    (tx) => tx.normalizedStatus === "pending" || tx.normalizedStatus === "unknown",
  );
  const duplicateSuggestions = suggestDuplicateTickets(tickets, {
    windowHours: 48,
  });
  const activeIncidents = demoIncidents.filter(
    (inc) => inc.status !== "resolved",
  );

  const customerName = (id: string) =>
    demoCustomers.find((c) => c.id === id)?.fullName ?? "Unknown customer";

  return (
    <>
      <header className="page-header">
        <h1>Support overview</h1>
        <p>
          Payment-aware support queue for demo tenant{" "}
          <strong>Kioska Market</strong>. All data on this page is fictional.
        </p>
      </header>

      <section className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Open tickets</p>
          <p className="stat-value">{openTickets.length}</p>
          <p className="stat-hint">Across all channels</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Unresolved payments</p>
          <p className="stat-value">{unresolvedPayments.length}</p>
          <p className="stat-hint">Pending or unknown status</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Duplicate suggestions</p>
          <p className="stat-value">{duplicateSuggestions.length}</p>
          <p className="stat-hint">Awaiting human confirmation</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active incidents</p>
          <p className="stat-value">{activeIncidents.length}</p>
          <p className="stat-hint">Grouped payment issues</p>
        </div>
      </section>

      <section className="panel">
        <h2>Recent payment-linked tickets</h2>
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Customer</th>
              <th>Reference</th>
              <th>Payment status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.slice(0, 5).map((ticket) => {
              const tx = transactions.find(
                (t) => t.reference === ticket.transactionReference,
              );
              return (
                <tr key={ticket.id}>
                  <td>
                    <Link href="/tickets">{ticket.subject}</Link>
                    <div className="muted">
                      {ticket.id} · {ticket.channel}
                    </div>
                  </td>
                  <td>{customerName(ticket.customerId)}</td>
                  <td>
                    {ticket.transactionReference ?? "—"}
                    {tx && (
                      <div className="muted">
                        {formatMinorUnits(tx.amountMinor, tx.currency)}
                      </div>
                    )}
                  </td>
                  <td>
                    {tx ? (
                      <span className={STATUS_BADGE[tx.normalizedStatus]}>
                        {tx.normalizedStatus}
                      </span>
                    ) : (
                      <span className="badge badge-unknown">not linked</span>
                    )}
                  </td>
                  <td className="muted">{formatDateTime(ticket.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {duplicateSuggestions.length > 0 && (
        <section className="panel">
          <h2>Possible duplicate cases</h2>
          <p className="muted">
            Suggestions are based on tenant, customer, and exact transaction
            reference only. A human must confirm before any cases are linked.
          </p>
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Possible duplicate of</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {duplicateSuggestions.map((s) => (
                <tr key={`${s.ticketId}-${s.duplicateOfTicketId}`}>
                  <td>{s.ticketId}</td>
                  <td>{s.duplicateOfTicketId}</td>
                  <td>{s.transactionReference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}
