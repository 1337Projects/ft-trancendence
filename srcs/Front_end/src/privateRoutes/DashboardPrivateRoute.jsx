
import {useContext} from 'react'
import { authContext } from '../Contexts/authContext'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '../Layouts/DashboardLayout'

export function DashboardPrivateRoute() {
    const authTokens = useContext(authContext)
    console.log(authTokens)
    return authTokens ? <DashboardLayout /> : <Navigate to="../../auth/login" />
}