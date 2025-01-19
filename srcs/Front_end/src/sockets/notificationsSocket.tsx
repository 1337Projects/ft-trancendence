import { WebSocketService } from '@/sockets/index'
import { NotificationType } from "@/types/indexTypes";


class NotificationSocket extends WebSocketService {

    eventCallback = (event : MessageEvent) => {
        const data = JSON.parse(event.data)
        switch (data.response.status) {
            case 207:
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