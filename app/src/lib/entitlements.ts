/**
 * Capa de autorización por módulo (entitlements)
 *
 * Decide si un usuario puede acceder a un módulo (MFE). Es la ÚNICA pieza
 * donde vive esa regla; todas las capas (páginas, APIs, sidebar) la reutilizan.
 *
 * Regla actual:
 *  - admin → acceso total (ve todos los módulos)
 *  - user  → acceso solo a los módulos presentes en user.subscriptions
 *
 * La fuente de las suscripciones está desacoplada: hoy es un campo en User,
 * mañana podría ser una colección Subscription o el estado de Stripe sin tocar
 * a quienes consumen estas funciones.
 */

import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "@/app/src/lib/auth";
import type { ModuleKey } from "@/app/src/lib/modules";

/**
 * Comprobación pura (sin efectos). Útil en cualquier contexto.
 */
export function hasModuleAccess(
  user: CurrentUser | null,
  moduleKey: ModuleKey
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return Array.isArray(user.subscriptions) && user.subscriptions.includes(moduleKey);
}

/**
 * Guard para Server Components (páginas).
 * Si el usuario no tiene acceso, redirige y corta el render.
 * Devuelve el usuario autenticado cuando sí tiene acceso.
 */
export async function requireModuleAccess(
  moduleKey: ModuleKey
): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    // Sin sesión → al login (coincide con el comportamiento del middleware)
    redirect("/login");
  }

  if (!hasModuleAccess(user, moduleKey)) {
    // Sesión válida pero sin suscripción → pantalla de "sin acceso"
    redirect(`/dashboard/no-access?module=${moduleKey}`);
  }

  return user;
}

/**
 * Guard para Server Components (páginas) que requieren rol admin.
 * Redirige a no-admins. Devuelve el usuario admin cuando procede.
 */
export async function requireAdminPage(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

/**
 * Guard para Route Handlers (APIs).
 * Devuelve `null` si el acceso es válido, o una respuesta 401/403 (con los
 * headers CORS provistos) que el handler debe retornar tal cual.
 *
 * Uso:
 *   const denied = await requireApiAccess("alerts", CORS_HEADERS);
 *   if (denied) return denied;
 */
export async function requireApiAccess(
  moduleKey: ModuleKey,
  headers?: HeadersInit
): Promise<NextResponse | null> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401, headers }
    );
  }

  if (!hasModuleAccess(user, moduleKey)) {
    return NextResponse.json(
      { error: "No tienes acceso a este módulo" },
      { status: 403, headers }
    );
  }

  return null;
}

/**
 * Guard para Route Handlers que requieren rol admin.
 * Devuelve `{ ok: true, user }` o `{ ok: false, response }` (401/403) que el
 * handler debe retornar tal cual.
 */
export async function requireAdminApi(
  headers?: HeadersInit
): Promise<
  | { ok: true; user: CurrentUser }
  | { ok: false; response: NextResponse }
> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "No autenticado" }, { status: 401, headers }),
    };
  }

  if (user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Requiere rol de administrador" },
        { status: 403, headers }
      ),
    };
  }

  return { ok: true, user };
}
