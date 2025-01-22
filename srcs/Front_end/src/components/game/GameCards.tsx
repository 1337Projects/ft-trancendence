import { useContext } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { FaArrowRightLong } from "react-icons/fa6"
import { DialogContext } from "@/Contexts/DialogContext"
import { RiGamepadLine } from "react-icons/ri"
import TournmentDialog from './TournamentDialog'
import { Link } from "react-router-dom"

function Card({description, img, text, link} : {description : string, img : string, text : string, link : string}) {

    const { theme, color } = useContext(ApearanceContext) || {}

    return (
        <div className={`w-full mx-auto border-[1px] ${theme == 'light' ? "border-black/10" : "border-white/10"} rounded`}>
            <div className="h-[160px] w-full">
                <div className="w-full h-full overflow-hidden rounded-t flex justify-center" >
                    <img src={img} className="w-full h-full" alt="" />
                </div>
            </div>
            <div className="p-4">
                <h1 className="text-sm capitalize font-semibold tracking-wide">{text}</h1>
                <p className="mt-2 text-xs font-thin leading-5 h-[60px]">{description}</p>
                <Link to={link}>
                    <button style={{background : color}} className="px-6 text-white h-[34px] rounded mt-4 flex items-center justify-center" >
                        <h1 className="text-[12px] lowercase mr-2">play now</h1>
                        <FaArrowRightLong className="text-[10pt]" />
                    </button>
                </Link>
            </div>
        </div>
    )
}


const gamePlayModes = [
    {
        title : "Random Ping Pong Match",
        description : "Jump into a fast-paced ping pong match against random opponents from around the world.",
        image : "/game/leo-vs-random.jpg",
        link : "waiting/room/public/ping-pong"
    },
    {
        title : "VS Friend Ping Pong Match",
        description : "Challenge your friends to a thrilling ping pong match.",
        image : "/game/leo-vs-friend.jpg",
        link : "waiting/room/private/ping-pong"
    },
    {
        title : "Random Tic Tac Toe Match",
        description : "Play Tic Tac Toe against random players anytime, anywhere.",
        image : "/game/random-tic.jpg",
        link : "waiting/room/public/tic-tac-toe"
    },
    {
        title : "VS Friend Tic Tac Toe Match",
        description : "Challenge your friends to a thrilling Tic Tac Toe match, anytime, anywhere.",
        image : "/game/random-tic.jpg",
        link : "waiting/room/private/tic-tac-toe"
    },
    {
        title : "VS Computer Tic Tac Toe Match",
        description : "Take on the computer in a solo Tic Tac Toe match.",
        image : "/game/random-tic.jpg",
        link : "tic-tac-toe/room/ai"
    }
]


export default function Cards() {
    const appearence = useContext(ApearanceContext)
    const { open, setOpen } = useContext(DialogContext) || {}

    return (
        <div className={`px-8 ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"}`}>
            <div className={`items-center flex justify-between`}>
                <div>
                    <h1 className="text-xl font-bold capitalize ">game modes:</h1>
                    <p className="text-small max-w-[400px] mt-2">Dive into exciting challenges with a variety of game modes! Whether you're up for a fast-paced Ping Pong match, a fun Random Match with players around the world, a competitive VS Friends battle, or the classic strategy of Tic Tac Toe, there's something for everyone. Pick your mode and start playing now!</p>
                </div>
            </div>
            <div className="mt-10 flex justify-end">
                <button 
                    style={{background : appearence?.color}} 
                    className="p-2 px-4 capitalize rounded-full text-white flex items-center"
                    onClick={() => setOpen!(true)}
                >
                    <span className="mr-2 text-sm">create tournment</span>
                    <RiGamepadLine className="text-[18pt]" />
                </button>
                {
                    open &&
                    <TournmentDialog  />
                }
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                {
                    gamePlayModes.map((item, index) => 
                        <Card key={index} description={item.description} img={item.image} text={item.title} link={item.link} />
                    )
                }
            </div>
        </div>
    )
}