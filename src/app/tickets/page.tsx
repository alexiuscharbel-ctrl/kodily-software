import type { Metadata } from "next";
import { formatDateTime } from "@/lib/format";
import {
  DEMO_TENANT_ID,
  demoCustomers,
  demoTickets,
} from "@/lib/fixtures";

export const metadata: Metadata = { title: "Tickets — Kodily Support" };

const STATUS_BADGE: Record<string, string> = {
  open: "badge badge-pending",
  pending: "badge badge-info",
  resolved: "badge badge-success",
  closed: "badge badge-unknown",
};

const PRIORITY_BADGE: Record<string, string> = {
  urgent: "badge badge-failed",
  high: "badge badge-pending",
  medium: "badge badge-info",
  low: "badge badge-unknown",
};

export default function TicketsPage() {
  const tickets = demoTickets
    .filter((t) => t.tenantId === DEMO_TENANT_ID)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <>
      <header className="page-header">
        <h1>Tickets</h1>
        <p>
          Support conversations linked to payment transactions. Fictional demo
          data.
        </p>
      </header>

      <section className="panel">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Customer</th>
              <th>Channel</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Reference</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  {ticket.subject}
                  <div className="muted">{ticket.id}</div>
                </td>
                <td>
                  {demoCustomers.find((c) => c.id === ticket.customerId)
                    ?.fullName ?? "Unknown"}
                </td>
                <td className="muted">{ticket.channel}</td>
                <td>
                  <span className={PRIORITY_BADGE[ticket.priority]}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span className={STATUS_BADGE[ticket.status]}>
                    {ticket.status}
                  </span>
                </td>
                <td className="muted">{ticket.transactionReference ?? "—"}</td>
                <td className="muted">{formatDateTime(ticket.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
