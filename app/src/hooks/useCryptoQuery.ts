import { useQuery } from "@tanstack/react-query";

export const useCryptoQuery = () =>{
    return useQuery({
        queryKey: ["transaction"],
        queryFn: async ()=>{
            const res = await fetch("/api/trantransactions")
            return res.json()
        },
        staleTime: 5000
    })
}