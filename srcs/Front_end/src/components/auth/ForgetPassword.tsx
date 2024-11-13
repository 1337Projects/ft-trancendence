import React, { useEffect, useState } from "react"
import MyInput from "../ui/Input"
import { Form, Formik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from 'yup' 
import { AlertType } from "../../Types"
import Alert from "../ui/Alert"


async function requestLinkHandler(values) {
    try {
        const url = `${import.meta.env.VITE_API_URL}users/forgetPassword/`
        console.log(url)
        const response = await fetch(url, {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'                
            },
            credentials : 'include',
            body :  JSON.stringify(values),
        })

        if (!response.ok) {
            const { error } = await response.json()
            throw Error(error)
        }

        const { message } = await response.json()
        return {
            message : [message],
            type : "success"
        }

    } catch (err) {
        return {
            message : [err.toString()],
            type : "error"
        }
    }
}

const EmailvalidationSchema = Yup.object({
    email :  Yup.string().email('Invalid email').required('Required')
})

const PasswordvalidationSchema = Yup.object({
    password :  Yup.string().required('Required').min(10, 'your password must contain at least 10 chars')
})

async function resetPasswordHandler(values) {
    console.log(values)

    try { 
        const response = await fetch(`${import.meta.env.VITE_API_URL}users/confirmPassword/`, {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials : 'include',
            body :  JSON.stringify(values),
        })

        if (!response.ok) {
            const { error } =  await response.json()
            throw Error(error)
        }

        const { message } = await response.json()
        return {
            message : [message],
            type : "success"
        }


    } catch(err) {
        return {
            message : [err.toString()],
            type : "error"
        }
    }
}

export default function ForgetPassword() {

    const params = new URLSearchParams(window.location.search)

    const token = params.get('token')
    const email = params.get('email')
    const [alert, setAlert] = useState<AlertType | null>(null)

    const navigate = useNavigate()
    

    return (
       <div className="px-10">
            <div>
            <div className="text-center">
                <h1 className="font-bold uppercase text-[18pt]">Forget your passowrd ?</h1>
                <p className="mt-4 text-[8pt]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit voluptatum nihil dignissimos?</p>
            </div>
            <div className="mt-14 max-w-[400px] mx-auto">
                {
                    alert && <Alert alert={alert} alertHandler={setAlert} />
                }
                {
                    token == null ?
                    <Formik
                        initialValues={{ email : '', }}
                        validationSchema={EmailvalidationSchema}
                        onSubmit={async (values) =>  setAlert(await requestLinkHandler(values))}
                    >
                        <Form>
                            <MyInput type="email" id="email" label="email" name="email" placeholder="email@example.com" />
                            <button type="submit" className="mt-10 bg-darkItems w-full h-12 rounded text-white text-[14pt] capitalize">reset</button>
                        </Form>
                    </Formik>
                    :
                    <Formik
                        initialValues={{ password : '' }}
                        validationSchema={PasswordvalidationSchema}
                        onSubmit={async (values) => {
                            setAlert(await resetPasswordHandler({...values, token , email}))
                            setTimeout(() => navigate('/auth/login') , 1000 * 3)
                        }}
                    >
                        <Form>
                            <MyInput type="password" id="password" label="new password" name="password" placeholder="***************" />
                            <button type="submit" className="mt-10 bg-darkItems w-full h-12 rounded text-white text-[14pt] capitalize">reset</button>
                        </Form>
                    </Formik>
                }
               
            </div>
            <h1 className="mt-10 text-center lowercase">
                you wanna go back to 
                <span  className="font-bold ml-2 uppercase">
                    <Link to="../login">
                        login ?
                    </Link>
                </span>
            </h1>
            </div>
       </div>
    )
}