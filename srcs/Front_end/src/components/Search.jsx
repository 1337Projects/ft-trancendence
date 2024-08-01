import { faSearch, faCaretDown, faUser, faGear, faRightToBracket, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { ColorContext, ThemeContext } from "../Contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";


const users = [
    {id:0, username: 'aamhamdi', img:'/aamhamdi1.jpeg'},
    {id:1, username: 'nmaazouz', img:'/aamhamdi1.jpeg'},
    {id:2, username: 'oaboulgh', img:'/aamhamdi1.jpeg'},
    {id:3, username: 'kben-ham', img:'/aamhamdi1.jpeg'},
    {id:4, username: 'mel-harc', img:'/aamhamdi1.jpeg'},
]

function SearchResult({query, queryHandler}) {
    const res = users.filter(item => item.username.includes(query))
    const navigate = useNavigate()

    function eventHandler() {
        queryHandler('')
        navigate('/dashboard/profile')
    }

    return (
        <>
            <div className="text-[12px] w-full z-10 bg-darkItems border-r-[.2px] border-l-[.2px] border-b-[.2px] border-darkText/10 mt-2 absolute ml-[-2.5rem] p-4 h-fit max-h-">
                <ul>
                    {
                        res.length ? 
                        res.map(i => {
                            return <li key={i.id} className="flex my-2 items-center cursor-pointer" onClick={() => eventHandler()}>
                                <img  src={i.img} className="w-[27px] rounded-full mr-2" alt={i.img} />
                                <p className="lowercase">{i.username}</p>
                             </li>
                        }) : "Not result Found"
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
                   w-[190px] border-[.3px] h-full z-10 rounded-sm ml-2 shadow-sm cursor-pointer`} onClick={() => setShow(!show)}>
                    <div className="flex items-center justify-center h-full">
                        <div className="infos">
                            <div className="top flex text-small mb-1 justify-between items-center">
                                <p>enjoy</p>
                                <FontAwesomeIcon icon={!show ? faCaretDown : faCaretUp} />
                            </div>
                            <h1 className="text-primaryText font-bold">aamhamdi</h1>
                        </div>
                        <img className="w-[40px] rounded-[50%] h-25px border-[1px] ml-4" src="/aamhamdi1.jpeg" alt="avatar" />
                    </div>
                    {
                        show && 
                        <ul className={`${theme === 'light' ? "bg-lightItems" : "bg-darkItems"} text-primaryText p-1 rounded-b-sm}`}>
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
                            <li className="flex w-full justify-between items-center px-4 my-4">
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