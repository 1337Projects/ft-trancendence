import React, { useContext, useState } from "react";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { FaBell, FaPalette,  FaUser } from "react-icons/fa";
import Profile from "./Profile";
import Apperance from "./Apperance";
import Security from "./Security";

function ListItem({item,  isActive, handler}) {
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
    {text: "Security", icon: <FaBell />},
    {text: "Apperance", icon: <FaPalette />},
]


export default function Setings() {
    
    const [item, setItem] = useState('Profile')
    const {theme} = useContext(ApearanceContext) || {}

    return (
        <div className={`${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} p-1 w-full flex-grow h-[94vh] rounded mt-2`}>
            <div className="w-full md:flex max-w-[800px] mx-auto">
                <div className="w-full  md:w-[300px] md:mr-4 mt-6">
                    <ul className="grid grid-cols-3 md:grid-cols-1 gap-4 min-h-[45px] px-4">
                        {listItems.map(it => <ListItem item={it} isActive={it.text == item} handler={setItem}  />)}
                    </ul>
                </div>
                <div className="flex-grow w-full  mt-6">
                    {item === 'Profile' && <Profile /> || item === 'Security' && <Security /> || item === 'Apperance' && <Apperance />}
                </div>
            </div>
        </div>
    )
}