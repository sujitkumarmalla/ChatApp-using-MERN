import React from "react";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";

const Homepage = () => {
  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-2xl overflow-hidden
                    bg-white/10
                    backdrop-blur-xl
                    border border-white/20
                    shadow-xl">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default Homepage;