import { MessageType } from "@/types/chat"
import { FirendType, UserType } from "@/types/user"
import React, { createContext, ReactNode } from "react"


export type UserDataType = {
    status : number,
    messages : MessageType[],
    user : UserType
    nbr_pages : number
    freindship : FirendType
}

type ChatContextType = {
    messages : MessageType[] | null,
    userData : UserDataType | null,
    setMessages : React.Dispatch<React.SetStateAction<MessageType[] | null>>,
    setUserData : React.Dispatch<React.SetStateAction<UserDataType | null>>,
}

export const ChatContext = createContext<ChatContextType | null>(null)


export default function ChatContextProvider({ value, children } :  { children : ReactNode , value : ChatContextType }) {

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}