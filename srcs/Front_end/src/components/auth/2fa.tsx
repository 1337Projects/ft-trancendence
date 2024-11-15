
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Contexts/authContext'
import TwoFaInput from './2faInput';
import QRCode from "react-qr-code";
import { Link } from 'react-router-dom';

export default function TwoFactor () {


    const qrCodeUrl = "otpauth://totp/YourAppName:username?secret=JBSWY3DPEHPK3PXP&issuer=YourAppName";

    return (
        <div className='flex flex-col items-center justify-center w-full h-[100vh] '>
            <div className='flex justify-center items-center  w-[100%] h-[400px]'>
                <div className='w-[100%] flex flex-col items-center justify-center'>
                    <QRCode value={qrCodeUrl} size={300} />
                    <Link to="../login">
                        <h1 className='p-4'> skip for now</h1>
                    </Link>
                </div>
            </div>
            <TwoFaInput/>
        </div>
    )
}
