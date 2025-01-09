import { NotificationType } from "./types";
import { MessageType } from "./types/chat";
import { UserType } from "./types/user";


type CallBackType = (data : any) => void

interface SocketMessageType {
    event : string,
    partner? : string,
    from? : string,
    page? : number,
    sender? : string,
    receiver? : string,
    message? : string,
    link? : string,
    page_size? : number,
}


export class WebSocketService {

    callbacks: Record<string, CallBackType>;
    socket: null | WebSocket;
    queue: SocketMessageType[];
    openCallback: () => void;
    closeCallback: () => void;
    errorCallback: (error : Event) => void;
    eventCallback: (event : MessageEvent) => void;

    constructor() {
        this.socket = null
        this.callbacks = {}
        this.queue = [];

        this.openCallback = () => {
            console.log("web socket connection established")
            this.flushQueue()
        }

        this.closeCallback = () => {
            console.log("WebSocket connection closed");
        }

        this.errorCallback = (error : Event) => {
            console.log("WebSocket error:", error);
        }

        this.eventCallback = (event : MessageEvent) => {
            const data = JSON.parse(event.data)
            switch (data.response.status) {
                case 400:
                    console.log(data.response.error)
                    break;
                case 212:
                    console.log(data.response)
                    break;
                default:
                    break;
            }
        }
    }

    addCallback(key : string, callback : CallBackType) {
        this.callbacks[key] = callback
    }


    connect(url : string) {

        console.log(url)

        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.socket = new WebSocket(url);

            this.socket.onopen = this.openCallback
            this.socket.onclose = this.closeCallback        
            this.socket.onerror = this.errorCallback
            this.socket.onmessage = this.eventCallback
        }
    }

    sendMessage(message : SocketMessageType) { 
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            this.queue.push(message);
        }
    }

    flushQueue() {
        while (this.queue.length > 0 && this.socket) {
            const message = this.queue.shift();
            this.socket.send(JSON.stringify(message));
        }
    }

    close() {
        if (this.socket && this.socket.readyState == WebSocket.OPEN) {
            this.socket.close()
        }
        this.socket = null
    }
}


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
        // console.log("data = >" , data)
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

class TournamentSocket extends WebSocketService {


    openCallback = () => {
        console.log("tournament web socket connection established")
        this.flushQueue()
    }

    closeCallback = () => {
        console.log("tournament WebSocket connection closed");
    }

    eventCallback = (event : MessageEvent) => {
        const data = JSON.parse(event.data)
        
        switch (data.response.status) {
            case 100: {
                const players : UserType[] = []
                for (const [, value] of Object.entries(data.response.data.players as Record<string, UserType>) ) {
                    players.push(value)
                }
                data.response.data.players = players
                this.callbacks["roomDataHandler"]?.(data.response.data)
                break;
            }
            case 200:
                console.log(JSON.parse(data.response.game))
                break;
            case 201:
                this.callbacks["setRoom"]?.(data.response.room)
                break;
            case 210:
                // console.log(data.response.data)
                this.callbacks["tr_data"]?.(data.response.data)
                setTimeout(() => {
                    this.sendMessage({"event" : "start"})
                }, 4000)
                break;
            case 211:
                this.callbacks["match_data"]?.(data.response.data)
                break;
            case 212:
                this.callbacks["winner_data"]?.(data.response.data)
                break;
            default:
                console.log(data)
                break;
        }
    }
}

class TicTacTeoSocket extends WebSocketService {

    openCallback = () => {
        console.log("tic tac web socket connection established")
        this.flushQueue()
    }

    closeCallback = () => {
        console.log("tic tac WebSocket connection closed");
    }

    eventCallback = (event : MessageEvent) => {
        const data = JSON.parse(event.data)
        // console.log(data)
        switch (data.status) {
            case 201: {
                this.callbacks["init"]?.((prev) => {
                    return {
                        ...prev,
                        players : data.data.players,
                        user : data.data.user,
                        board : data.data.board,
                    }
                })
                break;
            }
            case 202: {
                this.callbacks["init"]?.((prev) => {
                    return {
                        ...prev,
                        user : data.data.user,
                        board : data.data.board,
                        error : null
                    }
                })
                break;
            }
            case 203: {
                this.callbacks["init"]?.((prev) => {
                    return {
                        ...prev,
                        board : data.data.board,
                        winner : data?.data?.winner || undefined,
                        error : null
                    }
                })
                break;
            }
            case 204: {
                this.callbacks["time"]?.(data.data.time)
                break;
            }
            case 400: {
                this.callbacks["init"]?.((prev) => {
                    return {
                        ...prev,
                        error : data.data.error,
                    }
                })
                break;
            };
            default:
                break;
        }
    }
}



const Socket = new WebSocketService()

export const notificationSocket = new NotificationSocket()
export const tournamentSocket = new TournamentSocket()
export const roomSocket = new RoomSocket()
export const chatSocket = new ChatSocket()
export const ticTacTeoSocket = new TicTacTeoSocket()

export default Socket