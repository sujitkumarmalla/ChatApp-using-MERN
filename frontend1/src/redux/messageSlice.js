import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [], 
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const messageIndex = state.messages.findIndex(m => m._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].status = status;
      }
    }
  },
});

export const { setMessages, updateMessageStatus } = messageSlice.actions;
export default messageSlice.reducer;