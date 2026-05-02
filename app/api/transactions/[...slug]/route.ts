//localhost:3000/api/transactions/user/123

//localhost:3000/api/transactions/user/fer
//localhost:3000/api/transactions/user/fer/coin/bitcoin

//localhost:3000/api/transactions/coin/bitcoin

//localhost:3000/api/transactions/client/chedrahui/coin/btc

//localhost:3000/api/transactions/client/bimbo/coin/btc
//localhost:3000/api/transactions/client/bimbo/coin/usd


//localhost:3000/api/transactions/business_chain/femsa/client/oxxo/coin/btc

//localhost:3000/api/transactions/business_chain/bimbo/client/bimbo/coin/btc  // XXXXXXX

//localhost:3000/api/transactions/client/bimbo/coin/btc

//params.slug = ["client", "bimbo", "coin", "btc"]

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
        "id": "0df876b5-b657-4985-b67e-xxadsd",
        "user": "enrique",
        "coin": "bitcoin",
        "amount": 20
    }
]

export async function GET(
  req: Request,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const { slug = [] } = await context.params // revisar documentacion especifica 

  let result = [...transactions]

  if (slug[0] === "coin" && slug[1]) {
    result = result.filter((t) =>
      t.coin.toLowerCase().includes(slug[1].toLowerCase())
    )
  }

  if (slug[0] === "user" && slug[1]) {
    result = result.filter((t) =>
      t.user.toLowerCase().includes(slug[1].toLowerCase())
    )
  }

  if (slug[0] === "user" && slug[2] === "coin") {
    const user = slug[1]
    const coin = slug[3]

    result = result.filter((t) =>
      t.user.toLowerCase().includes(user.toLowerCase()) &&
      t.coin.toLowerCase().includes(coin.toLowerCase())
    )
  }

  return NextResponse.json(result)
}