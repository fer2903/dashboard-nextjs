//localhost:3000/api/transaction/1234 // traer el registro con el id 1234
//localhost:3000/api/transaction/abcdfg // traer el registro con el id 1234

import { NextResponse } from "next/server";

type TransactionResponse = {
    id: string; //uuid
    user: string;
    coin: string;
    amount: number;
}
let transactions: TransactionResponse[] = [
    {
        "id": "3fa8911e-4249-41a2-b972-10f9325f7ec1",
        "user": "fer",
        "coin": "bitcoin",
        "amount": 2.5
    },
    {
        "id": "0df876b5-b657-4985-b67e-d31dd20dd048",
        "user": "joel",
        "coin": "bitcoin",
        "amount": 50
    },
     {
        "id": "0df876b5-b657-4985-b67e-xxxxxx",
        "user": "ricardo",
        "coin": "bitcoin",
        "amount": 30
    },
     {
        "id": "1",
        "user": "enrique",
        "coin": "bitcoin",
        "amount": 20,
    }
]

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()

    transactions = transactions.map((t) =>
        t.id === id ? { ...t, ...body } : t
    )

    return NextResponse.json({
        message: "updated",
        transaction: transactions,
    })
}

export async function DELETE(req: Request, { params }: { params: Promise<{id: string}>}){
    const { id } = await params
    let result = transactions.filter((t)=> t.id !== id)
    return NextResponse.json({message: "deleted", transactions: result})
}