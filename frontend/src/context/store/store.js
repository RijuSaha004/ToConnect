import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducer/userReducer/userReducer.js";
import postReducer from "../reducer/postReducer/postReducer.js";
import socketReducer from "../reducer/socketReducer/socketReducer.js";
import messageReducer from "../reducer/messageReducer/messageReducer.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    socketReducer,
    message: messageReducer,
  },
});
