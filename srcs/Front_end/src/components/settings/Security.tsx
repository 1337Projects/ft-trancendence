import React, { useContext, useState } from "react"
import { FaAngleDown, FaAngleUp, FaLocationArrow } from "react-icons/fa"
import { Formik, Form } from 'formik'
import SettingsInput from "./Input"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from '../../Contexts/authContext'

function SecurityItem({children}) {
    const [show, setShow] = useState(false)
    return (
        <li className="flex justify-between items-center text-[10pt] mt-10 w-fit capitalize" onClick={() => setShow(!show)}>
            {children}
        </li>
    )
}


function ChangePassword() {
    const { color } = useContext(ApearanceContext) || {}
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
        <div className="w-full h-fit border-[1px] rounded p-6 mt-4 border-white/20">
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
                    <button style={{background : color}} type="submit" className="mt-6 w-full py-2 rounded capitalize">change password</button>
                </Form>
            </Formik>
        </div>
    )
}


export default function Security() {
    const [changePass, setChangePass] = useState(false)
    return (
        <div>
            <ul>
                <SecurityItem>
                    <p onClick={() => setChangePass(prev => !prev)} className="mr-1">change password</p>
                    { changePass ? <FaAngleUp /> :  <FaAngleDown /> }
                </SecurityItem>
                { changePass && <ChangePassword /> }
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
