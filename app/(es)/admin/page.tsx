import type { Metadata } from "next";
import AdminPanel from "../../../components/AdminPanel";
import { site } from "../../../lib/site";

export const metadata: Metadata = {
  title: "Gestión de reservas",
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return (
    <main className="site">
      <header className="topbar">
        <a href="/" className="brand">
          {site.name}
        </a>
        <nav className="menu">
          <a href="/">Ver la web</a>
        </nav>
      </header>
      <AdminPanel />
    </main>
  );
}
