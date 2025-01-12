import { useContext, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import MyUseEffect from '@/hooks/MyUseEffect'
// import { MdOutlineTipsAndUpdates } from "react-icons/md";
// import { GiSandsOfTime } from "react-icons/gi";
import Hero from './Hero'
import { DialogContext } from "@/Contexts/DialogContext"
import { TrItem } from "./tournament/Events"
// import { IoIosMailUnread } from "react-icons/io"
import Cards from "./GameCards";
import { UserContext } from "@/Contexts/authContext"

// function CatButton({icon, text, categorie, handler} : {icon : ReactElement : }) {
//     const {color, theme} = useContext(ApearanceContext) || {}
//     const t = categorie === text ? color : ""
//     return (
//         <button style={{color:t, borderColor : t}} className={`border-[.1px] ${theme == 'light' ? "border-black" : "border-white"} h-fit flex justify-between items-center font-bold capitalize rounded text-[8pt] p-2 mr-3 min-w-10`} onClick={()=> handler(text)}>
//             <p className="mr-2">{text}</p>
//             <div className="text-[12pt]">
//                 {icon}
//             </div>
//         </button>
//     )
// }

// export function Categories({categorie, Handler}) {
    
//     return (
//         <div className="w-full h-[30px] flex">
//             <CatButton text="latest" icon={<MdOutlineTipsAndUpdates />} categorie={categorie} handler={Handler} />
//             <CatButton text="ongoing" icon={<GiSandsOfTime />} categorie={categorie}  handler={Handler} />
//             <CatButton text="ended" icon={<IoIosMailUnread />} categorie={categorie}  handler={Handler} />
//         </div>
//     )
// }


export default function Game() {
    const appearence = useContext(ApearanceContext)
    const { authInfos } = useContext(UserContext) || {}
    const [tournments, setTournments] = useState([])
    const { open } = useContext(DialogContext) || {}

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
                        {/* <div className="w-full h-[50px] flex items-center mt-6">
                            <Categories categorie="latest" Handler={null} />
                        </div> */}
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


