
import { useContext } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { GameType, ScoreType } from "@/types/gameTypes"



function Radio({checked} : {checked : boolean}) {
    const { color } = useContext(ApearanceContext) || {}
    return (
        <li>
            <input style={{accentColor : color}} type="radio" className="w-[11px]" onChange={() => {}} checked={checked} />
        </li>
    )
}

export default function Score({data, score} : {data : GameType | null, score : ScoreType}) {

    
    if (!data) {
        return (
            <div className='h-[40px] flex w-full justify-between animate-pulse'>
                <div className="flex items-start">
                    <div className="mr-4 bg-gray-300 w-[40px] h-[40px] rounded-full" />
                    <div>
                        <div className='w-[60px] h-4 bg-gray-300 rounded-full' />
                        <div className='w-[100px] h-2 mt-2 bg-gray-300 rounded-full' />
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="flex-col flex items-end">
                        <div className='w-[60px] h-4 bg-gray-300 rounded-full' />
                        <div className='w-[100px] h-2 mt-2 bg-gray-300 rounded-full' />
                    </div>
                    <div className="ml-4 bg-gray-300 w-[40px] h-[40px] rounded-full" />
                </div>
            </div>
        )
    }

    const {player1, player2} = data?.game_data

    return (
        <div className="h-[40px] w-full">
            <div className="h-full w-full flex justify-between items-center">
                <div className=''>
                    <div className=" flex items-center p-2 rounded-full border-[0px] border-white/30">
                        <div className="mr-4 border-[.3px] w-[40px] h-[40px] flex justify-center items-center rounded-full">
                            <img src={player1.profile.avatar} className="bg-white w-full rounded-full h-full" alt="" />
                        </div>
                        <div className="relative">
                            <h1 className='text-[12pt] font-bold'>{player1.username}</h1>
                            <ul className="flex justify-between w-[90px]">
                                {[...Array(5)].map((_, index) => <Radio key={index} checked={index < score.score1} />)}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="score text-center">
                    <div className="text-[12pt]">{score.score1} / {score.score2}</div>
                </div>
                <div className='relative '>
                    <div className=" flex items-center p-2 rounded-full border-[0px] border-white/30">
                        <div className="text-right">
                            <h1 className="text-[12pt] font-bold">{player2.username}</h1>
                            <ul className="flex justify-between w-[90px]">
                                {[...Array(5)].map((_, index) => <Radio key={index} checked={index >=  (5 - score.score2)} />)}
                            </ul>
                        </div>
                        <div className="ml-4 border-[.3px] w-[40px] h-[40px] flex justify-center items-center rounded-full">
                            <img src={player2.profile.avatar} className="bg-white w-full rounded-full h-full" alt="" />
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
}
