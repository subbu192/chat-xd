'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProfilePic from '@/assets/profile.jpg';
import OnlineLogo from '@/assets/icons/online.svg';
import OfflineLogo from '@/assets/icons/offline.svg';
import SearchLogo from '@/assets/icons/search.svg';
import MenuLogo from '@/assets/icons/threedots.svg';

import ChatArea from "@/components/ChatArea";
import RightBar from "@/components/RightBar";

export default function UserChat() {
    const [ recieverData, setRecieverData ] = useState({});

    const onlineStatus = 'Online';

    const userID = useParams().userID;
    console.log(userID);

    const updateRecieverData = async () => {
        const res = await fetch('http://localhost:4000/frnds/getUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userPhone: userID })
        })

        const resData = await res.json();

        setRecieverData(resData);
    }

    useEffect(() => {
        updateRecieverData();

        return () => {
            setRecieverData({});
        }
    }, []);

    return (
        <>
            <div className="flex-1 flex flex-col justify-start items-start">
                <div className="flex flex-row justify-between items-center w-full bg-gray-200 px-5 py-2">
                    <div className="flex flex-row justify-start items-center gap-2 w-full">
                        <Image src={ProfilePic} alt="Profile Pic" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="text-sm font-semibold px-2">{recieverData.userName}</h3>
                            <div className="flex flex-row justify-start items-center">
                                {
                                    (onlineStatus == 'Online') ? (
                                        <Image src={OnlineLogo} alt="Online" className="w-6 object-fill" />
                                    ) : (
                                        <Image src={OfflineLogo} alt="Offline" className="w-6" />
                                    )
                                }
                                <p className="text-sm">{onlineStatus}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                        <button className="px-3 py-3 rounded-full hover:bg-gray-300"><Image src={SearchLogo} alt="Search Logo" className="w-5" /></button>
                        <button className="px-3 py-3 rounded-full hover:bg-gray-300"><Image src={MenuLogo} alt="Menu Logo" className="w-5" /></button>
                    </div>
                </div>
                <ChatArea />
            </div>
            <RightBar recieverData={recieverData} />
        </>
    )
}