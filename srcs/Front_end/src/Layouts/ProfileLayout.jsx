import { Outlet } from "react-router-dom"
import FriendsList from '../components/profile/FriendList'
import {PlayerStatus} from "../components/profile/profile"


export default function ChatLayout() {
    return (
        <>
            <div className="flex justify-between h-[100vh] mt-2 w-full ">
                <Outlet />
                {/* <FriendsList />  */}
            </div>
        </>
    )
}
