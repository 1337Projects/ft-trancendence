import { useField } from "formik"
import React from "react"

export default function MyInput({label , ...props}) {

    const [field, meta] = useField(props)

    return (
        <>
            <label className="text-[11pt] capitalize w-full flex justify-between mb-1 mt-10" htmlFor={props.name}>{label} </label>
            <input
                className={`mt-2 w-full text-lightText text-[12pt] px-4 rounded h-12 border-black/50 
                ${meta.touched && meta.error ? "outline outline-red-500 border-none" : "outline-black border-[.5px]"}
                `}
                {...field} {...props}
            />
            {meta.touched && meta.error ? <div className="text-red-500 lowercase mt-2">{meta.error}</div> : null}
        </>
    )

}