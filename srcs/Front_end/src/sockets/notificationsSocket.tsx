import { WebSocketService } from '@/sockets/index'
import { NotificationType } from "@/types/indexTypes";


class NotificationSocket extends WebSocketService {


    openCallback = () => {
        console.log("Notifications web socket connection established")
        this.flushQueue()
    }

    closeCallback = () => {
        console.log("Notifications WebSocket connection closed");
    }

    eventCallback = (event : MessageEvent) => {
        const data = JSON.parse(event.data)
        console.log("nots ==> ", data)
        switch (data.response.status) {
            case 207:
                // console.log(this.callbacks)
                this.callbacks["setNots"]?.((prev : NotificationType[]) => [data.response.not, ...prev])
                this.callbacks["hasNew"]?.((prev : string) => prev + 1)
                break;
            case 208:
                this.callbacks["FirstSetNots"]?.(data.response.nots)
                this.callbacks["hasNew"]?.(data.response.num_of_notify)
                break;
            case 209:
                this.callbacks["appendNots"]?.(data.response.nots);
                break;
            default:
                break;
        }
    }
}


export const notificationSocket = new NotificationSocket()