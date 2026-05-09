"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Iconos SVG ──────────────────────────────────────────────────────

const IconList = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconPlus = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
  </svg>
);

// ── Nav items del MFE ───────────────────────────────────────────────
// Con basePath='/dashboard/transactions', Link href="/" → /dashboard/transactions
// y href="/new" → /dashboard/transactions/new
const NAV_ITEMS = [
  { href: "/",    label: "Lista de Transacciones", icon: <IconList /> },
  { href: "/new", label: "Nueva Transacción",       icon: <IconPlus /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 min-h-screen flex flex-col shrink-0"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* ── Header del MFE ──────────────────────────────────── */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        {/* Logo + nombre */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 8px 16px 0 rgba(79,70,229,0.35)",
            }}
          >
            <IconLogo />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">
              Crypto Dashboard
            </h1>
            <p className="text-[11px] mt-0.5 leading-none" style={{ color: "#637381" }}>
              Panel de Control
            </p>
          </div>
        </div>

        {/* Badge "Microfrontend" */}
        <div
          className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: "rgba(79,70,229,0.20)",
            color: "#818CF8",
            border: "1px solid rgba(79,70,229,0.30)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          MFE · Transacciones · :3001
        </div>
      </div>

      {/* ── Navegación ──────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-5">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.1em] px-3 mb-2"
          style={{ color: "rgba(145,158,171,0.48)" }}
        >
          Módulo
        </p>

        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            // Calcular si está activo comparando el path completo
            // basePath = /dashboard/transactions
            // pathname "/" → activo en /dashboard/transactions
            // pathname "/new" → activo en /dashboard/transactions/new
            const fullPath = `/dashboard/transactions${item.href === "/" ? "" : item.href}`;
            const isActive = pathname === fullPath;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative"
                style={{
                  color: isActive ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                  backgroundColor: isActive ? "var(--sidebar-active-bg)" : "transparent",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#C4CDD5";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--sidebar-text)";
                  }
                }}
              >
                {/* Barra lateral activa */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                    style={{ backgroundColor: "#818CF8" }}
                  />
                )}
                <span style={{ color: isActive ? "#818CF8" : "#637381" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Footer: Volver al host ───────────────────────────── */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        {/* Volver al dashboard principal */}
        <a
          href="http://localhost:3000/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full"
          style={{ color: "#637381" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "#C4CDD5";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "#637381";
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
        >
          <IconArrowLeft />
          <span>Dashboard Principal</span>
        </a>
      </div>
    </aside>
  );
}
