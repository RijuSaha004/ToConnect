import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  getAllComments,
  getAllPosts,
  getAllUserPosts,
} from "../../action/postAction/postAction.js";

const initialState = {
  posts: [],
  isError: false,
  postUploadSuccess: false,
  allUserPosts: [],
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    postReset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        state.message = action.payload;
        state.postUploadSuccess = true;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.message = action.payload;
        state.postUploadSuccess = false;
      })
      .addCase(getAllUserPosts.fulfilled, (state, action) => {
        state.allUserPosts = action.payload.reverse();
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.reverse();
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments.reverse();
      });
  },
});

export const { postReset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
