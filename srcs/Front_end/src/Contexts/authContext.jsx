

import { createContext } from 'react'

export const authContext = createContext(null)
export const authContextHandler = createContext(null)


export default function AuthcontextProvidder({children, user, handler}) {
    return (
        <authContext.Provider value={user}>
            <authContextHandler.Provider value={handler}>
                {children}
            </authContextHandler.Provider>
        </authContext.Provider>
    )
}