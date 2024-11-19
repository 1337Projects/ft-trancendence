import { createContext } from "react";
import React from "react";


type TournamentContextType = {
    data : any,
    setData : React.Dispatch<React.SetStateAction<any>>,
}


export const Touramentcontext = createContext<null | TournamentContextType>(null)


export default function TouramentcontextProvider({ children, value }) {

    return (
        <Touramentcontext.Provider value={value}>
            { children}
        </Touramentcontext.Provider>
    )
}