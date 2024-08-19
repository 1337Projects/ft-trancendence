
import {useContext, useEffect, useState} from 'react'
import { authContext, authContextHandler } from '../Contexts/authContext'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '../Layouts/DashboardLayout'


export const DashboardPrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const authhandler = useContext(authContextHandler)
    let accessToken = useContext(authContext);
    useEffect(() => {
            const getTokens = async () => {
                await fetch('http://localhost:8000/api/auth/refresh/', 
                {
                    method: 'GET',
                    credentials : 'include'
                })
                .then(res => res.json())
                .then(res => {
                    // console.log(res.access_token)
                    authhandler(res.access_token)
                    setIsAuthenticated(res.access_token != null)
                })
                .catch(err => console.log(err))
            }
            
            const timer = setTimeout(async () => {
                if (!accessToken) {
                    await getTokens()
                } else {
                    setIsAuthenticated(true)
                }
                setLoading(false);
            }, 300)
            return () => clearTimeout(timer)
    }, []);

  if (loading) {
    return <div></div>;
  }

  return isAuthenticated ? <DashboardLayout /> : <Navigate to="../../auth/login" />
};
