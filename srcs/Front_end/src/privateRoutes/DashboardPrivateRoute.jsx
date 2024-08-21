
import {useContext, useEffect, useState} from 'react'
import { authContext } from '../Contexts/authContext'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '../Layouts/DashboardLayout'

export function DashboardPrivateRoute() {
    const authTokens = useContext(authContext)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function getToken() {
            await fetch('url', {
                method : 'GET',
                credentials : 'include',
            })
            .then(res => res.json())
            .then(data => {
                authTokens(data.access)
                setIsAuthenticated(data.access != null)
            })
            .catch(err => console.log(err))
        }
        const timer = setTimeout(async () => {
        if (authTokens.token == '') {
            await getToken()
        } else {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
        }, 300)
        return () => clearTimeout(timer)
    }, [])
    
    if (isLoading) {
        return (<div>Loading...</div>)
    }

    return isAuthenticated ? <DashboardLayout /> : <Navigate to="../../auth/login" />
}