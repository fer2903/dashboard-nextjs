"use client";

/**
 * Módulo Usuarios — /dashboard/users
 *
 * Lista todos los usuarios registrados en el sistema.
 * Los datos vienen de MongoDB a través de GET /api/users.
 *
 * Características:
 *  - Tabla con información de usuarios
 *  - Badge de rol (admin / user) con colores diferenciados
 *  - Formato de fecha legible
 *  - Estado de carga y error manejados
 *
 * Este módulo usa datos reales de nuestra base de datos,
 * a diferencia del hook anterior que usaba JSONPlaceholder.
 */

import { useUsers } from "@/app/src/hooks/useUsers";

// Componente Badge para el rol del usuario
const RoleBadge = ({ role }: { role: string }) => {
  const styles = {
    admin: "bg-purple-100 text-purple-700 border border-purple-200",
    user: "bg-blue-100 text-blue-700 border border-blue-200",
  };

  const icons = {
    admin: "👑",
    user: "👤",
  };

  const style = styles[role as keyof typeof styles] || styles.user;
  const icon = icons[role as keyof typeof icons] || icons.user;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${style}`}>
      <span>{icon}</span>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// Formatea una fecha ISO a formato legible
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function UsersPage() {
  const { users, loading, error } = useUsers();

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Usuarios registrados en el sistema
          </p>
        </div>

        {/* Contador de usuarios */}
        {users && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
            {users.length} {users.length === 1 ? "usuario" : "usuarios"}
          </div>
        )}
      </div>

      {/* ── Estado de carga ── */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-16" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Estado de error ── */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-semibold">Error al cargar usuarios</p>
          <p className="text-sm mt-1">
            Verifica tu conexión a MongoDB en las variables de entorno
          </p>
        </div>
      )}

      {/* ── Sin usuarios ── */}
      {!loading && !error && users && users.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-semibold text-gray-700">No hay usuarios registrados</p>
          <p className="text-sm text-gray-400 mt-1">
            Los usuarios aparecerán aquí una vez que alguien se registre
          </p>
        </div>
      )}

      {/* ── Tabla de usuarios ── */}
      {!loading && !error && users && users.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Usuario
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Rol
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Registrado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {/* Avatar + Nombre */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar con inicial del nombre */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400 font-mono">
                          {user._id.slice(-8)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  {/* Rol */}
                  <td className="px-6 py-4 text-center">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Fecha de registro */}
                  <td className="px-6 py-4 text-right text-gray-400 text-xs">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
