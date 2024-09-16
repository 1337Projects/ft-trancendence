import { faSearch, faCaretDown, faUser, faGear, faRightToBracket, faCaretUp, faAnglesUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { ColorContext, ThemeContext } from "../Contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { authContext, userContext } from "../Contexts/authContext";


const users = [
    {
        email: "aamhamdi@student.1337.ma",
        first_name: "Abdelhadi",
        id: 44,
        last_name: "Amhamdi",
        profile : {
            image: 'https://cdn.intra.42.fr/users/a60d6e59c8e25f00d89f55621023e181/aamhamdi.jpg',
            bio: 'number #1 in ping pong 🥱\naamhamdi.com', 
            level: 0.7, 
            rank: 44
        },
        username: "aamhamdi"
    }
]

function SearchResult({query, queryHandler}) {
    const navigate = useNavigate()
    const tokens = useContext(authContext)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(async () => {
            await fetch(`http://localhost:8000/api/profile/search_user/?query=${query}`, {
                method : 'GET',
                headers : {
                    "Content-Type": "application/json",
					"Authorization": `Bearer ${tokens.mytoken}`
                },
                credentials : 'include'
            })
            .then(res => res.json())
            .then(data => {
                if (data.data != undefined) {
                    console.log(data.data)
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
            <div className="text-[12px] w-full z-10 bg-darkItems border-r-[.2px] border-l-[.2px] border-b-[.2px] border-darkText/10 mt-2 absolute ml-[-2.5rem] p-4 h-fit max-h-">
                <ul>
                    {
                        (data != null && data.length) ? 
                        data.map(i => {
                            return ( 
                                <li 
                                    key={i?.id} 
                                    className="flex my-2 items-center justify-between cursor-pointer border-[.2px] p-2 rounded-md border-white/10 cursor-pointer" 
                                    onClick={() => eventHandler(i?.username)}
                                >
                                    <div className="flex">
                                        <img  src={i?.profile?.image} className="w-[44px] h-[44px] bg-white rounded-md mr-4" alt={i?.profile?.image} />
                                        <div>
                                            <p className="text-[16px] lowercase font-bold">@{i.username}</p>
                                            <p className="mt-[4px]">{i?.first_name} {i?.last_name}</p>

                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <h1 className="mr-2">{i?.profile?.level} LVL</h1>
                                        <FontAwesomeIcon icon={faAnglesUp} />
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
    const theme = useContext(ThemeContext)
    const [show, setShow] = useState(false)
    const [searchText, seTSearchText] = useState('')
    const user = useContext(userContext)
    return (
        <>
            <div className="flex relative w-full h-[60px]">
                <div
                    className={`
                    ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}
                    search flex-grow h-full
                    rounded-sm p-1 px-3 flex items-center shadow-sm border-[.3px] relative
                `}>
                    <FontAwesomeIcon icon={faSearch} className="text-primaryText mx-2"  />
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
                    ${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText border-darkText/10"}
                   w-[170px] border-[.3px] h-full z-10 rounded-sm ml-2 shadow-sm cursor-pointer`} onClick={() => setShow(!show)}>
                    <div className="flex items-center justify-center h-full">
                        <div className="infos">
                            <div className="top flex text-small mb-1 justify-between items-center">
                                <p>enjoy</p>
                                <FontAwesomeIcon icon={!show ? faCaretDown : faCaretUp} />
                            </div>
                            <h1 className="text-primaryText font-bold">{user?.username}</h1>
                        </div>
                        <img className="w-[40px] h-[40px] rounded-[50%] h-25px border-[1px] bg-white ml-4" src={user?.profile?.image} alt="avatar" />
                    </div>
                    {
                        show && 
                        <ul className={`${theme === 'light' ? "bg-lightItems" : "bg-darkItems/50 border-darkText/10"} border-[.4px] rounded-sm backdrop-blur-md text-primaryText p-1 mt-[4px] rounded-b-sm}`}>
                            <li>
                                <Link to="profile" className="flex w-full justify-between items-center px-4 my-4">
                                    <p>Pfrofile</p>
                                    <FontAwesomeIcon icon={faUser} />
                                </Link>
                            </li> 
                            <li>
                                <Link to="setings" className="flex w-full justify-between items-center px-4 my-4 ">
                                    <p>Setings</p>
                                    <FontAwesomeIcon icon={faGear} />
                                </Link>
                            </li>
                            <li className="flex w-full border-t-[.3px] border-darkText/20 justify-between items-center p-2 px-4">
                                <p className="">Logout</p>
                                <FontAwesomeIcon icon={faRightToBracket} />
                            </li>
                            
                        </ul>
                    }
                </div>
            </div>
            
        </>
    )
}