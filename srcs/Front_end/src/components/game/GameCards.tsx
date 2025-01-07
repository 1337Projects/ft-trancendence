import { useContext } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { FaArrowRightLong } from "react-icons/fa6"
import { DialogContext } from "@/Contexts/DialogContext"
import { RiGamepadLine } from "react-icons/ri"
import TournmentDialog from './TournamentDialog'
import { Link } from "react-router-dom"

function Card({color, img, text, link} : {color : string, img : string, text : string, link : string}) {

    const { theme } = useContext(ApearanceContext) || {}

    return (
        <div className={`w-full mx-auto border-[1px] ${theme == 'light' ? "border-black/10" : "border-white/10"} rounded`}>
            <div className="h-[160px] w-full">
                <div className="w-full h-full overflow-hidden rounded-t flex justify-center" >
                    <img src={img} className="w-full h-full" alt="" />
                </div>
            </div>
            <div className="p-4">
                <h1 className="text-md capitalize font-semibold tracking-wide">{text}</h1>
                <p className="mt-2 text-xs font-thin leading-5">Lorem ipsum dolor, sit amet elit. Placeat, autem minus deleniti ad</p>
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


export default function Cards({color} : {color : string}) {
    const appearence = useContext(ApearanceContext)
    const { open, setOpen } = useContext(DialogContext) || {}

    return (
        <div className={`px-8 ${appearence?.theme === 'light' ? "text-lightText" : "text-darkText"}`}>
            <div className={`items-center flex justify-between`}>
                <div>
                    <h1 className="text-secondary capitalize ">game modes:</h1>
                    <p className="text-small max-w-[400px] mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur rem quia inventore officiis, odio rerum sapiente asperiores earum nobis labore architecto nam qui quae. repudiandae voluptas consequuntur pariatur</p>
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
                <Card color={color} link="waiting/room/public/ping-pong" img="/game/leo-vs-random.jpg" text="random match"/>
                <Card color={color} link="/" img="/game/leo-vs-computer.jpg" text="vs Computer"/>
                <Card color={color} link="waiting/room/private/ping-pong" img="/game/leo-vs-friend.jpg" text="vs friend"/>
                <Card color={color} link="waiting/room/public/tic-tac-toe" img="/game/leo-vs-friend.jpg" text="tic tak teo"/>
            </div>
        </div>
    )
}