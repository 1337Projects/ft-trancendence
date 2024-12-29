import { TournamentDataType } from "@/types/tournament";
import { createContext, ReactNode } from "react";
import React from "react";


type TournamentContextType = {
    data : TournamentDataType,
    setData : React.Dispatch<React.SetStateAction<TournamentDataType>>,
}


export const Touramentcontext = createContext<null | TournamentContextType>(null)


export default function TouramentcontextProvider({ children, value } : {children : ReactNode, value : TournamentContextType}) {

    return (
        <Touramentcontext.Provider value={value}>
            { children}
        </Touramentcontext.Provider>
    )
}