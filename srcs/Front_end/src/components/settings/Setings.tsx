import React, { ReactElement, useContext, useState } from "react";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { FaPalette,  FaUser } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import Profile from "./Profile";
import Apperance from "./Apperance";
import Security from "./Security";

type ItemType = {text : string, icon : ReactElement}

function ListItem({item,  isActive, handler} : {
    item : ItemType,
    isActive : boolean,
    handler : React.Dispatch<React.SetStateAction<string>> 
}) {
    const {color, theme} = useContext(ApearanceContext) || {}

    return (
        <li 
            className={`${theme === 'light' && !isActive ? "text-lightText" : "text-darkText"} border-white/20 text-[11pt] cursor-pointer justify-center flex px-4 h-[45px] items-center rounded-md`} 
            style={{background : isActive ? color : ""}} 
            onClick={() => handler(item.text)}>
            <p>{item.text}</p>
            <div className="ml-2">
                {item.icon}
            </div>
        </li>
    )
}


const listItems = [
    {text: "Profile", icon: <FaUser />},
    {text: "Security", icon: <MdOutlineSecurity />},
    {text: "Apperance", icon: <FaPalette />},
]


export default function Setings() {
    
    const [item, setItem] = useState('Profile')
    const {theme} = useContext(ApearanceContext) || {}

    return (
        <div className={`overflow-scroll p-2 ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} w-full h-full`}>
            <div className="w-full md:flex px-10 max-w-[800px] mx-auto">
                <div className="w-full  md:w-[300px] md:mr-4 px-2">
                    <ul className={`grid grid-cols-3 content-start p-2 md:grid-cols-1 gap-4 min-h-[45px] h-full border-[1px] ${theme == 'light' ? "border-black/10" : "border-white/10"}  rounded-md`}>
                        {
                            listItems.map(it => 
                            (<ListItem 
                                key={it.text} 
                                item={it} 
                                isActive={it.text == item} 
                                handler={setItem}  
                            />))
                        }
                    </ul>
                </div>
                <div className="flex-grow w-full">
                    {
                        item === 'Profile' && 
                            <Profile /> || 
                        item === 'Security' &&
                            <Security /> ||
                        item === 'Apperance' && 
                            <Apperance />
                    }
                </div>
            </div>
        </div>
    )
}