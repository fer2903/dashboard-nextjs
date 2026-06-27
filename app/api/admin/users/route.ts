import { NextResponse } from "next/server";
import { connectDB } from "@/app/src/lib/mongodb";
import { User } from "@/app/src/models/User";
import { requireAdminApi } from "@/app/src/lib/entitlements";

/**
 * GET /api/admin/users
 *
 * Lista todos los usuarios con su rol y suscripciones, para la pantalla de
 * administración de accesos. Solo accesible por usuarios con rol "admin".
 */
export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const users = await User.find({})
      .select("name email role subscriptions createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    console.error("[ADMIN USERS GET ERROR]", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}
