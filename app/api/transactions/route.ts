import { NextResponse } from "next/server";
import { connectDB } from "@/app/src/lib/mongodb";
import { Transaction } from "@/app/src/models/Transaction";

type TransactionResponse = {
    id: string; //uuid
    user: string;
    coin: string;
    amount: number;
}

//GET, POST, PUT, DELETE

export async function GET() {
    await connectDB();

    const data = await Transaction.find() // Select * from transactions

    return NextResponse.json(data)
}

export async function POST(requestBody: Request){ //recibir objetos a generar o registrar 
    await connectDB();

    const body = await requestBody.json()
    const newTrx = await Transaction.create(body)

    return NextResponse.json(newTrx, {status:201})
}