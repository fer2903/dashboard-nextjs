import { NextResponse } from "next/server";

type CoinGeckoResponse = {
    id: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
}

type Crypto = {
    id: string; //emular que extraemos de nuestra propia db 
    name: string;
    price: number;
    change: number;
}

export async function GET(){ // funcion next js 
    try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd", {next: {revalidate: 30}}) // ruta , parametros
        const data: CoinGeckoResponse[] = await res.json()

        const formatted: Crypto[] = data.map((coin) =>({
            id: coin.id,
            name: coin.name,
            price: coin.current_price,
            change: coin.price_change_percentage_24h
        }))

        return NextResponse.json(formatted) // aseguramos que sea json la respuesta
    } catch (error) {
        return NextResponse.json(
            {error: "Error fetching crypto"},
            {status: 500}
        )
    }
}