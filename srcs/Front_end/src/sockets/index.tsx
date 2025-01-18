import { CallBackType, SocketMessageType } from "@/types/socketTypes";


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
            if (this.callbacks["back"]) {
                this.callbacks["back"](error)
            }
            console.log("WebSocket error:", error);
        }

        this.eventCallback = (event : MessageEvent) => {
            const data = JSON.parse(event.data)
            switch (data.response.status) {
                case 400:
                    console.log(data.response.error)
                    break;
            }
        }
    }

    addCallback(key : string, callback : CallBackType) {
        this.callbacks[key] = callback
    }


    connect(url : string) {
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
            if (message) {
                this.socket.send(JSON.stringify(message));
            }
        }
    }

    close() {
        if (this.socket && this.socket.readyState == WebSocket.OPEN) {
            this.socket.close()
        }
        this.socket = null
    }
}

