import { NextRequest, NextResponse } from "next/server";
import { verifyToken, signToken } from "@/app/src/lib/jwt";
import { connectDB } from "@/app/src/lib/mongodb";
import { User } from "@/app/src/models/User";

/**
 * GET /api/auth/me
 *
 * Retorna la información del usuario autenticado actualmente.
 * Útil para que el frontend sepa quién está logueado sin exponer el token.
 *
 * Requiere: cookie "token" con un JWT válido
 *
 * Flujo:
 *  1. Leer el token de la cookie
 *  2. Verificar y decodificar el JWT
 *  3. Buscar el usuario en MongoDB con el ID del payload
 *  4. Devolver los datos del usuario (sin contraseña)
 */
export async function GET(req: NextRequest) {
  try {
    // Leer el token de la cookie de la request
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Verificar el JWT — lanza error si es inválido o expirado
    const payload = await verifyToken(token);

    // Buscar usuario fresco desde la DB (el token podría tener datos viejos)
    await connectDB();
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Re-emitir el token con los datos frescos (rol + suscripciones) para que
    // el gateo del middleware (que lee los claims del JWT) quede al día sin
    // necesidad de que el usuario vuelva a iniciar sesión (self-healing).
    const subscriptions = Array.isArray(user.subscriptions) ? user.subscriptions : [];
    const response = NextResponse.json({ user });

    try {
      const freshToken = await signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        subscriptions,
      });
      response.cookies.set("token", freshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: "/",
      });
    } catch {
      // Si el refresco falla, devolvemos igual los datos del usuario.
    }

    return response;
  } catch {
    // El token era inválido o expirado
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 401 }
    );
  }
}
