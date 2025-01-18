
import { Outlet } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import ConversationsList, {Friends} from '../components/chat/chat'
import { ApearanceContext } from "../Contexts/ThemeContext"
import { FaBars } from "react-icons/fa"
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { UserContext } from "../Contexts/authContext"
import ChatContextProvider from "@/Contexts/ChatContext"
import { ChatUserDataType, ConversationType, MessageType } from "@/types/chatTypes"
import { chatSocket } from "@/sockets/chatSocket"



export default function ChatLayout() {
    const { theme } = useContext(ApearanceContext) || {}
    const [menu, setMenu] = useState<boolean>(false)

    const { user } = useContext(UserContext) || {}
    const [ cnvs , setCnvs ] = useState<ConversationType[] | null>(null)


    const [ messages, setMessages ] = useState<MessageType[] | null>(null)
    const [ userData, setUserData ] = useState<ChatUserDataType | null>(null)


    const value = {
        messages,
        setMessages,
        userData,
        setUserData,
    }

    function UpdateConversationsHandler(cnv : ConversationType) {
        setCnvs(prev => prev ? [cnv, ...prev.filter(c => c.id != cnv.id)] : [cnv])
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            chatSocket.connect(`${import.meta.env.VITE_SOCKET_URL}wss/chat/${user?.id}/`)
            chatSocket.addCallback('cnvsHandler', setCnvs)
            chatSocket.addCallback('cnvsUpdate', UpdateConversationsHandler)
            chatSocket.addCallback("setData", setMessages)
            chatSocket.addCallback("setUser", setUserData)
            chatSocket.sendMessage({
                "event" : "fetch_conversations"
            })
        }, 150)

        return () => {
            clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        return () => {
            chatSocket.close();
        }
    }, [])


    return (
        <>
            <div className={` ${theme === 'light' ? " bg-lightItems text-lightText" : "bg-darkItems text-darkText"} h-full min-h-fit w-full rounded-sm flex-grow`}>
                <div className="flex w-full h-full ">
                    <div className={`h-full overflow-scroll ${theme == 'light' ? "border-black/20" : "border-white/20"} border-r-[.3px] rounded-sm z-10 w-[90px]  ${menu ? "active-menu" : "non-active-menu"}`}>
                        <div className={`w-full h-fit px-2`}>
                            <div className={`text-[16pt] w-full h-[70px] flex items-center  ${menu ? "justify-end" : "justify-center"}`}>
                                <div className="w-fit" onClick={() => setMenu(prev => !prev)}>
                                    { menu ? <TbLayoutSidebarRightExpandFilled /> : <FaBars /> }
                                </div>
                            </div>
                            <Friends menu={menu} handler={setMenu} />
                            <hr className={`mt-2 ${theme == 'light' ? "border-black/20" : "border-white/20"}`} />
                            <ConversationsList menu={menu} data={cnvs!} />
                        </div>
                    </div>
                    <div className={`flex-grow w-full`}>
                        <div className={`w-full h-full p-2 overflow-scroll`}>
                            <ChatContextProvider value={value}>
                                <Outlet />
                            </ChatContextProvider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
