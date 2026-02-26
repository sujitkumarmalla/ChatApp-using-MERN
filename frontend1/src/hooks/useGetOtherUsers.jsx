import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                // Fix 1: Use the full URL directly if BASE_URL isn't defined
                const res = await axios.get(`http://localhost:8080/api/v1/user/`);
                
                // Debugging: Open your browser console (F12) and look at this!
                console.log("API FULL RESPONSE:", res);

                /* Fix 2: Check if your backend sends the array directly 
                   or inside res.data.users. 
                   If res.data is the array, keep it. 
                   If it's an object, use res.data.users (or whatever the key is).
                */
                dispatch(setOtherUsers(res.data)); 

            } catch (error) {
                console.log("Error in useGetOtherUsers:", error);
            }
        }
        fetchOtherUsers();
    }, [dispatch]) // Added dispatch to dependency array for best practice
}

export default useGetOtherUsers;