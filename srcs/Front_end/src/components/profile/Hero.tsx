import { useContext } from "react"
import { ApearanceContext } from "@/Contexts/ThemeContext"
import {  UserContext } from "@/Contexts/authContext"
import { Relations } from './ActionsHandlers'
import { UserType } from "@/types/user"


function BannerSkeleton() {
	return (
		<div>
			<div className='top-0 h-[150px] w-full'>
				<div className='animate-pulse w-full h-full bg-gray-300'></div>
			</div>
			<div className='w-full px-2 rounded-sm h-fit mt-[-40px] flex items-center justify-center'>
				<div className='px-2 h-full w-full'>
					<div className="flex items-center">
						<div className='w-[90px] h-[90px] z-10 bg-gray-300 border-2 rounded-full'></div>
						<div className="mt-10 ml-4">
							<h1 className='mt-4 animate-pulse rounded-full bg-gray-300 w-[100px] h-6'></h1>
							<h1 className='mt-2 animate-pulse rounded-full bg-gray-300 w-[180px] h-4'></h1>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className='text-[10pt] mt-4'>
							<h1 className='mt-4 animate-pulse rounded-full bg-gray-300 w-[180px]  h-4'></h1>
							<h1 className='mt-2 animate-pulse rounded-full bg-gray-300 w-[80px]  h-4'></h1>
						</div>
						<div>
							<h1 className='animate-pulse rounded-full bg-gray-300 w-[80px]  h-8'></h1>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function Banner({ user } : { user : UserType }) {

	const appearence = useContext(ApearanceContext)
	const { authInfos } = useContext(UserContext) || {}


	// useEffect(() => {
	// 	if (!user) {
	// 	  const timer = setTimeout(() => {
	// 		toast.error("Failed loading data, please refresh");
	// 	  }, 1000);
	
	// 	  return () => clearTimeout(timer);
	// 	}
	//   }, [user]);

	if (!user) {
		return (
			<BannerSkeleton />
		)
	}

	return (
		<div>
			<div className='top-0 h-[180px] w-full border-b-[1px] overflow-hidden'>
				<img src={user?.profile.banner} className='w-full h-full' alt="" />
			</div>

			<div className='w-full px-2  rounded-sm h-fit mt-[-40px] flex items-center justify-center'>
				<div className='px-2  w-full'>
					<div className="flex items-center">
						<img className='w-[90px] h-[90px] bg-white border-2 rounded-full' src={`${user?.profile?.avatar}`} alt="" />
						<div className="mt-10 ml-4">
							<h1 className='mt-4 text-[16pt] font-bold'>@{user?.username}</h1>
							<h1 className='text-[10pt] mt-2 '>{user?.first_name} {user?.last_name}</h1>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className='text-[10pt] mt-4'>
							{
								user?.profile?.bio != '' && 
								<textarea 
									value={user?.profile?.bio}
									disabled={true}
									className={`${appearence?.theme == 'light' ? "text-lightText" : "text-darkText"} resize-none bg-transparent outline-none`}>
								</textarea>
							}
						</div>
						<div>
							{
								(user && user?.username != authInfos?.username) &&
								<Relations friend={user} />
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
