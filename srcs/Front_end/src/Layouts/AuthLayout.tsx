
import { Outlet } from 'react-router-dom'
import React, { useEffect, useState } from 'react'


function Slide({text, img}) {
  return (
    <div className='slide'>
      <img className='mx-auto max-w-[500px] w-full h-full' src={img} alt="" />
      <div className='text-center'>
        <h1 className='mt-16 text-[24pt] font-bold uppercase font-pt text-white'>{text}</h1>
        <p className='mt-4 text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, perspiciatis.</p>
      </div>
    </div>
  )
}

export default function AuthLayout() {
  
  const [slide, setSlide] = useState(1)
  useEffect(() => {
    const timer = setTimeout(() => {
      // console.log('timer created')
      setSlide(prev => prev < 3 ? prev += 1 : 1)
    }, 1000 * 8)

    return () => clearTimeout(timer)
  }, [slide])

    return (
      <>
        <main>
          <div className="w-full h-screen">
            <div className={`w-full bg-lightItems text-lightText h-full`}>
                <div className="h-full w-full flex p-2">
                    <div className="h-full w-full lg:w-1/2 flex items-center justify-center">
                        <div className="w-full max-w-[700px]">
                          <Outlet />
                        </div>
                    </div>
                    <div className="h-full hidden bg-[#1b1b1f]  w-1/2 p-2 lg:flex items-center">
                      <div className='w-full'>
                        <div className=''>
                          <div className={`${slide == 1 ? "w-full transition-opacity duration-[4s]  opacity-1" : "w-0 h-0 overflow-hidden opacity-0"}`}>
                            <Slide text="Play ping pong" img="/485.svg" />
                          </div>
                          <div className={`${slide == 2 ? "w-full transition-opacity duration-[4s] opacity-1" : "w-0 h-0 overflow-hidden opacity-0"}`}>
                            <Slide text="Contact with friends" img="/487.svg" />
                          </div>
                          <div className={`${slide == 3 ? "w-full transition-opacity duration-[4s] opacity-1" : "w-0 h-0 overflow-hidden opacity-0"}`}>
                            <Slide text="add your friends" img="/486.svg" />
                          </div>
                        </div>
                        <div className='mt-[100px] flex justify-center'>
                          {[1, 2, 3].map(item => <div key={item} className={`w-[10px] ml-2 h-[10px] ${item == slide ? "bg-white" : "bg-gray-400"}  rounded-full`} onClick={() => setSlide(item)}></div>)}
                        </div>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </>
    )
}