import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from 'formik'
import { OauthProviders } from './Oauth';
import MyInput from "../ui/Input";
import * as yup from 'yup'
import Alert from "../ui/Alert";
import { UserContext } from "../../Contexts/authContext";
import { AlertType } from "@/types";

const validate = yup.object({
    email : yup.string().required('required !').email(),
    password : yup.string().required('required !').min(10, 'Must be 10 characters or more')
})

export default function Login() {
    const navigation = useNavigate()
    const [alert, setAlert] = useState<AlertType | null>(null)
    const { setAuthInfosHandler } = useContext(UserContext) || {}

    const loginHandler = async (values : {email : string, password : string}) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/api/login/`, {
                method : 'POST',
                credentials : 'include',
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(values)
            })
            
            if (!response.ok) {
                const { error } = await response.json()
                throw Error(error)
            }

            const data = await response.json()
            if (data['2fa'] === 'True')
            {
                navigation("../2faCheck")
            }
            else {
                setAuthInfosHandler!(data.access)
                navigation("../../dashboard/game")

            }
            // if has 2fa enabke
            // else navigation("../../dashboard/game")

        } catch (error) {
            setAlert({message : [error instanceof Error ? error.toString() : "An error has been ocured!"], type : 'error'})
        }
    }

    return (
       <div className="overflow-scroll h-full w-full flex items-center justify-center">
        <div className="h-full max-h-[700px]">
            <div className="heading w-full p-1 text-center">
                <h1 className="text-[40pt] font-semibold uppercase">welcome back</h1>
                <p className="text-[8pt] mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, cumque.</p>
            </div>
            <div className="w-full max-w-[400px] mx-auto mt-2">
                { alert && <Alert alert={alert} alertHandler={setAlert} /> }
                <div className="grid mt-6 w-full">
                    <Formik 
                        initialValues={{
                            email : '',
                            password : '',
                            remember : false
                        }}
                        validationSchema={validate}
                        onSubmit={(values) => loginHandler(values)}
                    >
                        <Form>
                            <MyInput type="email" name="email" id="email" label="email" placeholder="jhondeo@example.com" />
                            <MyInput type="password" name="password" id="password" label="password" placeholder="*****************" />
                            <div className="mt-10 flex items-center">                               
                                <Link to="../forgetPassowrd" className="font-bold capitalize">forget password ?</Link>
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
       </div> 
    )
}