import React, { useState } from 'react';
import { IoSendSharp } from "react-icons/io5";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice'; // Import your action

const Sendinput = () => {

    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    
    // FIX 1: Destructure to get the actual user object
    const { selectedUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim()) return; // Don't send empty messages

        try {
            const res = await axios.post(
                `http://localhost:8080/api/v1/message/send/${selectedUser?._id}`, 
                { message }, 
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            console.log("Message sent response:", res.data);

            // FIX 2: Update Redux store immediately so the message appears on screen
            // We take the existing messages and add the new one from the response
            dispatch(setMessages([...messages, res.data.newMessage])); 
            
            // Clear input after sending
            setMessage(""); 

        } catch (error) {
            console.log("Error sending message:", error);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-3'>
            <div className='w-full relative'>
                <input 
                    type="text" 
                    placeholder='Send a message...' 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    className='border text-sm rounded-lg block w-full bg-gray-700 p-3 border-zinc-500 text-white' 
                />
                <button type="submit" className='absolute inset-y-0 end-0 flex items-center pr-4 text-white hover:text-blue-500'>
                    <IoSendSharp />
                </button>
            </div>
        </form>
    )
}

export default Sendinput;