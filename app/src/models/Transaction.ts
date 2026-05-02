import mongoose, { Schema, models } from "mongoose";

const TransactioSchema = new Schema(
    {
        user: {type: String, required: false},
        coin: {type: String, required: false},
        amount: { type: Number, required: false}
    },
    {
        timestamps: true
    }
)

export const Transaction = models.Transaction || mongoose.model("Transaction", TransactioSchema)
