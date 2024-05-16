'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { socket } from "@/socket";
import ProfilePic from '@/assets/profile.jpg';

import { useGlobalContext } from "@/context/context";
import { useRouter } from "next/navigation";

export default function ContactList() {
    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();
    const router = useRouter();

    console.log('Contact List');

    const [ chatData, setChatData ] = useState([]);

    const updateContacts = async (userData) => {
        console.log('Heeello', userData);

        const res = await fetch('http://localhost:4000/frnds/getContacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userPhone: userData.userPhone })
        })

        const resData = await res.json();
        console.log('resData', resData);

        if (res.ok) {
            setChatData((chatData) => {return [...chatData, ...resData.contactList]});
        } else {
            console.log(resData.error);
        }
    }

    useEffect(() => {
        console.log('Start', userData);

        updateContacts(userData);
    }, [userData])

    useEffect(() => {
        socket.on('addContact', (user) => {
            setChatData((chatData) => {return [...chatData, {
                userPhone: user.userPhone,
                userName: user.userName,
                chatMessage: 'You became friends. You can chat now.'
            }]})
        })

        socket.on('rmFrnd', (userID) => {
            setChatData((chatData) => {
                return chatData.filter((chat) => chat.userPhone != userID);
            });
            router.push('/dashboard');
        })

        return () => {
            socket.off('addContact', (user) => {
                setChatData((chatData) => {return [...chatData, {
                    userPhone: user.userPhone,
                    userName: user.userName,
                    chatMessage: 'You became friends. You can chat now.'
                }]})
            })

            socket.off('rmFrnd', (userID) => {
                setChatData((chatData) => {
                    return chatData.filter((chat) => chat.userPhone != userID);
                });
            })
        }
    }, [])

    return (
        <div className="flex flex-col justify-start items-start gap-1">
            <p className="text-lg font-semibold px-3">Contacts</p>
            {
                chatData.map((item, id) => {
                    return (
                    <Link key={id} href={`/dashboard/chat/${item.userPhone}`} className="flex flex-row justify-start items-center gap-3 px-3 py-2 w-[250px] hover:bg-gray-300">
                        <Image src={ProfilePic} alt="Profile Pic" className="w-8 h-8 rounded-full border-[1px] border-black object-cover" />
                        <div className="flex flex-col justify-center items-start">
                            <h2 className="text-sm font-medium">{item.userName}</h2>
                            <p className="text-[12px]">{item.chatMessage ? item.chatMessage : 'You became friends. You can chat now.'}</p>
                        </div>
                    </Link>)
                })
            }
        </div>
    )
}