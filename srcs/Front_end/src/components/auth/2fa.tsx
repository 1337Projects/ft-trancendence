
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Contexts/authContext'
import TwoFaInput from './2faInput';
import { Link } from 'react-router-dom';
import MyUseEffect from '../../hooks/MyUseEffect';
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { OtpInput } from 'reactjs-otp-input';




export default function TwoFactor ( {are_you_in, cancel, setShowPopup, setTwofa} ) {

    const [qrCodeUrl, setQr] = useState()
    const qr = "otpauth://totp/YourAppName:username?secret=JBSWY3DPEPK3PXP"
    const user = useContext(UserContext)
    const appearence = useContext(ApearanceContext)
    const [otp, setOtp] = useState('');
    const [errr, setErrr] = useState('VERIFY');
    const [bol, setBol] = useState(true);

    const handleChange = (otp) =>{
        setOtp(otp);
    }
    
    const handleSubmit = () =>{
        if (errr === 'DONE') {
            setShowPopup(false)
        }
        if (otp.length === 6) {
            const data = {
                data:{
                    topt: otp
                }
            };

            fetch(`${import.meta.env.VITE_API_URL}api/profile/2fa/`, {
                method: 'POST',
                credentials : 'include',
                headers: {
                    'Authorization' : `Bearer ${user?.authInfos?.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('OTP data:', data);
                if (data['message'] !== 'Successful'){
                    setOtp('')
                    setErrr('Try Again')
                }
                else {
                    setBol(false)
                    setTwofa(false)
                    setErrr('DONE')
                }
            })
            
        }
    }

    MyUseEffect(
        async () => {
            try
            {
                const response = await fetch(`${import.meta.env.VITE_API_URL}api/profile/2fa/qr/`, {
                    method: 'GET',
                    credentials : 'include',
                    headers : {
                        'Authorization' : `Bearer ${user?.authInfos?.accessToken}`,
                    }
                })
                if (!response.ok) {
                    const { error } = await response.json()
                    throw  new Error(error)
                }
                const { qr_code_image } = await response.json()
                console.log(qr_code_image)
                setQr(qr_code_image)
            }
            catch(err) {
                console.log(err)
            }

        }, []
    )

    console.log(qrCodeUrl)
    return (
        <div className={`flex  flex-col items-center justify-center  md:w-[100%]
        transition-all duration-300 ease-in-out p-6 text-white text-center rounded-lg
        'backdrop-blur-md
        ${appearence?.theme === 'light' ? 'bg-black/30': 'bg-white/30'  }
        ${bol === true ? 'h-[530px]' : 'h-[100px]' }
        `}>
        {
            bol && 
            <div className='flex justify-center items-center  w-[100%] h-[400px]'>
                <div className='w-[100%] flex flex-col items-center justify-center'>
                    <img src={qrCodeUrl} alt="user" className="mt-1 h-[250px] w-[250px] md:h-[280px] md:w-[280px] mx-2 border-[1px] border-black/20 rounded-sm" />
                    {
                        are_you_in &&
                        <Link to="../login">
                            <h1 className='p-4'>skip for now</h1>
                        </Link>
                    }
                    {
                        cancel &&
                        <button className='p-4 text-[30px] text-[#ebebeb]' onClick={() => setShowPopup(false)} >CANCEL</button>
                    }
                </div>
            </div>
        }
        {
            bol && 
            <OtpInput
            value={otp} onChange={handleChange} numInputs={6}
            containerStyle={{
                display: 'flex',
                justifyContent: 'space-around',
                width:'100%',
                
            }}
            inputStyle={{
                width: '50px',
                height: '50px',
                fontSize: '20px',
                textAlign: 'center',
                border: '1px solid #000',
                borderRadius: '8px',
                outline: 'none',
                color: '#000',
            }}
            />
        }
            <button onClick={handleSubmit} className='text-[#fff] p-2 mt-4 rounded-[5px] text-[25px] bg-[#ff0000]'>
                {errr}
            </button>

        </div>
    )
}
