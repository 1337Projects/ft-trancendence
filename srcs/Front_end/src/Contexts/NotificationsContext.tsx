import { createContext, useState, useContext, ReactNode } from "react";
import { UserContext } from "./authContext";
import { NotificationsContextType, NotificationType } from "@/types/indexTypes";
import { notificationSocket } from "@/sockets/notificationsSocket";



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
