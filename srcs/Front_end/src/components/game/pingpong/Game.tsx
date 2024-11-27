
import Socket from "../../../socket";

class Ball {
    ctx: any;
    r: number;
    
    constructor(context) {
        this.ctx = context;
        this.r = 25;
    }
    
    draw(x, y) {
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, this.r, this.r, 25)
        this.ctx.strokeStyle = 'white'
        this.ctx.fill();
    }
}

class Paddle {
    ctx: any;
    width: number;
    height: number;

    constructor(context) {
        this.ctx = context;
        this.width = 10;
        this.height = 60;
    }

    draw(y, x) {
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, this.width, this.height, 6)
        this.ctx.strokeStyle = 'white'
        this.ctx.fill();
    }
}


export default class Game {
    width: any;
    height: any;
    ctx: any;
    ball: Ball;
    paddleA: Paddle;
    paddleB: Paddle;
    lastTime: null;
    step: number;
    scoreHandler: any;
    data: null;
    constructor(context, scoreHandler) {

        this.width = context.canvas.width;
        this.height = context.canvas.height;
        this.ctx = context;
        this.ball = new Ball(this.ctx);
        this.paddleA = new Paddle(this.ctx);
        this.paddleB = new Paddle(this.ctx);
        this.lastTime = null;
        this.step = context.canvas.width / 10
        this.scoreHandler = scoreHandler
        this.data = null
    }

    draw() {
        this.ctx.clearRect(0,0, this.width, this.height);
        this.ctx.strokeStyle = 'white'
        this.ctx.fillStyle = 'white'
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        // console.log(this.data)
        if (this.data) {
            this.paddleA.draw(this.data.pay, 4);
            this.paddleB.draw(this.data.pby, this.width - 14);
            this.ball.draw(this.data.bx, this.data.by)
        }
    }

    handler(e) {
        switch (e.key) {
            case 'a':
                Socket.sendMessage({"event":"control", "action" : "p1_left"})
                break;
            case 'd':
                Socket.sendMessage({"event":"control", "action" : "p1_right"})
                break;
            case 'ArrowLeft':
                Socket.sendMessage({"event":"control", "action" : "p2_left"})
                break;
            case 'ArrowRight':
                Socket.sendMessage({"event":"control", "action" : "p2_right"})
                break;
            default:
                break;
        }   
    }
    
    setup(data) {
        // Socket.addCallback("setInitData", (data) => {
        //     this.data = data
        //     // self.data = data
        //     // this.scoreHandler([data.players.player1, data.players.player2])
        // })
        this.data = data
        this.draw();
        document.addEventListener('keydown', this.handler)
    }
}