class Paddle {
    private context;
    private width;
    private height;
    private y;
    private x;
    private paddleNum;

    constructor(context: CanvasRenderingContext2D, num, paddles) {
        this.context = context;
        this.width = paddles.width;
        this.height = paddles.height;
        this.paddleNum = num;
        if (num == 1)
        {
            this.y = 0;
            this.x = paddles.paddle1X;
        }
        else
        {
            this.y = context.canvas.height - this.height;
            this.x = paddles.paddle2X;
        }
    }
    
    public render() {
        this.context.fillStyle = 'black';
        this.context.fillRect(this.x - (this.width / 2), this.y, this.width, this.height);
    }
}
class Ball {
    private x: number;
    private y: number;
    private radius: number = 10;
    private context;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.x = context.canvas.width / 2;
        this.y = context.canvas.height / 2;
    }

    public render() {
        // Draw the ball
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = 'blue';
        this.context.fill();
        this.context.closePath();
    }
}

class Game {
    private context: CanvasRenderingContext2D;
    private ball: Ball;
    private paddle1: Paddle;
    private paddle2: Paddle;
    private paddleMove: number;

    constructor(context: CanvasRenderingContext2D, paddles) {
        this.context = context;
        this.ball = new Ball(context);
        console.log(paddles);
        this.paddle1 = new Paddle(context, 1, paddles);
        this.paddle2 = new Paddle(context, 2, paddles);
        this.paddleMove = 10;
    }

    renderNet() {
        const netWidth = 10;
        const netHeight = 2;
        const netColor = 'black';
        const canvasHeight = this.context.canvas.height;
        const canvasWidth = this.context.canvas.width;

        this.context.fillStyle = netColor;
        
        for (let i = 0; i <= canvasWidth; i += 15) {
            this.context.fillRect(i, canvasHeight / 2 - netHeight / 2, netWidth, netHeight);
        }
        
        // render i line with the midle of x ray.
        for (let i = 0; i <= canvasHeight; i += 15) {
            this.context.fillRect(canvasWidth / 2 - netHeight / 2, i, netHeight, netWidth);
        }
    }

    update(paddle1X, paddle2X): void {
        // set stats of paddle1 and paddle2
    }

    render() {
        // Clear the previous frame
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.renderNet();
        this.ball.render();
        this.paddle1.render();
        this.paddle2.render();
    }
}

class WebSocketHandler {
    private socket: WebSocket;
    private game: Game | null = null;

    constructor(wsUrl: string) {
        this.socket = new WebSocket(wsUrl);
        this.initializeWebSocket();
    }

    private initializeWebSocket() {
        this.socket.onopen = () => {
            console.log('WebSocket opened');
        };

        this.socket.onmessage = (event) => {
            console.log('Received message', event.data);
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
        };
    }

    private handleMessage(data: any) {
        const type = data.event;
        switch (type) {
            case 'init_game':
                this.handleInitGame(data);
                break;
            case 'update_stats':
                this.handleUpdateStats(data);
                break;
            // Add more cases for other message types
            default:
                console.warn('Unknown message type:', type);
        }
    }

    private handleInitGame(data: any) {
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;
        const paddles = data.paddles;
        const gameDimensions = data.game;

        if (!paddles || !gameDimensions) {
            console.error('Invalid game initialization data:', data);
            return;
        }
        this.game = new Game(context, paddles);
        this.game!.render();
    }

    private handleUpdateStats(data: any) {
        const stats = data.stats;
        // Handle stats update
    }

    // Add more methods to handle other message types
}

console.log('begin');

function getWsUrl(path: string): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${path}`;
}

function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

function getGameIdFromUrl(): string | null {
    const path = window.location.pathname;
    const match = path.match(/\/api\/game\/(\d+)/);
    return match ? match[1] : null;
}

function connect() {
    console.log('connect function');
    const accessToken = getCookie('access_token');
    if (!accessToken) {
        alert('Please login first');
        return;
    }
    const gameId = getGameIdFromUrl();
    if (!gameId) {
        alert('Game ID not found in URL');
        return;
    }
    const wsUrl = getWsUrl(`/ws/game/${gameId}/?token=${accessToken}`);
    console.log('WebSocket URL:', wsUrl);

    // const game = new Game(context);

    new WebSocketHandler(wsUrl);
}

connect();