import React, { useEffect, useRef } from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMessage from '../hooks/useGetRealtimeMessage';

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();

    const { messages } = useSelector(store => store.message);
    const { authUser, selectedUser } = useSelector(store => store.user); 
    const lastMessageRef = useRef();

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // SAFETY CHECK 1: Guarantee messages is always an array
    const safeMessages = Array.isArray(messages) ? messages : [];

    // SAFETY CHECK 2: Filter out any undefined/null messages that might cause a crash
    const activeChatMessages = safeMessages.filter((msg) => {
        if (!msg) return false; // Ignore undefined messages
        return msg?.senderId === authUser?._id || msg?.senderId === selectedUser?._id;
    });

    return (
        <div className='px-4 flex-1 overflow-auto flex flex-col'>
            {activeChatMessages.length > 0 ? (
                activeChatMessages.map((msg, index) => {
                    // SAFETY CHECK 3: Final check before rendering
                    if (!msg) return null; 

                    return (
                        // Use msg._id, but fallback to 'index' if _id is missing
                        <div key={msg._id || index} ref={index === activeChatMessages.length - 1 ? lastMessageRef : null}>
                            <Message message={msg} />
                        </div>
                    )
                })
            ) : (
                <div className='flex flex-col items-center justify-center h-full opacity-50'>
                    <p className='text-white'>Say hi to start the conversation!</p>
                </div>
            )}
        </div>
    );
};

export default Messages;