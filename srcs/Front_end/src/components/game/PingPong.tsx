
import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from '../../Contexts/authContext'
import { gameSocket, tournamentSocket } from "../../socket";
import Game from "./pingpong/Game";
import Score from "./pingpong/Score";

import MyUseEffect from "../../hooks/MyUseEffect"
import {PlayerWon} from './pingpong/Winner'


export default function PingPong() {

    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const canvaParentRef = useRef<null | HTMLDivElement>(null);
    const gameRef = useRef<null | Game>(null);
    const [data, setData] = useState(null);
    const { id } = useParams()
    const { authInfos } = useContext(UserContext) || {}
    const navigate = useNavigate()
    const [ closed, setClosed ] = useState(false)

    useEffect(() => {
        
        const timer = setTimeout(() => {
            gameSocket.connect(`ws://localhost:8000/ws/game/play/${id}/?token=${authInfos?.accessToken}`)
            gameSocket.addCallback("setInitData", setData)
            // gameSocket.addCallback("closeHandler", setClosed)
        }, 200)

        return () => {
            clearTimeout(timer)
            gameSocket.close()
        }
    }, [])

    const quiteHandler = () => {
        navigate(`/dashboard/game/tournment/1/remote`)
        tournamentSocket.sendMessage({"event" : "upgrade", "winner_id" : data.players.player1.user.id})
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('rebuild')
            if (canvasRef.current && data) {
                const  ctx = canvasRef?.current?.getContext("2d");
                gameRef.current = new Game(ctx, setData);
                gameRef.current.setup(data)
                if (data.ended) {
                    gameSocket.close()
                    setClosed(true)
                }
            }
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
                <div className={`relative h-fit`}>
                    
                    {/* <ActionsMenu rotateHandler={rotateHandler} pauseHandler={pauseHandler} /> */}

                    {
                        closed && <div className="w-full bg-white/20 backdrop-blur-lg h-[500px] absolute z-10 p-2">
                            <PlayerWon quitHandler={quiteHandler} data={data} />
                        </div>
                    }
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

