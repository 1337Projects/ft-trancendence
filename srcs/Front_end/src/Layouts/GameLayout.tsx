import React, { useContext, useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { tournamentSocket } from '../socket'
import { UserContext } from '../Contexts/authContext'


export default function GameLayout() {

    const { tournament_id } = useParams()
    const { authInfos } = useContext(UserContext) || {}


    useEffect(() => {

        const timer = setTimeout(() => {
            tournamentSocket.connect(`${import.meta.env.VITE_SOCKET_URL}/wss/tournment/${tournament_id}/?token=${authInfos?.accessToken}`)
        }, 300)

        return () => {
            clearTimeout(timer)
            tournamentSocket.close()
        }
    }, [])

    return (
        <div className='h-full w-full'>
            <Outlet />
        </div>
    )
}