import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../config/index.js";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/login", {
        email: user.email,
        password: user.password,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/register", {
        name: user.name,
        email: user.email,
        username: user.username,
        password: user.password,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_user_and_profile");
      return thunkAPI.fulfillWithValue(response.data.user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAllUser = createAsyncThunk(
  "user/getAllUser",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (userData, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/update_user_data", {
        name: userData.name,
        username: userData.username,
        currentPost: userData.currentPost,
        bio: userData.bio,
      });
      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const addNewWork = createAsyncThunk(
  "user/addNewWork",
  async (userData, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/add_work", {
        company: userData.company,
        position: userData.position,
        years: userData.experience,
      });
      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const addNewEducation = createAsyncThunk(
  "user/addNewEducation",
  async (userData, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/add_education", {
        school: userData.school,
        degree: userData.degree,
        fieldOfStudy: userData.fieldOfStudy,
      });
      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAllUserWork = createAsyncThunk(
  "user/getAllUserWork",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users_work");
      return thunkAPI.fulfillWithValue(response.data.allWorks);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAllUserEducation = createAsyncThunk(
  "user/getAllUserEducation",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users_education");
      return thunkAPI.fulfillWithValue(response.data.allEducations);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          receiverId: user.user_id,
        },
      );
      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getRequestedConnections = createAsyncThunk(
  "user/getRequestedConnections",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/requested_connections");
      return thunkAPI.fulfillWithValue(response.data.requestedConnections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getRecivedConnections = createAsyncThunk(
  "user/getRecivedConnections",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/received_connections");
      return thunkAPI.fulfillWithValue(response.data.recivedConnections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAllAcceptedConnections = createAsyncThunk(
  "user/getAllAcceptedConnections",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/all_accepted_connections");
      return thunkAPI.fulfillWithValue(response.data.acceptedConnections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);
