
import React, { useContext, useEffect, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { gameSocket } from "@/sockets/gameSocket";
import { useParams } from "react-router-dom";
import { UserContext } from "@/Contexts/authContext";
import Canvas from "./Canvas";

export interface GameType {
    paddles: never; // Replace 'any' with the actual type
    game: never;   // Replace 'any' with the actual type
    ball: never;    // Replace 'any' with the actual type
}

function PingPong() {
    const { game_id }= useParams();
    const { authInfos } = useContext(UserContext) || {}
    const [ game, setGame] = useState<GameType | null>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            gameSocket.connect(`ws://localhost:8000/ws/game/${game_id}/?token=${authInfos?.accessToken}`);
            gameSocket.addCallback("init", init);
        }, 200);

        return () => {
            clearTimeout(timer);
            gameSocket.close();
        };
    }, [game_id, authInfos]);

    function init(data: never) {
        console.log('init functions with :', data);
        const {paddles, game, ball} = data;
        console.log('init function with : ', { paddles, game, ball });
        const game_data = { paddles, game, ball };
        console.log('game data: ', game_data);
        setGame(game_data);
    }


    
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (canvasRef.current && data) {
    //             const  ctx = canvasRef?.current?.getContext("2d");
    //             gameRef.current = new Game(ctx, setData);
    //             gameRef.current.setup(data)
    //             if (data.ended) {
    //                 gameSocket.close()
    //                 setClosed(true)
    //                 setTimeout(() => {
    //                     tournamentSocket.sendMessage({"event" : "upgrade", "winner_id" : data.winner})
    //                     if (tournament_id) {
    //                         navigate(`/dashboard/game/tournment/${tournament_id}/`)
    //                     } else {
    //                         navigate(`/dashboard/game/`)
    //                     }
    //                 }, 2000)
    //             }
    //         }
    //     }, 50)

    //     return () =>  {
    //         // delete gameRef.current;
    //         gameRef.current = null
    //         clearTimeout(timer)
           
    //     }
    // }, [data])

    const { theme } = useContext(ApearanceContext) || {}

    return (
            <div className={`relative ${theme === 'light' ? " text-lightText bg-lightItems" : " text-darkText bg-darkItems"}  flex justify-center items-center rounded-none w-full h-[100vh] mt-2 p-2`}>
                <div className={`relative h-fit`}>
                    {/* {
                        closed && 
                        <h1 
                            className="bg-black/20 h-[150px] flex justify-center items-center absolute z-10 w-full top-[50%] translate-y-[-50%]"
                        > 
                            <h1 className="text-[30pt] font-bold uppercase">{data.winner == user.id ? "victory" : "ko"} </h1>
                        </h1>
                    } */}
                    <div>
                        <div className='flex justify-center'>
                            {/* <Score data={data} />  */}
                        </div>
                        <div className={`flex justify-center items-center mt-10 h-fit`}>
                            {/* {
                                !isStarted && 
                                <div className='absolute text-[80px] font-kaushan uppercase transition-all p-2 text-center h-fit text-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-30'>
                                <h1 className=''>{startStatus}</h1>
                                </div>
                            } */}
                            { game && <Canvas game={game}/>}
                            {/* <div ref={canvaParentRef} className={` ${theme === 'light' ? "border-lightText" : "border-darkText"} rounded-sm w-full flex justify-center items-center h-5/6 relative transition-transform duration-1000`}>
                                <div className=''>
                                    <canvas className={`border-[.1px] border-white/50 mr-10 bg-black/30 rounded-sm backdrop-blur-md w-full`} width="600px" height="400px" ref={canvasRef}></canvas>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div> 
            </div> 
    )
}

export default PingPong;