'use client';

import Link from "next/link";
import Image from "next/image";
import { useGlobalContext } from "@/context/context";
import { useEffect } from "react";
import ProfilePic from '@/assets/profile.jpg';
import { deleteCookie } from "cookies-next";
import { redirect, useRouter } from "next/navigation";
import { verifyUser } from '../libs/auth';

export default function Header() {
    const router = useRouter();

    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();

    const updateUserData = async () => {
        const userData = JSON.parse(localStorage.getItem('userData')!) ? JSON.parse(localStorage.getItem('userData')!) : {};
        const jwtToken = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : 'abcd';

        const verified = await verifyUser(jwtToken, JSON.stringify(userData));

        if (verified) {
            setUserData(userData);
        } else {
            handleLogout(true);
        }
    }
    
    useEffect(() => {
        updateUserData();
    }, []);

    const handleLogout = (refresh: boolean) => {
        localStorage.removeItem('userData');
        localStorage.removeItem('jwt');
        deleteCookie('jwt');
        deleteCookie('userData');
        setUserData({});
        setJwtToken('');
        if (!refresh) {
            router.push('/');
        }
    }

    return (
        <div className="flex flex-row justify-between items-center px-10 py-1 border-b-[1px] border-black">
            <Link href={'/'} className="text-2xl font-semibold px-3 py-1 hover:bg-gray-200">chatXD</Link>
            {Object.keys(userData).length ? (
            <div className="flex flex-row justify-center items-center">
                <Link href={'/profile'} className="flex flex-row justify-center items-center gap-2 px-3 py-1 hover:bg-gray-200">
                    <p className="text-sm">{userData?.userName}</p>
                    <Image src={ProfilePic} alt="Profile Pic" className="w-6 h-6 rounded-full object-cover border-[1px] border-black"/>
                </Link>
                <button onClick={() => {handleLogout(false)}} className="px-3 py-1 text-sm hover:bg-gray-200">Logout</button>
            </div>
            ) : (
            <div className="flex flex-row justify-center items-center">
                <Link href={'/auth/login'} className="px-3 py-1 text-sm hover:bg-gray-200">Login</Link>
                <Link href={'/auth/register'} className="px-3 py-1 text-sm hover:bg-gray-200">Register</Link>
            </div>
            )}
        </div>
    )
}