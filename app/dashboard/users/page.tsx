"use client";

import { useUsers } from "@/app/src/hooks/useUsers";

// ── Badge de Rol estilo MUI Chip ────────────────────────────────────
const RoleBadge = ({ role }: { role: string }) => {
  const isAdmin = role === "admin";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isAdmin ? "rgba(124,58,237,0.12)" : "rgba(79,70,229,0.10)",
        color: isAdmin ? "#7c3aed" : "#4f46e5",
        border: `1px solid ${isAdmin ? "rgba(124,58,237,0.24)" : "rgba(79,70,229,0.20)"}`,
      }}
    >
      {isAdmin ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// ── Formateo de fecha ───────────────────────────────────────────────
const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatTime = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

// ── Avatar con color por nombre ─────────────────────────────────────
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #6366f1, #4f46e5)",
  "linear-gradient(135deg, #a78bfa, #7c3aed)",
  "linear-gradient(135deg, #38bdf8, #0284c7)",
  "linear-gradient(135deg, #34d399, #059669)",
  "linear-gradient(135deg, #fb7185, #e11d48)",
  "linear-gradient(135deg, #fbbf24, #d97706)",
];

const UserAvatar = ({ name }: { name: string }) => {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  const idx = (initial.charCodeAt(0) - 65) % AVATAR_GRADIENTS.length;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{
        background: AVATAR_GRADIENTS[Math.max(0, idx)],
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.12)",
      }}
    >
      {initial}
    </div>
  );
};

// ── Tabla skeleton ──────────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="animate-pulse divide-y" style={{ borderColor: "rgba(145,158,171,0.12)" }}>
    {[1,2,3,4,5].map(i => (
      <div key={i} className="flex items-center gap-4 px-6 py-4">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-4 bg-gray-100 rounded w-28" />
      </div>
    ))}
  </div>
);

// ── Página principal ────────────────────────────────────────────────
export default function UsersPage() {
  const { users, loading, error } = useUsers();

  return (
    <div className="p-6 space-y-5">

      {/* ── Stat rápida de usuarios ─────────────────────────── */}
      {users && !loading && (
        <div className="flex items-center justify-end gap-3">
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
            style={{
              backgroundColor: "rgba(79,70,229,0.10)",
              color: "var(--primary)",
              border: "1px solid rgba(79,70,229,0.20)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {users.length} {users.length === 1 ? "usuario" : "usuarios"} registrados
          </div>
        </div>
      )}

      {/* ── Card contenedora (MUI Paper) ─────────────────────── */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
      >
        {/* Card Header */}
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid rgba(145,158,171,0.16)" }}
        >
          <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Lista de Usuarios
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Usuarios registrados en el sistema
          </p>
        </div>

        {/* ── Estado de carga ─────────────────────────────────── */}
        {loading && <TableSkeleton />}

        {/* ── Estado de error ─────────────────────────────────── */}
        {error && !loading && (
          <div className="px-6 py-12 text-center">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="font-semibold mb-1" style={{ color: "#dc2626" }}>Error al cargar usuarios</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Verifica tu conexión a MongoDB en las variables de entorno
            </p>
          </div>
        )}

        {/* ── Sin usuarios ─────────────────────────────────────── */}
        {!loading && !error && users && users.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: "rgba(145,158,171,0.08)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              No hay usuarios registrados
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Los usuarios aparecerán aquí una vez que alguien se registre
            </p>
          </div>
        )}

        {/* ── Tabla MUI-style ──────────────────────────────────── */}
        {!loading && !error && users && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-secondary)" }}>
                    Usuario
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-secondary)" }}>
                    Email
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-secondary)" }}>
                    Rol
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-secondary)" }}>
                    Registrado
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const isLast = idx === users.length - 1;
                  return (
                    <tr
                      key={user._id}
                      className="transition-colors"
                      style={{ borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.12)" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(145,158,171,0.04)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {/* Avatar + Nombre */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name} />
                          <div>
                            <p className="font-semibold text-sm leading-none" style={{ color: "var(--text-primary)" }}>
                              {user.name}
                            </p>
                            <p className="text-[10px] mt-1 font-mono" style={{ color: "var(--text-disabled)" }}>
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {user.email}
                      </td>

                      {/* Rol */}
                      <td className="px-6 py-4 text-center">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                          {formatDate(user.createdAt)}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-disabled)" }}>
                          {formatTime(user.createdAt)}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer de la tabla */}
            <div
              className="px-6 py-3 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(145,158,171,0.16)", backgroundColor: "#FAFAFA" }}
            >
              <p className="text-xs" style={{ color: "var(--text-disabled)" }}>
                Mostrando {users.length} {users.length === 1 ? "usuario" : "usuarios"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
