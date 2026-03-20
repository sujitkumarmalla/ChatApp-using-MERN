import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, clearUnread } from '../redux/userSlice';
import { getAvatar } from '../utils/getAvtar';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers, unreadMessages } = useSelector(store => store.user);

    if (!user) return null;

    const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(String(user._id));
    const unreadCount = unreadMessages?.[user._id] || 0;

    const handleClick = () => {
        dispatch(setSelectedUser(user));
        dispatch(clearUnread(user._id));
    };

    return (
        <>
            <div 
                onClick={handleClick} 
                className={`flex gap-3 items-center pl-3 pr-3 pt-3 cursor-pointer transition-all duration-200 
                ${selectedUser?._id === user._id ? 'bg-[#2A3942]' : 'hover:bg-[#202C33]'}`}
            >
                <div className="relative pb-3 shrink-0">
                    <div className="w-[49px] h-[49px] rounded-full overflow-hidden shrink-0">
                        <img src={getAvatar(user)} alt="user" className="w-full h-full object-cover" />
                    </div>
                    {isOnline && (
                        <span className="absolute bottom-3 right-0 w-3.5 h-3.5 bg-[#00A884] border-2 border-[#111B21] rounded-full"></span>
                    )}
                </div>

                <div className='flex flex-col flex-1 border-b border-[#222D34] pb-4 h-full justify-center'>
                    <div className="flex justify-between items-center">
                        <p className='text-[#E9EDEF] text-[17px]'>{user?.fullName}</p>
                    </div>
                    {unreadCount > 0 && (
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-[#8696A0] text-sm truncate">New Message</span>
                            <div className="bg-[#00A884] text-[#111B21] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {unreadCount}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OtherUser;