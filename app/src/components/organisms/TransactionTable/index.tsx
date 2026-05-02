"use client"

import { useTransactions } from "@/app/src/hooks/useTransaction";
import { TransactionRow } from "../../molecules/TransactionRow";

export const TransactionTable = ( )=>{
    const {data, isPending, error } = useTransactions()
    if(isPending) return <p>loading transactions...</p>
    if(error) return <p>error lodading data</p>

    return (
        <div>
            <h2>Transactions</h2>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Coin</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((tx:any)=>(<TransactionRow key={tx.id} tx={tx}/>))}
                </tbody>
            </table>
        </div>
    )
}