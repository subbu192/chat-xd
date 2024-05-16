'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/context";
import { useParams } from "next/navigation";

import { socket } from "@/socket";

import SendLogo from '@/assets/icons/send.svg';

export default function ChatArea() {
    const { userData, setUserData, jwtToken, setJwtToken } = useGlobalContext();

    const params = useParams();

    const userID = params.userID;

    const [ chatMessage, setChatMessage ] = useState('');

    const [ chatData, setChatData ] = useState([]);

    const sendMessage = async () => {
        const msgData = {
            fromID: userData.userPhone,
            toID: userID,
            msgContent: chatMessage
        }

        const res = await fetch('http://localhost:4000/chats/addChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(msgData)
        })

        if (res.ok) {
            socket.emit('sendMsg', msgData);
            setChatMessage('');
        } else {
            console.log('Failed to Send msg');
        }
    }

    const updateChat = async (userData) => {
        const res = await fetch('http://localhost:4000/chats/getChats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fromID: userData.userPhone, toID: userID })
        })

        const resData = await res.json();

        if (res.ok) {
            setChatData((chatData) => {return [...chatData, ...resData.chatList]});
        } else {
            console.log(resData.error);
        }
    }

    useEffect(() => {
        console.log('inside useeffect');
        const userData = JSON.parse(localStorage.getItem('userData')!);

        updateChat(userData);

        socket.on('gotMsg', (msgData) => {
            setChatData((chatData) => { return [...chatData, msgData] });
            console.log(chatData);
        });

        return () => {
            socket.off('gotMsg', (msgData) => {
                if (msgData.toID != userData.userPhone) {
                    return;
                }
                setChatData((chatData) => { return [...chatData, msgData] });
                console.log(chatData);
            });
        }
    }, []);

    return (
        <>
            <div className="flex-1 flex flex-col justify-end w-full px-5 py-2 gap-1 h-full">
                {
                    chatData.map((item, id) => {
                        return (
                            <div key={id} className={`flex flex-row ${(userID == item.toID) ? "justify-end" : "justify-start"} items-center`}>
                                <p className={`px-2 py-1 bg-gray-200 rounded-lg`}>{item.msgContent}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className="flex flex-row justify-between items-center w-full bg-gray-200 px-5 py-3">
                <input onChange={(e) => { setChatMessage(e.target.value) }} className="text-gray-500 bg-gray-200 w-full outline-none" type="text" value={chatMessage} placeholder="Type a message" required />
                <button onClick={sendMessage} className="px-2 py-2 rounded-full hover:bg-gray-300"><Image src={SendLogo} alt="Send Message" className="w-6" /></button>
            </div>    
        </>
    )
}