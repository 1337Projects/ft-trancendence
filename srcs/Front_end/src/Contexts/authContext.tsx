import React, { createContext, useState } from 'react'

type AuthInfosType = {
    accessToken : string,
    username : string,
}

type UserProfileType = {
    photo : string,
    bio : string,
}

type UserType = {
    username : string,
    first_name : string,
    last_name : string,
    profile : UserProfileType
}

type UserContextType = {
    authInfos : AuthInfosType | null,
    user : UserType | null,
    setAuthInfos : React.Dispatch<React.SetStateAction<AuthInfosType | null>>,
    setUser : React.Dispatch<React.SetStateAction<UserType | null>>
}

export const UserContext = createContext<UserContextType | null>(null)


export default function UserContextProvider({children}) {

    const [authInfos, setAuthInfos] = useState<AuthInfosType | null>(null)
    const [user, setUser] = useState<UserType | null>(null)

    const value = {
        authInfos,
        user,
        setAuthInfos,
        setUser
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

