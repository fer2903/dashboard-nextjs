"use client";

import { usePathname } from "next/navigation";

// ── Mapa de ruta → título de página ────────────────────────────────
const PAGE_TITLES: Record<string, { title: string; breadcrumb: string[] }> = {
  "/dashboard":              { title: "Dashboard",     breadcrumb: ["Inicio", "Dashboard"] },
  "/dashboard/users":        { title: "Usuarios",      breadcrumb: ["Inicio", "Gestión", "Usuarios"] },
  "/dashboard/transactions": { title: "Transacciones", breadcrumb: ["Inicio", "Gestión", "Transacciones"] },
  "/dashboard/payments":     { title: "Pagos",         breadcrumb: ["Inicio", "Gestión", "Pagos"] },
  "/dashboard/payments/success": { title: "Pago Exitoso",  breadcrumb: ["Inicio", "Pagos", "Éxito"] },
  "/dashboard/payments/cancel":  { title: "Pago Cancelado", breadcrumb: ["Inicio", "Pagos", "Cancelado"] },
};

// ── Icono de menú hamburguesa ───────────────────────────────────────
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// ── Icono campana ───────────────────────────────────────────────────
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ── TopBar principal ────────────────────────────────────────────────
export default function TopBar() {
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] ?? { title: "Dashboard", breadcrumb: ["Inicio"] };

  return (
    <header
      className="h-16 flex items-center px-6 shrink-0"
      style={{
        backgroundColor: "rgba(244, 246, 248, 0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(145, 158, 171, 0.24)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* ── Breadcrumb / Título ─────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-0.5" aria-label="breadcrumb">
          {page.breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
              <span
                style={{
                  color: i === page.breadcrumb.length - 1
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  fontWeight: i === page.breadcrumb.length - 1 ? 600 : 400,
                }}
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        {/* Título */}
        <h1
          className="text-xl font-bold leading-none truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {page.title}
        </h1>
      </div>

      {/* ── Acciones de la derecha ──────────────────────────── */}
      <div className="flex items-center gap-2 ml-4">
        {/* Botón de notificaciones */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(145,158,171,0.12)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
          title="Notificaciones"
        >
          <IconBell />
          {/* Badge de notificación */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{
              backgroundColor: "#EF4444",
              borderColor: "rgba(244,246,248,0.92)",
            }}
          />
        </button>

        {/* Separador */}
        <div className="w-px h-8 mx-1" style={{ backgroundColor: "rgba(145,158,171,0.24)" }} />

        {/* Avatar del usuario */}
        <button
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all duration-150"
          style={{ color: "var(--text-primary)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(145,158,171,0.12)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
        >
          {/* Avatar con gradiente */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            U
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
              Usuario
            </p>
            <p className="text-[10px] mt-0.5 leading-none" style={{ color: "var(--text-secondary)" }}>
              Admin
            </p>
          </div>
          {/* Chevron */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden sm:block" style={{ color: "var(--text-secondary)" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
