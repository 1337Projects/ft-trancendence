import { UserType } from "./userTypes";

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

export type InputPropsType = {
    label: string,
    id: string,
    name: string,
    type?: string,
    placeholder: string
}

export type DialogContextType = {
    open : boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type NotificationsContextType = {
    notifications: NotificationType[] | null;
    setNotifications: React.Dispatch<React.SetStateAction<null | NotificationType[]>>;
    fetchMoreNotifications: () => void;
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    hasMore : boolean;
    currentPage: number;
    hasNew : number,
    setHasNew : React.Dispatch<React.SetStateAction<number>>,
}