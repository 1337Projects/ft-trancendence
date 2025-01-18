
import { MessageType } from "@/types/chatTypes";
import { WebSocketService } from '@/sockets/index'


class ChatSocket extends WebSocketService {

    openCallback = () => {
        console.log("Chat web socket connection established")
        this.flushQueue()
    }

    closeCallback = () => {
        console.log("Chat WebSocket connection closed");
    }
    
    eventCallback = (event : MessageEvent) => {

        const data = JSON.parse(event.data)

        switch (data.response.status) {
            case 205:
                this.callbacks["setData"]?.((prev : MessageType[]) => prev ? [...prev, data.response.message] : [data.response.message])
                this.callbacks["cnvsUpdate"]?.(data.response.conversation)
                break;
            case 206:
                console.log(data.response)
                this.callbacks["setData"]?.((prev : MessageType[]) => prev ? [...[...data.response.messages].reverse(), ...prev, ] : [...[...data.response.messages].reverse()])
                this.callbacks["setUser"]?.(data.response)
                break;
            case 209:
                this.callbacks["cnvsHandler"]?.(data.response.conversations)
                break;
            case 400:
                console.log("400" , data)
                break;
            default:
                break;
        }
    }
}


export const chatSocket = new ChatSocket()