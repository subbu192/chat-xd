'use client';

import Link from "next/link";
import Image from "next/image";
import GoogleIcon from '@/assets/icons/google.svg';
import { useState } from "react";
import { useGlobalContext } from "@/context/context";
import { z } from 'zod';
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export default function Register() {
    const router = useRouter();

    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();

    const [ fullName, setFullName ] = useState('');
    const [ userName, setUserName ] = useState('');
    const [ userPhone, setUserPhone ] = useState('');
    const [ userPass, setUserPass ] = useState('');

    const [ error, setError ] = useState('');

    const handleRegister = async () => {
        const phoneRegex = new RegExp(
            /[6789]\d{9}$/
        );

        const userSchema = z.object({
            fullName: z.string().min(1, { message: "Full Name is required" }).max(20, { message: "Maximum Full Name Length should be 20" }),
            userName: z.string().min(1, { message: "Username is required" }).max(12, { message: "Maximum Username Length should be 12" }),
            userPhone: z.string().regex(phoneRegex, 'Invalid Phone Number'),
            userPass: z.string().min(6, { message: "Minimum Password length should be 6"}).max(12, { message: "Maximum Password Length should be 12"})
        })

        const givenData = { fullName, userName, userPhone, userPass };

        const report = userSchema.safeParse(givenData);

        if (report.error) {
            setError(report.error.errors[0].message);
            return;
        }

        const res = await fetch('http://localhost:4000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(givenData)
        })

        const resData = await res.json();

        if (res.ok) {
            setUserData(resData.userData);
            setJwtToken(resData.token);
            setCookie('jwt', resData.token, { maxAge: 1000 * 60 * 3 });
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
                <h2 className="text-xl font-semibold">Register</h2>
                <p className="text-[12px]">Create an account to start chatting.</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
                <Link href={'#'} className="flex flex-row justify-center items-center gap-2 w-[240px] px-5 py-2 border-2 border-gray-500 hover:bg-hover_color">
                    <Image src={GoogleIcon} alt="Google Login" className="w-5" />
                    <p className="text-sm">Continue with Google</p>
                </Link>
            </div>
            <p className="text-sm">or</p>
            <div className="flex flex-col justify-center items-center gap-1">
                <input onChange={(e) => { setFullName(e.target.value) }} value={fullName} className="text-sm px-3 py-2 w-[240px] border-[1px] border-gray-500" type="text" name="fullName" id="fullName" placeholder="Full Name" required />
                <input onChange={(e) => { setUserName(e.target.value) }} value={userName} className="text-sm px-3 py-2 w-[240px] border-[1px] border-gray-500" type="text" name="userName" id="userName" placeholder="Username" required />
                <input onChange={(e) => { setUserPhone(e.target.value) }} value={userPhone} className="text-sm px-3 py-2 w-[240px] border-[1px] border-gray-500" type="text" name="userPhone" id="userPhone" placeholder="Phone Number" required />
                <input onChange={(e) => { setUserPass(e.target.value) }} value={userPass} className="text-sm px-3 py-2 w-[240px] border-[1px] border-gray-500" type="password" name="userPass" id="userPass" placeholder="Password" required />
                <p className="text-[12px] text-red-600">{error}</p>
                <button onClick={handleRegister} className="text-sm my-2 border-2 border-gray-500 px-3 py-1 hover:bg-gray-200">Register</button>
            </div>
            <div className="flex flex-row justify-center items-center gap-1 text-gray-500 text-sm">
                <p>Already have an account?</p>
                <Link href={'/auth/login'} className="text-black">Login here.</Link>
            </div>
        </div>
    )
}