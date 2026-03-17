import { createSlice } from "@reduxjs/toolkit";
import {
  addNewEducation,
  addNewWork,
  getAboutUser,
  getAllAcceptedConnections,
  getAllUser,
  getAllUserEducation,
  getAllUserWork,
  getRecivedConnections,
  getRequestedConnections,
  loginUser,
  registerUser,
  sendConnectionRequest,
  updateUserData,
} from "../../action/userAction/userAction.js";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  isProcessSuccess: false,
  // isProcessNotSuccess: true,
  // isProfileUpdateSuccess: false,
  // isNewWorkAddedSuccessfully: false,
  allUserWork: [],
  allUserEducation: [],
  requestedConnections: [],
  receivedConnections: [],
  allAcceptedUserConnections: [],
  all_users: [],
  all_profiles_fetched: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userReset: () => initialState,
    emptyMessage: (state) => {
      state.message = "";
    },
    userIsLoggedIn: (state) => {
      state.loggedIn = true;
    },
    userIsNotLoggedIn: (state) => {
      state.loggedIn = false;
      state.user = undefined;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        //////////////////////////////////////////////////////
        ((state.isLoading = true),
          (state.message = "Logging in please wait ..."));
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Successfully logged in";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        ((state.isLoading = true),
          (state.message = "Registering. please wait ..."));
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Registration successfull. Please Sign In ...";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.message = action.payload;
        state.isProcessSuccess = true;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.message = action.payload;
        state.isProcessSuccess = false;
      })
      .addCase(addNewWork.fulfilled, (state, action) => {
        state.message = action.payload;
        state.isProcessSuccess = true;
      })
      .addCase(addNewWork.rejected, (state, action) => {
        state.message = action.payload;
        state.isProcessSuccess = false;
      })
      .addCase(addNewEducation.fulfilled, (state, action) => {
        state.message = action.payload;
        state.isProcessSuccess = true;
      })
      .addCase(addNewEducation.rejected, (state, action) => {
        state.message = action.payload;
        state.isProcessSuccess = false;
      })
      .addCase(getAllUserWork.fulfilled, (state, action) => {
        state.allUserWork = action.payload;
      })
      .addCase(getAllUserEducation.fulfilled, (state, action) => {
        state.allUserEducation = action.payload;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.message = action.payload;
        state.isProcessSuccess = true;
      })
      .addCase(getRequestedConnections.fulfilled, (state, action) => {
        state.requestedConnections = action.payload;
      })
      .addCase(getRecivedConnections.fulfilled, (state, action) => {
        state.receivedConnections = action.payload;
      })
      .addCase(getAllAcceptedConnections.fulfilled, (state, action) => {
        state.allAcceptedUserConnections = action.payload;
      });
  },
});

export const { userReset, emptyMessage, userIsLoggedIn, userIsNotLoggedIn } =
  userSlice.actions;
export default userSlice.reducer;
