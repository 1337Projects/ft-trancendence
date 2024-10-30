import React, { createContext, useState } from 'react'


type DialogContextType = {
    open : boolean,
    setOpen: React.Dispatch<React.SetStateAction<Boolean>>
}


export const DialogContext = createContext<DialogContextType | null>(null)


export function DialogContextProvider({children}) {

    const [open, setOpen] = useState<Boolean>(false)

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