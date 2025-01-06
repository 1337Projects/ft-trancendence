import React, { createContext, useState, useContext, ReactNode } from "react";
import { notificationSocket } from "@/socket";
import { UserContext } from "./authContext";
import { NotificationType } from "@/types";

type NotificationsContextType = {
    notifications: NotificationType[] | null;
    setNotifications: React.Dispatch<React.SetStateAction<null | NotificationType[]>>;
    fetchMoreNotifications: () => void;
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    hasMore : boolean;
    currentPage: number;
    hasNew : number,
    setHasNew : React.Dispatch<React.SetStateAction<number>>,
}

export const NotificationsContext = createContext<null | NotificationsContextType>(null);

export default function NotificationsContextProvider({ children } : {children : ReactNode}) {
    const { authInfos} = useContext(UserContext) || {}; 
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [ notifications, setNotifications ] = useState<null | NotificationType[]>(null)
    const [ hasNew, setHasNew ] = useState(0)

    const fetchMoreNotifications = async () => {
        try
        {
            const nextPage = currentPage + 1;
            notificationSocket.sendMessage({
                event: "fetch nots",
                sender: authInfos?.username,
                page: nextPage,
                page_size: 7,
            });
            setCurrentPage(currentPage + 1);
            // console.log("current page:", currentPage, nextPage)
        }
        catch (error)
        {
            console.error("Error fetching more notifications:", error);
        }
    };
    
    const value = {
        notifications,
        hasNew,
        setNotifications,
        fetchMoreNotifications,
        setHasMore,
        setCurrentPage,
        hasMore,
        currentPage,
        setHasNew
    }

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}
