import React, { useEffect, useRef } from 'react'
import { useSelector } from "react-redux";
import { getAvatar } from '../utils/getAvtar';
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";

const Message = ({ message }) => {
    const scroll = useRef();
    
    const { authUser, selectedUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [message]);

    // Use == to handle potential String vs Object ID mismatches
    const isMe = message?.senderId == authUser?._id;

    return (
        <div ref={scroll} className={`chat ${isMe ? 'chat-end' : 'chat-start'} mb-2`}>
            {/* Profile Photo - hidden in typical WhatsApp format but keeping for UI fidelity if wanted, or shrink it */}
            <div className="chat-image avatar hidden md:block">
                <div className="w-8 rounded-full shadow-md">
                    <img 
                        alt="Profile" 
                        src={isMe ? getAvatar(authUser) : getAvatar(selectedUser)} 
                    />
                </div>
            </div>
            
            {/* Bubble - Right side is Green, Left side is Zinc */}
            <div className={`chat-bubble max-w-[85%] md:max-w-[70%] break-words shadow-sm text-[15px] leading-5 px-3 py-2 ${
                isMe 
                ? 'bg-[#005C4B] text-[#E9EDEF] rounded-tr-none' // Dark Green (WhatsApp style)
                : 'bg-[#202C33] text-[#E9EDEF] rounded-tl-none'  // Zinc/Gray
            }`}>
                <div className="flex flex-col">
                    <span>{message?.message}</span>
                    <div className={`flex items-center justify-end mt-1 gap-1 text-[11px] ${isMe ? 'text-[#8696A0]' : 'text-[#8696A0]'}`}>
                        <time>
                            {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                        {isMe && (
                            <span className="ml-[2px] text-[15px] flex items-center">
                                {message.status === 'sent' && <IoCheckmark className="text-[#8696A0]" />}
                                {message.status === 'delivered' && <IoCheckmarkDone className="text-[#8696A0]" />}
                                {message.status === 'seen' && <IoCheckmarkDone className="text-[#53bdeb]" />}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Message;