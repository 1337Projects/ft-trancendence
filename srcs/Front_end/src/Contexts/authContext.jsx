

import { createContext } from 'react'

export const authContext = createContext(null)
export const authContextHandler = createContext(null)


export default function AuthcontextProvidder({children, token, tokenHandler}) {
    return (
        <authContext.Provider value={token}>
            <authContextHandler.Provider value={tokenHandler}>
                {children}
            </authContextHandler.Provider>
        </authContext.Provider>
    )
}

export const userContext = createContext(null)
export const userContextHandler = createContext(null)

export function UsercontextProvidder({children, user, userhandler}) {
    return (
        <userContext.Provider value={user}>
            <userContextHandler.Provider value={userhandler}>
                {children}
            </userContextHandler.Provider>
        </userContext.Provider>
    )
}