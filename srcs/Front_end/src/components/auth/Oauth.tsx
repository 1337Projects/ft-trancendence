import React, { useContext, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../../Contexts/authContext'
import { FaGoogle } from 'react-icons/fa'
import { Si42 } from "react-icons/si";


export function OauthProviders() {
    
  function googleAuth() {
      fetch('http://localhost:8000/api/auth/google/')
      .then(res => res.json())
      .then(data => {
          window.location.href = data.url
      })
      .catch(err => console.log(err))
  }

  function intraAuth() {
      fetch('http://localhost:8000/api/auth/oauth/intra/')
      .then(res => res.json())
      .then(data => {
          window.location.href = data.url
      })
      .catch(err => console.log(err))
  }

  return (
      <>
          <div onClick={googleAuth} className="login-google cursor-pointer text-[10px] uppercase h-8 border-blue-500/80 border-[1px] w-1/1 rounded flex items-center justify-center">
              <h5 className="mr-2">continue with google account</h5>
              <i><FaGoogle /></i>
          </div>
          <div onClick={intraAuth} className="login-42 cursor-pointer text-[10px] uppercase h-8 mt-4 border-red-500/80 border-[1px] rounded w-1/1 flex items-center justify-center">
              <h5 className="mr-2">continue with 42 account</h5>
              <i><Si42 /></i>
          </div>
          <hr className='mt-10' />
      </>
  )
}

export function GoogleOauth() {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const user = useContext(UserContext)

    const navigate = useNavigate()
    useEffect(() => {
      const timer = setTimeout(() => {
        fetch(`http://localhost:8000/api/auth/google_callback/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body : JSON.stringify({
            code : code,
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status == 200) {
            user?.setAuthInfosHandler(data.access)
            navigate('../../dashboard/game')
          }
        })
        .catch(err => console.log(err))
      }, 300)
      return () => clearTimeout(timer)
    }, [])
    return (
      <h1></h1>
    )
}

export function IntraOauth() {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const navigate = useNavigate()
    const user = useContext(UserContext)
    useEffect(() => {
      const timer = setTimeout(() => {
        fetch(`http://localhost:8000/api/auth/oauth/intra/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials : 'include',
          body : JSON.stringify({
            code : code,
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status == 200) {
            user?.setAuthInfosHandler(data.access)
            navigate('../../dashboard/game')
          }
        })
        .catch(err => console.log(err))
      }, 300)
      return () => clearTimeout(timer)
    }, [])
    return (
      <></>
    )
}