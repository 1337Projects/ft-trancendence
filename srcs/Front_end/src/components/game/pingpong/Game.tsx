

class Paddle {
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private x: number;
    private _y: number;
    // private paddleNum: number;

    constructor(context: CanvasRenderingContext2D, num: number, paddles: { width: number, height: number, paddle1: number, paddle2: number }) {
        this.context = context;
        this.width = paddles.width;
        this.height = paddles.height;
        // this.paddleNum = num;
        if (num === 1) {
            this.x = 6;
            this._y = paddles.paddle1;
        } else {
            this.x = context.canvas.width - this.width - 6;
            this._y = paddles.paddle2;
        }
    }
    
    public render() {
        // console.log('x: ', this.x, 'y: ', this._y);
        this.context.fillStyle = 'white';
        this.context.beginPath()
        this.context.roundRect(this.x, this._y - (this.height / 2), this.width, this.height, 5);
        this.context.fill();
    }

    public set Y(y: number) {
        // console.log('setY y: ', y);
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

    constructor(context: CanvasRenderingContext2D, ball: {x: number, y: number}) {
        this.context = context;
        this.x = ball.x;
        this.y = ball.y;
    }

    public render() {
        // Draw the ball
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = 'white';
        this.context.fill();
        this.context.closePath();
    }

    public set(ball: {x : number, y : number}) {
        this.x = ball.x;
        this.y = ball.y;
    }
}

export class Game {
    private context: CanvasRenderingContext2D;
    private ball: Ball;
    private paddle1: Paddle;
    private paddle2: Paddle;
    // private paddleMove: number;

    constructor(context: CanvasRenderingContext2D, paddles: { width: number, height: number, paddle1: number, paddle2: number }, ball: {x : number, y : number}) {
        this.context = context;
        this.ball = new Ball(context, ball);
        this.paddle1 = new Paddle(context, 1, paddles);
        this.paddle2 = new Paddle(context, 2, paddles);
        // this.paddleMove = 10;
    }

    renderNet() {
        const netWidth = 10;
        const netHeight = 2;
        const netColor = 'white';
        const canvasHeight = this.context.canvas.height;
        const canvasWidth = this.context.canvas.width;

        this.context.fillStyle = netColor;
        
        // for (let i = 0; i <= canvasWidth; i += 15) {
        //     this.context.fillRect(i, canvasHeight / 2 - netHeight / 2, netWidth, netHeight);
        // }
        
        // render i line with the midle of x ray.
        for (let i = 0; i <= canvasHeight; i += 15) {
            this.context.fillRect(canvasWidth / 2 - netHeight / 2, i, netHeight, netWidth);
        }
    }

    setUpdate(stats: { paddle1: number, paddle2: number , ball : {x : number, y : number}}): void {
        // set stats of paddle1 and paddle2
        // console.log('setUpdate (stats): ', stats);
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
