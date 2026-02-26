import React, { useEffect } from 'react'
import Sendinput from './Sendinput'
import Messages from './Messages'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../redux/userSlice'

const MessageContainer = () => {
    const { selectedUser, authUser} = useSelector(store => store.user);
    const dispatch = useDispatch();

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
        <div className='md:min-w-[550px] flex flex-col h-full'>
            {
                selectedUser ? (
                    // IF A USER IS SELECTED: Show the Chat UI
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 bg-zinc-800 text-white px-4 py-2 mb-2">
                            <div className="avatar online">
                                <div className="w-10 rounded-full">
                                    <img
                                        src={selectedUser?.profilePhoto}
                                        alt="user profile"
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col flex-1'>
                                <div className='flex justify-between gap-2'>
                                    <p className='font-bold'>{selectedUser?.fullName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <Messages />

                        {/* Input Area */}
                        <Sendinput />
                    </>
                ) : (
                    // IF NO USER IS SELECTED: Show the Welcome Screen
                    <div className='flex flex-col items-center justify-center flex-1 text-white text-center'>
                        <h1 className='text-4xl font-bold'>
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