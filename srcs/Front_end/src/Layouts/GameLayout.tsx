import React from 'react'
import { Outlet } from 'react-router-dom'


export default function GameLayout() {

    return (
        <div className='h-full w-full'>
            <Outlet />
        </div>
    )
}