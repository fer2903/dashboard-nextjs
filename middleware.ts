import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/src/lib/jwt";

/**
 * Middleware de Next.js — Protección de Rutas con JWT
 *
 * El middleware se ejecuta ANTES de que Next.js procese cualquier request
 * que coincida con el `config.matcher` definido al final de este archivo.
 *
 * Importante: El middleware corre en el Edge Runtime (no Node.js completo),
 * por eso usamos `jose` (compatible con Edge) en lugar de `jsonwebtoken`.
 *
 * Flujo de autenticación:
 *  1. Request llega a /dashboard o cualquier subruta
 *  2. Middleware extrae el token de la cookie "token"
 *  3. Si no hay token → redirige a /login
 *  4. Si hay token → intenta verificarlo con nuestro JWT_SECRET
 *  5. Si el token es válido → deja pasar la request (NextResponse.next())
 *  6. Si el token es inválido/expirado → redirige a /login
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Obtener el token JWT de la cookie httpOnly
  const token = req.cookies.get("token")?.value;

  // Si no hay token, redirigir al login inmediatamente
  if (!token) {
    console.log(`[Middleware] Sin token → redirigiendo a /login desde ${pathname}`);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Intentar verificar el token
    // Si es válido, payload contiene { userId, email, role }
    await verifyToken(token);

    // Token válido → dejar pasar la request
    return NextResponse.next();
  } catch (error) {
    // Token inválido, expirado o modificado → redirigir al login
    console.log(`[Middleware] Token inválido → redirigiendo a /login desde ${pathname}`);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

/**
 * Configuración del Matcher
 *
 * Define qué rutas activan el middleware.
 * El patrón "/dashboard/:path*" aplica a:
 *  - /dashboard
 *  - /dashboard/users
 *  - /dashboard/cualquier-subruta
 *
 * Las rutas de autenticación (/login, /register) y API no están
 * incluidas aquí, por lo que son públicamente accesibles.
 */
export const config = {
  matcher: ["/dashboard/:path*"],
};
