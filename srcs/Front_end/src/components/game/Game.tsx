import { useContext, useEffect, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import Hero from './Hero'
import { DialogContext } from "@/Contexts/DialogContext"
import { TrItem } from "./tournament/Events"
import Cards from "./GameCards";
import { UserContext } from "@/Contexts/authContext"
import { useSearchParams } from "react-router-dom";
import { TournamentDataType } from "@/types/tournamentTypes";
import { toast } from "react-toastify"

export function CatButton({icon, text, filter} : {icon : JSX.Element, text : string, filter : string}) {

    const [searchParams, setSearchParams] = useSearchParams()
    const category = searchParams.get(filter)

    const {color, theme} = useContext(ApearanceContext) || {}
    const selectedColor = (category === text || (!category && text === 'ping pong')) ? color : "" 
    return (
        <button 
            style={{color:selectedColor, borderColor : selectedColor}} 
            className={`border-[.1px] ${theme == 'light' ? "border-black" : "border-white"} h-fit flex justify-between items-center font-bold capitalize rounded text-[8pt] p-2 mr-3 min-w-10`} 
            onClick={()=> {
                searchParams.set(filter, text)
                setSearchParams(searchParams)
            }}
        >
            <p className="mr-2">{text}</p>
            <div className="text-[12pt]">
                {icon}
            </div>
        </button>
    )
}



export default function Game() {
    const appearence = useContext(ApearanceContext)
    const { authInfos } = useContext(UserContext) || {}
    const [tournments, setTournments] = useState<TournamentDataType[]>([])
    const { open } = useContext(DialogContext) || {}
    const [searchParams, ] = useSearchParams()


    const categorie = searchParams.get('category')

    const filtredTournments = (categorie && categorie != 'latest')  ? 
        tournments.filter((item) => item.tourament_status === categorie) :
        tournments.filter((item) => item.tourament_status === 'waiting')

    const fetchTournamanets = async () => {
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
            toast.error(err instanceof Error ? err.toString() : "somthing went wrong...")
        }
    }

    useEffect(() => {
        fetchTournamanets()
    }, [open])

    return (
        <>
            <div className={`${appearence?.theme == 'light' ? "bg-lightItems text-lightText " : "bg-darkItems text-darkText"} w-full h-full overflow-scroll p-2`}>
                <div className="mx-auto max-w-[800px] h-full">
                    <Hero />
                    <Cards />
                    
                    <div className="px-10 mt-16">
                        <h1 className="text-xl font-bold">Avialable Tournments :</h1>
                        <div  className="w-full mt-6 h-fit">
                            {
                                filtredTournments.length ?
                                filtredTournments.map((item, index) => 
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


