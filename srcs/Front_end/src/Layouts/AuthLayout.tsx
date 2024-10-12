
import { Outlet } from 'react-router-dom'
import React from 'react'


export default function AuthLayout() {
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
                        <div className='slide'>
                          <img className='mx-auto max-w-[800px] w-full h-full' src="/485.svg" alt="" />
                          <div className='text-center'>
                            <h1 className='mt-16 text-[24pt] font-bold uppercase text-white'>Play ping pong</h1>
                            <p className='mt-4 text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, perspiciatis.</p>
                          </div>
                        </div>
                        <div className='mt-[100px] flex justify-center'>
                          <div className='w-[10px] ml-2 h-[10px] bg-white rounded-full'></div>
                          <div className='w-[10px] ml-2 h-[10px] bg-gray-200 rounded-full'></div>
                          <div className='w-[10px] ml-2 h-[10px] bg-gray-200 rounded-full'></div>
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