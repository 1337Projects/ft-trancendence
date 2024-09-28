
import { Outlet } from "react-router-dom"
import React, { useContext, useState } from "react"
import ConversationsList, {Friends} from '../components/chat/chat'
import { ApearanceContext } from "../Contexts/ThemeContext"
import { FaBars } from "react-icons/fa"
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { FaGear } from "react-icons/fa6"

export default function ChatLayout() {
    const {theme, color} = useContext(ApearanceContext) || {}
    const [menu, setMenu] = useState<Boolean>(false)
    return (
        <>
            <div className="flex justify-between w-full h-[94vh] mt-2 ">
                <div className={`${theme === 'light' ? "text-lightText" : "text-darkText"} shadow-sm h-[100vh] rounded-sm flex-grow overflow-y-auto`}>
                    <div className="flex h-full relative">
                        <div className={`absolute h-[100vh] rounded-sm z-10 bg-chat bg-cover w-[70px] xl:w-[300px]  md:border-r-[.1px] border-gray-700 ${menu ?"active-menu" : "non-active-menu"}`}>
                            <div className={`backdrop-blur-2xl bg-darkItems/60 w-full h-full xl:px-4 ${menu && "px-4"}`}>
                                <div className={`text-[16pt] w-full h-[70px] xl:hidden flex items-center  ${menu ? "justify-end" : "justify-center"}`} onClick={() => setMenu(prev => !prev)}>
                                    {
                                        menu ? 
                                        <TbLayoutSidebarRightExpandFilled />
                                        :
                                        <FaBars />
                                    }
                                </div>
                                <Friends menu={menu} />
                                <hr className="border-white/20 mx-4 " />
                                <ConversationsList menu={menu} />
                                <div className="w-full px-4 bottom-[150px] sm:bottom-[100px]  h-[40px] absolute left-0">
                                    <div style={{background:color}} className="w-full flex justify-center items-center h-full rounded-full">
                                        <FaGear className={`${menu && "test-style mr-2"} xl:mr-2`} />
                                        <h1 className={`xl:block ${!menu ? "hidden" : "test-style"}`}>chat settings</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`ml-[74px] xl:ml-[304px] h-full flex-grow`}>
                            <div className="bg-pong bg-cover w-full h-full">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
