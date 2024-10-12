import React from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from 'formik'
import { OauthProviders } from './Oauth';
import MyInput from "./Input";
import * as yup from 'yup'

const validate = yup.object({
    username : yup.string().required('required !').max(15, 'Must be 10 characters or less'),
    password : yup.string().required('required !').min(10, 'Must be 10 characters or more')
})

export default function Login() {
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
                        password : ''
                    }}
                    validationSchema={validate}
                    onSubmit={(values) => {console.log(values)}}
                >
                    <Form>
                        <MyInput type="text" name="username" label="username" placeholder="jhon deo" />
                        <MyInput type="password" name="password" label="password" placeholder="*****************" />
                        <div className="mt-10 flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" name="remember"  />
                                <p className="ml-2 lowercase">remember me</p>
                            </div>
                            <p className="font-bold capitalize">forget password ?</p>
                        </div>
                        <button type="submit" className="mt-10 bg-darkItems w-full h-12 rounded text-white text-[14pt]">Login</button>
                    </Form>
                </Formik>
                <div>
                    <OauthProviders />
                </div>
                <p className="mt-10 text-center">
                    you dont have account ? 
                    <Link to="../signup" className="font-bold uppercase ml-2">register</Link>
                </p>
            </div>
        </div>
       </div> 
    )
}