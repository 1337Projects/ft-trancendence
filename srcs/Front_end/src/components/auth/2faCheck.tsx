import TwoFaInput from "./2faInput"
import { OtpInput } from 'reactjs-otp-input';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../Contexts/authContext'
import { Navigate, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';


export default function TwoFacCheck () {
    // const [qrCodeUrl, setQr] = useState()
    // const qr = "otpauth://totp/YourAppName:username?secret=JBSWY3DPEPK3PXP"
    // const user = useContext(UserContext)
    // const appearence = useContext(ApearanceContext)
    const [otp, setOtp] = useState('');
    const [errr, setErrr] = useState('VERIFY');
    // const [bol, setBol] = useState(true);
    const user = useContext(UserContext)
    const location = useLocation();  // Get location object
    const navigate = useNavigate()

    const { dataa } = location.state || {}; 
    const handleChange = (otp) =>{
        setOtp(otp);
        dataa['topt'] = otp
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
                console.log('OTP data:', data);
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
    // 
    return (
        <div className="w-[96%] flex flex-col items-center justify-around  h-[200px] p-[30px] rounded-[20px] ">
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
                borderRadius: '8px',
                outline: 'none',
                color: '#000',
            }}
            />
            <button onClick={handleSubmit} className='text-[#fff] w-[25%] p-2 mt-4 rounded-[5px] text-[25px] bg-[#ff0000]'>
                {errr}
            </button>
        </div>
    )
}