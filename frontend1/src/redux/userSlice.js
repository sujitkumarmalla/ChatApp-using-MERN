import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    otherUsers: [], 
    selectedUser: null,
    onlineUsers: [], // Initialize as array, not null
    typingUsers: [], // Store users currently typing
    unreadMessages: {}, // Map of userId -> count
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
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(userId => userId !== action.payload);
    },
    moveUserToTop: (state, action) => {
      const userId = action.payload;
      const userIndex = state.otherUsers.findIndex(u => u._id === userId);
      if (userIndex > 0) {
        // Remove the user from their current position and unshift to the front
        const [movedUser] = state.otherUsers.splice(userIndex, 1);
        state.otherUsers.unshift(movedUser);
      }
    },
    incrementUnread: (state, action) => {
      const userId = action.payload;
      if (state.unreadMessages[userId]) {
        state.unreadMessages[userId] += 1;
      } else {
        state.unreadMessages[userId] = 1;
      }
    },
    clearUnread: (state, action) => {
      const userId = action.payload;
      state.unreadMessages[userId] = 0;
    }
  },
});

export const { setAuthUser, setOtherUsers, setSelectedUser, setOnlineUsers, addTypingUser, removeTypingUser, moveUserToTop, incrementUnread, clearUnread } = userSlice.actions;
export default userSlice.reducer;