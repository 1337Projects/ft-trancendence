import { MatchDataType } from "./gameTypes"


export interface SocketMessageType {
    event : string,
    partner? : string,
    from? : string,
    page? : number,
    sender? : string,
    receiver? : string,
    message? : string,
    link? : string,
    page_size? : number,
    result? : MatchDataType,
    x? : number,
    y? : number,
}

export type CallBackType<T = any> = (data : T) => void



