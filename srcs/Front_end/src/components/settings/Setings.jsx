import { faBell, faGear, faLanguage, faLocation, faMailBulk, faMailReply, faMoon, faPalette, faPassport, faPen, faShieldHalved, faSun, faUser, faXmarksLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { ColorContext, ColorToggelContext, ThemeContext, ThemeToggelContext } from "../../Contexts/ThemeContext";
import {authContext, userContext, userContextHandler} from '../../Contexts/authContext'

function Avatars({user, handler, images}) {
    const theme = useContext(ThemeContext)
    return (
        <div className="w-full">
            <div className="w-full h-[100px] bg-banner bg-cover rounded-sm p-2">
                <input
                    type="file" 
                    onChange={(e) => handler({...images, banner : e.target.files})}
                    className="bg-darkItems/40 backdrop-blur-lg p-2 w-fit text-[12px]"
                />
            </div>
            <div className="user w-full flex mt-8">
                <img src={user?.profile?.image} className="bg-white w-[60px] h-[60px] rounded-sm mr-3" alt="img" />
                <div className="text-[10px]">
                    <input
                        type="file"
                        onChange={(e) => handler({...images, avatar : e.target.files})}
                        className={`${theme === 'light' ? "bg-lightText text-lightItems" : "bg-black/30"} capitalize p-2 rounded-sm w-[160px]`}
                    />
                    <p className="mt-2 text-[10px]">JPG, PNG, JPEG, 3MB max.</p>
                </div>
            </div>
        </div>
    )
}

function SettingsInput({theme, value, name, type, handler}) {

    return (
        <div className="w-full max-w-[230px] block">
            <label className="w-full block mb-2 text-[10px] capitalize">{name}</label>
            <input 
                className={`focus:outline-none rounded-sm px-2 ${theme === 'light' ? "border-lightText border-[.3px]" : "bg-darkBg"} w-full text-[10px] h-[40px]`} 
                value={value} type={type} 
                onChange={(e) => handler(prev => {
                    return {...prev, [name]: e.target.value}
                })}
            />
            
        </div>
    )
}

function Profile() {
    const theme = useContext(ThemeContext)
    const user = useContext(userContext)
    const userHandler = useContext(userContextHandler)
    const token = useContext(authContext)
    const color = useContext(ColorContext)
    const [disabled, setDisabled] = useState(true)
    const [alert, setAlert] = useState({})
    const [userData, setUserData] = useState({...user})
    const [images, setImages] = useState({avatar : null, banner: null})

    function updateDatahandler() {
        const formdata = new FormData()
        formdata.append("user", JSON.stringify(userData))
        if (images.avatar)
            formdata.append("avatar" , images.avatar[0])
        if (images.banner)
            formdata.append("banner" , images.banner[0])
        fetch('http://localhost:8000/api/profile/set_profile_data/', {
            method: 'PUT',
            credentials:'include',
            body : formdata,
            headers: {
                "Authorization" : `Bearer ${token.mytoken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.status == 200) {
                userHandler(data.res)
            } 
            else if (data.status == 401) {
                setAlert({"data" : data.err})
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="">
            {
                alert.data != null &&
                <div className="bg-red-500 p-2 px-4 w-fit text-[11px] rounded-sm capitalize">
                    {alert.data}
                </div>
            }
            <Avatars user={user} handler={setImages} images={images}/>
            <ul className="mt-8"> 
                <div>
                    <SettingsInput theme={theme} value={userData?.username} name="username" type="text" handler={setUserData} />
                </div>
                <div className="mt-8">
                    <SettingsInput theme={theme} value={userData?.first_name} name="first_name" type="text" handler={setUserData} />
                </div>
                <div className="mt-8">
                    <SettingsInput theme={theme} value={userData?.last_name} name="last_name" type="text" handler={setUserData} />
                </div>
                <li className="mt-8">
                    <label>
                        <div className="flex text-[10px] capitalize items-center justify-between w-[230px] mb-2">
                            <p>bio</p>
                        </div>
                        <textarea
                            onChange={(e) => setUserData(prev => {
                                setDisabled(false)
                                return {...prev,  profile : {...prev.profile, bio:e.target.value}}
                            })}
                            value={userData.profile.bio}
                            rows="4" className={`p-2 focus:outline-none rounded-sm w-[130px] ${theme === 'light' ? "border-lightText border-[.3px]" : "bg-darkBg"} px-2 w-[230px] text-[10px]`} type="text" />
                    </label>
                </li>
                
            </ul>
            <button  onClick={updateDatahandler} style={{background:color}} className="text-white cursor-pointer p-2 mt-8 rounded-sm w-[230px] h-[35px] flex items-center justify-center">save changes</button>
        </div>
    )
}


function SecurityItem({children, cmp}) {
    const [show, setShow] = useState(false)
    return (
        <li className="flex justify-between items-center text-[10px] w-fit capitalize mt-10" onClick={() => setShow(!show)}>
            {children}
            {show && cmp}
        </li>
    )
}

function Input() {
    return (
        <label>
            <input type="text" name="" id="" />
        </label>
    )
}

function Security() {
    return (
        <div>
            <ul>
                <SecurityItem cmp={<Input />}>
                    <p className="mr-1">change password</p>
                    <FontAwesomeIcon icon={faShieldHalved} />
                </SecurityItem>
                <SecurityItem>
                    <p>two factor authentification?</p>
                </SecurityItem>
                <SecurityItem>
                    <p className="mr-1">connection logs</p>
                    <FontAwesomeIcon icon={faLocation} />
                </SecurityItem>
            </ul>
        </div>
    )
}

function Notifications() {
    return (
        <div className="mt-4">
            <div>
                <label className="flex items-center justify-between w-fit text-[10px]">
                    <input className="mr-1 rounded-full w-4" type="checkbox" name="" id="" />
                    <p>All Notifications</p>
                </label>
                <ul className="mt-4 ml-4">
                    <li className="mt-10">
                        <label className="flex items-center justify-between w-fit text-[10px]">
                            <input className="mr-1 w-4" type="checkbox" name="" id="" />
                            <p>Messages</p>
                        </label>
                        <p className="text-[8px] font-light mt-1 ml-3">Get notified when someones send you a message.</p>
                    </li>
                    <li className="mt-10">
                        <label className="flex items-center justify-between w-fit text-[10px]">
                            <input className="mr-1 w-4" type="checkbox" name="" id="" />
                            <p>friend request</p>
                        </label>
                        <p className="text-[8px] font-ligth mt-1 ml-3">Get notified when someones send you a friend request.</p>
                    </li>
                    <li className="mt-10">
                        <label className="flex items-center justify-between w-fit text-[10px]">
                            <input className="mr-1 w-4" type="checkbox" name="" id="" />
                            <p>game invites</p>
                        </label>
                        <p className="text-[8px] mt-1 ml-3">Get notified when someones invite you to play.</p>
                    </li>
                    <li className="mt-10">
                        <label className="flex items-center justify-between w-fit text-[10px]">
                            <input className="mr-1 w-4" type="checkbox" name="" id="" />
                            <p>authentification</p>
                        </label>
                        <p className="text-[8px] mt-1 ml-3">Get notified when you loged-in from another device.</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

function Select({children, val, handler}) {
    const [value, setValue] = useState(val)
    const theme = useContext(ThemeContext);
    return (
        <select name="selectedFruit" className={`mt-2 px-2 rounded-sm w-[230px] h-[40px] text-[10px] ${theme === 'light' ? "border-lightText border-[.3px]" : "bg-darkBg"} focus:outline-none`} value={value} onChange={(e) => {
            handler(e.target.value);
            setValue(e.target.value);
        }}>
            {children}
        </select> 
    )
}

const colors = [
    {id:0, color:'#FFC100', name:'yellow'},
    {id:1, color:'#C53F3F', name:'red'},
    {id:2, color:'#92E3A9', name:'green'},
    {id:3, color:'#407BFF', name:'blue'},
    {id:4, color:'#7E57C2', name:'purple'},
    {id:5, color:'#FF81AE', name:'pink'},
    {id:6, color:'#ff9800', name:'orange'},
    {id:7, color:'#009688', name:'green1'},
]

function Apperance() {

    const theme = useContext(ThemeContext)
    const color = useContext(ColorContext)
    const ThemeHandler = useContext(ThemeToggelContext)
    const ColorHandler = useContext(ColorToggelContext)

    return (
        <div className="mt-4">
            <ul>
                <li className="mt-1">
                    <label className="text-[10px]">
                        <div className="flex justify-between items-center w-[230px]  px-1">
                            <p>color</p>
                            <FontAwesomeIcon icon={faPalette} />
                        </div>
                        <Select val={color} handler={ColorHandler}>
                            {colors.map(c => <option key={c.id} value={c.color}>{c.name}</option>)}
                        </Select>
                    </label>
                </li>
                <li className="mt-10">
                    <label className="text-[10px]">
                        <div className="flex justify-between items-center w-[230px] px-1">
                            <p>theme</p>
                            <FontAwesomeIcon icon={faSun} />
                        </div>
                        <Select val={theme} handler={ThemeHandler}>
                            <option value="light">light</option>
                            <option value="dark">dark</option>
                        </Select>
                    </label>
                </li>
                <li className="mt-10">
                    <label className="text-[10px]">
                        <div className="flex justify-between items-center w-[230px] px-1">
                            <p>language</p>
                            <FontAwesomeIcon icon={faLanguage} />
                        </div>
                        <Select val="eng" handler={null}>
                            <option value="eng">English</option>
                            <option value="fr">Frensh</option>
                        </Select>
                    </label>
                </li>
                
            </ul>
        </div>
    )
}




function ListItem({text, icon, isActive, handler}) {
    const color = useContext(ColorContext)
    const c = isActive === text ? color : ""
    const theme = useContext(ThemeContext)

    return (
        <li style={{background: c}} className={`${theme === 'light' && isActive !== text ? "text-lightText" : "text-darkText"} cursor-pointer flex mt-2 justify-between text-[10px] px-4 h-[30px] items-center rounded-sm`} onClick={() => handler(text)}>
            <p>{text}</p>
            <FontAwesomeIcon icon={icon} />
        </li>
    )
}


function SideList({item, handler}) {
    return (
        <ul>
            <ListItem text="Profile" icon={faUser} isActive={item} handler={handler}/>
            <ListItem text="Security" icon={faShieldHalved} isActive={item} handler={handler}/>
            <ListItem text="Notifications" icon={faBell} isActive={item} handler={handler}/>
            <ListItem text="Apperance" icon={faPalette} isActive={item} handler={handler}/>
        </ul>
    )
}



export default function Setings() {
    
    const [item, setItem] = useState('Profile')
    const theme = useContext(ThemeContext)
    const ColorHandler = useContext(ColorToggelContext);

    return (
        <div className={`${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} p-1 w-full flex-grow h-[94vh] rounded mt-2`}>
            <div className="header w-full h-[50px] flex justify-between items-center text-[12px] px-4">
                <h1 className="font-kaushan">settings</h1>
                <FontAwesomeIcon icon={faGear} />
            </div>
            <div className="px-2 mt-2 flex justify-between">
                <div className="w-[200px] p-1">
                    <SideList item={item} handler={setItem} />
                </div>
                <div className="w-[60%] p-1">
                    {
                        item === 'Profile' && <Profile /> || item === 'Security' && <Security /> ||
                        item === 'Notifications' && <Notifications /> || item === 'Apperance' && <Apperance /> 
                    }
                </div>
            </div>
        </div>
    )
}