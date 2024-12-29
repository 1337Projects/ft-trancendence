import React, { createContext, useState, useContext } from "react";
import { notificationSocket } from "@/socket";
import { UserContext } from "./authContext";

type NotificationsContextType = {
    notifications: [] | null;
    setNotifications: React.Dispatch<React.SetStateAction<null | []>>;
    fetchMoreNotifications: () => void;
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    hasMore : boolean;
    currentPage: number;
    hasNew : boolean,
    setHasNew : React.Dispatch<React.SetStateAction<boolean>>,
}

export const NotificationsContext = createContext<null | NotificationsContextType>(null);

export default function NotificationsContextProvider({ children }) {
    const { authInfos} = useContext(UserContext) || {}; 
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [ notifications, setNotifications ] = useState<null | []>(null)
    const [ hasNew, setHasNew ] = useState(false)

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
            // console.log("current page:", currentPage)
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
