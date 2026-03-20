import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, updateMessageStatus } from "../redux/messageSlice";
import { addTypingUser, removeTypingUser, moveUserToTop, incrementUnread } from "../redux/userSlice";
import { useSocket } from "../context/SocketContext";

const useGetRealTimeMessage = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      if (newMessage.senderId === selectedUser?._id) {
        // The sender is the actively selected user.
        dispatch(addMessage(newMessage));
        socket.emit("markSeen", { messageId: newMessage._id, senderId: newMessage.senderId });
      } else {
        // From someone else, mark delivered and increment unread badge
        socket.emit("markDelivered", { messageId: newMessage._id, senderId: newMessage.senderId });
        dispatch(incrementUnread(newMessage.senderId));
      }

      // Automatically move the user who just messaged to the top of the chat list
      dispatch(moveUserToTop(newMessage.senderId));
    });

    socket?.on("messageDelivered", (messageId) => {
      dispatch(updateMessageStatus({ messageId, status: "delivered" }));
    });

    socket?.on("messageSeen", (messageId) => {
      dispatch(updateMessageStatus({ messageId, status: "seen" }));
    });

    socket?.on("typing", (userId) => {
      dispatch(addTypingUser(userId));
    });

    socket?.on("stopTyping", (userId) => {
      dispatch(removeTypingUser(userId));
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("messageDelivered");
      socket?.off("messageSeen");
      socket?.off("typing");
      socket?.off("stopTyping");
    };
  }, [socket, dispatch, selectedUser]);
};

export default useGetRealTimeMessage;