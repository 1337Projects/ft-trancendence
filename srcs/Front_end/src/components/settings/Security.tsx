import React, { useContext, useEffect, useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa"
import { Formik, Form } from 'formik'
import SettingsInput from "./Input"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { UserContext } from '@/Contexts/authContext'
import TwoFImg from "./TwoFImg"
import TwoFactor from "../auth/2fa"
import Alert from "../ui/Alert"
import * as Yup from 'yup'
import { AlertType } from "@/types/indexTypes"
import { toast } from "react-toastify"


function SecurityItem({children} : { children : React.ReactNode }) {
    return (
        <li 
            className="flex h-[40px] cursor-pointer justify-between items-center text-[10pt] w-fit capitalize"
        >
            {children}
        </li>
    )
}

const ValidationSchema = Yup.object({
    old_password : Yup.string().required('REQUIRED !').min(10, 'MUST BE AT LEAST 10 CHARACHTERS'),
    new_password : Yup.string().required('REQUIRED !').min(10, 'MUST BE AT LEAST 10 CHARACHTERS')
})

function ChangePassword() {
    const { color, theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}
    const [ alert, setAlert ] = useState<AlertType | null>(null)



    async function submitHandler(values : {old_password : string, new_password : string}) {

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
                const { error } = await response.json()
                throw Error(error)
            }
    
            setAlert({"type" : "success", "message" : ["your password has been updated successfully"]})
        } catch (err) {
            setAlert({"type" : "error" , "message" : [err instanceof Error ? err.toString() : "error occured"]})
        }
        setTimeout(() => {
            setAlert(null)
        }, 2000)
    }

    

    return (
        <div className={`w-full h-fit border-[1px] rounded p-6 mt-4 ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
            {
                alert && <Alert alert={alert} alertHandler={setAlert} />
            }
            
            <Formik
                initialValues={{
                    old_password : '',
                    new_password : ''
                }}
                validationSchema={ValidationSchema}
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
    const [twoF, setTwoF] = useState(true)
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
        })
        .catch((error) => {
            toast.error(error instanceof Error ? error.toString() : "somthing went wrong...")
        })
    }

    useEffect (() => {

        const fetchTwofa = async () => {
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
                if (twofa === 'True')
                {
                    setTwofa(true)
                } else {
                    setTwofa(false)
                }
            }
            catch(err) {
                toast.error(err instanceof Error ? err.toString() : "somthing went wrong...")
            }
        }

        fetchTwofa()
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
                                <TwoFImg />
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
                    
                    onClick={submitCancel}
                    className={` p-[10px] rounded-[5px] hover:bg-[#747474]
                    ${appearence?.theme === 'light' ? 'text-[#fff]' : 'text-[#000]'}
                    `}>
                        Turn OFF
                    </button>
                    <button
                    style={{ backgroundColor: appearence?.color }}
                    onClick={() => setCheck(!showCheck)} className={`p-[10px] rounded-[5px] text-[#fff] `}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}

