import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../config";

export const getMessage = createAsyncThunk(
  "message/getMessage",
  async ({ recieverId }, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/message/get-messages/${recieverId}`,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ recieverId, message }, thunkAPI) => {
    try {
      const response = await clientServer.post(`/message/send/${recieverId}`, {
        message,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (msgId, thunkAPI) => {
    try {
      const response = await clientServer.post("/message/delete", {
        msgId,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);
