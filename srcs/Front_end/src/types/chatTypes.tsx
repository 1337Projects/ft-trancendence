
import { FriendType, UserType } from "./userTypes"


export type ChatUserDataType = {
    status : number,
    messages : MessageType[],
    user : UserType
    nbr_pages : number
    freindship : FriendType
}


export type MessageType = {
    sender : UserType,
    receiver : UserType,
    id : number,
    message : string,
    created_at : string,
    link_expired : boolean,
    link : string | null,
}

export type ConversationType = {
    sender : UserType,
    receiver : UserType,
    id : number,
    content_of_last_message : string,
    last_message_time : string

}

export type ChatContextType = {
    messages : MessageType[] | null,
    userData : ChatUserDataType | null,
    setMessages : React.Dispatch<React.SetStateAction<MessageType[] | null>>,
    setUserData : React.Dispatch<React.SetStateAction<ChatUserDataType | null>>,
}