import React, { useContext } from "react";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { FaInbox } from "react-icons/fa";
import { IoIosMailUnread } from "react-icons/io";


function CatButton({icon, text, categorie, handler}) {
    const {color, theme} = useContext(ApearanceContext) || {}
    const t = categorie === text ? color : ""
    return (
        <button style={{color:t, borderColor : t}} className={`border-[.1px] ${theme == 'light' ? "border-black" : "border-white"} h-fit flex justify-between items-center font-bold capitalize rounded text-[8pt] p-2 mr-3 min-w-10`} onClick={()=> handler(text)}>
            <p className="mr-2">{text}</p>
            <div className="text-[12pt]">
                {icon}
            </div>
        </button>
    )
}


export default function Categories({categorie, Handler}) {
    
    return (
        <div className="w-full h-[30px] px-4 flex mt-4">
            <CatButton text="all" icon={<FaInbox />} categorie={categorie} handler={Handler} />
            <CatButton text="unread" icon={<IoIosMailUnread />} categorie={categorie}  handler={Handler} />
        </div>
    )
}
