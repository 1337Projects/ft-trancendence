


class WebSocketService {

    constructor() {
        this.socket = null
        this.callbacks = []
        this.queue = [];
    }

    addCallback(key, callback) {
        this.callbacks[key] = callback
    }

    connect(url) {
        if (this.socket && this.socket.readyState == WebSocket.OPEN)
            this.close()
        if (!this.socket || this.socket.readyState == WebSocket.CLOSED) {
            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                console.log("web socket connection established")
                this.flushQueue()
            }
            this.socket.onclose = () => {
                console.log("WebSocket connection closed");
            };
        
            this.socket.onerror = (error) => {
                console.log("WebSocket error:", error);
            };

            this.socket.onmessage = (event) => {
                let data = JSON.parse(event.data)
                console.log("this is it => " , data)
                switch (data.response.status) {
                    case 201:
                        console.log(data.response.room)
                        this.callbacks["setRoom"](data.response.room)
                        break;
                    case 202:
                        this.callbacks["setInitData"](JSON.parse(data.response.game))
                        break;
                    case 203:
                        console.log("start game event comes")
                        this.callbacks["startGame"]()
                        break;
                    case 204:
                        this.callbacks["resultHandler"](data.response.match)
                        break;
                    case 205:
                        this.callbacks["setData"](prev => [...prev , data.response.message])
                        break;
                    case 206:
                        this.callbacks["setData"](data.response.messages)
                        this.callbacks["setUser"](data.response.user)
                        break;
                    case 207:
                        // console.log( "data => " , data)
                        this.callbacks["setNots"](prev => [data.response.not, ...prev])
                        break;
                    case 208:
                        // console.log( "data ==> " , data)
                        this.callbacks["setNots"](data.response.nots.reverse())
                        break;
                    case 210:
                        this.callbacks["tr_data"](data.response)
                    case 400:
                        console.log(data.response.error)
                        break;
                    default:
                        break;
                }
            }
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

const Socket = new WebSocketService()
export const notsSocket = new WebSocketService()

export default Socket