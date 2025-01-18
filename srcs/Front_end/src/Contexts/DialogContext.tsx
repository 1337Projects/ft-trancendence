import { DialogContextType } from '@/types/indexTypes'
import { createContext, ReactNode, useState } from 'react'


export const DialogContext = createContext<DialogContextType | null>(null)


export function DialogContextProvider({children} : {children : ReactNode}) {

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