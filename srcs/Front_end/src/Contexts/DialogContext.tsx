import React, { createContext, useState } from 'react'


type DialogContextType = {
    open : boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export const DialogContext = createContext<DialogContextType | null>(null)


export function DialogContextProvider({children}) {

    const [open, setOpen] = useState<boolean>(false)

    const val = {
        open,
        setOpen
    }

    return (
        <DialogContext.Provider value={val}>
            { children }
        </DialogContext.Provider>
    )

}