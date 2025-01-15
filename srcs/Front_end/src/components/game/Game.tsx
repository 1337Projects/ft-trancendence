import { useContext, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import MyUseEffect from '@/hooks/MyUseEffect'
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { GiSandsOfTime } from "react-icons/gi";
import Hero from './Hero'
import { DialogContext } from "@/Contexts/DialogContext"
import { TrItem } from "./tournament/Events"
import Cards from "./GameCards";
import { UserContext } from "@/Contexts/authContext"
import { useSearchParams } from "react-router-dom";
import { LuHistory } from "react-icons/lu";

export function CatButton({icon, text} : {icon : JSX.Element, text : string}) {

    const [searchParams, setSearchParams] = useSearchParams()
    const category = searchParams.get('category')

    const {color, theme} = useContext(ApearanceContext) || {}
    const selectedColor = (category === text || (!category && (text === 'latest' || text === 'all'))) ? color : "" 
    return (
        <button 
            style={{color:selectedColor, borderColor : selectedColor}} 
            className={`border-[.1px] ${theme == 'light' ? "border-black" : "border-white"} h-fit flex justify-between items-center font-bold capitalize rounded text-[8pt] p-2 mr-3 min-w-10`} 
            onClick={()=> {
                setSearchParams({category : text})
            }}
        >
            <p className="mr-2">{text}</p>
            <div className="text-[12pt]">
                {icon}
            </div>
        </button>
    )
}

const categories = [
    {
        text : 'latest',
        icon : <MdOutlineTipsAndUpdates />
    },
    {
        text : 'ongoing',
        icon : <GiSandsOfTime />
    },
    {
        text : 'ended',
        icon : <LuHistory />
    }
]

export function Categories() {
    
    return (
        <div className="w-full h-[30px] flex">
            {
                categories.map((item, index) => 
                    <CatButton key={index} text={item.text} icon={item.icon} />
                )
            }
        </div>
    )
}


export default function Game() {
    const appearence = useContext(ApearanceContext)
    const { authInfos } = useContext(UserContext) || {}
    const [tournments, setTournments] = useState([])
    const { open } = useContext(DialogContext) || {}

    // const [searchParams, setSearchParams] = useSearchParams()

    MyUseEffect(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/tournment/get_all/`, {
                method : 'GET',
                credentials : 'include',
                headers : {
                    'Authorization' : `Bearer ${authInfos?.accessToken}`
                }
            })

            if (!response.ok) {
                const { error } = await response.json()
                throw  new Error(error)
            }

            const { data } = await response.json()
            setTournments(data)
        } catch(err) {
            console.log(err)
        }
    }, [open])

    return (
        <>
            <div className={`${appearence?.theme == 'light' ? "bg-lightItems text-lightText " : "bg-darkItems text-darkText"} w-full h-full overflow-scroll p-2`}>
                <div className="mx-auto max-w-[800px] h-full">
                    <Hero />
                    <Cards color={appearence?.color || "#ffffff"} />
                    
                    <div className="px-10 mt-16">
                        <h1 className="text-xl font-bold">Avialable Tournments :</h1>
                        <div className="w-full h-[50px] flex items-center mt-6">
                            <Categories />
                        </div>
                        <div  className="w-full mt-6 h-fit">
                            {
                                tournments.length ?
                                tournments.map((item, index) => 
                                    <div className="" key={index}>
                                        <TrItem data={item} />
                                    </div> )
                                :
                                <div className={`w-full rounded h-[170px] border-[1px] ${appearence?.theme == "light" ? "border-black/20" : "border-white/20"} text-sm flex justify-center items-center`}>
                                    <p>not tournaments yet, create one</p>
                                    <span style={{color : appearence?.color}} className="ml-2 font-bold text-md cursor-pointer">Create !</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}


