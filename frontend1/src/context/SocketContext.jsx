import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers } from "../redux/userSlice";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { authUser } = useSelector(store => store.user);

    const dispatch = useDispatch();

    useEffect(() => {
        if (authUser) {
            const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:8081' : '/';
            const socketInstance = io(socketUrl, {
                query: {
                    userId: authUser._id,
                }
            });

            setSocket(socketInstance);

            socketInstance.on("connect", () => {
                console.log("🚀 Socket Connected via Context! ID:", socketInstance.id);
            });
            
            socketInstance.on("getOnlineUsers", (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers)); // Use the verified action creator
            });

            return () => {
                socketInstance.close();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
