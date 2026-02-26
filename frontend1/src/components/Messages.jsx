import React, { useEffect, useRef } from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages'
import { useSelector } from 'react-redux';

const Messages = () => {
    useGetMessages();
    const { messages } = useSelector(store => store.message);
    const { authUser, selectedUser } = useSelector(store => store.user); 
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    if (!messages) return <div className='text-white p-4'>Loading...</div>;

    // THE FIX: Relaxed filter. We just check if the sender is either YOU or THEM.
    // This stops new messages from disappearing if 'receiverId' is missing from the backend response.
    const activeChatMessages = messages.filter((msg) => {
        return msg?.senderId === authUser?._id || msg?.senderId === selectedUser?._id;
    });

    return (
        <div className='px-4 flex-1 overflow-auto flex flex-col'>
            {
                activeChatMessages.length > 0 ? (
                    activeChatMessages.map((msg, index) => {
                        const isLastMessage = index === activeChatMessages.length - 1;
                        
                        return (
                            <div key={msg._id} ref={isLastMessage ? lastMessageRef : null}>
                                <Message message={msg} />
                            </div>
                        )
                    })
                ) : (
                    // FIX: You were missing this fallback UI in the code you pasted!
                    <div className='flex flex-col items-center justify-center h-full opacity-50'>
                        <p className='text-white'>Say hi to start the conversation!</p>
                    </div>
                )
            }
        </div>
    )
}

export default Messages;