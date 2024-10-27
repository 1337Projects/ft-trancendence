import React, { useState } from "react"
import { FaLocationArrow } from "react-icons/fa"

function SecurityItem({children}) {
    const [show, setShow] = useState(false)
    return (
        <li className="flex justify-between items-center text-[10px] w-fit capitalize mt-10" onClick={() => setShow(!show)}>
            {children}
        </li>
    )
}


export default function Security() {
    return (
        <div>
            <ul>
                <SecurityItem>
                    <p className="mr-1">change password</p>
                </SecurityItem>
                <SecurityItem>
                    <p>two factor authentification?</p>
                </SecurityItem>
                <SecurityItem>
                    <p className="mr-1">connection logs</p>
                    <FaLocationArrow />
                </SecurityItem>
            </ul>
        </div>
    )
}
