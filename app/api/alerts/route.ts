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

export async function GET() {
  try {
    await connectMongo();
    const alerts = await Alert.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(alerts, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("GET /api/alerts error:", error);
    return NextResponse.json(
      { error: "Error al obtener alertas" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();
    const alert = await Alert.create(body);
    return NextResponse.json(alert, { status: 201, headers: CORS_HEADERS });
  } catch (error: unknown) {
    console.error("POST /api/alerts error:", error);
    const message =
      error instanceof Error ? error.message : "Error al crear alerta";
    return NextResponse.json({ error: message }, { status: 400, headers: CORS_HEADERS });
  }
}
