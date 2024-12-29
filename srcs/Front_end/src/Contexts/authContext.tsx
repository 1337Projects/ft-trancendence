import React, { createContext, ReactNode, useState } from 'react'
import {jwtDecode} from 'jwt-decode'
import { AuthInfosType, FirendType, UserContextType, UserType } from '@/types/user'




export const UserContext = createContext<UserContextType | null>(null)


export default function UserContextProvider({children} : {children : ReactNode}) {

    const [authInfos, setAuthInfos] = useState<AuthInfosType | null>(null)
    const [user, setUser] = useState<UserType | null>(null)
    const [friends, setFriends] = useState<FirendType[] | null>(null)

    function setAuthInfosHandler(token : string | null) {
        if (!token) {
            setAuthInfos(null)
            return
        }
        const pyload : {username : string} = jwtDecode(token)
        setAuthInfos({accessToken : token, username : pyload.username})
    }

    const value = {
        authInfos,
        user,
        friends,
        setAuthInfosHandler,
        setUser,
        setFriends
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

