import { useCryptoPrices } from "./useCrypto"
import { useFetchPro } from "./useFetchPro"

export const useDashboard = ()=>{
    const crypto = useCryptoPrices()
    const users = useFetchPro("https://jsonplaceholder.typicode.com/users")

    return{
        loading: crypto.loading || users.loading,
        data:{
            crypto: crypto.data,
            users: users.data
        }
    }
}