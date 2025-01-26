
import { useContext, useEffect, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { gameSocket } from "@/sockets/gameSocket";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "@/Contexts/authContext";
import Canvas from "./Canvas";
import Score from "./Score";
import { GameType, MatchDataType, ScoreType } from "@/types/gameTypes";
import { tournamentSocket } from "@/sockets/tournamentSocket";



function PingPong() {
    const { game_id, tournament_id }= useParams();
    const { authInfos, user } = useContext(UserContext) || {}
    const [ game, setGame] = useState<GameType | null>(null)
    const [ score, setScore] = useState<ScoreType>( { score1: 0, score2: 0 })
    const [ matchResult, setMatchResult ] = useState<MatchDataType | null>(null)
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
            gameSocket.addCallback("game_ended", navigateBack)
            gameSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/game/${game_id}/?token=${authInfos?.accessToken}`);
        }, 200);

        return () => {
            clearTimeout(timer);
            gameSocket.close();
        };
    }, [game_id, authInfos]);

    function init(data : GameType) {
        const {paddles, game, ball, game_data} = data;
        const game_data_infos = { paddles, game, ball, game_data };
        setGame(game_data_infos as GameType);
    }

    function set_score( { score1, score2 }: ScoreType) {
        setScore( { score1, score2 });
    }


    useEffect(() => {
        if (matchResult) {
            if (tournament_id) {
                tournamentSocket.sendMessage({"event" : "upgrade", "result" : matchResult})
            }
            const timer = setTimeout(navigateBack, 2000)
            return () =>  clearTimeout(timer)
        }
    }, [matchResult])

    const { theme } = useContext(ApearanceContext) || {}

    return (
            <div className={`${theme === 'light' ? " text-lightText bg-lightItems" : " text-darkText bg-darkItems"}  flex justify-center items-center rounded-none w-full h-[100vh] mt-2 p-2`}>
                <div className={`relative h-fit`}>
                    <div className="w-full">
                        <div className='flex justify-center px-4'>
                            <Score data={game} score={score} />
                        </div>
                        <div className={`flex relative justify-center items-center mt-10 h-fit`}>
                            {
                                matchResult && 
                                <div 
                                    className="bg-black/50 h-[100px] flex justify-center items-center absolute z-10 w-full top-[50%] translate-y-[-50%]"
                                > 
                                    <h1 className="text-[30pt] text-white font-bold uppercase">{matchResult.winner == user?.id ? "victory" : "ko"} </h1>
                                </div>
                            }
                            <Canvas game={game}/>
                        </div>
                    </div>
                </div> 
            </div> 
    )
}

export default PingPong;