import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Contexts/authContext";
import { FaAnglesUp, FaGear, FaRightToBracket } from "react-icons/fa6";
import { ApearanceContext } from "../Contexts/ThemeContext";
import { FaCaretDown, FaSearch, FaUser } from "react-icons/fa";

function SearchResult({query, queryHandler}) {
    const navigate = useNavigate()
    const user = useContext(UserContext)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const {theme} = useContext(ApearanceContext) || {}
    useEffect(() => {
        const timer = setTimeout(async () => {
            await fetch(`http://localhost:8000/api/profile/users/?query=${query}`, {
                method : 'GET',
                headers : {
                    "Content-Type": "application/json",
					"Authorization": `Bearer ${user?.authInfos?.accessToken}`
                },
                credentials : 'include'
            })
            .then(res => res.json())
            .then(data => {
                if (data.data != undefined) {
                    setData(data.data)
                }
            })
            .catch(err => console.log("err:", err))
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [query])

    function eventHandler(user) {
        queryHandler('')
        navigate(`/dashboard/profile/${user}`)
    }

    return (
        <>
            <div className={`text-[12px] ${theme == 'light' ? "bg-lightItems" : "bg-darkItems"} w-full z-20  border-r-[.2px] border-l-[.2px] border-b-[.2px] border-darkText/10 mt-2 absolute ml-[-1.7rem] p-4 h-fit`}>
                <ul>
                    {
                        (data != null && data?.length) ? 
                        data.map(i => {
                            return ( 
                                <li 
                                    key={i?.id} 
                                    className="flex my-2 items-center justify-between border-[.2px] p-2 rounded-md border-white/10 cursor-pointer" 
                                    onClick={() => eventHandler(i?.username)}
                                >
                                    <div className="flex">
                                        <img  src={i?.profile?.avatar} className="w-[44px] h-[44px] bg-white rounded-md mr-4" alt={i?.profile?.avatar} />
                                        <div>
                                            <p className="text-[16px] lowercase font-bold">{i.username}</p>
                                            <p className="mt-[4px]">{i?.first_name} {i?.last_name}</p>

                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <h1 className="mr-2">{i?.profile?.level} LVL</h1>
                                        <FaAnglesUp />
                                    </div>
                                </li>)
                        }) : !loading ? <h1>not found</h1> : <h1>Loading...</h1>
                    }
                </ul>
            </div>
        </>
    )
}

export default function Search() {
    const [show, setShow] = useState(false)
    const [searchText, seTSearchText] = useState('')
    const user = useContext(UserContext)
    const appearence = useContext(ApearanceContext)
    return (
        <>
            <div className="flex relative w-full h-[60px]">
                <div
                    className={`
                    ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}
                    search flex-grow h-full
                    rounded-sm p-1 px-3 flex items-center shadow-sm  relative
                `}>
                    <FaSearch />
                    <div className="w-full">
                        <input 
                            type="text" 
                            value={searchText} 
                            onChange={(e) => seTSearchText(e.target.value)} 
                            placeholder="search..." 
                            className="w-full h-full border-none bg-transparent text-primaryText ml-1 focus:outline-none" 
                        />
                        {
                            searchText != '' &&
                            <SearchResult query={searchText} queryHandler={seTSearchText} /> 
                        }
                    </div>
                </div>
                <div className={`
                    ${appearence?.theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}
                   w-[170px] border-[0px] h-full z-10 rounded-sm ml-2 shadow-sm cursor-pointer`} onClick={() => setShow(!show)}>
                    <div className="flex items-center justify-center h-full">
                        <div className="infos">
                            <div className="top flex text-small mb-1 justify-between items-center">
                                <p>enjoy</p>
                                <FaCaretDown />
                            </div>
                            <h1 className="text-primaryText font-bold">{user?.user?.username}</h1>
                        </div>
                        <img className="w-[40px] h-[40px] rounded-[50%] h-25px border-[1px] bg-white ml-4" src={user?.user?.profile?.avatar} alt="avatar" />
                    </div>
                    {
                        show && 
                        <ul className={`${appearence?.theme === 'light' ? "bg-lightItems" : "bg-darkItems/50 border-darkText/10"} border-[.4px] rounded-sm backdrop-blur-md text-primaryText p-1 mt-[4px] rounded-b-sm}`}>
                            <li>
                                <Link to="profile" className="flex w-full justify-between items-center px-4 my-4">
                                    <p>Pfrofile</p>
                                    <FaUser />
                                </Link>
                            </li> 
                            <li>
                                <Link to="setings" className="flex w-full justify-between items-center px-4 my-4 ">
                                    <p>Setings</p>
                                    <FaGear />
                                </Link>
                            </li>
                            <li className="flex w-full border-t-[.3px] border-darkText/20 justify-between items-center p-2 px-4">
                                <p className="">Logout</p>
                                <FaRightToBracket />
                            </li>
                            
                        </ul>
                    }
                </div>
            </div>
            
        </>
    )
}