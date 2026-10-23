import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kodily Support — Payment-aware support dashboard",
  description:
    "Demo dashboard for a payment-aware customer support platform. All data is fictional fixture data.",
};

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/tickets", label: "Tickets" },
  { href: "/payments", label: "Payments" },
  { href: "/incidents", label: "Incidents" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">
              <span className="brand-mark">K</span>
              <div>
                <p className="brand-name">Kodily Support</p>
                <p className="brand-sub">Payment-aware helpdesk</p>
              </div>
            </div>
            <nav className="nav">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="sidebar-note">
              Demo build — fictional fixture data only. Not connected to any
              live payment provider or database.
            </p>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
