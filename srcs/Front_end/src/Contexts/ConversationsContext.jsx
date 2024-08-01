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