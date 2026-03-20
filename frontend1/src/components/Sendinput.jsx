import React, { useState } from 'react';
import { IoSendSharp } from "react-icons/io5";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../redux/messageSlice'; // Import your action
import { moveUserToTop } from '../redux/userSlice';
import { useSocket } from '../context/SocketContext';

const Sendinput = () => {

    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    
    // FIX 1: Destructure to get the actual user object
    const { selectedUser } = useSelector(store => store.user);
    const { socket } = useSocket();

    // Track the timeout ID for stopTyping
    const [typingTimeoutId, setTypingTimeoutId] = useState(null);

    const onChangeHandler = (e) => {
        setMessage(e.target.value);
        if (socket && selectedUser) {
            socket.emit("typing", selectedUser._id);
            if (typingTimeoutId) clearTimeout(typingTimeoutId);
            
            const timeoutId = setTimeout(() => {
                socket.emit("stopTyping", selectedUser._id);
            }, 2000);
            setTypingTimeoutId(timeoutId);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim()) return; // Don't send empty messages

        try {
            const res = await axios.post(
                `/api/v1/message/send/${selectedUser?._id}`, 
                { message }, 
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            console.log("Message sent response:", res.data);

            // FIX 2: Update Redux store immediately so the message appears on screen
            // res.data is the message object itself.
            dispatch(addMessage(res.data)); 
            dispatch(moveUserToTop(selectedUser?._id));
            
            // Clear input after sending
            setMessage(""); 
            
            if (socket && selectedUser) {
                socket.emit("stopTyping", selectedUser._id);
                if (typingTimeoutId) clearTimeout(typingTimeoutId);
            }

        } catch (error) {
            console.log("Error sending message:", error);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='px-4 py-3 bg-[#202C33]'>
            <div className='w-full relative flex items-center gap-3'>
                <input 
                    type="text" 
                    placeholder='Type a message' 
                    value={message} 
                    onChange={onChangeHandler}
                    className='w-full bg-[#2A3942] text-[#D1D7DB] placeholder-[#8696A0] px-4 py-[10px] rounded-lg focus:outline-none' 
                />
                <button type="submit" className='text-[#8696A0] hover:text-[#D1D7DB] shrink-0 p-1'>
                    <IoSendSharp size={24} />
                </button>
            </div>
        </form>
    )
}

export default Sendinput;