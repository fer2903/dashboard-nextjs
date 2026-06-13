"use client";

import Link from "next/link";
import { useAlerts, markAlertRead, deleteAlert, AppAlert } from "@/app/src/hooks/useAlerts";

// ── Colores por tipo ─────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  info: {
    bg: "rgba(2,132,199,0.08)",
    text: "#0284c7",
    border: "rgba(2,132,199,0.2)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  warning: {
    bg: "rgba(217,119,6,0.08)",
    text: "#d97706",
    border: "rgba(217,119,6,0.2)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  error: {
    bg: "rgba(225,29,72,0.08)",
    text: "#e11d48",
    border: "rgba(225,29,72,0.2)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  success: {
    bg: "rgba(5,150,105,0.08)",
    text: "#059669",
    border: "rgba(5,150,105,0.2)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
};

const TypeBadge = ({ type }: { type: string }) => {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG["info"];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      {cfg.icon}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const isUnread = status === "unread";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isUnread ? "rgba(79,70,229,0.1)" : "rgba(107,114,128,0.1)",
        color: isUnread ? "#4f46e5" : "#6b7280",
        border: `1px solid ${isUnread ? "rgba(79,70,229,0.2)" : "rgba(107,114,128,0.2)"}`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isUnread ? "#4f46e5" : "#9ca3af" }} />
      {isUnread ? "No leída" : "Leída"}
    </span>
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

const TableSkeleton = () => (
  <div className="animate-pulse divide-y" style={{ borderColor: "rgba(145,158,171,0.12)" }}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4">
        <div className="h-6 bg-gray-100 rounded-full w-20" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-100 rounded w-64" />
        </div>
        <div className="h-6 bg-gray-100 rounded-full w-16" />
        <div className="h-4 bg-gray-100 rounded w-20" />
      </div>
    ))}
  </div>
);

export default function AlertsListPage() {
  const { alerts, loading, error, mutate } = useAlerts();

  const handleMarkRead = async (alertItem: AppAlert) => {
    try {
      await markAlertRead(alertItem._id);
      mutate();
    } catch (e) {
      window.alert(`Error: ${(e as Error).message}`);
    }
  };

  const handleDelete = async (alertItem: AppAlert) => {
    if (!confirm(`¿Eliminar alerta "${alertItem.title}"?`)) return;
    try {
      await deleteAlert(alertItem._id);
      mutate();
    } catch (e) {
      window.alert(`Error: ${(e as Error).message}`);
    }
  };

  // Garantiza que alerts sea siempre un array (SWR puede devolver un objeto de error)
  const alertsList: AppAlert[] = Array.isArray(alerts) ? alerts : [];
  const unreadCount = alertsList.filter((a) => a.status === "unread").length;

  return (
    <div className="p-6 space-y-5">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {!loading && alertsList.length >= 0 && (
          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
              style={{ backgroundColor: "rgba(225,29,72,0.08)", color: "#e11d48", border: "1px solid rgba(225,29,72,0.2)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount} sin leer
            </div>
            <div
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(107,114,128,0.08)", color: "#6b7280" }}
            >
              {alertsList.length} total
            </div>
          </div>
        )}
        {!loading && <div />}
        <Link
          href="/dashboard/alerts/new"
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#e11d48" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva Alerta
        </Link>
      </div>

      {/* ── Card ─────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
      >
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(145,158,171,0.16)" }}>
          <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Centro de Alertas
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Notificaciones y alertas del sistema
          </p>
        </div>

        {loading && <TableSkeleton />}

        {error && !loading && (
          <div className="px-6 py-12 text-center">
            <p className="font-semibold text-red-600">Error al cargar alertas</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Verifica la conexión con el host
            </p>
          </div>
        )}

        {!loading && !error && alertsList.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: "rgba(225,29,72,0.06)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Sin alertas</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              El sistema está en calma. Crea una alerta de prueba.
            </p>
          </div>
        )}

        {!loading && !error && alertsList.length > 0 && (
          <div>
            {alertsList.map((alert, idx) => {
              const isLast = idx === alertsList.length - 1;
              const cfg = TYPE_CONFIG[alert.type] ?? TYPE_CONFIG["info"];
              return (
                <div
                  key={alert._id}
                  className="flex items-start gap-4 px-6 py-4 transition-colors"
                  style={{
                    borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.12)",
                    borderLeft: `3px solid ${cfg.text}`,
                    backgroundColor: alert.status === "unread" ? `${cfg.bg}` : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(145,158,171,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      alert.status === "unread" ? cfg.bg : "transparent";
                  }}
                >
                  {/* Icono tipo */}
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: cfg.bg, color: cfg.text }}
                  >
                    {cfg.icon}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                        {alert.title}
                      </p>
                      {alert.status === "unread" && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {alert.message}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-disabled)" }}>
                      Fuente: {alert.source} · {formatDate(alert.createdAt)} {formatTime(alert.createdAt)}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <TypeBadge type={alert.type} />
                    <StatusBadge status={alert.status} />
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {alert.status === "unread" && (
                      <button
                        onClick={() => handleMarkRead(alert)}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                        style={{ color: "#4f46e5", backgroundColor: "rgba(79,70,229,0.08)" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Leer
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(alert)}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                      style={{ color: "#e11d48", backgroundColor: "rgba(225,29,72,0.08)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}

            <div
              className="px-6 py-3"
              style={{ borderTop: "1px solid rgba(145,158,171,0.16)", backgroundColor: "#FAFAFA" }}
            >
              <p className="text-xs" style={{ color: "var(--text-disabled)" }}>
                {unreadCount} sin leer · {alertsList.length} total
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
