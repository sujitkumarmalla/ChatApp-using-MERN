import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from './components/Signup';
import Login from './components/Login';
import Homepage from './components/Homepage';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from "socket.io-client"
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Login /> }
])

function App() {
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket); 
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      // 1. Establish connection
      const socketInstance = io("http://localhost:8081", {
        query: {
          userId: authUser._id,
        }
      });

      // 2. Store socket in Redux
      dispatch(setSocket(socketInstance));

      // 3. Set up listeners
      socketInstance.on("connect", () => {
        console.log("🚀 Socket Connected! ID:", socketInstance.id);
      });

      socketInstance.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // 4. Cleanup function
      return () => {
        socketInstance.close();
        dispatch(setSocket(null));
      };
    } else {
      // If user logs out, clean up
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <div className="h-screen w-screen bg-[#111B21] text-[#E9EDEF] overflow-hidden">
      <RouterProvider router={router} />
    </div>
  )
}

export default App;