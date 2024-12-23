class Paddle {
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private x: number;
    private _y: number;
    private paddleNum: number;

    constructor(context: CanvasRenderingContext2D, num: number, paddles: { width: number, height: number, paddle1: number, paddle2: number }) {
        this.context = context;
        this.width = paddles.width;
        this.height = paddles.height;
        this.paddleNum = num;
        if (num === 1) {
            this.x = 0;
            this._y = paddles.paddle1;
        } else {
            this.x = context.canvas.width - this.width;
            this._y = paddles.paddle2;
        }
    }
    
    public render() {
        console.log('x: ', this.x, 'y: ', this._y);
        this.context.fillStyle = 'black';
        this.context.fillRect(this.x, this._y - (this.height / 2), this.width, this.height);
    }

    public set Y(y: number) {
        console.log('setY y: ', y);
        this._y = y;
    }

    public get Y(): number {
        return this._y;
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

    public set(ball: {x, y}) {
        this.x = ball.x;
        this.y = ball.y;
    }
}

class Game {
    private context: CanvasRenderingContext2D;
    private ball: Ball;
    private paddle1: Paddle;
    private paddle2: Paddle;
    private paddleMove: number;

    constructor(context: CanvasRenderingContext2D, paddles: { width: number, height: number, paddle1: number, paddle2: number }, ball: any) {
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

    setUpdate(stats: { paddle1: number, paddle2: number , ball : {x, y}}): void {
        // set stats of paddle1 and paddle2
        console.log('setUpdate (stats): ', stats);
        this.paddle1.Y = stats.paddle1;
        this.paddle2.Y = stats.paddle2;
        this.ball.set(stats.ball);
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
            if (keyData.key === 'ArrowUp' || keyData.key === 'ArrowDown')
                this.socket.send(JSON.stringify(keyData));
        });
    }

    private handleMessage(data) {
        const type = data.event;
        console.log('handle message : ', type);
        switch (type) {
            case 'init_game':
                const {type, event, ...init_data} = data;
                console.log('case init_game init_datat', init_data);
                this.handleInitGame(init_data);
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

    private handleInitGame(data: { paddles, game, ball}) {
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;
        const paddles = data.paddles;
        const gameDimensions = data.game;
        const ball = data.ball;

        console.log('hanndle init game:', data);
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