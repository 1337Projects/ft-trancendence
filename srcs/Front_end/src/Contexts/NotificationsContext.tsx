import React, { createContext, useState } from "react";


type NotificationsContextType = {
    notifications : [] | null,
    invites : [] | null,
    setNotifications : React.Dispatch<React.SetStateAction<null | []>>,
    setInvites : React.Dispatch<React.SetStateAction<null | []>>
}


export const NotificationsContext = createContext<null | NotificationsContextType>(null)


export default function NotificationsContextProvider({children}) {


    const [ notifications, setNotifications ] = useState<null | []>(null)
    const [ invites, setInvites ] = useState<null | []>(null)

    const value = {
        notifications,
        setNotifications,
        invites,
        setInvites
    }

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    )
}