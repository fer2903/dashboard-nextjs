//localhost:3000/api/transaction/1234 // traer el registro con el id 1234
//localhost:3000/api/transaction/abcdfg // traer el registro con el id 1234

import { NextResponse } from "next/server";
import { connectDB } from "@/app/src/lib/mongodb";
import { Transaction } from "@/app/src/models/Transaction";

type TransactionResponse = {
    id: string;
    user: string;
    coin: string;
    amount: number;
}


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB()

    const { id } = await params
    const body = await req.json()

    const updateTrx = await Transaction.findByIdAndUpdate(id, body, { new: true })

    return NextResponse.json({
        transaction: updateTrx,
        message: "updated"
    })
}

export async function DELETE(req: Request, { params }: { params: Promise<{id: string}>}){
    await connectDB()
    const { id } = await params
    await Transaction.findByIdAndDelete(id)

    return NextResponse.json({message: "deleted"})
}