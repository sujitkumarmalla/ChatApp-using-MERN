import React from "react";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import { useSelector } from "react-redux";

const Homepage = () => {
    const { selectedUser } = useSelector(store => store.user);

    return (
        <div className="flex h-full w-full bg-[#111B21] overflow-hidden sm:p-0 md:p-4 lg:p-6 justify-center">
            {/* Inner App Container (like WhatsApp Web) */}
            <div className="flex w-full h-full max-w-7xl bg-[#202C33] shadow-2xl md:min-h-[550px]">
                {/* Left Sidebar Pane */}
                <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-[#222D34] flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <Sidebar />
                </div>
                {/* Right Message Pane */}
                <div className={`w-full md:w-2/3 lg:w-3/4 flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
                    <MessageContainer />
                </div>
            </div>
        </div>
    );
};

export default Homepage;