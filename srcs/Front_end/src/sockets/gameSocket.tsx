import { WebSocketService } from "@/socket";

// interface EventType {
//     event: string;
//     data: 
// };

class GameSocket extends WebSocketService {


    openCallback = () => {
        console.log("Game web socket connection established")
        this.flushQueue()
    }

    closeCallback = () => {
        // this.callbacks['closeHandler'](true)
        console.log("Game WebSocket connection closed");
    }
    

    eventCallback = (event) => {

        console.log('event: ', event);
        const data = JSON.parse(event.data)
        console.log('data: ', data);
        const type = data.event;
        switch (type) {
            case 'init_game':
                this.callbacks['init'](data)
                break;
            default:
                break;
        }
    }
}

export const gameSocket = new GameSocket()