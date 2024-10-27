
import { useField } from "formik"
import React, { useContext } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"

export default function SettingsInput({label, ...props}) {

    const { theme } = useContext(ApearanceContext) || {}

    const [field, meta] = useField(props)

    return (
        <div className="w-full mt-6 block">
            <label className="w-full block mb-4 text-[10pt] capitalize" htmlFor={props.id} >{label}</label>
            <input 
                {...props} {...field}
                className={`rounded px-6 ${theme === 'light' ? "border-black/40" : "bg-darkItems border-white/20"} border-[.6px] w-full text-[10pt] h-[45px]`} 
            />
            {meta.touched && meta.error ? <div className="text-red-500 lowercase mt-2">{meta.error}</div> : null}
        </div>
    )
}


export function TextArea({label, ...props}) {

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