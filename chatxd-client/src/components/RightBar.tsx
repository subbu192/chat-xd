'use client';

import Link from "next/link";
import Image from "next/image";

import ProfilePic from '@/assets/profile.jpg';
import OnlineLogo from '@/assets/icons/online.svg';
import OfflineLogo from '@/assets/icons/offline.svg';
import { socket } from "@/socket";
import { useGlobalContext } from "@/context/context";
import { useEffect } from "react";

export default function RightBar(props) {
    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();

    const recieverData = props.recieverData;

    const onlineStatus = 'Online';

    const handleUnfriend = async (fromID, toID) => {
        const res = await fetch('http://localhost:4000/frnds/removeFrnd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fromID: fromID, toID: toID  })
        })

        if (res.ok) {
            socket.emit('removeFrnd', fromID, toID);
            console.log('Unfriend successfull');
        } else {
            console.log('Error unfriending.');
        }
    }

    return (
        <div className="hidden md:flex flex-col justify-between items-start gap-1 border-l-[1px] border-black w-[230px] px-3 py-3">
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row justify-center items-center gap-2">
                    <Image src={ProfilePic} alt="Profile Pic" className="w-[60px] h-[60px] rounded-full object-cover" />
                    <div className="flex flex-col justify-center items-start">
                        <h3 className="text-md font-semibold px-3">{recieverData.userName}</h3>
                        <div className="flex flex-row justify-start items-center">
                            {
                                (onlineStatus == 'Online') ? (
                                    <Image src={OnlineLogo} alt="Online" className="w-8" />
                                ) : (
                                    <Image src={OfflineLogo} alt="Offline" className="w-8" />
                                )
                            }
                            <p className="text-sm">{onlineStatus}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-1">
                    <p></p>
                </div>
            </div>
            <button onClick={() => { handleUnfriend(recieverData.userPhone, userData.userPhone) }} className="text-md text-red-600 px-3 py-2 bg-red-200 rounded-lg border-[1px] border-white hover:border-red-600">
                Unfriend {recieverData.userName}
            </button>
        </div>
    )
}