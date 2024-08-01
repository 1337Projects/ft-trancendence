import { Outlet } from "react-router-dom"
import FriendsList from '../components/profile/FriendList'
import {PlayerStatus} from "../components/profile/profile"


export default function ChatLayout() {
    return (
        <>
            {/* <div className="mt-2 h-[33vh]">
               <PlayerStatus />
            </div> */}
            <div className="flex justify-between h-[66vh] mt-2  w-full ">
                <Outlet />
                <FriendsList /> 
            </div>
        </>
    )
}
