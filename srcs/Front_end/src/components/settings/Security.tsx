import React, { useContext, useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa"
import { Formik, Form } from 'formik'
import SettingsInput from "./Input"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from '../../Contexts/authContext'
import TwoFImg from "./TwoFImg"
import { Link } from "react-router-dom"
import TwoFactor from "../auth/2fa"
import MyUseEffect from "../../hooks/MyUseEffect"
function SecurityItem({children}) {
    return (
        <li 
            className="flex h-[40px] cursor-pointer justify-between items-center text-[10pt] w-fit capitalize"
        >
            {children}
        </li>
    )
}


function ChangePassword() {
    const { color, theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}


    async function submitHandler(values) {

        try {
            const response = await  fetch(`${import.meta.env.VITE_API_URL}api/users/changePassword/`, {
                method : 'POST',
                headers : { 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${authInfos?.accessToken}`
                },
                credentials : 'include',
                body : JSON.stringify(values)
            })
    
            if (!response.ok) {
                throw(await response.json())
            }
    
            console.log('changed')
        } catch (err) {
            console.log(err)
        }

    }

    

    return (
        <div className={`w-full h-fit border-[1px] rounded p-6 mt-4 ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
            <Formik
                initialValues={{
                    old_password : '',
                    new_password : ''
                }}
                onSubmit={submitHandler}
            >
                <Form>
                    <SettingsInput label="old password" id="old_password" name="old_password" type="password" placeholder="old password..." />
                    <SettingsInput label="new password" id="new_password" name="new_password" type="password" placeholder="new password..."  />
                    <button style={{background : color}} type="submit" className="mt-6 text-white w-full py-2 rounded">change password</button>
                </Form>
            </Formik>
        </div>
    )
}


export default function Security() {
    const [changePass, setChangePass] = useState(true)
    const [twoF, setTwoF] = useState(false)
    const { color, theme } = useContext(ApearanceContext) || {}
    const [showPopup, setShowPopup] = useState(false);
    const [showCheck, setCheck] = useState(false);
    const [twofaa, setTwofa] = useState(true);
    const { authInfos } = useContext(UserContext) || {}
    const appearence = useContext(ApearanceContext)

    
    const  submitCancel = () => {

        fetch(`${import.meta.env.VITE_API_URL}api/profile/2fa/disable/`, {
            method : 'PATCH',
            credentials : 'include',
            headers : { 
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${authInfos?.accessToken}`
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data['message'] === 'Secret key deleted successfully')
            {
                setCheck(!showCheck)
                setTwofa(!twofaa)
            }
            console.log('changed:', data)
        })
        .catch((e) => {
            console.log("errora", e)
        })
    }

    MyUseEffect ( async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/2fa/state/`, {
                    method: 'GET',
                    credentials : 'include',
                    headers : {
                        'Authorization' : `Bearer ${authInfos?.accessToken}`,
                    }
                })
                if (!response.ok) {
                    const { error } = await response.json()
                    throw  new Error(error)
                }
                const { twofa } = await response.json()
                // console.log(twofa)
                if (twofa === 'True')
                {
                    setTwofa(true)
                } else {
                    setTwofa(false)
                }
                // console.log(twofaa)
            }
            catch(err) {

            }
    }, [twofaa])
    return (
        <div className="h-full">
            <ul className="">
                <div onClick={() => setChangePass(prev => !prev)}>
                    <SecurityItem >
                        <p className="mr-1">change password</p>
                        { changePass ? <FaAngleUp /> :  <FaAngleDown /> }
                    </SecurityItem>
                </div>
                { changePass && <ChangePassword /> }
                <div onClick={() => setTwoF(prev => !prev)} className="mt-6">
                    <SecurityItem>
                        <p className="mr-1">two factor authentification?</p>
                        { twoF ? <FaAngleUp /> :  <FaAngleDown /> }
                    </SecurityItem>
                </div>
                {twoF && 
                    <div className={`mt-4 grid h-fit grid-cols-2 gap-2 border-[1px]  p-4 rounded ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
                        <div className="w-full h-full p-2">
                            <h1 className="capitalize text-md">
                                turn on two-factor authentification
                            </h1>
                            <p className="text-xs mt-4 lowercase leading-5">Prevent hackers from accessing your account with an additional layer of security.</p>
                            {
                                twofaa === false ?
                                <button onClick={() => setShowPopup(!showPopup)} style={{background : color}} className="mt-10 text-white  p-3 px-6 text-xs rounded">
                                turn on 2-f authentification
                                </button>
                                : 
                                <button onClick={() => setCheck(!showCheck)} style={{background : color}} className="mt-10 text-white  p-3 px-6 text-xs rounded">
                                turn off 2-f authentification
                                </button>
                            }
                        </div>
                        <div className="w-full h-full p-4 flex justify-center items-center">
                            <div className="w-[160px] ">
                                <TwoFImg color={color} theme={theme} />
                            </div>
                        </div>
                    </div>
                }
            </ul>
            {showPopup && (
                <div className={` h-[60%]  transition-all duration-300 ease-in-out ${1 ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'relative'}`}>
                    <TwoFactor are_you_in={false} cancel={showPopup} setShowPopup={setShowPopup} setTwofa={setTwofa} />
                </div>
            )}
            {showCheck && (
                <div className={`flex flex-col justify-around h-[150px]  transition-all duration-300 ease-in-out fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                p-6 text-white text-center rounded-lg
                'backdrop-blur-md
                ${appearence?.theme === 'light' ? 'bg-[#424242]': 'bg-[#b6b6b6]'  }
                `}>
                    <button
                    style={{ backgroundColor: appearence?.color }}
                    onClick={submitCancel} className="text-[#fff] p-[10px] rounded-[5px]">
                        Are you sure ???
                    </button>
                    <button onClick={() => setCheck(!showCheck)} className={`p-[10px] rounded-[5px] ${appearence?.theme === 'light' ? 'text-[#fff]' : 'text-[#000]'} `}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}

