import { useField } from "formik"
import React from "react"


type InputPropsType = {
    label : string, 
    id: string, 
    name : string, 
    type : string , 
    placeholder : string
}

export default function MyInput({label , ...props} : InputPropsType) {

    const [field, meta] = useField(props)

    return (
        <div>
            <label 
                className="text-[11pt] capitalize w-full flex justify-between mb-1 mt-10" 
                htmlFor={props.id || props.name}
            > {label} </label>
            <input
                className={`mt-2 w-full text-lightText text-[12pt] px-4 rounded h-12 border-black/50 
                ${meta.touched && meta.error ? "outline outline-red-500 border-none" : "outline-black border-[.5px]"}
                `}
                {...field} {...props}
            />
            {meta.touched && meta.error ? <div className="text-red-500 lowercase mt-2">{meta.error}</div> : null}
        </div>
    )

}

export function MyCheckbox({...props} : {type : string, name : string, id : string}) {
    const [field] = useField(props)
    return (
        <div>
            <input  {...field} {...props} />
        </div>
    )
}