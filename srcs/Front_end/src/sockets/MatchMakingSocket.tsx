import { WebSocketService } from '@/sockets/index'



class RoomSocket extends WebSocketService {


    openCallback = () => {
        console.log("Room web socket connection established")
        this.flushQueue()
    }

    closeCallback = () => {
        // this.callbacks['closeHandler'](true)
        console.log("Room WebSocket connection closed");
    }
    
    eventCallback = (event : MessageEvent) => {

        const data = JSON.parse(event.data)
        switch (data.response.status) {
            case 201:
                this.callbacks["setRoom"]?.(data.response.room)
                break;
            case 203:
                this.callbacks["startGame"]?.(data.response.game_id)
                break;
            default:
                break;
        }
    }
}

export const roomSocket = new RoomSocket()