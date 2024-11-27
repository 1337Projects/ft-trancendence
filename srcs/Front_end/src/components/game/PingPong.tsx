
import React, { useContext, useEffect, useRef, useState } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import Socket from "../../socket";
import Game from "./pingpong/Game";
import Score from "./pingpong/Score";

import MyUseEffect from "../../hooks/MyUseEffect"


export default function PingPong() {

    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const canvaParentRef = useRef<null | HTMLDivElement>(null);
    const gameRef = useRef<null | Game>(null);
    const [data, setData] = useState(null);
    
    // let interval;
    // const [result, setResult] = useState(null)
    // const [restart, setRestart] = useState(false);
    // const [deg, setDeg] = useState(90);
    // const navigate = useNavigate();
    // const [isStarted, setIsStarted] = useState(false)
    // const [startStatus, setStartStatus] = useState(3)

    // function quitHandler() {
    //     Socket.close()
    //     navigate('/dashboard/game');
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
        const timer = setTimeout(() => {
            Socket.addCallback("setInitData", setData)
            setTimeout(() => {
                Socket.sendMessage({"event" : "get_init_data"})
            }, 1000)
        }, 300)

        return ()  => {
            clearTimeout(timer)
        }
    }, [])

    



    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('rebuild')
            if (canvasRef.current && data) {
                const  ctx = canvasRef?.current?.getContext("2d");
                gameRef.current = new Game(ctx, setData);
                gameRef.current.setup(data)
            }
            // Socket.addCallback("resultHandler", setResult)
        }, 50)

        return () =>  {
            // delete gameRef.current;
            gameRef.current = null
            clearTimeout(timer)
        }
    }, [data])

    const { theme } = useContext(ApearanceContext) || {}

    return (
            <div className={`relative ${theme === 'light' ? " text-lightText bg-lightItems" : " text-darkText bg-darkItems"}  flex justify-center items-center rounded-none w-full h-[100vh] mt-2 p-2`}>
                <div className={`h-fit`}>
                    
                    {/* <ActionsMenu rotateHandler={rotateHandler} pauseHandler={pauseHandler} /> */}
                    {
                        <div>
                            <div className='flex justify-center'>
                                <Score data={data} /> 
                            </div>
                            <div className={`flex justify-center items-center mt-10 h-fit`}>
                                {/* {
                                    !isStarted && 
                                    <div className='absolute text-[80px] font-kaushan uppercase transition-all p-2 text-center h-fit text-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-30'>
                                    <h1 className=''>{startStatus}</h1>
                                    </div>
                                } */}
                                <div ref={canvaParentRef} className={` ${theme === 'light' ? "border-lightText" : "border-darkText"} rounded-sm w-full flex justify-center items-center h-5/6 relative transition-transform duration-1000`}>
                                    <div className=''>
                                        <canvas className={`border-[.1px] border-white/50 mr-10 bg-black/30 rounded-sm backdrop-blur-md w-full`} width="600px" height="400px" ref={canvasRef}></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div> 
            </div> 
    )
}
