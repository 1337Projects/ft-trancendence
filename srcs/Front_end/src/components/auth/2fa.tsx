
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../Contexts/authContext'
import { Link } from 'react-router-dom';
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { OtpInput } from 'reactjs-otp-input';
import { toast } from 'react-toastify';




export default function TwoFactor ( {are_you_in, cancel, setShowPopup, setTwofa} : 
    {
        are_you_in:boolean,
        cancel: boolean,
        setShowPopup: React.Dispatch<React.SetStateAction<boolean>>
        setTwofa: React.Dispatch<React.SetStateAction<boolean>>
    }) {

    const [qrCodeUrl, setQr] = useState()
    const user = useContext(UserContext)
    const appearence = useContext(ApearanceContext)
    const [otp, setOtp] = useState('');
    const [errr, setErrr] = useState('Verify');
    const [bol, setBol] = useState(true);

    const handleChange = (otp : string) =>{
        setOtp(otp);
    }
    
    const handleSubmit = () =>{
        if (errr === 'Done') {
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
                if (data['message'] !== 'Successful'){
                    setOtp('')
                    setErrr('Try Again')
                }
                else {
                    setBol(false)
                    setTwofa(true)
                    setShowPopup(false)
                    setErrr('Done')
                }
            })
            
        }
    }

    useEffect(() => {

        const fetchQr = async () => {
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
                setQr(qr_code_image)
            }
            catch(err) {
                toast.error(err instanceof Error ? err.toString() : "somthing went wrong...")
            }
        }

        fetchQr()

        }, []
    )

    return (
        <div className={`flex flex-col items-center justify-center  md:w-[100%]
        transition-all duration-300 ease-in-out px-10 py-4 text-white text-center rounded
        backdrop-blur-xl border-[.4px] shadow-xl
        ${appearence?.theme === 'light' ? 'bg-gray-950/40 border-gray-800/20': 'bg-[#b6b6b6]/20'  }
        ${bol === true ? 'h-[530px]' : 'h-[100px]' }
        `}>
        {
            bol && 
            <div className='flex justify-center items-center  w-[100%] h-[400px]'>
                <div className='w-[100%] flex flex-col items-center justify-center'>
                    {
                        qrCodeUrl && <img 
                            src={qrCodeUrl} 
                            alt="user" 
                            className="mt-1 h-[250px] w-[250px] md:h-[280px] md:w-[280px] mx-2 rounded" 
                        />
                    }
                    <p className='text-xs max-w-[400px] mx-auto py-4'>Enhance the security of your account by enabling Two-Factor Authentication (2FA). With 2FA, you add an extra layer of protection by requiring both your password and a verification code sent to your phone or email</p>
                    {
                        are_you_in &&
                        <Link to="/auth/login">
                            <h1 className='p-4'>skip for now</h1>
                        </Link>
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
                borderRadius: '2px',
                outline: 'none',
                color: '#000',
            }}
            />
        }
        <div className='flex items-center mt-6 justify-center w-[70%]'>
            <button
                style={{ backgroundColor: appearence?.color }}
                onClick={handleSubmit} 
                className={`px-6 h-[38px] rounded text-sm text-[#fff]`}
            >
                {errr}
            </button>
            {
                cancel && errr != 'Done' &&
                <button 
                    className={`ml-2 px-6 h-[38px] rounded text-sm text-white`} 
                    onClick={() => 
                    setShowPopup(false)}
                >
                    Cancel
                </button>
            }
        </div>
        </div>
    )
}
