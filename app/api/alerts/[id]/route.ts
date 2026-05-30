import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/app/src/lib/mongodb";
import { Alert } from "@/app/src/models/Alert";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_ALERTS_MFE_URL ?? "http://localhost:3004",
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
  try {
    await connectMongo();
    const { id } = await params;
    const alert = await Alert.findById(id).lean();
    if (!alert) {
      return NextResponse.json({ error: "Alerta no encontrada" }, { status: 404, headers: CORS_HEADERS });
    }
    return NextResponse.json(alert, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("GET /api/alerts/[id] error:", error);
    return NextResponse.json({ error: "Error al obtener alerta" }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await req.json();
    const alert = await Alert.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!alert) {
      return NextResponse.json({ error: "Alerta no encontrada" }, { status: 404, headers: CORS_HEADERS });
    }
    return NextResponse.json(alert, { headers: CORS_HEADERS });
  } catch (error: unknown) {
    console.error("PUT /api/alerts/[id] error:", error);
    const message = error instanceof Error ? error.message : "Error al actualizar alerta";
    return NextResponse.json({ error: message }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const alert = await Alert.findByIdAndDelete(id).lean();
    if (!alert) {
      return NextResponse.json({ error: "Alerta no encontrada" }, { status: 404, headers: CORS_HEADERS });
    }
    return NextResponse.json({ message: "Alerta eliminada correctamente" }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("DELETE /api/alerts/[id] error:", error);
    return NextResponse.json({ error: "Error al eliminar alerta" }, { status: 500, headers: CORS_HEADERS });
  }
}
