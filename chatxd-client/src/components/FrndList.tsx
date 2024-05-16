'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { socket } from "@/socket";
import ProfilePic from '@/assets/profile.jpg';
import AcceptLogo from '@/assets/icons/accept.svg';
import RejectLogo from '@/assets/icons/reject.svg';

import { useGlobalContext } from "@/context/context";

export default function FrndList() {
    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();

    console.log('Frnd List');

    const [ frndReqs, setFrndReqs ] = useState([])

    const handleFRUpdate = async (toData, status) => {
        const res = await fetch('http://localhost:4000/frnds/updateFRStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromID: userData.userPhone,
                toID: toData.userPhone,
                status: status
            })
        })

        setFrndReqs((frndReqs) => {
            return frndReqs.filter((frndReq) => frndReq.userPhone != toData.userPhone)
        });

        if (res.ok) {
            socket.emit('updateFR', userData, toData, status);
        } else {
            console.log('FR Update Failed.');
        }        
    }

    const updateFrndReqs = async (userData) => {
        const res = await fetch('http://localhost:4000/frnds/getFRs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userPhone: userData.userPhone })
        })

        const resData = await res.json();

        if (res.ok) {
            setFrndReqs((frndReqs) => {return [...frndReqs, ...resData.contactList]});
        } else {
            console.log(resData.error);
        }
    }

    useEffect(() => {
        updateFrndReqs(userData);
    }, [userData])

    useEffect(() => {
        socket.on('newFrndReq', (reqData) => {
            setFrndReqs((frndReqs) => {return [...frndReqs, reqData]});
        });
        
        return () => {
            socket.off('newFrndReq', (reqData) => {
                setFrndReqs((frndReqs) => {return [...frndReqs, reqData]});
            });

        }
    }, [])

    return (
        <div className="flex flex-col justify-start items-start gap-1">
            <p className="text-lg font-semibold px-3">Friend Requests</p>
            {
                frndReqs.map((item, id) => {
                    return (
                    <div key={id} className="flex flex-row justify-start items-center gap-3 px-4 py-2 w-[250px] hover:bg-gray-300">
                        <Image src={ProfilePic} alt="Profile Pic" className="w-7 h-7 rounded-full border-[1px] border-black object-cover" />
                        <div className="flex flex-row justify-between items-center w-full">
                            <h2 className="text-sm font-medium">{item.userName}</h2>
                            <div className="flex flex-row justify-center items-center gap-1">
                                <button onClick={() => { handleFRUpdate(item, 'accept') }} className="px-1 py-1 rounded-full hover:bg-gray-200"><Image src={AcceptLogo} alt="Accept Friend Request" className="w-5" /></button>
                                <button onClick={() => { handleFRUpdate(item, 'reject') }} className="px-1 py-1 rounded-full hover:bg-gray-200"><Image src={RejectLogo} alt="Reject Friend Request" className="w-5" /></button>
                            </div>
                        </div>
                    </div>)
                })
            }
        </div>
    )
}