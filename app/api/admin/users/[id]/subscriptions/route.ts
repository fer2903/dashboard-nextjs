import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/src/lib/mongodb";
import { User } from "@/app/src/models/User";
import { requireAdminApi } from "@/app/src/lib/entitlements";
import { isModuleKey, SUBSCRIBABLE_KEYS } from "@/app/src/lib/modules";

/**
 * PATCH /api/admin/users/[id]/subscriptions
 *
 * Reemplaza las suscripciones (módulos) de un usuario. Solo admin.
 *
 * Body: { subscriptions: string[] }  // cada valor debe ser una key de módulo válida
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const incoming = body?.subscriptions;

    if (!Array.isArray(incoming)) {
      return NextResponse.json(
        { error: "subscriptions debe ser un arreglo de keys de módulo" },
        { status: 400 }
      );
    }

    // Validar y normalizar: solo keys conocidas y suscribibles, sin duplicados
    const invalid = incoming.filter((k: unknown) => typeof k !== "string" || !isModuleKey(k));
    if (invalid.length > 0) {
      return NextResponse.json(
        {
          error: "Hay módulos inválidos en la solicitud",
          invalid,
          allowed: SUBSCRIBABLE_KEYS,
        },
        { status: 400 }
      );
    }

    const normalized = Array.from(new Set(incoming as string[])).filter((k) =>
      (SUBSCRIBABLE_KEYS as string[]).includes(k)
    );

    await connectDB();
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { subscriptions: normalized } },
      { new: true, runValidators: true }
    )
      .select("name email role subscriptions")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user, message: "Suscripciones actualizadas" });
  } catch (error) {
    console.error("[ADMIN SUBSCRIPTIONS PATCH ERROR]", error);
    return NextResponse.json(
      { error: "Error al actualizar suscripciones" },
      { status: 500 }
    );
  }
}
