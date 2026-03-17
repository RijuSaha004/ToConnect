import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  acceptConnectionRequest,
  addUserEducation,
  addUserWork,
  deleteAcceptedConnection,
  deleteUserEducation,
  deleteUserWork,
  downloadProfile,
  getAllAcceptedConnectionOfUser,
  getAllUserEducation,
  getAllUserProfile,
  getAllUserWork,
  getReceivedConnections,
  getRequestedConnections,
  getUserAndProfile,
  getUserProfileAndUserBasedOnId,
  login,
  logOut,
  register,
  rejectConnectionRequest,
  sendConnectionRequest,
  unsendConnectionRequest,
  updateUserData,
  uploadProfilePicture,
  userVerification,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/verify", asyncHandler(userVerification));
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/logout", isLoggedIn, asyncHandler(logOut));
router.get(
  "/get_user_and_profile",
  isLoggedIn,
  asyncHandler(getUserAndProfile),
);
router.get("/get_all_users", isLoggedIn, asyncHandler(getAllUserProfile));
router.post(
  "/get_profile_based_on_id",
  isLoggedIn,
  asyncHandler(getUserProfileAndUserBasedOnId),
);
router.get("/download_resume", isLoggedIn, asyncHandler(downloadProfile));
router.post("/update_user_data", isLoggedIn, asyncHandler(updateUserData));
router.post(
  "/update_profile_picture",
  upload.single("profile_picture"),
  isLoggedIn,
  asyncHandler(uploadProfilePicture),
);
router.post("/add_work", isLoggedIn, asyncHandler(addUserWork));
router.post("/add_education", isLoggedIn, asyncHandler(addUserEducation));
router.get("/get_all_users_work", isLoggedIn, asyncHandler(getAllUserWork));
router.get(
  "/get_all_users_education",
  isLoggedIn,
  asyncHandler(getAllUserEducation),
);
router.post("/delete_work", isLoggedIn, asyncHandler(deleteUserWork));
router.post("/delete_education", isLoggedIn, asyncHandler(deleteUserEducation));
router.post(
  "/send_connection_request",
  isLoggedIn,
  asyncHandler(sendConnectionRequest),
);
router.post(
  "/unsend_request",
  isLoggedIn,
  asyncHandler(unsendConnectionRequest),
);
router.get(
  "/requested_connections",
  isLoggedIn,
  asyncHandler(getRequestedConnections),
);
router.get(
  "/received_connections",
  isLoggedIn,
  asyncHandler(getReceivedConnections),
);
router.post(
  "/accept_connection_request",
  isLoggedIn,
  asyncHandler(acceptConnectionRequest),
);
router.post(
  "/reject_connection_request",
  isLoggedIn,
  asyncHandler(rejectConnectionRequest),
);
router.get(
  "/all_accepted_connections",
  isLoggedIn,
  asyncHandler(getAllAcceptedConnectionOfUser),
);
router.post(
  "/delete_accepted_connection",
  isLoggedIn,
  asyncHandler(deleteAcceptedConnection),
);

export default router;
