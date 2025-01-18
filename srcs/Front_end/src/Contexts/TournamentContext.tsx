import { TournamentContextType } from "@/types/tournamentTypes";
import { createContext, ReactNode } from "react";


export const Touramentcontext = createContext<null | TournamentContextType>(null)


export default function TouramentcontextProvider({ children, value } : {children : ReactNode, value : TournamentContextType}) {

    return (
        <Touramentcontext.Provider value={value}>
            { children}
        </Touramentcontext.Provider>
    )
}