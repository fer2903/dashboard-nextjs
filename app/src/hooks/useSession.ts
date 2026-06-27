"use client";

/**
 * Hook useSession — Sesión del usuario en el cliente
 *
 * Obtiene el usuario autenticado desde GET /api/auth/me (vía SWR) para que
 * componentes cliente (Sidebar, guards de UI) sepan rol y suscripciones.
 *
 * Efecto secundario útil: al llamar a /api/auth/me, el backend re-emite el
 * token con los datos frescos, manteniendo al día el gateo del middleware.
 */

import useSWR from "swr";
import type { ModuleKey } from "@/app/src/lib/modules";

export type SessionUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  subscriptions: ModuleKey[];
};

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

export const useSession = () => {
  const { data, error, isLoading } = useSWR<{ user: SessionUser }>(
    "/api/auth/me",
    fetcher
  );

  const user = data?.user ?? null;
  const role = user?.role ?? null;
  const subscriptions: ModuleKey[] = user?.subscriptions ?? [];

  /** ¿El usuario puede ver este módulo? Admin ve todo. */
  const canAccessModule = (key: ModuleKey) =>
    role === "admin" || subscriptions.includes(key);

  return {
    user,
    role,
    subscriptions,
    isAdmin: role === "admin",
    canAccessModule,
    loading: isLoading,
    error,
  };
};
