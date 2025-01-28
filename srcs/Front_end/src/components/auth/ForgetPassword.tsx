import { useState } from "react"
import MyInput from "../ui/Input"
import { Form, Formik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from 'yup' 
import Alert from "../ui/Alert"
import { AlertType } from "@/types/indexTypes"


async function requestLinkHandler(values : {email : string}) {
    try {
        const url = `${import.meta.env.VITE_API_URL}api/users/forgetPassword/`
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
            message : [err instanceof Error ? err.message : 'An unknown error occurred'],
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

async function resetPasswordHandler(values : {password : string, token : string, email : string} ) {

    try { 
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/confirmPassword/`, {
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
            message : [err instanceof Error ? err.toString() : "An unknown error occurred"],
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
       <div className="px-10 h-full flex items-center justify-center">
            <div className="h-full max-h-[500px]">
                <div className="text-center">
                    <h1 className="font-bold uppercase text-[18pt]">Forget your passowrd ?</h1>
                    <p className="mt-4 text-[8pt] max-w-[450px] mx-auto">No worries! If you've forgotten your password, simply follow the steps to reset it. Enter your registered email address, and we’ll send you a link to create a new password. It’s quick, easy, and ensures you regain access to your account securely.</p>
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
                                if (token && email) {
                                    const ret = await resetPasswordHandler({...values, token , email})
                                    setAlert(ret)
                                    if (ret.type === "success") {
                                        setTimeout(() => navigate('/auth/login') , 1000 * 2)
                                    }
                                }
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
                        <Link to="/auth/login">
                            login ?
                        </Link>
                    </span>
                </h1>
            </div>
       </div>
    )
}