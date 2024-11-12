import React, { useContext, useState } from "react"
import { FaAngleDown, FaAngleUp, FaLocationArrow } from "react-icons/fa"
import { Formik, Form } from 'formik'
import SettingsInput from "./Input"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from '../../Contexts/authContext'

function SecurityItem({children}) {
    return (
        <li 
            className="flex h-[40px] cursor-pointer justify-between items-center text-[10pt] mt-10 w-fit capitalize"
        >
            {children}
        </li>
    )
}


function ChangePassword() {
    const { color, theme } = useContext(ApearanceContext) || {}
    const { authInfos } = useContext(UserContext) || {}

    async function submitHandler(values) {

        const response = await  fetch(`${import.meta.env.VITE_API_URL}users/changePassword/`, {
            method : 'POST',
            headers : { 
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${authInfos?.accessToken}`
            },
            credentials : 'include',
            body : JSON.stringify(values)
        })

        if (!response.ok) {
            console.log(await response.json())
        }

        console.log('changed')

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
    const [changePass, setChangePass] = useState(false)
    const [twoF, setTwoF] = useState(false)
    const { color, theme } = useContext(ApearanceContext) || {}
    return (
        <div className="">
            <ul>
                <div onClick={() => setChangePass(prev => !prev)}>
                    <SecurityItem >
                        <p className="mr-1">change password</p>
                        { changePass ? <FaAngleUp /> :  <FaAngleDown /> }
                    </SecurityItem>
                </div>
                { changePass && <ChangePassword /> }
                <div onClick={() => setTwoF(prev => !prev)}>
                    <SecurityItem>
                        <p className="mr-1">two factor authentification?</p>
                        { twoF ? <FaAngleUp /> :  <FaAngleDown /> }
                    </SecurityItem>
                </div>
                {twoF && 
                    <div className={`mt-4 grid h-fit grid-cols-2 gap-2 border-[1px]  p-4 rounded ${theme == 'light' ? "border-black/20" : "border-white/20"}`}>
                        <div className="w-full h-full p-2">
                            <h1 className="capitalize text-md">turn on two-factor authentification</h1>
                            <p className="text-xs mt-4 lowercase leading-5">Prevent hackers from accessing your account with an additional layer of security.</p>
                            <button style={{background : color}} className="mt-10 text-white p-3 px-6 text-xs rounded">turn on 2-f authentification</button>
                        </div>
                        <div className="w-full h-full p-4 flex justify-center items-center">
                            <img src="/2f.svg" className="w-[160px] h-auto" alt="" />
                        </div>
                    </div>
                }
            </ul>
        </div>
    )
}
