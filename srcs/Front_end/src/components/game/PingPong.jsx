import {ColorContext, ThemeContext} from '../../Contexts/ThemeContext'
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faRotate } from '@fortawesome/free-solid-svg-icons';
import { faCirclePause, faImage } from '@fortawesome/free-regular-svg-icons';
import { flushSync } from 'react-dom';

class Ball {
    constructor(context) {
        this.ctx = context;
        this.x;
        this.y;
        this.r = 10;
        this.valocity;
        this.agl;
        this.reset();
        this.direction;
    }
    
    reset () {
        this.x = this.ctx.canvas.width / 2;
        this.y = this.ctx.canvas.height / 2;
        this.agl = Math.random() * (2 * Math.PI);
        while (this.agl <= 0.5 || this.agl >= 0.9) {
            this.agl = Math.random() * 2 * Math.PI;
        }
        this.direction = {x:Math.cos(this.agl), y:Math.sin(this.agl)}
        this.valocity = 0.25;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        this.ctx.fill();
    }

    update(delta) {
        this.x += this.direction.x * delta * this.valocity;
        this.y +=  this.direction.y * delta * this.valocity;
        if (this.x <= 0 || this.x >= this.ctx.canvas.width)
            this.direction.x *= -1;
        this.valocity += 0.0001;
    }
}

class Paddle {
    constructor(context, x, y) {
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 10;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.roundRect(this.x, this.y, this.width, this.height, 6)
        this.ctx.strokeStyle = 'white'
        this.ctx.fill();
    }

    update(newXPos) {
        if (this.x + newXPos < 0)
            this.x += newXPos - (this.x + newXPos);
        else if (this.x + this.width + newXPos > this.ctx.canvas.width)
            this.x += this.ctx.canvas.width - this.x - this.width;
        else
            this.x += newXPos;
    }
}

class Game {
    constructor(context, handler, players) {
        this.handler = handler;
        this.score = players;
        this.width = context.canvas.width;
        this.height = context.canvas.height;
        this.ctx = context;
        this.ctx.translate(0.5, 0.5);
        this.ball = new Ball(context);
        this.paddleA = new Paddle(this.ctx, this.width / 2 - 50 , 5);
        this.paddleB = new Paddle(this.ctx, this.width / 2 - 50 , this.height - 15);
        this.update = this.update.bind(this);
        this.lastTime = null;
        this.isEnded = true;
        this.isPaused = true;
        this.player1_index = 0;
        this.player2_index = players[0].score.length - 1;
        this.step = context.canvas.width / 10
    }

    reduceFunc(total, value) {
        return total + value;
    }

    updateScore(player, index) {
        let score = this.score[player].score
        score[index] = 1;
        this.score[player].score = score;
        this.score[player].total = score.reduce(this.reduceFunc);
        this.handler([...this.score])
        this.ball.reset();
        this.isEnded = this.isLose();
        console.log(this.score[0].total , this.score[1].total)
    }

    isLose() {
        return (this.score[0].total == 3 || this.score[1].total == 3)
    }

    update(time) {
        if (this.lastTime) {
            let delta = time - this.lastTime;
            this.ctx.clearRect(0,0,this.width, this.height);
            if (!this.isEnded && !this.isPaused) {
                this.ball.update(delta);
                if (this.ball.y <= this.paddleA.y + this.paddleA.height && this.ball.x >= this.paddleA.x && this.ball.x <= this.paddleA.x + this.paddleA.width)
                    this.ball.direction.y *= -1;
                else if (this.ball.y >= this.paddleB.y && this.ball.x >= this.paddleB.x && this.ball.x <= this.paddleB.x + this.paddleB.width)
                    this.ball.direction.y *= -1;
                else if (this.ball.y < 0) {
                    this.updateScore(0, this.player1_index)
                    this.player1_index++;
                }
                else if(this.ball.y > this.height) {
                    this.updateScore(1, this.player2_index);
                    this.player2_index--;
                }
            }
        }
        this.lastTime = time;
        this.draw();
    }

    draw() {
        // console.log(this.isEnded)
        this.ctx.strokeStyle = 'white'
        this.ctx.fillStyle = 'white'
        this.ctx.beginPath();
        this.paddleA.draw();
        this.paddleB.draw();
        if (!this.isEnded) {
            this.ball.draw();
            this.ctx.moveTo(0, this.height/2);
            this.ctx.lineTo(this.width, this.height/2);
            this.ctx.stroke();
        }
        window.requestAnimationFrame(this.update);
    }
    
    setup() {
        window.addEventListener('keydown', (e) => {
            if (e.key == 'a')
                this.paddleA.update(this.step * -1);
            else if (e.key == 'd')
                this.paddleA.update(this.step);
            else if (e.key == 'ArrowLeft')
                this.paddleB.update(this.step * -1);
            else if (e.key == 'ArrowRight')
                this.paddleB.update(this.step);
        })
        this.draw();
    }
}

function Score({data}) {
    const color = useContext(ColorContext)
    return (
        <div className="score flex justify-center h-1/8 items-center">
            <div className="h-[50px] w-[400px] rounded-sm bg-darkBg/60 backdrop-blur-lg flex justify-between px-4 items-center">
                <div className=" flex items-center">
                    <div className="mr-4 border-[.3px] w-[30px] h-[30px] flex justify-center items-center rounded-full">
                        <img src="/aamhamdi1.jpeg" className="max-w-full rounded-full max-h-full" alt="" />
                    </div>
                    <div className="text-[14px]">
                        <h1>{data[0].nickname}</h1>
                        <ul style={{accentColor:color}} className='flex justify-evenly'>
                            {data[0].score.map((s, index) => <li key={index}><input  onChange={() => {}} className=' h-[10px]' type='radio' checked={s} /></li>)}
                        </ul>
                    </div>
                </div>
                <div className="score text-center">
                    <div className="time">{data[0].total} | {data[1].total}</div>
                </div>
                <div className=" flex items-center">
                    <div className="text-[14px] text-right">
                        <h1>{data[1].nickname}</h1>
                        <ul style={{accentColor:color}} className='flex justify-evenly'>
                            {data[1].score.map((s, index) => <li key={index}><input  onChange={() => {}} className='h-[10px]' type='radio' checked={s} /></li>)}
                        </ul> 
                    </div>
                    <div className="ml-4 border-[.3px] w-[30px] h-[30px] flex justify-center items-center rounded-full">
                        <img src="/aamhamdi1.jpeg" className="max-w-full rounded-full max-h-full" alt="" />
                    </div>
                </div> 
            </div>
        </div>
    )
}

const players = [
    {id:0, nickname:'aamhamdi', name:'player1', total : 0 , score:[0,0,0]},
    {id:1, nickname:'nmaazouz', name:'player2', total : 0, score:[0,0,0]},
]


function PlayerWon({Restarthandler, quitHandler}) {
    const color = useContext(ColorContext)
    return (
        <div className='absolute z-10 text-center bg-darkBg/50 backdrop-blur-md p-2 flex justify-center items-center w-[50%] h-[200px] rounded-sm top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            <div>
                <h1 className='text-[40px] uppercase mb-10'>you win</h1>
                <div className="actions text-[15px] p-1 flex justify-center mt-10">
                    <button style={{background:color}} className='p-1 h-[35px] rounded-sm capitalize mr-2 w-[90px]' onClick={Restarthandler}>restart</button>
                    <button style={{background:color}} className='p-1 h-[35px] capitalize rounded-sm mr-2 w-[90px]' onClick={quitHandler}>Quit</button>
                </div>
            </div>
        </div>
    )
}


function ActionsMenu({rotateHandler, pauseHandler}) {
    return (
        <>
            <div className='bg-darkBg/50 backdrop-blur-md text-[16px] w-14 rounded-sm h-[170px] absolute right-0 top-0 flex justify-center items-center'>
                <ul>
                    <li className='text-center'><FontAwesomeIcon icon={faClose} /></li>
                    <li className='mt-4 text-center' onClick={rotateHandler}><FontAwesomeIcon icon={faRotate}/></li>
                    <li className='mt-4 text-center'><FontAwesomeIcon  icon={faImage}/></li>
                    <li className='mt-4 text-center' onClick={pauseHandler} ><FontAwesomeIcon  icon={faCirclePause}/></li>
                </ul>
            </div>
        </>
    )
}

function ScorePoints({player}) {

    const color = useContext(ColorContext)

    return (
        <>
            <div className=' absolute top-[50%] right-20 translate-y-[-50%] flex justify-center'>
                <div >
                    <ul style={{accentColor:color}} className='w-10'>
                    {player.map(p => p.score.map((item, index) => <li key={index}><input type="radio" onChange={() => {}} checked={item} /></li>))}
                    </ul>
                </div>
            </div>
        </>
    )
}


export default function PingPong() {
    let interval;
    const theme = useContext(ThemeContext)
    const canvasRef = useRef(null);
    const canvaParentRef = useRef(null);
    const gameRef = useRef(null);
    const [player, setPlayer] = useState(players);
    const [restart, setRestart] = useState(false);
    const [deg, setDeg] = useState(90);
    const navigate = useNavigate();
    const [isStarted, setIsStarted] = useState(false)
    const [startStatus, setStartStatus] = useState(3)

    function resetHandler() {
        setPlayer([{...player[0], total:0, score:[0,0,0]},{...player[1], total:0, score:[0,0,0]}])
        setRestart(!restart);
    }
    
    function quitHandler() {
        navigate('/dashboard/game');
    }

    function rotateHandler() {
        flushSync(() => {
            gameRef.current.isPaused = true
            setDeg(prev => (prev + 90))
        })
        canvaParentRef.current.style = `transform: rotateZ(${deg}deg)`
    }

    function pauseHandler() {
        gameRef.current.isPaused = !gameRef.current.isPaused
    }

    function start_handler() {
        interval = setInterval(() => {
            setStartStatus(prev => prev == 1 ? 'ready ?' : prev - 1)
        }, 1000);
    } 

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         let rect = canvaParentRef.current.getBoundingClientRect()
    //         canvasRef.current.width = rect.width
    //         canvasRef.current.height = rect.height
    //         window.addEventListener('resize', () => {
    //             if (gameRef.current.isPaused) {
    //                 rect = canvaParentRef.current.getBoundingClientRect()
    //                 canvasRef.current.width = rect.width
    //                 canvasRef.current.height = rect.height
    //                 setRestart(!restart)
    //             }
    //         })
    //     }, 100)

    //     return (() => {
    //         clearTimeout(timer)
    //     })
    // }, [])
    
    useEffect(() => {
        const  ctx = canvasRef.current.getContext("2d");
        const timer = setTimeout(() => {
            gameRef.current = new Game(ctx, setPlayer, player);
            gameRef.current.setup();
            setTimeout(() => {
                gameRef.current.isEnded = false;
                gameRef.current.isPaused = false
                setIsStarted(true)
                setStartStatus(3)
                clearInterval(interval)
            }, 4000)
            start_handler()
        }, 500)
        
        return () => {
            clearTimeout(timer);
            setPlayer([{...player[0], total:0, score:[0,0,0]},{...player[1], total:0, score:[0,0,0]}])
            delete gameRef.current;
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            setIsStarted(false)
        }
    } , [restart])

    return (
        <div className={`${theme === 'light' ? " text-lightText" : " text-darkText"} bg-pong bg-cover w-full h-[90vh] mt-2  p-2`}>
            <div className={`h-full relative `}>
                <ActionsMenu rotateHandler={rotateHandler} pauseHandler={pauseHandler} />
                <Score data={player} /> 
                {
                    (player[0].total == 3 || player[1].total == 3) &&
                    <PlayerWon quitHandler={quitHandler} Restarthandler={resetHandler} />
                }
                <div className={`flex justify-center items-center mt-2 h-[80vh]`}>
                    {
                        !isStarted && 
                        <div className='absolute text-[80px] font-kaushan uppercase transition-all p-2 text-center h-fit text-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-30'>
                            <h1 className=''>{startStatus}</h1>
                        </div>
                    }
                    <div ref={canvaParentRef} className={` ${theme === 'light' ? "border-lightText" : "border-darkText"} rounded-sm w-8/12 flex justify-center items-center h-5/6 relative transition-transform duration-1000`}>
                        {/* <ScorePoints player={player} /> */}
                        <canvas className={` border-[1px] bg-black/30 rounded-sm backdrop-blur-md`} width="350px" height="530px" ref={canvasRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    )
}