'use client';

import Link from "next/link";
import Image from "next/image";
import GoogleIcon from '@/assets/icons/google.svg';
import { useState } from "react";
import { useGlobalContext } from "@/context/context";
import { z } from 'zod';
import { setCookie } from 'cookies-next';
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();

    const [ userPhone, setUserPhone ] = useState('');
    const [ userPass, setUserPass ] = useState('');

    const [ error, setError ] = useState('');

    const handleLogin = async () => {
        const phoneRegex = new RegExp(
            /[6789]\d{9}$/
        );

        const userSchema = z.object({
            userPhone: z.string().regex(phoneRegex, 'Invalid Phone Number'),
            userPass: z.string().min(6, { message: "Minimum Password length should be 6"}).max(12, { message: "Maximum Password Length should be 12"})
        })

        const report = userSchema.safeParse({ userPhone, userPass });

        if (report.error) {
            setError(report.error.errors[0].message);
            return;
        }

        const res = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userPhone, userPass })
        })

        const resData = await res.json();

        if (res.ok) {
            setUserData(resData.userData);
            setJwtToken(resData.token);
            setCookie('jwt', resData.token);
            setCookie('userData', resData.userData);
            localStorage.setItem('userData', JSON.stringify(resData.userData));
            localStorage.setItem('jwt', resData.token);
            router.push('/dashboard');
        } else {
            setError(resData.error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold">Login</h2>
                <p className="text-[12px]">Login to start chatting.</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
                <Link href={'#'} className="flex flex-row justify-center items-center gap-2 w-[240px] px-5 py-2 border-2 border-gray-500 hover:bg-hover_color">
                    <Image src={GoogleIcon} alt="Google Login" className="w-5" />
                    <p className="text-sm">Continue with Google</p>
                </Link>
            </div>
            <p className="text-sm">or</p>
            <div className="flex flex-col justify-center items-center gap-1">
                <input onChange={(e) => { setUserPhone(e.target.value) }} value={userPhone} className="text-sm px-3 py-2 w-[240px] border-[1px] border-gray-500" type="text" name="userPhone" id="userPhone" placeholder="Phone Number" required />
                <input onChange={(e) => { setUserPass(e.target.value) }} value={userPass} className="text-sm px-3 py-2 w-[240px] border-[1px] border-gray-500" type="password" name="userPass" id="userPass" placeholder="Password" minLength={6} required />
                <p className="text-[12px] text-red-600">{error}</p>
                <button onClick={handleLogin} className="text-sm my-2 border-2 border-gray-500 px-3 py-1 hover:bg-gray-200">Login</button>
            </div>
            <div className="flex flex-row justify-center items-center gap-1 text-gray-500 text-sm">
                <p>Don't have an account?</p>
                <Link href={'/auth/register'} className="text-black">Register here.</Link>
            </div>
        </div>
    )
}