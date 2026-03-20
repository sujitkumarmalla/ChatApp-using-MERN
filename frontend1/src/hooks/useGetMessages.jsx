import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { useSocket } from "../context/SocketContext";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      // 1. Safety check inside the function
      if (!selectedUser?._id) return;

      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `/api/v1/message/${selectedUser._id}`
        );

        console.log("Messages Received:", res.data); // DEBUG: Check what the backend sends

        // 2. Extract array specifically if it's wrapped in an object
        const messageData = Array.isArray(res.data) ? res.data : res.data?.messages;
        
        dispatch(setMessages(messageData || []));

        // 3. Mark all loaded messages from the other user as seen
        if (messageData && messageData.length > 0 && socket) {
            messageData.forEach((msg) => {
                if (msg.senderId === selectedUser._id && msg.status !== 'seen') {
                    socket.emit("markSeen", { messageId: msg._id, senderId: msg.senderId });
                }
            });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser?._id, dispatch, socket]); // Added socket dependency so it marks seen reliably
};

export default useGetMessages;