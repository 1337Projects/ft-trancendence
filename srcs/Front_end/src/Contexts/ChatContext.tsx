import React, { createContext } from "react";
import { MessageType, UserType } from "../Types";


type ChatContextType = {
    messages : MessageType[],
    userData : UserType | null,
    setMessages : React.Dispatch<React.SetStateAction<MessageType[]>>,
    setUserData : React.Dispatch<React.SetStateAction<UserType | null>>,
}

export const ChatContext = createContext<ChatContextType | null>(null)


export default function ChatContextProvider({ value, children }) {

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}