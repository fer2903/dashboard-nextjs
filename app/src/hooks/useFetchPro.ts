import { useState, useEffect, useRef } from "react";

type Options ={
    retries?: number
}

export const useFetchPro = (url: string, options?:Options)=>{
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const abortRef = useRef<AbortController | null>(null)
    
    useEffect(()=>{
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        let attemps = 0

        const fetchData = async ()=>{
            try {
                setLoading(false)
                const res = await fetch(url, {
                    signal: controller.signal
                })
                if (!res.ok) throw new Error("error")

                const json = await res.json()
                setData(json)
            } catch (error) {
                if(attemps < (options?.retries || 0)){
                    attemps++
                    fetchData()
                }else{
                    setError("Failed request")
                }

            } finally{
                setLoading(true)
            }
            fetchData()
        }
        return () => controller.abort()

    },[null])

    return { data, loading, error}
}