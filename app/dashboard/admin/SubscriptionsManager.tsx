"use client";

/**
 * SubscriptionsManager — Pantalla admin para conceder/revocar módulos
 *
 * Lista los usuarios (GET /api/admin/users) y muestra un toggle por cada
 * módulo suscribible. Al cambiar un toggle, hace PATCH
 * /api/admin/users/[id]/subscriptions con el nuevo arreglo y revalida.
 */

import { useState } from "react";
import useSWR from "swr";
import { MODULES, SUBSCRIBABLE_KEYS, type ModuleKey } from "@/app/src/lib/modules";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  subscriptions: ModuleKey[];
};

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

const MODULE_COLS = MODULES.filter((m) => m.requiresSubscription);

export default function SubscriptionsManager() {
  const { data: users, error, isLoading, mutate } = useSWR<AdminUser[]>(
    "/api/admin/users",
    fetcher
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  const toggle = async (user: AdminUser, key: ModuleKey) => {
    const current = new Set(user.subscriptions ?? []);
    if (current.has(key)) current.delete(key);
    else current.add(key);

    const next = Array.from(current).filter((k) =>
      (SUBSCRIBABLE_KEYS as string[]).includes(k)
    );

    setSavingId(user._id);
    // Actualización optimista
    mutate(
      (prev) =>
        prev?.map((u) => (u._id === user._id ? { ...u, subscriptions: next } : u)),
      { revalidate: false }
    );

    try {
      const res = await fetch(`/api/admin/users/${user._id}/subscriptions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptions: next }),
      });
      if (!res.ok) throw new Error("patch failed");
      await mutate();
    } catch {
      await mutate(); // revertir desde el servidor
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
          Administración de suscripciones
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          Concede o revoca el acceso de cada usuario a los módulos. Los admins ven todos los módulos.
        </p>
      </div>

      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
      >
        {isLoading && (
          <div className="px-6 py-12 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Cargando usuarios…
          </div>
        )}

        {error && !isLoading && (
          <div className="px-6 py-12 text-center text-sm" style={{ color: "#dc2626" }}>
            Error al cargar usuarios. Verifica tu sesión de administrador.
          </div>
        )}

        {!isLoading && !error && users && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr style={{ backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-secondary)" }}>
                    Usuario
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-secondary)" }}>
                    Rol
                  </th>
                  {MODULE_COLS.map((m) => (
                    <th key={m.key} className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                      style={{ color: "var(--text-secondary)" }}>
                      {m.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const isLast = idx === users.length - 1;
                  const isAdmin = user.role === "admin";
                  return (
                    <tr key={user._id}
                      style={{ borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.12)" }}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm leading-none" style={{ color: "var(--text-primary)" }}>
                          {user.name}
                        </p>
                        <p className="text-[11px] mt-1" style={{ color: "var(--text-disabled)" }}>
                          {user.email}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: isAdmin ? "rgba(124,58,237,0.12)" : "rgba(79,70,229,0.10)",
                            color: isAdmin ? "#7c3aed" : "#4f46e5",
                          }}>
                          {user.role}
                        </span>
                      </td>
                      {MODULE_COLS.map((m) => {
                        const checked = isAdmin || (user.subscriptions ?? []).includes(m.key);
                        return (
                          <td key={m.key} className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isAdmin || savingId === user._id}
                              onChange={() => toggle(user, m.key)}
                              title={isAdmin ? "Los admins acceden a todo" : `Alternar acceso a ${m.label}`}
                              style={{ width: 18, height: 18, accentColor: "#4f46e5", cursor: isAdmin ? "not-allowed" : "pointer" }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: "var(--text-disabled)" }}>
        Los cambios se aplican de inmediato. El usuario verá el módulo habilitado en su próxima navegación.
      </p>
    </div>
  );
}
