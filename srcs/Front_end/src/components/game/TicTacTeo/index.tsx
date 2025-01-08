import { UserContext } from "@/Contexts/authContext"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { ticTacTeoSocket } from "@/socket"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"


function GameCardItem({cell} : {cell : string}) {

    const {theme} = useContext(ApearanceContext) || {}

   

    return (
        <div className={`w-full h-full cursor-pointer ${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} flex justify-center items-center text-3xl`}> 
            <p>{cell}</p>
        </div>
    )
}


function Players({data, current} : {data : any, current : any}) {

    const { color } = useContext(ApearanceContext) || {}

    return (
        <div className="w-full h-[100px] rounded p-4">
            <div className="flex w-full relative justify-between items-center h-full">
                <div style={{background : color, color : "white"}} className="w-[200px] pl-4 rounded h-full justify-start flex items-center">
                    <img className="w-[50px] h-[50px] mr-4 rounded-full" src={data[0]?.profile?.avatar} />
                    <div className="flex flex-col items-start justify-center">
                        <p className="text-sm font-bold">{data[0]?.username}</p>
                        <p className="text-xs mt-1 uppercase">Player X</p>
                    </div>
                    <h1 style={{color : color}} className="absolute uppercase text-xs top-[-40px]">player x play now</h1>
                </div>
                <div className="w-[200px] h-full flex justify-end items-center">
                    <div className="flex flex-col items-end justify-center">
                        <p className="text-sm font-bold">{data[1]?.username}</p>
                        <p className="text-xs mt-1 uppercase">Player O</p>
                    </div>
                    <img className="w-[50px] h-[50px] ml-4 rounded-full" src={data[1]?.profile?.avatar} />
                </div>
            </div>
        </div>
    )
}


export default function TicTacTeo() {

    const { theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [grid, setGrid] = useState(null)

    
    const { game_id } = useParams()


    useEffect(() => {
        const timer = setTimeout(() => {
            ticTacTeoSocket.addCallback("init", setGrid)
            ticTacTeoSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/game/tic-tac-teo/play/${game_id}/?token=${authInfos?.accessToken}`)
        }, 300)

        return () => {
            clearTimeout(timer)
        }

    }, [])

    function test(y, x) {
        ticTacTeoSocket.sendMessage({
            "event" : "action",
            x,
            y
        })
    }

  

    
    
    if (!grid) {
        return (
            <div>loading ....</div>
        )
    }
    
    const {players, user, board} = grid
    
    return (
        <div className={`p-2 rounded w-full h-full flex flex-row justify-center items-center ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} mt-2`}>
            
            <div className="w-[500px] h-[400px] p-2 translate-y-[-40%]">
                <Players data={players} current={user} />
                <div className="w-full h-full mt-32 p-4">
                    <ul className={`grid grid-cols-1 ${theme === 'light' ? "bg-darkItems" : "bg-lightItems"} h-full gap-1`}>
                        {
                            board.map((row, i) => {
                                return (
                                    <li key={i} className="h-full">
                                        <ul className="grid h-full grid-cols-3 gap-1">
                                            {
                                                row.map((cell, j) => {
                                                    return (
                                                        <li onClick={() => test(i, j)} key={j} className="h-full">
                                                            <GameCardItem cell={cell} />
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </li>
                                )
                            })
                        }   
                    </ul>
                </div>
            </div>
        </div>
    )
}