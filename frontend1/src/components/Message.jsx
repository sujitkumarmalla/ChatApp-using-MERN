import React, { useEffect, useRef } from 'react'
import { useSelector } from "react-redux";

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
            {/* Profile Photo */}
            <div className="chat-image avatar">
                <div className="w-10 rounded-full shadow-md">
                    <img 
                        alt="Profile" 
                        src={isMe ? authUser?.profilePhoto : selectedUser?.profilePhoto} 
                    />
                </div>
            </div>
            
            {/* Time Header */}
            <div className="chat-header mb-1">
                <time className="text-[10px] opacity-70 ml-1 text-white">
                    {/* Shows real time from database */}
                    {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
            </div>

            {/* Bubble - Right side is Green, Left side is Zinc */}
            <div className={`chat-bubble max-w-[75%] break-words text-white shadow-lg ${
                isMe 
                ? 'bg-[#056162] rounded-tr-none' // Dark Green (WhatsApp style)
                : 'bg-zinc-700 rounded-tl-none'  // Zinc/Gray
            }`}>
                {message?.message}
            </div>
            
            {/* Only show 'Delivered' on your own messages */}
            {isMe && <div className="chat-footer opacity-50 text-[10px] mt-1">Delivered</div>}
        </div>
    )
}

export default Message;