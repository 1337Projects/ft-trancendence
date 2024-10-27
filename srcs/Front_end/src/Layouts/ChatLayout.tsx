
import { Outlet } from "react-router-dom"
import React, { useContext, useState } from "react"
import ConversationsList, {Friends} from '../components/chat/chat'
import { ApearanceContext } from "../Contexts/ThemeContext"
import { FaBars } from "react-icons/fa"
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";

export default function ChatLayout() {
    const { theme } = useContext(ApearanceContext) || {}
    const [menu, setMenu] = useState<Boolean>(false)
    return (
        <>
            <div className={`${theme === 'light' ? "text-lightText" : "text-darkText"} w-full h-[94vh] overflow-scroll mt-2 shadow-sm rounded-sm flex-grow`}>
                <div className="flex w-full min-h-[600px] h-full">
                    <div className={`h-full ${theme == 'light' ? "bg-white border-black/20" : "bg-darkItems border-white/30"} border-r-[.3px] rounded-sm z-10 w-[90px] xl:w-[400px]  ${menu ? "active-menu" : "non-active-menu"}`}>
                        <div className={` w-full h-fit xl:px-4 ${menu && "px-4"}`}>
                            <div className={`text-[16pt] w-full h-[70px] xl:hidden flex items-center  ${menu ? "justify-end" : "justify-center"}`} onClick={() => setMenu(prev => !prev)}>
                                {
                                    menu ? 
                                    <TbLayoutSidebarRightExpandFilled />
                                    :
                                    <FaBars />
                                }
                            </div>
                            <Friends menu={menu} handler={setMenu} />
                            <hr className={` ${theme == 'light' ? "border-black/20" : "border-white/20"} mx-4 `} />
                            <ConversationsList menu={menu} />
                        </div>
                    </div>
                    <div className={`flex-grow w-full`}>
                        <div className={`w-full h-full ${theme == 'light' ? "bg-lightItems" : "bg-darkItems"} p-2 `}>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
