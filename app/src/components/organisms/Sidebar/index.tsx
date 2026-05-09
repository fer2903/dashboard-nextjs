"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ── Iconos SVG inline (sin dependencias externas) ──────────────────────────

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconTransactions = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
  </svg>
);

const IconPayments = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconCrypto = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.5 9.5c.4-.9 1.4-1.5 2.5-1.5 1.7 0 3 1.3 3 3 0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12" y2="17.5" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Mapa de iconos por ruta
const ICON_MAP: Record<string, React.ReactNode> = {
  "/dashboard": <IconDashboard />,
  "/dashboard/users": <IconUsers />,
  "/dashboard/transactions": <IconTransactions />,
  "/dashboard/payments": <IconPayments />,
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/users", label: "Usuarios" },
  { href: "/dashboard/transactions", label: "Transacciones" },
  { href: "/dashboard/payments", label: "Pagos" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col shrink-0 border-r border-slate-800/60">

      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <IconCrypto />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">
              Crypto Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 leading-none">Panel de Control</p>
          </div>
        </div>
      </div>

      {/* ── Navegación ───────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">
          Módulos
        </p>

        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 relative
                ${isActive
                  ? "bg-indigo-600/90 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }
              `}
            >
              {/* Indicador activo lateral */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-300 rounded-r-full" />
              )}

              {/* Icono */}
              <span className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                {ICON_MAP[link.href]}
              </span>

              <span>{link.label}</span>

              {/* Dot activo */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-200 opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer: Logout ───────────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-slate-800/60">
        <button
          onClick={handleLogout}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <span className="shrink-0 transition-colors text-slate-600 group-hover:text-red-400">
            <IconLogout />
          </span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
