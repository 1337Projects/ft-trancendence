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
    

    eventCallback = (event: even) => {

        const data = JSON.parse(event.data)
        if (data.event !== 'update')
        {
            console.log('event: ', event);
            console.log('data: ', data);
        }
        const type = data.event;
        switch (type) {
            case 'init_game':
                this.callbacks['init'](data);
                break;
            case 'update':
                this.callbacks['update'](data.stats);
                break;
            case 'set_score':
                this.callbacks['set_score'](data.score);
                break;
            default:
                break;
        }
    }
}

export const gameSocket = new GameSocket()