import { UserType } from "./user"


export type MessageType = {
    sender : UserType,
    receiver : UserType,
    id : number,
    message : string,
    created_at : string
}

export type ConversationType = {
    content_of_last_message : string,
    last_message_time : string

}