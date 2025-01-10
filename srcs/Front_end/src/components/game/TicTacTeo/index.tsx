import { UserContext } from "@/Contexts/authContext"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { ticTacTeoSocket } from "@/socket"
import { useContext, useEffect, useState } from "react"
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom"


function GameCardItem({cell} : {cell : string}) {

    const {theme} = useContext(ApearanceContext) || {}

   

    return (
        <div className={`w-full h-full cursor-pointer rounded ${theme === 'light' ? "bg-lightItems" : "bg-darkItems/60 backdrop-blur-md"} flex justify-center items-center text-3xl`}> 
            <p>{cell}</p>
        </div>
    )
}


function Players({data, current} : {data : any, current : any}) {

    const { color } = useContext(ApearanceContext) || {}

    const activeStyle = {
        background : color, color : "white"
    }

    return (
        <div className="w-full h-[100px] rounded p-4">
            <div className="flex w-full relative justify-between items-center h-full">
                <div 
                    style={current.username === data[0].username ? activeStyle : {}} 
                    className="w-[200px] pl-4 rounded h-full justify-start flex items-center"
                >
                    <img className="w-[50px] h-[50px] mr-4 rounded-full" src={data[0]?.profile?.avatar} />
                    <div className="flex flex-col items-start justify-center">
                        <p className="text-sm font-bold">{data[0]?.username}</p>
                        <p className="text-xs mt-1 uppercase">Player X</p>
                    </div>
                    {
                        current.username === data[0].username && 
                        <h1 style={{color : color}} className="absolute uppercase left-2 text-xs top-[-40px]">player x play now</h1>
                    }
                </div>
                <div 
                    style={current.username === data[1].username ? activeStyle : {}}  
                    className="w-[200px] pr-4 rounded h-full flex justify-end items-center"
                >
                    <div className="flex flex-col items-end justify-center">
                        <p className="text-sm font-bold">{data[1]?.username}</p>
                        <p className="text-xs mt-1 uppercase">Player O</p>
                    </div>
                    <img className="w-[50px] h-[50px] ml-4 rounded-full" src={data[1]?.profile?.avatar} />
                </div>
                {
                    current.username === data[1].username && 
                    <h1 style={{color : color}} className="absolute uppercase right-2 text-xs top-[-40px]">player O play now</h1>
                }
            </div>
        </div>
    )
}


export default function TicTacTeo() {

    const { theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [data, setData] = useState({players : null, user: null, board : null, winner : null, error : null })
    const navigate = useNavigate()
    const { game_id } = useParams()
    const [ time, setTime ] = useState(0)


    useEffect(() => {
        const timer = setTimeout(() => {
            ticTacTeoSocket.addCallback("init", setData)
            ticTacTeoSocket.addCallback("time", setTime)
            ticTacTeoSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/game/tic-tac-teo/play/${game_id}/?token=${authInfos?.accessToken}`)
        }, 300)

        return () => {
            clearTimeout(timer)
            ticTacTeoSocket.close()
        }
    }, [])

    useEffect(() => {
        let interval : NodeJS.Timeout;
        if (data.winner !== null) {
            setTimeout(() => {
                navigate('/dashboard/game')
            }, 4000)
        } 

        return () => {
            clearInterval(interval)
        }
    }, [data])

    function test(y, x) {
        ticTacTeoSocket.sendMessage({
            "event" : "action",
            x,
            y
        })
    }

    
    if (!data.players || !data.board || !data.user) {
        return (
            <div>loading ....</div>
        )
    }
    
    const {players, user, board} = data
    
    return (
        <div className={`p-2 rounded w-full h-full flex flex-row items-center justify-center ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} mt-2`}>
            <div className="w-[500px] h-fit p-2">
                {
                    data.error && 
                    <div className="w-full h-[100px]">
                        <div className="bg-red-500 text-white p-4 rounded relative">
                            <p className="text-xs">{data.error}</p>
                            <IoMdCloseCircleOutline className="absolute top-2 right-2" />
                        </div>
                    </div>
                }
                <div className="w-full h-fit relative">
                    <Players data={players} current={user} />
                </div>
                <div className="w-full h-[100px] flex justify-center items-center">
                    <p className="text-2xl">00 : {time < 10 && "0"}{time}</p>
                </div>
                <div className="w-full h-[400px] t mt-2 rounded p-4 relative">
                    {
                        data.winner !== null &&
                        <div 
                            className="absolute z-10 w-full h-[100px] bg-gray-700/50 top-[50%] backdrop-blur-xl uppercase text-3xl left-0 translate-y-[-50%] flex items-center justify-center">
                                {data.winner == undefined ? "match end" : (data.winner.username == authInfos?.username ? "victory" : "ko")}
                        </div>
                    }
                    <ul className={`grid grid-cols-1 h-full gap-1`}>
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