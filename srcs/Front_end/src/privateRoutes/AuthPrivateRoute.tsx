import {useContext, useEffect, useState} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../Contexts/authContext';
import { toast } from 'react-toastify';


export const AuthPrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const user = useContext(UserContext)
    useEffect(() => {
            const getTokens = async () => {
                await fetch(`${import.meta.env.VITE_API_URL}api/auth/refresh/`, 
                {
                    method: 'GET',
                    credentials : 'include'
                })
                .then(res => res.json())
                .then(res => {
                    user?.setAuthInfosHandler(res.access_token)
                    setIsAuthenticated(res.access_token != null)
                })
                .catch(err => {
                    toast.error(err instanceof Error ? err.toString() : "somthing went wrong...")
                })
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

  return isAuthenticated ? <Navigate to="/dashboard/game" /> :  <Outlet />
};