

export type ApearanceContextType = {
    theme : string,
    color : string,
    themeHandler : (theme : string) => void,
    colorHandler : (color : string) => void,
}

export type AuthInfosType = {
    accessToken : string,
    username : string,
}

type UserProfileType = {
    avatar : string,
    bio : string,
    level : number,
    rank : number,
    banner : string
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

export type UserContextType = {
    authInfos : AuthInfosType | null,
    user : UserType | null,
    friends : FirendType[] | null,
    setAuthInfosHandler : (token : string | null) => void,
    setUser : React.Dispatch<React.SetStateAction<UserType | null>>
    setFriends : React.Dispatch<React.SetStateAction<FirendType[] | null>>

}

export type MessageType = {
    sender : UserType,
    receiver : UserType,
    id : number,
    message : string,
    created_at : string

}

export type AlertType = {
    message: string[];
    type: string;
}