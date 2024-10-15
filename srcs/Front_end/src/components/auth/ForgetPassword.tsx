import React from "react"
import MyInput from "../ui/Input"
import { Form, Formik } from "formik"
import { Link } from "react-router-dom"

export default function ForgetPassword() {
    return (
       <div className="px-10">
            <div>
            <div className="text-center">
                <h1 className="font-bold uppercase text-[18pt]">Forget your passowrd ?</h1>
                <p className="mt-4 text-[8pt]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit voluptatum nihil dignissimos?</p>
            </div>
            <div className="mt-14">
                <Formik
                    initialValues={{
                        email : ''
                    }}
                    onSubmit={() => {}}
                >
                    <Form>
                        <MyInput type="email" id="email" label="email" name="email" placeholder="email@example.com" />
                        <button type="submit" className="mt-10 bg-darkItems w-full h-12 rounded text-white text-[14pt] capitalize">reset</button>
                    </Form>
                </Formik>
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