import Alert from "@/components/ui/Alert";
import { UserContext } from "@/Contexts/authContext"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { ticTacTeoSocket } from "@/sockets/ticTacToeSocket";
import { TicTacTeoType } from "@/types/gameTypes";
import { AlertType } from "@/types/indexTypes";
import { UserType } from "@/types/userTypes";
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export function GameCardItem({cell} : {cell : string}) {

    const {theme} = useContext(ApearanceContext) || {}

    return (
        <div className={`w-full h-full cursor-pointer rounded ${theme === 'light' ? "bg-lightItems" : "bg-darkItems/60 backdrop-blur-md"} flex justify-center items-center`}> 
            <p className="text-[20px]">{cell || "-"}</p>
        </div>
    )
}


export function Players({data, current} : {data : {user : UserType, char : string}[], current : UserType}) {

    const { color } = useContext(ApearanceContext) || {}

    const activeStyle = {
        background : color, color : "white"
    }

    return (
        <div className="w-full h-[100px] rounded p-4">
            <div className="flex w-full relative justify-between items-center h-full">
                <div 
                    style={current.username === data[0]?.user?.username ? activeStyle : {}} 
                    className="w-[200px] pl-4 rounded h-full justify-start flex items-center"
                >
                    <img className="w-[50px] h-[50px] mr-4 rounded-full" src={data[0]?.user?.profile?.avatar} />
                    <div className="flex flex-col items-start justify-center">
                        <p className="text-sm font-bold">{data[0]?.user?.username}</p>
                        <p className="text-xs mt-1 uppercase">Player {data[0]?.char}</p>
                    </div>
                    {
                        current.username === data[0]?.user?.username && 
                        <h1 style={{color : color}} className="absolute uppercase left-2 text-xs top-[-40px]">player x play now</h1>
                    }
                </div>
                <div 
                    style={current.username === data[1]?.user?.username ? activeStyle : {}}  
                    className="w-[200px] pr-4 rounded h-full flex justify-end items-center"
                >
                    <div className="flex flex-col items-end justify-center">
                        <p className="text-sm font-bold">{data[1]?.user?.username}</p>
                        <p className="text-xs mt-1 uppercase">Player {data[1]?.char}</p>
                    </div>
                    <img className="w-[50px] h-[50px] ml-4 rounded-full" src={data[1]?.user?.profile?.avatar} />
                </div>
                {
                    current.username === data[1]?.user?.username && 
                    <h1 style={{color : color}} className="absolute uppercase right-2 text-xs top-[-40px]">player O play now</h1>
                }
            </div>
        </div>
    )
}




export default function TicTacTeo() {

    const { theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [data, setData] = useState<null | TicTacTeoType>(null)
    const navigate = useNavigate()
    const { game_id } = useParams()
    const [ time, setTime ] = useState(0)
    const [ error, setError ] = useState<null | AlertType>(null)


    useEffect(() => {
        
        const timer = setTimeout(() => {
            ticTacTeoSocket.addCallback("init", setData)
            ticTacTeoSocket.addCallback("time", setTime)
            ticTacTeoSocket.addCallback("err", setError)
            ticTacTeoSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/game/tic-tac-teo/play/${game_id}/?token=${authInfos?.accessToken}`)
        }, 300)

        return () => {
            clearTimeout(timer)
            ticTacTeoSocket.close()
        }
    }, [])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        let interval : NodeJS.Timeout | null = null;
        if (data?.winner !== null) {
            interval = setTimeout(() => {
                navigate('/dashboard/game')
            }, 2000)

        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }

    }, [data])

    function test(y : number, x : number) {
        ticTacTeoSocket.sendMessage({
            "event" : "action",
            x,
            y
        })
    }

    
    if (!data || !data.players || !data.board || !data.user) {
        return (
            <div>loading...</div>
        )
    }
    
    const {players, user, board} = data
    
    return (
        <div className={`p-2 rounded w-full h-full flex flex-row items-center justify-center ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} mt-2`}>
            <div className="w-[500px] h-fit p-2">
                {
                    error && 
                    (<div className="h-[100px]">
                        <Alert 
                        alert={error} 
                        alertHandler={setError} 
                    />
                    </div>)
                }
                <div className="w-full h-fit relative">
                    <Players data={players} current={user} />
                </div>
                <div className="w-full h-[100px] flex justify-center items-center">
                    <p className="text-2xl">00 : {time < 10 && "0"}{time}</p>
                </div>
                <div className="w-full h-[400px] tictaktoe-background mt-2 rounded p-4 relative">
                    {
                        data.winner !== null &&
                        <div 
                            className="absolute z-10 w-full h-[100px] bg-gray-700/50 top-[50%] backdrop-blur-xl uppercase text-3xl left-0 translate-y-[-50%] flex items-center justify-center">
                                {data.winner == undefined ? "match end" : (data?.winner?.username == authInfos?.username ? "victory" : "ko")}
                        </div>
                    }
                    <ul className={`grid grid-cols-1 h-full gap-1`}>
                        {
                            board.map((row, i : number) => (
                                <li key={i} className="h-full">
                                    <ul className="grid h-full grid-cols-3 gap-1">
                                        {
                                            row.map((cell, j : number) => (
                                                <li onClick={() => test(i, j)} key={j} className="h-full">
                                                    <GameCardItem cell={cell} />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }   
                    </ul>
                </div>
            </div>
        </div>
    )
}