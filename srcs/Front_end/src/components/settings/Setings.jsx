import { faBell, faGear, faLanguage, faLocation, faMailBulk, faMailReply, faMoon, faPalette, faPassport, faPen, faShieldHalved, faSun, faUser, faXmarksLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { ColorContext, ColorToggelContext, ThemeContext, ThemeToggelContext } from "../../Contexts/ThemeContext";


// icon-primary 20px
// icon-secendary 12px
// text-primary 14px
// text-secendar 10px

function Avatars() {
    const theme = useContext(ThemeContext)
    return (
        <div className="w-full p-1 my-2">
            <div className="user flex">
                <img src="/ava2.png" className="w-[40px] h-fit rounded-sm mr-3" alt="" />
                <div className="text-[10px]">
                    <button className={`${theme === 'light' ? "bg-lightText text-lightItems" : "bg-black/30"}  p-1 rounded-sm`}>change avatar</button>
                    <p className="mt-2 text-[8px]">JPG, PNG, JPEG, !MB max.</p>
                </div>
            </div>
            <div className="user flex mt-10">
                <img src="/aamhamdi1.jpeg" className="w-[40px] h-[40px] rounded-sm mr-3" alt="" />
                <div className="text-[10px]">
                    <button className={`${theme === 'light' ? "bg-lightText text-lightItems" : "bg-black/30"}  p-1 rounded-sm`}>change picture</button>
                    <p className="mt-2 text-[8px]">JPG, PNG, JPEG, !MB max.</p>
                </div>
            </div>
        </div>
    )
}

function Profile() {
    const theme = useContext(ThemeContext)
    return (
        <div>
            <Avatars />
            <ul>
                <li className="my-10">
                    <label >
                        <div className="flex text-[10px] items-center justify-between w-[230px] my-2 px-2">
                            <p>username</p>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <input className={` focus:outline-none rounded-sm px-2 ${theme === 'light' ? "border-lightText border-[.3px]" : "bg-darkBg"} w-[230px] text-[10px] h-[40px]`} value="aamhamdi" type="text" />
                    </label>
                </li>
                <li className="my-4">
                    <label >
                        <div className="flex text-[10px] items-center justify-between w-[230px] my-2 px-2">
                            <p>email</p>
                            <FontAwesomeIcon icon={faMailBulk} />
                        </div>
                        <input className={` focus:outline-none rounded-sm w-[130px] ${theme === 'light' ? "border-lightText border-[.3px]" : "bg-darkBg"} px-2 w-[230px] h-[40px] text-[10px]`} value="example@gmail.com" type="text" />
                    </label>
                </li>
                
            </ul>
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