
import React, {useContext, useEffect, useState} from 'react'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '../Layouts/DashboardLayout'
import { UserContext } from '../Contexts/authContext';


export const DashboardPrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const user = useContext(UserContext)
    useEffect(() => {
            const getTokens = async () => {
                await fetch('http://localhost:8000/api/auth/refresh/', 
                {
                    method: 'GET',
                    credentials : 'include'
                })
                .then(res => res.json())
                .then(res => {
                    user?.setAuthInfosHandler(res.access_token)
                    setIsAuthenticated(res.access_token != null)
                })
                .catch(err => console.log(err))
            }
            
            const timer = setTimeout(async () => {
                if (!user?.authInfos?.accessToken) {
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
