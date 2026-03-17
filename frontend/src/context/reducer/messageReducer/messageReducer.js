import { createSlice } from "@reduxjs/toolkit";
import {
  deleteMessage,
  getMessage,
  sendMessage,
} from "../../action/messageAction/messageAction";

const initialState = {
  buttonLoading: false,
  screenLoading: false,
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    resetMessageState: (state) => {
      state.messages = [];
    },
    setNewMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    deleteMsgFromState: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // get messages ---------------------------------------------------->
      .addCase(getMessage.pending, (state, action) => {
        state.buttonLoading = true;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.messages = action.payload?.responseData?.messages ?? [];
        state.buttonLoading = false;
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.buttonLoading = false;
      })

      // send message --------------------------------------------->
      .addCase(sendMessage.pending, (state, action) => {
        state.buttonLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const oldMessages = state.messages ?? [];
        state.messages = [...oldMessages, action.payload?.responseData];
        state.buttonLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.buttonLoading = false;
      })

      //delete message ----------------------------------------------->
      .addCase(deleteMessage.pending, (state, action) => {})
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (msg) => msg._id != action.payload.deletedMessageId,
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {});
  },
});

export const { resetMessageState, setNewMessage, deleteMsgFromState } =
  messageSlice.actions;

export default messageSlice.reducer;
