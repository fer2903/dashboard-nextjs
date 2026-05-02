
import { createContext, useContext, useState } from "react";

type DashboardState = { // tipos a recibir 
    currency: "usd" | "mxn"
    setCurrency: (c: "usd" | "mxn") => void
}


const Ctx = createContext<DashboardState | null >(null) // inicializamos contexto , le asignamos agregados son los tipos -DashboardState

export const DashboardProvider =({children}:any) =>{ // el proveedor hereda los cambios a los componenter hijos 
    const [currency, setCurrency] = useState< "usd" | "mxn">("usd")  // aqui se inicializan las variables que deben cambiar 

    return(// componente react context
        <Ctx.Provider value={{currency, setCurrency}}> 
            {children}
        </Ctx.Provider>
    )
}

export const useDashboardProvider = ()=>{ // condicion de permiso sobre el acceso al contexto
    const ctx = useContext(Ctx)
    if(!ctx) throw new Error("Missing Provider")
    return  ctx
}
