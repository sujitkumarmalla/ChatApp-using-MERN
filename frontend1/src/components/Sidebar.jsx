import React, { useState, useEffect, useRef } from "react";
import { MdSearch } from "react-icons/md";
import Otherusers from "./Otherusers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from "../redux/userSlice";
import { getAvatar } from "../utils/getAvtar";

const Sidebar = () => {
  const { otherUsers, authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]); // 🔥 backup list
  const navigate = useNavigate();

  // 🔥 Save original users when loaded
  useEffect(() => {
    setAllUsers(otherUsers);
  }, [otherUsers]);

  // ✅ Logout
  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/api/v1/user/logout"
      );
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null))
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 REALTIME SEARCH
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // ✅ if empty → restore all users
    if (!value.trim()) {
      dispatch(setOtherUsers(allUsers));
      return;
    }

    const filteredUsers = allUsers.filter((user) =>
      user.fullName.toLowerCase().includes(value.toLowerCase())
    );

    dispatch(setOtherUsers(filteredUsers));
  };

  const searchSubmitHandle = (e) => {
    e.preventDefault();

    const conversationUser = allUsers.find((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversationUser) {
      dispatch(setSelectedUser(conversationUser));
      setSearch("");
    } else {
      toast.error("User not found");
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    const checkToastId = toast.loading("Uploading photo...");
    try {
      const res = await axios.put("http://localhost:8081/api/v1/user/profile-photo", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Profile photo updated!", { id: checkToastId });
      dispatch(setAuthUser(res.data.user));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to upload photo", { id: checkToastId });
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#111B21]">
      {/* 🟢 NEW: User Profile Header */}
      <div className="px-4 py-3 bg-[#202C33] flex justify-between items-center border-b border-[#222D34]">
         <div className="flex items-center gap-3 w-full">
             <div 
                 className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition shrink-0"
                 onClick={() => fileInputRef.current?.click()}
                 title="Change Profile Photo"
             >
                 <img src={getAvatar(authUser)} alt="my-profile" className="w-full h-full object-cover" />
                 <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleProfilePhotoChange} 
                     accept="image/*" 
                     className="hidden" 
                 />
             </div>
             <p className="text-[#E9EDEF] font-semibold truncate">{authUser?.fullName || "My Profile"}</p>
         </div>
      </div>

      <div className="px-3 py-2 bg-[#111B21]">
        <form onSubmit={searchSubmitHandle} className="flex items-center gap-2 bg-[#202C33] rounded-lg px-2 py-1">
          <button type="submit" className="text-[#8696A0] p-1">
            <MdSearch size={20} />
          </button>
          <input
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-[#D1D7DB] placeholder-[#8696A0] focus:outline-none py-1 text-sm"
            type="text"
            placeholder="Search or start new chat"
          />
        </form>
      </div>

      <div className="border-b border-[#222D34]"></div>

      <Otherusers />

      <div className="mt-auto p-3 bg-[#202C33] border-t border-[#222D34]">
        <button className="w-full py-2 text-sm text-[#00A884] hover:bg-[#111B21] transition-colors rounded" onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;