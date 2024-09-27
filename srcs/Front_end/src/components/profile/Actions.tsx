import React, { useContext } from "react"
import { ApearanceContext } from "../../Contexts/ThemeContext"
import { FaCheckDouble, FaCommentDots, FaEllipsisV, FaPlus, FaUserMinus } from "react-icons/fa"
import { GiSandsOfTime } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

function ActionButton({text, icon, handler}) {
	const appearence = useContext(ApearanceContext)
	return (
		<button 
			onClick={handler} 
			style={{background: appearence?.color}} 
			className='text-white mx-2 px-4 rounded-2xl w-fit h-[38px] text-[10pt] flex items-center justify-center'
		>
			<h1 className='mr-2 capitalize'>{text}</h1>
			{icon}
		</button>
	)
}

export function Actions({friends, profile_user, handlers}) {
	
	function has_relation(arr, id, status) {
		let res = arr?.filter(item => (item.receiver.id == id || item.sender.id== id))
		if (status)
			return res[0].status == status
		return res?.length
	}

	function is_receiver(arr, id, status) {
		let res = arr?.filter(item => (item.receiver.id == id && item.status == status))
		return res?.length
	}


	if (!has_relation(friends, profile_user?.id, null)) {
		return (<ActionButton text="Add Friend" icon={<FaPlus />} handler={handlers.new} />)
	}

	if (has_relation(friends, profile_user?.id, 'waiting') && !is_receiver(friends, profile_user.id, 'waiting')) {
		return (
			<div className='flex justify-between w-[220px]'>
				<ActionButton text="accept friend" icon={<FaCheckDouble />} handler={handlers.accept} />
				<ActionButton text="reject" icon={<IoMdClose />} handler={handlers.reject} />
			</div>
		)
	}
	if (has_relation(friends, profile_user?.id, 'accept')){
		return (
			<div className='flex justify-between items-center w-[230px]'>
				<ActionButton text="contact" icon={<FaCommentDots />} handler={null} />
				<ActionButton text="unfriend" icon={<FaUserMinus />} handler={handlers.cancle} />
				<FaEllipsisV className="w-[100px]" />
			</div>
		)
	}
	return (<ActionButton text="cancle the request" icon={<GiSandsOfTime />} handler={handlers.cancle} />)
}