
import React, { useContext, useState } from 'react'
import { UserContext } from '../../Contexts/authContext'
import { Link } from 'react-router-dom';
import MyUseEffect from '../../hooks/MyUseEffect';
import { ApearanceContext } from '../../Contexts/ThemeContext';
import { OtpInput } from 'reactjs-otp-input';




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

    const handleChange = (otp) =>{
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
                console.log('OTP data:', data);
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

    // console.log(appearence?.color)
    return (
        <div className={`flex  flex-col items-center justify-center  md:w-[100%]
        transition-all duration-300 ease-in-out p-6 text-white text-center rounded-lg
        'backdrop-blur-md
        ${appearence?.theme === 'light' ? 'bg-[#424242]': 'bg-[#b6b6b6]'  }
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
        <div className='flex items-center justify-center w-[70%]'>
            <button
            style={{ backgroundColor: appearence?.color }}
            onClick={handleSubmit} className={` pl-5 pr-5 h-[44px]  rounded-[5px] text-[18px] text-[#fff]`}>
                {errr}
            </button>
            {
                cancel && errr != 'Done' &&
                <button className={`p-4 text-[18px] ${appearence?.theme === 'light' ? 'text-[#fff]' : 'text-[#000]'} `} onClick={() => setShowPopup(false)} >Cancel</button>
            }
        </div>
        </div>
    )
}
