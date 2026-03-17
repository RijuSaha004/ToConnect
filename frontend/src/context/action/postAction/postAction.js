import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../config";

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    try {
      const { file, body } = userData;

      const formData = new FormData();
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/post/create_post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue(response.data.message);
      } else {
        return thunkAPI.rejectWithValue("Post failed to upload");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAllUserPosts = createAsyncThunk(
  "post/getAllUserPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("post/userPosts");
      return thunkAPI.fulfillWithValue(response.data.posts);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("post/allPosts");
      return thunkAPI.fulfillWithValue(response.data.posts);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAllComments = createAsyncThunk(
    "post/getAllComments", 
    async (post_id, thunkAPI) => {
        try {
            const response = await clientServer.post("/post/get_comments", {
                post_id: post_id
            })
            return thunkAPI.fulfillWithValue({
                comments: response.data.comments,
                post_id: post_id
            })
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const postComment = createAsyncThunk (
    "post/postComment", 
    async (commentData, thunkAPI) => {
        try {
            const response = await clientServer.post("/post/comment", {
                post_id: commentData.post_id,
                commentBody: commentData.body
            })
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
