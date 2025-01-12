import { useField } from "formik"
import { useState } from "react"
import { FaRegEye, FaEyeSlash } from "react-icons/fa";


type InputPropsType = {
    label : string, 
    id: string, 
    name : string, 
    type : string , 
    placeholder : string
}

export default function MyInput({label , ...props} : InputPropsType) {

    const [field, meta] = useField(props)
    const [see, setSee] = useState(false)

    return (
        <div>
            <label 
                className="text-[11pt] capitalize w-full flex justify-between mb-1 mt-4" 
                htmlFor={props.id || props.name}
            > { label }</label>
            <div className="relative">
                {
                    label.includes('password') && 
                    <div
                        className="absolute top-6 right-4 text-[12pt]"
                        onClick={() => setSee(prev => !prev)}
                    >
                        {see ? <FaEyeSlash /> : <FaRegEye />}
                    </div>
                }
                <input
                    className={`mt-2 w-full text-lightText text-[12pt] px-4 rounded h-12 border-black/50 
                    ${meta.touched && meta.error ? "outline outline-red-500 border-none" : "outline-black border-[.5px]"}
                    `}
                    {...field} {...props}
                    type={label.includes('password') ? see ? "text" : "password" : "text"}
                />
            </div>
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