import {ColorContext, ThemeContext} from '../../Contexts/ThemeContext'
import { useContext, useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faRotate, faStar } from '@fortawesome/free-solid-svg-icons';
import { faCirclePause, faImage } from '@fortawesome/free-regular-svg-icons';
import Socket from '../../socket'
import {authContext} from '../../Contexts/authContext'
import { useNavigate } from 'react-router-dom';

class Ball {
    constructor(context) {
        this.ctx = context;
        this.r = 12;
    }
    
    draw(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.r, 0, 2*Math.PI)
        this.ctx.fill();
    }
}

class Paddle {
    constructor(context) {
        this.ctx = context;
        this.width = 80;
        this.height = 10;
    }

    draw(x, y) {
        this.ctx.beginPath();
        this.ctx.roundRect(x * 2, y, this.width, this.height, 6)
        this.ctx.strokeStyle = 'white'
        this.ctx.fill();
    }
}

class Game {
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
        this.ctx.moveTo(0, this.height/2);
        this.ctx.lineTo(this.width, this.height/2);
        this.ctx.stroke();
        this.paddleA.draw(self.data.pax, 5);
        this.paddleB.draw(self.data.pbx, this.height - 15);
        this.ball.draw(self.data.bx * 2, self.data.by * 2)
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
    
    setup() {
        Socket.addCallback("setInitData", (data) => {
            self.data = data
            this.scoreHandler([data.players.player1, data.players.player2])
            this.draw();
        })
        document.addEventListener('keydown', this.handler)
    }
}

function Score({data}) {
    const color = useContext(ColorContext)
    if (!data.length) {
        return (<></>)
    }
    let rows = []
    for (let index = 0; index < 7; index++) {
        rows.push(<Radio key={index} checked={index < data[0].score} />)
    }
    let rows1 = []
    for (let index = 0; index < 7; index++) {
        rows1.push(<Radio key={index} checked={index < data[1].score} />)
    }
    rows1.reverse()

    function test(f) {
		return Math.ceil(((f < 1.0) ? f : (f % Math.floor(f))) * 100)
	}
    
    return (
        <div className="score flex justify-center h-[100px] items-center">
            <div className="h-full w-[400px] flex justify-between items-center">
                <div className='h-[100px]'>
                    <div className=" flex items-center p-2 rounded-full border-[0px] border-white/30">
                        <div className="mr-4 border-[.3px] w-[40px] h-[40px] flex justify-center items-center rounded-full">
                            <img src={data[0]?.user?.profile?.image} className="bg-white max-w-full rounded-full max-h-full" alt="" />
                        </div>
                        <div className="text-[14px] relative">
                            <h1 className='text-[13px]'>{data[0]?.user?.username}</h1>
                                {/* <h1 className=' text-[10px]'>LVL</h1> */}
                            <div className='bg-white rounded-full mt-2 h-2 w-[80px]'>
                                <div style={{width : `${test(data[0].user.profile.level)}%`, background:color}} className='rounded-full h-full'></div>
                            </div>
                        </div>
                    </div>
                    <ul style={{accentColor:color}} className='flex w-[160px] justify-evenly mt-2 rounded-full'>{rows}</ul>
                </div>
                <div className="score text-center">
                    <div className="time">{data[0]?.score} / {data[1]?.score}</div>
                </div>
                <div className='relative h-[100px]'>
                    <div className=" flex items-center p-2 rounded-full border-[0px] border-white/30">
                        <div className="text-[14px] text-right">
                            <h1>{data[1]?.user?.username}</h1>
                            <div className='bg-white rounded-full mt-2 h-2 w-[80px] relative'>
                                <div style={{width : `${test(data[1].user.profile.level)}%`, background:color}} className='rounded-full h-full absolute right-0'></div>
                            </div>
                        </div>
                        <div className="ml-4 border-[.3px] w-[40px] h-[40px] flex justify-center items-center rounded-full">
                            <img src={data[1]?.user?.profile?.image} className="bg-white max-w-full rounded-full max-h-full" alt="" />
                        </div>
                    </div> 
                    <ul style={{accentColor:color}} className='flex w-[160px]  justify-evenly absolute right-0 rounded-full p-1'>{rows1}</ul>
                </div>
            </div>
        </div>
    )
}




function PlayerWon({quitHandler, data}) {
    const color = useContext(ColorContext)
    const auth = useContext(authContext)
    return (
        <div className=' border-white/30 z-10  top-0 left-0 w-full h-full'>
            <div className='w-[80%] min-w-[500px]  h-[500px] ml-[50%]  border-white/20 translate-x-[-50%]'>
                <div className='h-[140px] flex p-4'>
                    {
                            data?.winner?.user?.username == auth?.username ? 
                            <div className='w-full h-fit p-6'>
                                <h1 className='text-[30px] uppercase font-bold'>congratulations !</h1>
                                <p className='mt-2 text-[11px] capitalize w-[270px]'>you are the winner you did well, goo game, plase go show them your skills again</p>
                            </div>
                            :
                            <div className='w-full h-fit p-10'>
                                <h1 className='text-[30px] uppercase font-bold'>unfortunately !</h1>
                                <p className='mt-2 text-[11px] capitalize w-[270px]'>you couldnt do it this time , u did play well but unlucky plase go show them ur real skills</p>
                            </div>
                    }
                    {/* <div>
                        <FontAwesomeIcon icon={faClose} />
                    </div> */}
                </div>
                <div className='flex  w-full'>
                    <div className='w-1/2 p-10 flex justify-center items-center text-center'>
                        <div className='w-[50%]'>
                            <img src={data?.winner?.user?.profile?.image} className='w-[80px] border-[1px] ml-[50%] translate-x-[-50%] rounded-full' alt="" />
                            <h1 className='mt-2'>{data?.winner?.user?.username}</h1>
                            <div className='my-2'>
                                <ul className='flex justify-center text-orange-300'>
                                    <li><FontAwesomeIcon icon={faStar} /></li>
                                    <li><FontAwesomeIcon icon={faStar} /></li>
                                    <li><FontAwesomeIcon icon={faStar} /></li>
                                    <li><FontAwesomeIcon icon={faStar} /></li>
                                    <li><FontAwesomeIcon icon={faStar} /></li>
                                </ul>
                            </div>
                            <h1 className='my-2'>+ {auth.username == data?.winner?.user?.username ? "100" : "10"}px</h1>
                            <button style={{background:color}} onClick={quitHandler} className='my-8 w-full rounded-full uppercase h-[40px]'>quit</button>
                        </div>
                    </div>
                    <div className='w-1/2 h-full flex items-center p-8'>
                        {
                            data?.winner?.user?.username == auth.username ? 
                            <div>
                                <img src="/wiin.svg" alt="" />
                            </div> 
                            :
                            <div>
                                <img src="/loos.svg" alt="" />
                            </div>
                        }
                    </div>
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

function Radio({checked}) {
    return (
        <li><input type="radio" onChange={() => {}} checked={checked} /></li>
    )
}


export default function PingPong() {
    const theme = useContext(ThemeContext)
    const canvasRef = useRef(null);
    const canvaParentRef = useRef(null);
    const gameRef = useRef(null);
    
    // let interval;
    const [player, setPlayer] = useState([]);
    const [result, setResult] = useState(null)
    // const [restart, setRestart] = useState(false);
    // const [deg, setDeg] = useState(90);
    const navigate = useNavigate();
    // const [isStarted, setIsStarted] = useState(false)
    // const [startStatus, setStartStatus] = useState(3)

    // function resetHandler() {
    //     setPlayer([{...player[0], total:0, score:[0,0,0]},{...player[1], total:0, score:[0,0,0]}])
    //     setRestart(!restart);
    // }
    
    function quitHandler() {
        Socket.close()
        navigate('/dashboard/game');
    }

    // function rotateHandler() {
    //     flushSync(() => {
    //         gameRef.current.isPaused = true
    //         setDeg(prev => (prev + 90))
    //     })
    //     canvaParentRef.current.style = `transform: rotateZ(${deg}deg)`
    // }

    // function pauseHandler() {
    //     gameRef.current.isPaused = !gameRef.current.isPaused
    // }

    // function start_handler() {
    //     interval = setInterval(() => {
    //         setStartStatus(prev => prev == 1 ? 'ready ?' : prev - 1)
    //     }, 1000);
    // } 

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
    
    // useEffect(() => {
    //     Socket.connect("ws://localhost:8000/ws/game/abc/")
    //     const  ctx = canvasRef.current.getContext("2d");
    //     const timer = setTimeout(() => {
    //         gameRef.current = new Game(ctx, setPlayer, player);
    //         gameRef.current.setup();
    //         setTimeout(() => {
    //             gameRef.current.isEnded = false;
    //             gameRef.current.isPaused = false
    //             setIsStarted(true)
    //             setStartStatus(3)
    //             clearInterval(interval)
    //         }, 4000)
    //         start_handler()
    //     }, 500)
        
    //     return () => {
    //         clearTimeout(timer);
    //         setPlayer([{...player[0], total:0, score:[0,0,0]},{...player[1], total:0, score:[0,0,0]}])
    //         delete gameRef.current;
    //         ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
    //         setIsStarted(false)
    //     }
    // } , [restart])


    useEffect(() => {
        const  ctx = canvasRef?.current?.getContext("2d");
        const timer = setTimeout(() => {
            gameRef.current = new Game(ctx, setPlayer);
            gameRef.current.setup()
            Socket.addCallback("resultHandler", setResult)
        }, 50)

        return () =>  {
            delete gameRef.current;
            gameRef.current = null
            clearTimeout(timer)
        }
    }, [])

    return (
        <div className={`relative ${theme === 'light' ? " text-lightText" : " text-darkText"}  flex justify-center items-center bg-cover rounded-none bg-darkItems w-full h-[100vh] mt-2 p-2`}>
            <div className={`h-fit`}>
                
                {/* <ActionsMenu rotateHandler={rotateHandler} pauseHandler={pauseHandler} /> */}
                {
                    result ?
                    <PlayerWon quitHandler={quitHandler} data={result} />
                    :
                    <div>
                        <div className='flex justify-center'>
                            <Score data={player} /> 
                        </div>
                        <div className={`flex justify-center items-center mt-10 h-fit`}>
                            {/* {
                                !isStarted && 
                                <div className='absolute text-[80px] font-kaushan uppercase transition-all p-2 text-center h-fit text-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-30'>
                                <h1 className=''>{startStatus}</h1>
                                </div>
                            } */}
                            <div ref={canvaParentRef} className={` ${theme === 'light' ? "border-lightText" : "border-darkText"} rounded-sm w-8/12 flex justify-center items-center h-5/6 relative transition-transform duration-1000`}>
                                <div className=''>
                                    <canvas className={`border-[.1px] border-white/50 mr-10 bg-black/30 rounded-sm backdrop-blur-md`} width="400px" height="600px" ref={canvasRef}></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}