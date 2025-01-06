
import { useField } from "formik"
import { useContext, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { FaEye, FaEyeSlash } from "react-icons/fa"

type InputPropsType = {
    label: string,
    id: string,
    name: string,
    type?: string,
    placeholder: string
}

export default function SettingsInput({label, ...props} : InputPropsType) {

    const { theme } = useContext(ApearanceContext) || {}
    const [field, meta] = useField(props)
    const [see, setSree] = useState(false)

    return (
        <div className="w-full mt-6 block">
            <label className="w-full block mb-4 text-[10pt] capitalize" htmlFor={props.id} >{label}</label>
            <div className="relative">
                <input 
                    {...props} {...field}
                    type={see ?  "text" : props.type}
                    className={`rounded  px-6 ${theme === 'light' ? "border-black/40" : "bg-darkItems border-white/20"} border-[.6px] w-full text-[10pt] h-[45px]`} 
                />
                {
                    props.type == 'password' &&
                    <div className="absolute top-4 right-4" onClick={() => setSree(prev => !prev)}>
                        { see  ? <FaEyeSlash /> : <FaEye /> }
                    </div>
                }
            </div>
            {meta.touched && meta.error ? <div className="text-red-500 lowercase mt-2">{meta.error}</div> : null}
        </div>
    )
}


export function TextArea({label, ...props} : InputPropsType) {

    const [field, meta] = useField(props)
    const { theme } = useContext(ApearanceContext) || {}

    return (
        <div>
            <div className="w-full mt-6 block">
                <label className="w-full block mb-4 text-[10pt] capitalize" htmlFor={props.id} >{label}</label>
                <textarea  
                    rows={4}
                    {...props} {...field}
                    className={`rounded p-6 ${theme === 'light' ? "border-black/40" : "bg-darkItems border-white/20"} border-[.6px] w-full text-[10pt]`} 
                />
                {meta.touched && meta.error ? <div className="text-red-500 lowercase mt-2">{meta.error}</div> : null}
            </div>
        </div>
    )
}