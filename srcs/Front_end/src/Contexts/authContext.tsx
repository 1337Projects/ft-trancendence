import React, { createContext, useState } from 'react'
import {jwtDecode} from 'jwt-decode'

type AuthInfosType = {
    accessToken : string,
    username : string,
}

type UserProfileType = {
    image : string,
    bio : string,
    level : number,
    rank : number
}

export type UserType = {
    username : string,
    first_name : string,
    last_name : string,
    profile : UserProfileType
}

export type FirendType = {
    id : Number,
    sender : UserType,
    receiver : UserType,
    status : string
}

type UserContextType = {
    authInfos : AuthInfosType | null,
    user : UserType | null,
    friends : FirendType[] | null,
    setAuthInfosHandler : (token : string | null) => void,
    setUser : React.Dispatch<React.SetStateAction<UserType | null>>
    setFriends : React.Dispatch<React.SetStateAction<FirendType[] | null>>

}

export const UserContext = createContext<UserContextType | null>(null)


export default function UserContextProvider({children}) {

    const [authInfos, setAuthInfos] = useState<AuthInfosType | null>(null)
    const [user, setUser] = useState<UserType | null>(null)
    const [friends, setFriends] = useState<FirendType[] | null>(null)

    function setAuthInfosHandler(token : string | null) {
        if (!token) {
            setAuthInfos(null)
            return
        }
        const pyload = jwtDecode(token)
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

