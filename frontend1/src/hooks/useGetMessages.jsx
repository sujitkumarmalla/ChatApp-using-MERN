import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      // 1. Safety check inside the function
      if (!selectedUser?._id) return;

      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `http://localhost:8080/api/v1/message/${selectedUser._id}`
        );

        console.log("Messages Received:", res.data); // DEBUG: Check what the backend sends

        // 2. Extract array specifically if it's wrapped in an object
        const messageData = Array.isArray(res.data) ? res.data : res.data?.messages;
        
        dispatch(setMessages(messageData || []));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser?._id, dispatch]); // Only run when the ID changes
};

export default useGetMessages;