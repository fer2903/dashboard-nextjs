import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/app/src/lib/mongodb";
import { Product } from "@/app/src/models/Product";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_PRODUCTS_MFE_URL ?? "http://localhost:3003",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    await connectMongo();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(products, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201, headers: CORS_HEADERS });
  } catch (error: unknown) {
    console.error("POST /api/products error:", error);
    const message =
      error instanceof Error ? error.message : "Error al crear producto";
    return NextResponse.json({ error: message }, { status: 400, headers: CORS_HEADERS });
  }
}
