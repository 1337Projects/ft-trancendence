import React, { ReactElement, useContext, useEffect, useRef, useState } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import { FaCommentDots, FaEllipsisV, FaPlus, FaUserMinus } from "react-icons/fa"
import { GiSandsOfTime } from "react-icons/gi";
import { FiCheckCircle } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { GoBlocked } from "react-icons/go";
import { CgUnblock } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { FirendType, UserType } from "@/Types";

function ActionButton({text, icon, handler} : { text : string, icon : ReactElement, handler : () => void}) {
	const appearence = useContext(ApearanceContext)
	return (
		<button 
			onClick={handler} 
			style={{background: appearence?.color}} 
			className='text-white px-4 rounded-full w-fit h-[38px] text-[10pt] flex items-center justify-center'
		>
			<h1 className='mr-2 capitalize'>{text}</h1>
			{icon}
		</button>
	)
}

type HandlerType = () => void

export function Actions({friends, profile_user, handlers} : {friends : FirendType[], profile_user : UserType, handlers : HandlerType[]}) {
	
	const navigate = useNavigate()

	function has_relation(arr : FirendType[], id : number, status : string | null) {
		const res = arr?.filter(item => (item.receiver.id == id || item.sender.id== id))
		if (status && res.length > 0)
			return res[0].status == status
		return res?.length
	}

	function is_receiver(arr : FirendType[], id : number, status : string) {
		return arr?.filter(item => (item.receiver.id == id && item.status == status)).length
	}


	if (!has_relation(friends, profile_user?.id, null)) {
		return (<ActionButton text="new Friend" icon={<FaPlus />} handler={handlers.new} />)
	}

	if (has_relation(friends, profile_user?.id, 'waiting') && !is_receiver(friends, profile_user.id, 'waiting')) {
		return (
			<div className='flex justify-between w-[190px]'>
				<ActionButton text="accept" icon={<FiCheckCircle />} handler={handlers.accept} />
				<ActionButton text="reject" icon={<IoMdClose />} handler={handlers.reject} />
			</div>
		)
	}
	if (has_relation(friends, profile_user?.id, 'accept') || has_relation(friends, profile_user?.id, 'blocked')){
		const [ openMenu, setOpenMenu ] = useState(false)
		const menuRef = useRef<null | HTMLUListElement>(null)
		const toggleButtonRef = useRef<null | HTMLDivElement>(null)

		useEffect(() => {

			function clickHandler(event) {
				if (menuRef.current && toggleButtonRef.current && !menuRef.current.contains(event.target) && !toggleButtonRef.current.contains(event.target)) {
					setOpenMenu(false)
				}
			}

			window.addEventListener('mousedown', clickHandler)

			return () => {
				window.removeEventListener('mousedown', clickHandler)
			}
		}, [])

		return (
			<div className='flex justify-between h-full items-center w-[120px] relative'>
				<ActionButton text="contact" icon={<FaCommentDots />} handler={() => navigate(`/dashboard/chat/${profile_user.username}`)} />
				<div className="cursor-pointer" ref={toggleButtonRef} onClick={() => setOpenMenu(prev => !prev)}>
					<FaEllipsisV />
				</div>
				{
					openMenu && 
					<ul ref={menuRef} className="w-[160px] h-fit p-2 z-10 rounded bg-darkItems border-[.2px] border-white/20 absolute top-[50px] right-[10px]">
						<li className="w-full hover:bg-gray-700/40 rounded px-4 justify-between text-xs p-2 h-[40px] flex items-center">
							<p>unfriend</p>
							<FaUserMinus />
						</li>
						<li className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between">
							<p>block</p>
							<GoBlocked />
						</li>
						<li className="w-full hover:bg-gray-700/40 rounded px-4 text-xs p-2 h-[40px] flex items-center justify-between">
							<p>unblock</p>
							<CgUnblock />
						</li>
					</ul>
				}
			</div>
		)
	}
	return (<ActionButton text="waiting" icon={<GiSandsOfTime />} handler={handlers.cancle} />)
}