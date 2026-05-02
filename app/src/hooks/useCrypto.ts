import { useFetchPro } from "./useFetchPro"

type  coinDataType = {
    id: string;
    name: string
    current_price: number
    price_change_percentage_24h: number
}

export const useCryptoPrices = () =>{
    const {data, loading} = useFetchPro("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")

    return {
        loading,
        data: data.map((crypto:coinDataType)=>({ // refactorizar a un map mas eficiente
            name: crypto.name,
            price: crypto.current_price,
            change: crypto.price_change_percentage_24h
        }))
    }
}