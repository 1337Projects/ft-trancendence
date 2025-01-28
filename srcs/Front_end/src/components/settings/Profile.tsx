import  { useContext, useState } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { UserContext } from "../../Contexts/authContext"
import { Form, Formik } from "formik"
import SettingsInput, { TextArea } from "./Input"
import { AlertType } from "@/types/indexTypes"
import Alert from "../ui/Alert"

function checkImage(img : File) {
    const type = img.type.split("/")
    if (type?.[0] !== "image" || (type?.[1] !== "png" && type?.[1] != "jpg" && type?.[1] != "jpeg")) {
        throw new Error("avatar should be an image (png, jpg, jpeg)")
    }
    if (img.size > 2 * 1024 * 1024) {
        throw new Error("avatar size should be less than 2mb")
    }
}

export default function Profile() {

    const appearence = useContext(ApearanceContext)
    const {user, authInfos, setUser} = useContext(UserContext) || {}
    const [images, setImages] = useState<{avatar : null | File, banner : null | File}>({avatar : null, banner: null})
    const [alert, setAlert] = useState<AlertType | null>(null)

    const initialValues = {
        first_name : user?.first_name || "",
        last_name : user?.last_name || "",
        bio : user?.profile.bio || "",
    }

    const submit_handler = async  (values : {first_name : string, last_name : string, bio : string}) => {

        try {
            const formdata = new FormData()
            formdata.append("user", JSON.stringify({first_name : values.first_name, last_name : values.last_name, profile : {bio : values.bio}}))
            if (images.avatar) {
                checkImage(images.avatar)
                formdata.append("avatar" , images.avatar)
            }
            if (images.banner) {
                checkImage(images.banner)
                formdata.append("banner" , images.banner)
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/set_profile_data/`, {
                method: 'PUT',
                credentials:'include',
                body : formdata,
                headers: {
                    "Authorization" : `Bearer ${authInfos?.accessToken}`,
                }
            })

            if (!response.ok) {
                const {message} = await response.json()
                throw Error(message)
            }
            const data = await response.json()
            setUser!(data.res);
            setAlert({
                type : "success",
                message : ["your data has been updated successfully"]
            })
        } catch (err) {
            setAlert({
                type : "error",
                message : [err instanceof Error ? err.toString() : "error occured"]
            })
        }
        setTimeout(() => {
            setAlert(null)
        }, 2000)
    }


    return (
        <div className="px-2 md:px-6 w-full">
            <div className="w-full">
                {
                    alert &&
                    <div className="w-full]">
                        <Alert alert={alert} alertHandler={setAlert} />
                    </div>
                }
                <div className="w-full mt-4 relative h-[140px] rounded-sm">
                    <div className='top-0 h-[140px] w-full overflow-hidden rounded-md'>
                        <img src={user?.profile?.banner} className='min-w-full  w-fit min-h-full h-fit' alt="" />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="bg-darkItems/40 backdrop-blur-lg text-white rounded-sm p-2 w-fit absolute top-2 left-2 text-[12px]"
                        onChange={e => setImages(prev => {
                            return {...prev, banner: e.target.files![0] ?? null}
                        })}
                    />
                </div>
                <div className="w-full flex mt-8">
                    <img src={user?.profile?.avatar} className="bg-white w-[60px] h-[60px] rounded-sm mr-3" alt="img" />
                    <div className="text-[10px] w-full relative">
                        <input
                            type="file" 
                            accept="image/*"
                            className=" absolute bg-darkItems/40 backdrop-blur-lg text-white rounded-sm p-2 text-[12px]"
                            onChange={e => setImages(prev => {
                                return {...prev, avatar: e.target.files![0] ?? null}
                            })}
                        />
                        <h1 className="bottom-0 uppercase left-0 absolute w-full">
                            max size 2MB (png, jpg, jpeg)
                        </h1>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <Formik
                    initialValues={initialValues}
                    onSubmit={submit_handler}
                >
                    <Form>
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