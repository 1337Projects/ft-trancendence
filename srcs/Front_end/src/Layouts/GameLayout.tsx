import React, { useContext, useEffect } from 'react'

import { Outlet, useParams } from 'react-router-dom'
import MyUseEffect from '../hooks/MyUseEffect'
import Socket from '../socket'
import { UserContext } from '../Contexts/authContext'

export default function GameLayout() {

    const { authInfos } = useContext(UserContext) || {}
    const { id } = useParams()

    MyUseEffect(() => {
        Socket.connect(`ws://localhost:8000/ws/tournment/${id}/?token=${authInfos?.accessToken}`)
    }, [])


    useEffect(() => {
        return () => {
            Socket.close()
        }
    }, [])

    return (
        <div className='h-full w-full'>
            <Outlet />
        </div>
    )
}