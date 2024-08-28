
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
                console.log(data)
                if (data.data.messages) {
                    this.callbacks["setData"](data.data.messages)
                    this.callbacks["setUser"](data.data.user)
                }
                else  {
                    this.callbacks["setData"](prev => [...prev , data.data])
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
        this.socket.close()
        this.socket = null
    }
}

const Socket = new WebSocketService()

export default Socket