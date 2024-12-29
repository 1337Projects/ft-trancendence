import { MessageType } from "@/types/chat"
import { UserType } from "@/types/user"
import React, { createContext, ReactNode } from "react"


type ChatContextType = {
    messages : MessageType[],
    userData : UserType | null,
    setMessages : React.Dispatch<React.SetStateAction<MessageType[]>>,
    setUserData : React.Dispatch<React.SetStateAction<UserType | null>>,
}

export const ChatContext = createContext<ChatContextType | null>(null)


export default function ChatContextProvider({ value, children } :  { children : ReactNode , value : ChatContextType }) {

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}