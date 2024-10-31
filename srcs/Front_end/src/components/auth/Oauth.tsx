import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Contexts/authContext'
import { FaGoogle } from 'react-icons/fa'
import { Si42 } from "react-icons/si";

export function OauthProviders() {

  function oauth(url : string) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        window.location.href = data.url
    })
    .catch(err => console.log(err))
  }
  
  return (
      <div className='mt-10'>
          <p className="oauth flex flex-row capitalize text-[10pt]">or login with</p>
          <div className='mt-10 grid grid-cols-2 gap-10'>
            <button
              onClick={() => oauth('http://localhost:8000/api/auth/oauth/intra/')}
              className='bg-darkItems w-full h-12 rounded text-white flex justify-center items-center'>
              <Si42 className='mr-2' />
              Intra
            </button>
            <button
              onClick={() => oauth('http://localhost:8000/api/auth/google/')}
              className='border-[.4px] border-black w-full h-12 rounded flex justify-center items-center'>
              <FaGoogle className='mr-2' />
              Google
            </button>
          </div>
      </div>
  )
}



export function Oauth({url} : {url : string}) {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const user = useContext(UserContext)

  const navigate = useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code) {
        fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body : JSON.stringify({code : code,})
        })
        .then(res => res.json())
        .then(data => {
          if (data.status == 200) {
            user?.setAuthInfosHandler(data.access)
            navigate('../../dashboard/game')
          }
        })
        .catch(err => console.log(err))
      } else {
        navigate('/auth/login')
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])
  return (
    <h1></h1>
  )
}

