'use client';

import Link from "next/link";
import Image from "next/image";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/context";

import ProfilePic from '@/assets/profile.jpg';
import SettingsLogo from '@/assets/icons/settings.svg';

import ContactList from "./ContactList";
import FrndList from "./FrndList";
import AddFriend from "./AddFrnd";

export default function LeftBar() {
    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();

    console.log('Left Bar');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData')!);

        socket.connect();
        console.log('Connected to Server.');
        socket.emit('join', userData);

        return () => {
            console.log('Leaving Room');
            socket.emit('leave', userData);
        }
    }, [])

    return (
        <div className="hidden md:flex flex-col justify-between items-start gap-2 border-r-[1px] border-black py-3">
            <div className="flex flex-col justify-start items-start gap-2">
                <AddFriend />
                <ContactList />
                <FrndList />
            </div>
            <div className="flex flex-col justify-center items-start">
                <Link href={'/dashboard/profile'} className="flex flex-row justify-start items-center gap-1 px-3 py-2 hover:bg-gray-300 w-[250px]">
                    <Image src={ProfilePic} alt="Profile Pic" className="w-6 h-6 rounded-full" />
                    <p className="text-sm font-semibold px-3">{userData.userName}</p>
                </Link>
                <Link href={'/dashboard/settings'} className="flex flex-row justify-start items-center gap-1 px-3 py-2 hover:bg-gray-300 w-[250px]">
                    <Image src={SettingsLogo} alt="Settings" className="w-6 h-6 rounded-full" />
                    <p className="text-sm font-semibold px-3">Settings</p>
                </Link>
            </div>
        </div>
    )
}