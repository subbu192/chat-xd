'use client';

import Image from "next/image";
import { useState } from "react";
import { useGlobalContext } from "@/context/context";
import { socket } from "@/socket";

import AddIcon from '@/assets/icons/add.svg';
import SendLogo from '@/assets/icons/accept.svg';

export default function AddFriend() {
    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();

    const [ frndNumber, setFrndNumber ] = useState('');
    const [ toggleAddFrnd, setToggleAddFrnd ] = useState(false);
    const [ messageFR, setMessageFR ] = useState('');

    const handleAddFriend = async () => {
        const res = await fetch('http://localhost:4000/frnds/updateFRStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromID: userData.userPhone,
                toID: frndNumber,
                status: 'pending'
            })
        })

        const resData = await res.json();

        if (res.ok) {
            socket.emit('addFriend', {
                fromID: userData.userPhone,
                toID: frndNumber,
                fromData: userData
            });
            setMessageFR(resData.msg);
            setToggleAddFrnd(false);
        } else {
            setMessageFR(resData.error);
            console.log('FR Send Failed.');
        }
    }

    return (
        <>
            <button onClick={() => {setToggleAddFrnd(!toggleAddFrnd)}} className="flex flex-row justify-start items-center gap-2 px-5 py-2 w-full hover:bg-gray-300">
                <Image src={AddIcon} alt="Add Friend" className="w-4 border-[1p] border-black rounded-full" />
                <p className="text-left text-sm font-medium">Add Friend</p>
            </button>
            <div className={`${toggleAddFrnd ? "block" : "hidden"} flex flex-row justify-between items-center w-full px-5`}>
                <input onChange={(e) => { setFrndNumber(e.target.value) }} className="text-sm outline-none w-[150px]" type="text" value={frndNumber} placeholder="Phone Number" required />
                <button onClick={handleAddFriend} className="px-1 py-1 rounded-full hover:bg-gray-200"><Image src={SendLogo} alt="Send Friend Request" className="w-5" /></button>
            </div>
            <p className={`${toggleAddFrnd ? "block" : "hidden"} w-full px-5 text-sm`}>{messageFR}</p>
        </>
    )
}