import { NextResponse } from "next/server";

type TransactionResponse = {
    id: string; //uuid
    user: string;
    coin: string;
    amount: number;
}

let transactions: TransactionResponse[] = [] // actualiaciones emulacion DB
//GET, POST, PUT, DELETE

export async function GET() {
    return NextResponse.json(transactions)
}

export async function POST(requestBody: Request){ //recibir objetos a generar o registrar 
    const body = await requestBody.json()
    const newTransaction: TransactionResponse = {
        id: crypto.randomUUID(),
        user: body.user,
        coin: body.coin,
        amount: body.amount
    }

    transactions.push(newTransaction);
    return NextResponse.json(newTransaction, {status:201})
}