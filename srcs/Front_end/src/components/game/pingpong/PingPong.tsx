
import { useContext, useEffect, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { gameSocket } from "@/sockets/gameSocket";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "@/Contexts/authContext";
import Canvas from "./Canvas";
import Score from "./Score";
import { tournamentSocket } from "@/socket";

export interface GameType {
    paddles: never; // Replace 'any' with the actual type
    game: never;   // Replace 'any' with the actual type
    ball: never; 
    game_data : never   // Replace 'any' with the actual type
}

export interface ScoreType {
    score1: number;
    score2: number;
}

function PingPong() {
    const { game_id, tournament_id }= useParams();
    const { authInfos, user } = useContext(UserContext) || {}
    const [ game, setGame] = useState<GameType | null>(null)
    const [ score, setScore] = useState<ScoreType>( { score1: 0, score2: 0 })
    const [ matchResult, setMatchResult ] = useState(null)
    const navigate = useNavigate()

    const navigateBack = () => {
        if (tournament_id) {
            navigate(`/dashboard/game/tournment/${tournament_id}/`)
        } else {
            navigate(`/dashboard/game/`)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            gameSocket.addCallback("init", init);
            gameSocket.addCallback("set_score", set_score);
            gameSocket.addCallback("set_match_result", setMatchResult);
            gameSocket.addCallback("back", navigateBack)
            gameSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/game/${game_id}/?token=${authInfos?.accessToken}`);
        }, 200);

        return () => {
            clearTimeout(timer);
            gameSocket.close();
        };
    }, [game_id, authInfos]);

    function init(data : any) {
        const {paddles, game, ball, game_data} = data;
        const game_data_infos = { paddles, game, ball, game_data };
        setGame(game_data_infos as GameType);
    }

    function set_score( { score1, score2 }: ScoreType) {
        setScore( { score1, score2 });
    }


    useEffect(() => {
        if (matchResult) {
            tournamentSocket.sendMessage({"event" : "upgrade", "result" : matchResult})
            const timer = setTimeout(navigateBack, 2000)
            return () =>  clearTimeout(timer)
        }
    }, [matchResult])

    const { theme } = useContext(ApearanceContext) || {}

    return (
            <div className={`relative ${theme === 'light' ? " text-lightText bg-lightItems" : " text-darkText bg-darkItems"}  flex justify-center items-center rounded-none w-full h-[100vh] mt-2 p-2`}>
                <div className={`relative h-fit`}>
                    {
                        matchResult && 
                        <div 
                            className="bg-black/20 h-[150px] flex justify-center items-center absolute z-10 w-full top-[50%] translate-y-[-50%]"
                        > 
                            <h1 className="text-[30pt] font-bold uppercase">{matchResult.winner == user.id ? "victory" : "ko"} </h1>
                        </div>
                    }
                    <div className="w-full">
                        <div className='flex justify-center px-4'>
                            <Score data={game} score={score} />
                        </div>
                        <div className={`flex justify-center items-center mt-10 h-fit`}>
                            <Canvas game={game}/>
                        </div>
                    </div>
                </div> 
            </div> 
    )
}

export default PingPong;