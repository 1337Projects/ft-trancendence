import { OauthProviders } from "./Oauth"
import { Link, useNavigate } from "react-router-dom"
import React, { useState } from "react"
import { Form, Formik } from "formik"
import MyInput from "../ui/Input"
import * as yup  from 'yup'
import Alert from "../ui/Alert"
import { AlertType } from "../../Types"

export default function Signup() {

    const navigation = useNavigate()

    const validate = yup.object({
        username : yup.string().required('required !').max(15, 'Must be 10 characters or less'),
        password : yup.string().required('required !').min(10, 'Must be 10 characters or more'),
        email : yup.string().required('required !').email(),
        first_name : yup.string().required('required !'),
        last_name : yup.string().required('required !')
    })

    const [alert, setAlert] = useState<AlertType | null>(null)


    const signupHandler = async values => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}users/api/register/`, {
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(values)
            })
            
            if (!response.ok) {
                setAlert(null)
                const { error } = await response.json()
                console.log("error => ", error)
                for (const [key, value] of Object.entries(error)) {
                    setAlert(prev => prev ? {message : [...prev.message, `${key} : ${value}`], type : 'error'} :  {message : [`${key} : ${value}`], type : 'error'})
                }
                return;
            }

            setAlert({message : ['you  have been registered successfully'], type : 'success'})

            setTimeout(() => {
                navigation("../2fa")
            }, 1000)

        } catch (error) {
            setAlert(prev => prev ? {message : [...prev.message, error.toString()], type : 'error'} : {message : [error.toString()], type : 'error'})
        }
    }

    return (
        <div className="h-[100vh] overflow-y-scroll">
            <div className="heading w-full p-1 text-center">
                <h1 className="text-[40pt] font-semibold uppercase">welcome back</h1>
                <p className="text-[8pt] mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, cumque.</p>
            </div>
            <div className="w-full max-w-[400px] mx-auto mt-10">
                { alert && <Alert alert={alert} alertHandler={setAlert} /> }
                <div className="grid mt-6 w-full">
                    <Formik 
                        initialValues={{
                            username : '',
                            password : '',
                            email : '',
                            first_name : '',
                            last_name : ''
                        }}
                        validationSchema={validate}
                        onSubmit={(values) => signupHandler(values)}
                    >
                        <Form>
                            <div className="grid grid-cols-2 gap-2">
                                <MyInput type="text" name="first_name" id="first_name" label="first name" placeholder="jhon" />
                                <MyInput type="text" name="last_name" id="last_name" label="last name" placeholder="deo" />
                            </div>
                            <MyInput type="text" name="username" id="username" label="username" placeholder="jhon deo" />
                            <MyInput type="email" name="email" id="email" label="email" placeholder="jhondeo@example.com" />
                            <MyInput type="password" name="password" id="password" label="password" placeholder="*****************" />
                            <button type="submit" className="mt-10 bg-darkItems w-full h-12 rounded text-white text-[14pt] capitalize">create account</button>
                        </Form>
                    </Formik>
                    <div>
                        <OauthProviders />
                    </div>
                    <p className="mt-10 text-center">
                        already have an account ? 
                        <Link to="../login" className="font-bold uppercase ml-2">Login</Link>
                    </p>
                </div>
            </div>
       </div> 
    )
}