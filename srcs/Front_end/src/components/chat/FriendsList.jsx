import { useState, useContext } from "react"
import {ThemeContext} from '../../Contexts/ThemeContext'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function FriendItem({data}) {
    return (
        <Link to="1">
            <li className="w-full h-[50px] mt-2 flex justify-center items-center cursor-pointer">
                <div className="img relative w-[35px] h-[35px] m-1">
                    <img src={data.img} className="w-[35px] h-[35px] rounded-[50%]" alt="img" />
                    <div className={`dot w-[10px] h-[10px] rounded-full absolute top-[30px] ${data.status !== 'active' ? "bg-rose-400" : "bg-teal-400"}`}></div>
                </div>
                <div className="content text-[10px] w-[70px]">
                    <h1 className="font-bold ">{data.name}</h1>
                    <p className="text-[7px] mt-1">{data.status}</p>
                </div>
            </li>
        </Link>
    )
}

export default function FriendsList() {

    const [friends, setFriends] = useState(initData)
    const theme = useContext(ThemeContext)

    return (
        <div className={`
            friends shadow-sm w-[190px] p-1 ml-2
            ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} 
        `}>
            <div className="header w-full h-[60px] flex justify-between items-center text-[12px] px-4">
                <h1 className="font-kaushan">friends</h1>
                <FontAwesomeIcon icon={faUserGroup} />
            </div>
            <ul>{friends.map(friend => <FriendItem key={friend.id} data={friend} />)}</ul>
        </div>
    )
}

const initData = [
    {id:0, name: 'aamhamdi', img:'/aamhamdi1.jpeg', status:'active'},
    {id:1, name: 'aamhamdi', img:'/aamhamdi1.jpeg', status:'last seen 19:24'},
    {id:2, name: 'aamhamdi', img:'/aamhamdi1.jpeg', status:'active'},
]