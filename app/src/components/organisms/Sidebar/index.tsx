"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ── Iconos SVG inline ───────────────────────────────────────────────

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconTransactions = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
  </svg>
);

const IconPayments = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2.5" ry="2.5" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconProducts = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

const IconAlerts = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ── Definición de rutas ─────────────────────────────────────────────

// mfe: true → usa <a> nativo para forzar navegación HTTP completa
// y que el rewrite de next.config.ts se active correctamente.
// Con <Link> (client-side) los rewrites se saltan.
type NavItem = { href: string; label: string; icon: React.ReactNode; mfe?: boolean };

const NAV_GENERAL: NavItem[] = [
  { href: "/dashboard",       label: "Dashboard",      icon: <IconDashboard /> },
];

const NAV_MANAGEMENT: NavItem[] = [
  { href: "/dashboard/users",        label: "Usuarios",       icon: <IconUsers /> },
  { href: "/dashboard/transactions", label: "Transacciones",  icon: <IconTransactions />, mfe: true },
  { href: "/dashboard/payments",     label: "Pagos",          icon: <IconPayments /> },
  { href: "/dashboard/products",     label: "Productos",      icon: <IconProducts />,     mfe: true },
  { href: "/dashboard/alerts",       label: "Alertas",        icon: <IconAlerts />,        mfe: true },
];

// ── NavGroup ────────────────────────────────────────────────────────
const NavGroup = ({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
}) => (
  <div className="mb-2">
    <p
      className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.1em]"
      style={{ color: "rgba(145, 158, 171, 0.48)" }}
    >
      {label}
    </p>

    <div className="space-y-0.5">
      {items.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        // Rutas MFE → <a> nativo para forzar full page load y activar rewrite
        // Rutas internas → <Link> para navegación client-side optimizada
        const sharedStyle = {
          color: isActive ? "#818CF8" : "#637381",
          backgroundColor: isActive ? "rgba(79, 70, 229, 0.16)" : "transparent",
        };
        const sharedClass = `
          group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] font-medium
          transition-all duration-150 relative
          ${isActive ? "text-[#818CF8]" : "hover:text-[#C4CDD5]"}
        `;
        const sharedHandlers = {
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            if (!isActive) {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
            }
          },
          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
            if (!isActive) {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }
          },
        };
        const inner = (
          <>
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] rounded-r-full"
                style={{ backgroundColor: "#818CF8" }}
              />
            )}
            <span className="shrink-0 transition-colors" style={{ color: isActive ? "#818CF8" : "#637381" }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </>
        );

        return item.mfe ? (
          <a
            key={item.href}
            href={item.href}
            className={sharedClass}
            style={sharedStyle}
            {...sharedHandlers}
          >
            {inner}
          </a>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={sharedClass}
            style={sharedStyle}
            {...sharedHandlers}
          >
            {inner}
          </Link>
        );
      })}
    </div>
  </div>
);

// ── Sidebar principal ───────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col shrink-0 border-r"
      style={{
        backgroundColor: "#1C2536",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 8px 16px 0 rgba(79,70,229,0.35)",
            }}
          >
            <IconLogo />
          </div>
          <div className="min-w-0">
            <h1
              className="text-sm font-bold tracking-tight leading-none truncate"
              style={{ color: "#ffffff" }}
            >
              Crypto Dashboard
            </h1>
            <p className="text-[11px] mt-0.5 leading-none" style={{ color: "#637381" }}>
              Panel de Control
            </p>
          </div>
        </div>
      </div>

      {/* ── Navegación ─────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-5 space-y-4 overflow-y-auto">
        <NavGroup label="General" items={NAV_GENERAL} pathname={pathname} />
        <NavGroup label="Gestión" items={NAV_MANAGEMENT} pathname={pathname} />
      </nav>

      {/* ── Divider ────────────────────────────────────────────── */}
      <div className="border-t mx-3" style={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* ── Footer: Logout ─────────────────────────────────────── */}
      <div className="px-3 py-4">
        <button
          onClick={handleLogout}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            transition-all duration-150"
          style={{ color: "#637381" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "#EF4444";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "#637381";
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
        >
          <span className="shrink-0 transition-colors">
            <IconLogout />
          </span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
