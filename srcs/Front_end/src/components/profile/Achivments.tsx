import React, { useContext } from "react"
import { FaCheck } from "react-icons/fa"


const achivments = [
	{id:0,title:'Bill Gates 3', des:'be active for more 3,5,7 days', rec : '1/2 ', achived:false, icon:'/fire.png'},
	{id:1,title:'Bill Gates 3', des:'be active for more 3,5,7 days', rec : '2/2', achived:true, icon:'/crow.png'},
	{id:2,title:'Bill Gates 3', des:'be active for more 3,5,7 days', rec : '6/6', achived:true, icon:'/medal.png'},
	{id:3,title:'Bill Gates 3', des:'be active for more 3,5,7 days', rec : '0/2', achived:false, icon:'/thumb-up.png'},
]

export default function Achivments() {
	return (
		<>
			<div className={`w-full h-fit rounded-sm`} >
				<ul className='mt-4'>
					{
						achivments.map(a => {
							return (
								<li key={a.id} className='my-6 flex items-center justify-between'>
									<div className='flex items-center'>
										<img src={a.icon} className='w-[45px]' alt="" />
										<div className='ml-4'>
											<h1 className='text-[13px]'>{a.title}</h1>
											<p className='text-[10px] mt-1'>{a.des}</p>
										</div>
									</div>
									<h1 className='ml-10 text-[12px]'>{a.rec}</h1>
									<div className='w-[120px] text-center'>
										{a.achived ? <div className='ml-6 text-[12px] text-emerald-600'>achived <FaCheck /> </div> : <div className='ml-6 text-[12px]'>not achived yet</div>}
									</div>
								</li>
							)
						})
					}
				</ul>
			</div>
		</>
	)
}
