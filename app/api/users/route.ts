import { NextResponse } from "next/server";
import { connectDB } from "@/app/src/lib/mongodb";
import { User } from "@/app/src/models/User";
import { getCurrentUser } from "@/app/src/lib/auth";

/**
 * GET /api/users
 *
 * Retorna todos los usuarios registrados desde MongoDB.
 *
 * Cambio respecto a la versión anterior:
 *  ANTES: consumía la API externa JSONPlaceholder (datos falsos)
 *  AHORA: consulta la colección "users" real en nuestra base de datos
 *
 * Seguridad: .select("-password") excluye el campo password de la respuesta.
 * Nunca se deben exponer hashes de contraseñas en APIs.
 *
 * El método .sort({ createdAt: -1 }) ordena del más reciente al más antiguo.
 */
export async function GET() {
  // Cerrar el endpoint: requiere sesión válida (antes era público).
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    await connectDB();

    // Buscar todos los usuarios, excluir el campo password (-password)
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 }); // más recientes primero

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS GET ERROR]", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}
