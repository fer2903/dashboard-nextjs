import { NextResponse } from "next/server";
import { connectDB } from "@/app/src/lib/mongodb";
import { Transaction } from "@/app/src/models/Transaction";

/**
 * Headers CORS — permiten que el MFE (localhost:3001) llame a esta API.
 * En producción cambia el origin a la URL real del MFE.
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Preflight OPTIONS (necesario para CORS con métodos no-GET)
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  await connectDB();
  const data = await Transaction.find().sort({ createdAt: -1 });
  return NextResponse.json(data, { headers: CORS_HEADERS });
}

export async function POST(requestBody: Request) {
  await connectDB();
  const body = await requestBody.json();
  const newTrx = await Transaction.create(body);
  return NextResponse.json(newTrx, { status: 201, headers: CORS_HEADERS });
}
