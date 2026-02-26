import React, { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import Otherusers from "./Otherusers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers, setSelectedUser } from "../redux/userSlice";

const Sidebar = () => {
  const { otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();

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
        "http://localhost:8080/api/v1/user/logout"
      );
      navigate("/login");
      toast.success(res.data.message);
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

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <form onSubmit={searchSubmitHandle} className="flex items-center gap-2">
        <input
          value={search}
          onChange={handleSearchChange}
          className="input input-bordered rounded-md w-full"
          type="text"
          placeholder="Search..."
        />

        <button
          type="submit"
          className="btn btn-square hover:cursor-pointer"
        >
          <MdSearch size={20} />
        </button>
      </form>

      <div className="divider px-3"></div>

      <Otherusers />

      <div className="mt-2">
        <button className="btn btn-sm" onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;