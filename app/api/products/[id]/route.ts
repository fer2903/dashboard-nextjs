import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/app/src/lib/mongodb";
import { Product } from "@/app/src/models/Product";
import { requireApiAccess } from "@/app/src/lib/entitlements";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_PRODUCTS_MFE_URL ?? "http://localhost:3003",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireApiAccess("products", CORS_HEADERS);
  if (denied) return denied;

  try {
    await connectMongo();
    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404, headers: CORS_HEADERS });
    }
    return NextResponse.json(product, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireApiAccess("products", CORS_HEADERS);
  if (denied) return denied;

  try {
    await connectMongo();
    const { id } = await params;
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404, headers: CORS_HEADERS });
    }
    return NextResponse.json(product, { headers: CORS_HEADERS });
  } catch (error: unknown) {
    console.error("PUT /api/products/[id] error:", error);
    const message = error instanceof Error ? error.message : "Error al actualizar producto";
    return NextResponse.json({ error: message }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireApiAccess("products", CORS_HEADERS);
  if (denied) return denied;

  try {
    await connectMongo();
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404, headers: CORS_HEADERS });
    }
    return NextResponse.json({ message: "Producto eliminado correctamente" }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500, headers: CORS_HEADERS });
  }
}
