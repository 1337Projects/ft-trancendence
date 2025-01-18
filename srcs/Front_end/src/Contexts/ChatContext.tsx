
import { ChatContextType } from "@/types/chatTypes"
import { createContext, ReactNode } from "react"



export const ChatContext = createContext<ChatContextType | null>(null)


export default function ChatContextProvider({ value, children } :  { children : ReactNode , value : ChatContextType }) {

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}