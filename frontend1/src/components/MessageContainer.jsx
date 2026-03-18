import React, { useEffect } from 'react'
import Sendinput from './Sendinput'
import Messages from './Messages'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../redux/userSlice'
import { getAvatar } from '../utils/getAvtar'

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers, typingUsers} = useSelector(store => store.user);
    const dispatch = useDispatch();

    const isOnline = selectedUser && onlineUsers?.includes(String(selectedUser?._id));
    const isTyping = selectedUser && typingUsers?.includes(String(selectedUser?._id));

    // DEBUGGING: Open your browser console (F12) to see what is inside authUser
    useEffect(() => {
        console.log("Current Logged In User (authUser):", authUser);
    }, [authUser]);

    // Cleanup: Resets the selected user when you leave the component
    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, [dispatch]); 

    return (
        <div className='flex flex-col h-full bg-[#0B141A] w-full'>
            {
                selectedUser ? (
                    // IF A USER IS SELECTED: Show the Chat UI
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 bg-[#202C33] text-white px-4 py-3 shadow-sm z-10">
                            {/* Mobile Back Button */}
                            <button
                                className="md:hidden mr-1 text-gray-300 hover:text-white"
                                onClick={() => dispatch(setSelectedUser(null))}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
</svg>
                            </button>
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img
                                        src={getAvatar(selectedUser)}
                                        alt="user profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-blue-500 border-2 border-[#202C33] rounded-full"></span>
                                )}
                            </div>

                            <div className='flex flex-col flex-1'>
                                <div className='flex justify-between gap-2'>
                                    <p className='font-bold'>{selectedUser?.fullName}</p>
                                </div>
                                {isTyping ? (
                                    <p className='text-xs text-green-400'>Typing...</p>
                                ) : (
                                    isOnline && <p className='text-xs text-zinc-400'>Online</p>
                                )}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <Messages />

                        {/* Input Area */}
                        <Sendinput />
                    </>
                ) : (
                    // IF NO USER IS SELECTED: Show the Welcome Screen
                    <div className='flex flex-col items-center justify-center flex-1 text-[#8696A0] text-center bg-[#222D34] border-b-[6px] border-[#00A884]'>
                        <h1 className='text-3xl font-light text-white mb-4'>
                            {/* If fullName is blank, check if it's stored as authUser.name or authUser.username */}
                            Welcome, {authUser?.fullName || "Guest"} 👋
                        </h1>
                        <p className='text-lg mt-2'>Select a friend to start chatting!</p>
                        
                        {/* Small hint for you while developing */}
                        {!authUser?.fullName && (
                            <p className='text-xs text-zinc-500 mt-4'>
                                Hint: If your name is missing, check the Console (F12) 
                                to see if the property name is 'fullName' or 'name'.
                            </p>
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default MessageContainer;