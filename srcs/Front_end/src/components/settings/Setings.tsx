import React, { useContext, useEffect, useState } from "react";
import { ApearanceContext } from "../../Contexts/ThemeContext";
import { FaGear, FaShield } from "react-icons/fa6";
import { FaBell, FaLanguage, FaLocationArrow, FaPalette, FaSun, FaUser } from "react-icons/fa";
import { UserContext } from "../../Contexts/authContext";


function Avatars({user, handler, images}) {
    let {theme} = useContext(ApearanceContext) || {theme : ""}

    return (
        <div className="w-full ">
            <div className="w-full relative h-[100px] rounded-sm">
                <div className='top-0 h-[100px] w-full overflow-hidden'>
					<img src={user?.profile?.banner} className='min-w-full w-fit min-h-full h-fit' alt="" />
				</div>
                <input
                    type="file" 
                    onChange={(e) => handler({...images, banner : e.target.files})}
                    className="bg-darkItems/40 backdrop-blur-lg p-2 w-fit absolute top-0 text-[12px]"
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
    const appearence = useContext(ApearanceContext)
    const {user, authInfos, setUser} = useContext(UserContext) || {}
    const [disabled, setDisabled] = useState(true)
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
                "Authorization" : `Bearer ${authInfos?.accessToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.status == 200) {
                setUser!(data.res)
                setUserData(data.res)
            } 
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="">
            <Avatars user={userData} handler={setImages} images={images}/>
            <ul className="mt-8"> 
                <div>
                    <SettingsInput theme={appearence?.theme} value={userData?.username} name="username" type="text" handler={setUserData} />
                </div>
                <div className="mt-8">
                    <SettingsInput theme={appearence?.theme} value={userData?.first_name} name="first_name" type="text" handler={setUserData} />
                </div>
                <div className="mt-8">
                    <SettingsInput theme={appearence?.theme} value={userData?.last_name} name="last_name" type="text" handler={setUserData} />
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
                            value={userData?.profile?.bio}
                            rows="4" className={`p-2 focus:outline-none rounded-sm w-[130px] ${appearence?.theme === 'light' ? "border-lightText border-[.3px]" : "bg-darkBg"} px-2 w-[230px] text-[10px]`} type="text" />
                    </label>
                </li>
                
            </ul>
            <button  onClick={updateDatahandler} style={{background:appearence?.color}} className="text-white cursor-pointer p-2 mt-8 rounded-sm w-[230px] h-[35px] flex items-center justify-center">save changes</button>
        </div>
    )
}


function SecurityItem({children}) {
    const [show, setShow] = useState(false)
    return (
        <li className="flex justify-between items-center text-[10px] w-fit capitalize mt-10" onClick={() => setShow(!show)}>
            {children}
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
                <SecurityItem>
                    <p className="mr-1">change password</p>
                    <FaShield />
                </SecurityItem>
                <SecurityItem>
                    <p>two factor authentification?</p>
                </SecurityItem>
                <SecurityItem>
                    <p className="mr-1">connection logs</p>
                    <FaLocationArrow />
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
    const {theme} = useContext(ApearanceContext) || {theme : ""}
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

   const {theme , color , themeHandler, colorHandler} = useContext(ApearanceContext) || {}

    return (
        <div className="mt-4">
            <ul>
                <li className="mt-1">
                    <label className="text-[10px]">
                        <div className="flex justify-between items-center w-[230px]  px-1">
                            <p>color</p>
                            <FaPalette />
                        </div>
                        <Select val={color} handler={colorHandler}>
                            {colors.map(c => <option key={c.id} value={c.color}>{c.name}</option>)}
                        </Select>
                    </label>
                </li>
                <li className="mt-10">
                    <label className="text-[10px]">
                        <div className="flex justify-between items-center w-[230px] px-1">
                            <p>theme</p>
                            <FaSun />
                        </div>
                        <Select val={theme} handler={themeHandler}>
                            <option value="light">light</option>
                            <option value="dark">dark</option>
                        </Select>
                    </label>
                </li>
                <li className="mt-10">
                    <label className="text-[10px]">
                        <div className="flex justify-between items-center w-[230px] px-1">
                            <p>language</p>
                            <FaLanguage />
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
    const {color, theme} = useContext(ApearanceContext) || {}
    const c = isActive === text ? color : ""

    return (
        <li style={{background: c}} className={`${theme === 'light' && isActive !== text ? "text-lightText" : "text-darkText"} cursor-pointer flex mt-2 justify-between text-[10px] px-4 h-[30px] items-center rounded-sm`} onClick={() => handler(text)}>
            <p>{text}</p>
            {icon}
        </li>
    )
}


function SideList({item, handler}) {
    return (
        <ul>
            <ListItem text="Profile" icon={<FaUser />} isActive={item} handler={handler}/>
            <ListItem text="Security" icon={<FaBell />} isActive={item} handler={handler}/>
            <ListItem text="Notifications" icon={<FaBell />} isActive={item} handler={handler}/>
            <ListItem text="Apperance" icon={<FaPalette />} isActive={item} handler={handler}/>
        </ul>
    )
}



export default function Setings() {
    
    const [item, setItem] = useState('Profile')
    const {theme} = useContext(ApearanceContext) || {}

    return (
        <div className={`${theme === 'light' ? "bg-lightItems text-lightText" : "bg-darkItems text-darkText"} p-1 w-full flex-grow h-[94vh] rounded mt-2`}>
            <div className="header w-full h-[50px] flex justify-between items-center text-[12px] px-4">
                <h1 className="font-kaushan">settings</h1>
                <FaGear />
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