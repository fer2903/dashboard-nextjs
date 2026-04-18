import { useQuery } from "@tanstack/react-query";

export const useCryptoQuery = () =>{
    return useQuery({
        queryKey: ["crypto"],
        queryFn: async ()=>{
            const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
            return res.json()
        },
        staleTime: 3000
    })
}