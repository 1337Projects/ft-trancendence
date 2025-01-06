import { UserType } from "./user"


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
    id : number,
    content_of_last_message : string,
    last_message_time : string

}