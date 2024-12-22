class Paddle {
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private y: number;
    private _x: number;
    private paddleNum: number;

    constructor(context: CanvasRenderingContext2D, num: number, paddles: { width: number, height: number, paddle1X: number, paddle2X: number }) {
        this.context = context;
        this.width = paddles.width;
        this.height = paddles.height;
        this.paddleNum = num;
        if (num === 1) {
            this.y = 0;
            this._x = paddles.paddle1X;
        } else {
            this.y = context.canvas.height - this.height;
            this._x = paddles.paddle2X;
        }
    }
    
    public render() {
        console.log('x: ', this._x, 'y: ', this.y);
        this.context.fillStyle = 'black';
        this.context.fillRect(this._x - (this.width / 2), this.y, this.width, this.height);
    }

    public set X(x: number) {
        console.log('setX x: ', x);
        this._x = x;
    }

    public get X(): number {
        return this._x;
    }
}
class Ball {
    private x: number;
    private y: number;
    private radius: number = 10;
    private context;

    constructor(context: CanvasRenderingContext2D, ball: any) {
        this.context = context;
        this.x = ball.x;
        this.y = ball.y;
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

    constructor(context: CanvasRenderingContext2D, paddles: { width: number, height: number, paddle1X: number, paddle2X: number }, ball: any) {
        this.context = context;
        this.ball = new Ball(context, ball);
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

    setUpdate(stats: { paddle1X: number, paddle2X: number }): void {
        // set stats of paddle1 and paddle2
        console.log('setUpdate (stats): ', stats);
        this.paddle1.X = stats.paddle1X;
        this.paddle2.X = stats.paddle2X;
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
        this.initializeKeydownListener();
    }

    private initializeWebSocket() {
        this.socket.onopen = () => {
            console.log('WebSocket opened');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message', data);
            this.handleMessage(data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
        };
    }

    private initializeKeydownListener() {
        document.addEventListener('keydown', (event) => {
            const keyData = {
                type: 'movePaddle',
                key: event.key,
            };
            if (keyData.key === 'ArrowRight' || keyData.key === 'ArrowLeft')
                this.socket.send(JSON.stringify(keyData));
        });
    }

    private handleMessage(data) {
        const type = data.event;
        console.log('handle message : ', type);
        switch (type) {
            case 'init_game':
                this.handleInitGame(data);
                break;
            case 'update':
                const stats = data.stats;
                console.log('stats to update: ', stats);
                this.handleUpdate(stats);
                break;
            // Add more cases for other message types
            default:
                console.warn('Unknown message type:', type);
        }
    }

    private handleInitGame(data) {
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;
        const paddles = data.paddles;
        const gameDimensions = data.game;
        const ball = data.ball;

        console.log(`hanndle init game: ${data}`);
        if (!paddles || !gameDimensions || !ball) {
            console.error('Invalid game initialization data:', data);
            return;
        }
        this.game = new Game(context, paddles, ball);
        this.game.render();
    }

    private handleUpdate(stats) {
        // Handle stats update
        console.log('handleUpdate (stats): ', stats);
        if (this.game) {
            this.game.setUpdate(stats);
            this.game.render();
        }
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

    new WebSocketHandler(wsUrl);
}

connect();