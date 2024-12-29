import { UserType } from "./user";

export type NotificationType = {
    created_at : string,
    sender : UserType,
    link : string,
    message : string
}

export type ApearanceContextType = {
    theme : string,
    color : string,
    themeHandler : (theme : string) => void,
    colorHandler : (color : string) => void,
}

export type AlertType = {
    message: string[];
    type: string;
}

export type DialogDataType = {
    members : number,
    name : string
}