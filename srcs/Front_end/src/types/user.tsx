

export type AuthInfosType = {
    accessToken : string,
    username : string,
}

export type UserProfileType = {
    avatar : string,
    bio : string,
    level : number,
    rank : number,
    banner : string,
    online : boolean,
}

export type UserType = {
    id : number,
    username : string,
    first_name : string,
    last_name : string,
    profile : UserProfileType,
    last_notification_seen : string,
}

export type UserContextType = {
    authInfos : AuthInfosType | null,
    user : UserType | null,
    friends : FirendType[] | null,
    setAuthInfosHandler : (token : string | null) => void,
    setUser : React.Dispatch<React.SetStateAction<UserType | null>>
    setFriends : React.Dispatch<React.SetStateAction<FirendType[] | null>>

}

export type FirendType = {
    id : number,
    sender : UserType,
    receiver : UserType,
    status : string
}