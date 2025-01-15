import Level from "./Level"
import Chart from "./Chart"
import MatchStatus from "./Status"
import MatchHistory from "./MatchHistory"


export default function Dashboard() {


	

	return (
		<div className='mx-2 flex h-fit'>
			<div className='w-full mx-auto max-w-[650px] mt-10'>
				<div>
					<Level />
				</div>
				<div className='mt-10'>
					<MatchStatus />
				</div>
				<div className='mt-20'>
					<Chart />
				</div>
				<div className="mt-20">
					<MatchHistory />
				</div>
			</div> 
		</div>
	)
}






