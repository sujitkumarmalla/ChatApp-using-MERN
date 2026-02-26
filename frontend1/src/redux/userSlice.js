import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    otherUsers: [], 
    selectedUser: null,
    onlineUsers: [], // 👈 ADD THIS: Otherwise useSelector(store=>store.user) returns undefined for onlineUsers
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => { // 👈 ADD THIS: To update online status later
      state.onlineUsers = action.payload;
    }
  },
});

export const {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
  setOnlineUsers
} = userSlice.actions;

export default userSlice.reducer;