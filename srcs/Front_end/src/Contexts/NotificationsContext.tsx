import React, { createContext, useState } from "react";


type NotificationsContextType = {
    notifications : [] | null,
    setNotifications : React.Dispatch<React.SetStateAction<null | []>>,
}


export const NotificationsContext = createContext<null | NotificationsContextType>(null)


export default function NotificationsContextProvider({children}) {


    const [ notifications, setNotifications ] = useState<null | []>(null)

    const value = {
        notifications,
        setNotifications,
    }

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    )
}