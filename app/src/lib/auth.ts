/**
 * Utilidades de sesión del lado servidor
 *
 * `getCurrentUser()` resuelve el usuario autenticado a partir de la cookie
 * httpOnly "token". Funciona tanto en Server Components como en Route
 * Handlers porque lee la cookie con `cookies()` de next/headers (no necesita
 * el objeto `req`).
 *
 * Devuelve SIEMPRE el usuario fresco desde la base de datos (no el payload del
 * JWT), de modo que cambios de permisos/suscripciones hechos por un admin
 * tengan efecto sin requerir que el usuario vuelva a iniciar sesión.
 *
 * NOTA: no usar en middleware (Edge Runtime). El middleware debe leer la
 * cookie desde `req.cookies` y verificar el token con verifyToken directamente.
 */

import { cookies } from "next/headers";
import { verifyToken } from "@/app/src/lib/jwt";
import { connectDB } from "@/app/src/lib/mongodb";
import { User } from "@/app/src/models/User";
import type { ModuleKey } from "@/app/src/lib/modules";

export type CurrentUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  subscriptions: ModuleKey[];
};

/**
 * Devuelve el usuario autenticado o `null` si no hay sesión válida.
 * No lanza: cualquier fallo (sin token, token inválido/expirado, usuario
 * inexistente) se resuelve como `null` para que el llamador decida la respuesta.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const payload = await verifyToken(token);

    await connectDB();
    const user = await User.findById(payload.userId)
      .select("-password")
      .lean<CurrentUser>();

    if (!user) return null;

    return {
      ...user,
      _id: String(user._id),
      subscriptions: Array.isArray(user.subscriptions) ? user.subscriptions : [],
    };
  } catch {
    return null;
  }
}
