import React from 'react'
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from "react-redux";

const OtherUsers = () => {

    // 1. Trigger the fetch hook
    useGetOtherUsers();
    
    // 2. Grab data from Redux
    const { otherUsers } = useSelector(store => store.user);
    

    // 3. Debugging: This will show in your browser console (F12)
    console.log("OTHER_USERS_STATE:", otherUsers);

    if (!otherUsers) return <div className='text-white p-4'>Loading...</div>;
     
    return (
        <div className='overflow-auto flex-1'>
            {
                otherUsers.length > 0 ? (
                    otherUsers.map((user) => (
                        <OtherUser key={user?._id} user={user} />
                    ))
                ) : (
                    <div className='text-white p-4'>
                        No users found in Redux state. 
                        Check your API Response!
                    </div>
                )
            }
        </div>
    )
}

export default OtherUsers;