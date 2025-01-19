import { WebSocketService } from '@/sockets/index'



class RoomSocket extends WebSocketService {

    
    eventCallback = (event : MessageEvent) => {
        const data = JSON.parse(event.data)
        switch (data.response.status) {
            case 201:
                this.callbacks["setRoom"]?.(data.response.room)
                break;
            case 203:
                this.callbacks["startGame"]?.(data.response.game_id)
                break;
            case 400:
                this.callbacks["error"]?.(data.response.error)
                break;
            default:
                break;
        }
    }
}

export const roomSocket = new RoomSocket()