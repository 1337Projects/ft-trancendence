import React, { useContext, useState } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from "../../Contexts/authContext"
import { Form, Formik } from "formik"
import SettingsInput, { TextArea } from "./Input"


export default function Profile() {

    const appearence = useContext(ApearanceContext)
    const {user, authInfos, setUser} = useContext(UserContext) || {}
    const [images, setImages] = useState<{avatar : null | File, banner : null | File}>({avatar : null, banner: null})


    const initialValues = {
        username : user?.username,
        first_name : user?.first_name,
        last_name : user?.last_name,
        bio : user?.profile.bio,
    }

    const submit_handler = async  values => {

        try {
            const formdata = new FormData()
            formdata.append("user", JSON.stringify({username : values.username,  first_name : values.first_name, last_name : values.last_name, profile : {bio : values.bio}}))
            if (images.avatar)
                formdata.append("avatar" , images.avatar)
            if (images.banner)
                formdata.append("banner" , images.banner)
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/set_profile_data/`, {
                method: 'PUT',
                credentials:'include',
                body : formdata,
                headers: {
                    "Authorization" : `Bearer ${authInfos?.accessToken}`,
                }
            })

            if (!response.ok) {
                console.log(await response.json())
                throw Error("");
            }
            const data = await response.json()
            setUser!(data.res);
        } catch (err) {
            console.log(err.toString());
        }
    }

    return (
        <div className="p-2 md:px-6 w-full">
            <div className="w-full ">
                <div className="w-full relative h-[140px] rounded-sm">
                    <div className='top-0 h-[140px] w-full overflow-hidden rounded-md'>
                        <img src={user?.profile?.banner} className='min-w-full  w-fit min-h-full h-fit' alt="" />
                    </div>
                    <input
                        type="file" 
                        className="bg-darkItems/40 backdrop-blur-lg text-white rounded-sm p-2 w-fit absolute top-2 left-2 text-[12px]"
                        onChange={e => setImages(prev => {
                            return {...prev, banner: e.target.files![0]}
                        })}
                    />
                </div>
                <div className="user w-full flex mt-8">
                    <img src={user?.profile?.avatar} className="bg-white w-[60px] h-[60px] rounded-sm mr-3" alt="img" />
                    <div className="text-[10px]">
                        <input
                            type="file" 
                            className="bg-darkItems/40 backdrop-blur-lg text-white rounded-sm p-2 w-fit text-[12px]"
                            onChange={e => setImages(prev => {
                                return {...prev, avatar: e.target.files![0]}
                            })}
                        />
                        <p className="mt-2 text-[10pt]">JPG, PNG, JPEG</p>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <Formik
                    initialValues={initialValues}
                    onSubmit={submit_handler}
                >
                    <Form>
                        <SettingsInput type="text" name="username" id="username" placeholder="joedeo" label="username" />
                        <SettingsInput type="text" name="first_name" id="first_name" placeholder="joe" label="first name" />
                        <SettingsInput type="text" name="last_name" id="last_name" placeholder="deo" label="last name" />
                        <TextArea name="bio" id="bio" label="bio" placeholder="bio" />
                        <button type="submit" style={{background:appearence?.color}} className="mt-10 w-full h-[45px] text-white capitalize text-md rounded" >save changes</button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}