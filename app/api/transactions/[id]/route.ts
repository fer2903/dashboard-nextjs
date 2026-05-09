import { NextResponse } from "next/server";
import { connectDB } from "@/app/src/lib/mongodb";
import { Transaction } from "@/app/src/models/Transaction";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const updateTrx = await Transaction.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(
    { transaction: updateTrx, message: "updated" },
    { headers: CORS_HEADERS }
  );
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ message: "deleted" }, { headers: CORS_HEADERS });
}
