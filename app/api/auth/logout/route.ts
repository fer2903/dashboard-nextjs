import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Cierra la sesión del usuario eliminando la cookie del token JWT.
 *
 * Para "eliminar" una cookie, se le establece una fecha de expiración
 * en el pasado o un valor vacío, lo que hace que el browser la descarte.
 */
export async function POST() {
  const response = NextResponse.json(
    { message: "Sesión cerrada exitosamente" },
    { status: 200 }
  );

  // Sobrescribir la cookie con valor vacío y expiración inmediata
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // fecha en el pasado → browser elimina la cookie
    path: "/",
  });

  return response;
}
