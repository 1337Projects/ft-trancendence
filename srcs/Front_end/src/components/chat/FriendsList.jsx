import { useState, useContext, useEffect } from "react"
import {ThemeContext} from '../../Contexts/ThemeContext'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { authContext } from "../../Contexts/authContext";
import { chatHandlerContext } from "../../Contexts/ConversationsContext";


Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .map(key => obj[key]);

function FriendItem({data}) {
    return (
        <Link to={`${data.username}`}>
            <li className="w-full h-[50px] mt-2 flex justify-center items-center cursor-pointer">
                <div className="img relative w-[35px] h-[35px]">
                    <img src={data.profile.image} className="bg-white w-[35px] h-[35px] rounded-[50%]" alt="img" />
                    <div className={`dot w-[10px] h-[10px] rounded-full absolute top-[30px] ${'active' !== 'active' ? "bg-rose-400" : "bg-teal-400"}`}></div>
                </div>
                <div className=" content text-[10px] w-[70px] ml-4">
                    <h1 className="font-bold ">{data.username}</h1>
                    <p className="text-[7px] mt-1">active</p>
                </div>
            </li>
        </Link>
    )
}

export default function FriendsList() {

    const [friends, setFriends] = useState([])
    const theme = useContext(ThemeContext)
    const tokens = useContext(authContext)
    const chatHandler = useContext(chatHandlerContext)

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch('http://localhost:8000/api/friends/get_friends/', {
                method : 'GET',
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.mytoken}`
                },
                credentials: 'include',
            })
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    chatHandler(data.data)
                    setFriends(data.data)
                }
            })
            .catch(err => console.log(err))
        }, 300)
        return () => clearTimeout(timer)
    }, [])
    return (
        <div className={`
            friends shadow-sm w-[170px] p-1 ml-2 h-full
            ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} 
        `}>
            <div className="header w-full h-[60px] flex justify-between items-center text-[12px] px-4">
                <h1 className="font-kaushan">friends</h1>
                <FontAwesomeIcon icon={faUserGroup} />
            </div>
            <ul>{friends.map(friend => {
                const user = Object.filter(friend, f => typeof f == "object" && f.username != tokens.username)[0]
                return <FriendItem key={user.id} data={user} />
            })}</ul>
        </div>
    )
}
