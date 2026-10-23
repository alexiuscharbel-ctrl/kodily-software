import type { Metadata } from "next";
import { formatDateTime } from "@/lib/format";
import { DEMO_TENANT_ID, demoIncidents, demoTickets } from "@/lib/fixtures";

export const metadata: Metadata = { title: "Incidents — Kodily Support" };

const STATUS_BADGE: Record<string, string> = {
  investigating: "badge badge-pending",
  monitoring: "badge badge-info",
  resolved: "badge badge-success",
};

export default function IncidentsPage() {
  const incidents = demoIncidents.filter(
    (inc) => inc.tenantId === DEMO_TENANT_ID,
  );

  return (
    <>
      <header className="page-header">
        <h1>Incidents</h1>
        <p>
          Groups of related payment-support cases, so agents can escalate and
          communicate once instead of per ticket. Fictional demo data.
        </p>
      </header>

      {incidents.map((incident) => (
        <section key={incident.id} className="incident-card">
          <h3>
            {incident.title}{" "}
            <span className={STATUS_BADGE[incident.status]}>
              {incident.status}
            </span>
          </h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Opened {formatDateTime(incident.openedAt)} ·{" "}
            {incident.ticketIds.length} linked tickets
          </p>
          <p>{incident.summary}</p>
          <p className="muted" style={{ marginBottom: 0 }}>
            Linked tickets:{" "}
            {incident.ticketIds
              .map(
                (id) =>
                  `${id} — ${demoTickets.find((t) => t.id === id)?.subject ?? "unknown ticket"}`,
              )
              .join(" · ")}
          </p>
        </section>
      ))}
    </>
  );
}
