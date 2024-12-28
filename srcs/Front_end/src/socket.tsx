import { UserType } from "./Types";

type CallBackType = (data : string) => void

class WebSocketService {

    callbacks: CallBackType[];
    socket: null | WebSocket;
    queue: never[];

    constructor() {
        this.socket = null
        this.callbacks = []
        this.queue = [];
    }

    addCallback(key, callback) {
        this.callbacks[key] = callback
    }


    openCallback = () => {
        console.log("web socket connection established")
        this.flushQueue()
    }

    closeCallback = () => {
        console.log("WebSocket connection closed");
    }

    errorCallback = (error) => {
        console.log("WebSocket error:", error);
    }


    eventCallback = (event) => {
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



    connect(url : string) {
        // if (this.socket && this.socket.readyState == WebSocket.OPEN)
        //     this.close()
        if (!this.socket || this.socket.readyState == WebSocket.CLOSED) {
            this.socket = new WebSocket(url);

            this.socket.onopen = this.openCallback
            this.socket.onclose = this.closeCallback        
            this.socket.onerror = this.errorCallback
            this.socket.onmessage = this.eventCallback
        }
    }

    sendMessage(message) { 
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }else {
            this.queue.push(message);
        } 
    }

    flushQueue() {
        while (this.queue.length > 0) {
            const message = this.queue.shift();
            this.socket!.send(JSON.stringify(message));
        }
    }

    close() {
        if (this.socket && this.socket.readyState == WebSocket.OPEN) {
            this.socket.close()
        }
        this.socket = null
    }
}


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

        const data = JSON.parse(event.data)
        switch (data.response.status) {
            case 201:
                this.callbacks["setRoom"](data.response.room)
                break;
            case 203:
                this.callbacks["startGame"](data.response.game_id)
                break;
            // case 202:
            //     this.callbacks["setInitData"](data.response.game)
            //     break;
            // case 204:
            //     this.callbacks["resultHandler"](data.response.match)
            //     break;
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
    
    eventCallback = (event) => {

        const data = JSON.parse(event.data)
        console.log(data)
        switch (data.response.status) {
            case 205:
                this.callbacks["setData"](prev => prev ? [...prev, data.response.message] : [data.response.message])
                this.callbacks["cnvsUpdate"](data.response.conversation)
                break;
            case 206:
                this.callbacks["setData"](prev => prev ? [...[...data.response.messages].reverse(), ...prev, ] : [...[...data.response.messages].reverse()])
                this.callbacks["setUser"](data.response)
                break;
            case 209:
                this.callbacks["cnvsHandler"](data.response.conversations)
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

    eventCallback = (event) => {
        const data = JSON.parse(event.data)
        // console.log("nots ==> ", data)
        switch (data.response.status) {
            case 207:
                // console.log(this.callbacks)
                this.callbacks["setNots"](prev => [data.response.not, ...prev])
                break;
            case 208:
                this.callbacks["FirstSetNots"](data.response.nots.reverse())
                break;
            case 209:
                this.callbacks["appendNots"](data.response.nots);
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
                this.callbacks["roomDataHandler"](data.response.data)
                break;
            }
            case 200:
                console.log(JSON.parse(data.response.game))
                break;
            case 201:
                this.callbacks["setRoom"](data.response.room)
                break;
            case 210:
                // console.log(data.response.data)
                this.callbacks["tr_data"](data.response.data)
                setTimeout(() => {
                    this.sendMessage({"event" : "start"})
                }, 4000)
                break;
            case 211:
                this.callbacks["match_data"](data.response.data)
                break;
            case 212:
                this.callbacks["winner_data"](data.response.data)
                break;
            default:
                break;
        }
    }
}



const Socket = new WebSocketService()

export const notificationSocket = new NotificationSocket()
export const tournamentSocket = new TournamentSocket()
export const gameSocket = new GameSocket()
export const chatSocket = new ChatSocket()

export default Socket