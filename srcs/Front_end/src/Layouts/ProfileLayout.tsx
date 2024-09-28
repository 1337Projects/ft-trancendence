import { Outlet } from "react-router-dom"
import React from "react"



export default function ProfileLayout() {
    return (
        <>
            <div className="flex justify-between h-[100vh] mt-2 w-full ">
                <Outlet />
            </div>
        </>
    )
}
