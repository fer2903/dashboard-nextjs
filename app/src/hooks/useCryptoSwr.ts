import useSWR from "swr";

const fetchData = (url: string) => fetch(url).then(res => res.json())

export const useCryptoSwr = () =>{
    const {data, error, isLoading} = 
        useSWR(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd",
            fetchData
        )

    return {
        data,
        loading: isLoading,
        error
    }
}