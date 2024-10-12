import { OauthProviders } from "./Oauth"
import { Link } from "react-router-dom"
import React from "react"
import { Form, Formik } from "formik"
import MyInput from "./Input"
import * as yup  from 'yup'


export default function Signup() {

    const validate = yup.object({
        username : yup.string().required('required !').max(15, 'Must be 10 characters or less'),
        password : yup.string().required('required !').min(10, 'Must be 10 characters or more'),
        email : yup.string().required('required !').email('Invalid email address')
    })

    return (
        <div>
            <div className="heading w-full p-1 text-center">
                <h1 className="text-[40pt] font-semibold uppercase">welcome back</h1>
                <p className="text-[8pt] mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, cumque.</p>
            </div>
            <div className="w-full max-w-[400px] mx-auto mt-10">
                <div className="grid mt-6 w-full">
                    <Formik 
                        initialValues={{
                            username : '',
                            password : '',
                            email : '',
                        }}
                        validationSchema={validate}
                        onSubmit={(values) => {console.log(values)}}
                    >
                        <Form>
                            <MyInput type="text" name="username" label="username" placeholder="jhon deo" />
                            <MyInput type="email" name="email" label="email" placeholder="jhondeo@example.com" />
                            <MyInput type="password" name="password" label="password" placeholder="*****************" />
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