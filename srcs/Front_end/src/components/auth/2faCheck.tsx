import { OtpInput } from 'reactjs-otp-input';
import { useContext, useState } from 'react'
import { UserContext } from '../../Contexts/authContext'
import { useNavigate } from 'react-router-dom'
import TwoFImg from "../settings/TwoFImg";



export default function TwoFacCheck () {
    const [otp, setOtp] = useState('');
    const [errr, setErrr] = useState('Verify');
    const user = useContext(UserContext)
    const navigate = useNavigate()
    const [dataa, setDataa] = useState({
            topt: ''
    })

    const handleChange = (otp : string) =>{
        setOtp(otp);
        setDataa({
                topt: otp
        })
    }
    
    const handleSubmit = () =>{
        if (otp.length === 6) {
            const data = {
                data:dataa
            }

            fetch(`${import.meta.env.VITE_API_URL}api/profile/2fa/topt/`, {
                method: 'POST',
                credentials : 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data['message'] !== 'Successful'){
                    setOtp('')
                    setErrr('Try Again..')
                }
                else {
                    user?.setAuthInfosHandler(data.access)
                    navigate('../../dashboard/game')
                }
            })
            
        }
    }
    return (
        <div className="w-[100%] h-full flex items-center justify-center bg-[#474747]">
            <div className="w-[96%]  flex flex-col items-center justify-between  h-[600px] p-[30px] ">
                <div className="w-[70%] min-w-[350px] ">
                    <TwoFImg />
                </div>
                <div className="flex flex-col items-center w-full">
                    <OtpInput
                    value={otp} onChange={handleChange} numInputs={6}
                    containerStyle={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width:'100%',
                        
                    }}
                    inputStyle={{
                        width: '60px',
                        height: '60px',
                        fontSize: '20px',
                        textAlign: 'center',
                        border: '1px solid #000',
                        
                        outline: 'none',
                        color: '#000',
                    }}
                    />
                    <button onClick={handleSubmit} className='text-[#fff] w-[25%] p-2 mt-4 text-[25px] bg-[#c01717]'>
                        {errr}
                    </button>
                </div>
            </div>
        </div>
    )
}