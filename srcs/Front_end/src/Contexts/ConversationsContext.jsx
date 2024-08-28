import { createContext } from 'react'

export const ConversationsContext = createContext(null)
export const ConversationsHandlerContext = createContext(null)


export function ConversationsProvider({children, data, dispatch}) {
    return (
        <ConversationsContext.Provider value={data}>
            <ConversationsHandlerContext.Provider value={dispatch}>
                {children}
            </ConversationsHandlerContext.Provider>
        </ConversationsContext.Provider>
    )
}


export const chatContext = createContext(null)
export const chatHandlerContext = createContext(null)

export function ChatProvider({children, data, dispatch}) {
    return (
        <chatContext.Provider value={data}>
            <chatHandlerContext.Provider value={dispatch}>
                {children}
            </chatHandlerContext.Provider>
        </chatContext.Provider>
    )
}