import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers } = useSelector(store => store.user);

    // 1. EMERGENCY CHECK: If user prop is missing, don't render anything
    if (!user) return null;

    const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user._id);

    const selectedUserHandler = (clickedUser) => {
        dispatch(setSelectedUser(clickedUser));
    }

    return (
        <>
            <div 
                onClick={() => selectedUserHandler(user)} 
                className={`${selectedUser?._id === user._id ? 'bg-zinc-200 text-black' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer transition-all`}
            >
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img 
                            src={user?.profilePhoto || "https://avatar.iran.liara.run/public/boy"} 
                            alt="user-profile" 
                        />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2'>
                        <p className='font-bold'>{user?.fullName || "Unknown User"}</p>
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1 opacity-10'></div>
        </>
    )
}

export default OtherUser;