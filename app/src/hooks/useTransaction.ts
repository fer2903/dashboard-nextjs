import { useQuery } from "@tanstack/react-query";

export type Transaction = {
    _id: string
    user: string
    coin: string
    amount: number
    createdAt: string
}

export function useTransactions(){
    return useQuery({
        queryKey: ["transaction"],
        queryFn: async ()=>{
            const res = await fetch("/api/transactions")
            return res.json()
        },
        staleTime: 5000
    })
}