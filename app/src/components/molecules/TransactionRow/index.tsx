import { Transaction } from "@/app/src/hooks/useTransaction";
import { Badge } from "../../atoms/Badge"; 

export const TransactionRow=({tx}: {tx: Transaction})=>{
    return (
        <tr>
            <td>{tx.user}</td>
            <td><Badge value={tx.coin}/></td>
            <td>{tx.amount}</td>
            <td>{new Date(tx.createdAt).toLocaleString()}</td>
        </tr>
    )
}