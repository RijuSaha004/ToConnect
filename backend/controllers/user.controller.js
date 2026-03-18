import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
// import Profile from "../models/profile.model.js";
// import ConnectionRequest from "../models/connections.model.js";

import { appError } from "../utils/appError.js";
import { generateJwtToken } from "../utils/generateJwtToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { convertUserDataToPDF } from "../utils/pdfConverter.js";
import {
  createEducationSchema,
  createWorkSchema,
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../validationSchemas.js";
import Work from "../models/work.model.js";
import Education from "../models/education.model.js";
import ConnectionRequest from "../models/connections.model.js";

// ----------------- USER VERIFICATION ------------------------------------------------------------
export const userVerification = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new appError("User not authenticated", 401);
  }

  const data = jwt.verify(token, process.env.TOKEN_KEY);

  const user = await User.findById(data.id);

  if (!user) {
    throw new appError("User not found", 401);
  }

  res.status(200).json({
    status: "success",
    user: user.name,
  });
};

// ----------------- REGISTER USER -----------------------------------------------------------------
export const register = async (req, res) => {
  const validationResult = registerUserSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new appError("Invalid Credentials", 400);
  }

  const { name, email, password, username } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw new appError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    username,
  });
  await newUser.save();

  return res.status(200).json({ message: "User created successfully" });
};

// ----------------- LOGIN USER ------------------------------------------------------------------
export const login = async (req, res) => {
  const validationResult = loginUserSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new appError("Invalid Credentials", 401);
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new appError("User does not exists", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new appError("Invalid credentials", 400);
  }

  const token = generateJwtToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res
    .status(200)
    .json({ message: "User logged in successfully", token: token });
};

// ----------------- LOGOUT USER -----------------------------------------------------------------
export const logOut = async (req, res) => {
  const userId = req.user._id;

  if (userId) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  res.status(200).json({ message: "User logged out" });
};

// ---------------- GET USER DATA -----------------------------------------------------------------
export const getUserAndProfile = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findOne({ _id: userId }).select(
    "name username bio currentPost profilePicture",
  );

  return res.status(200).json({ user });
};

//------------------ GET ALL USERS -----------------------------------------------------------------
export const getAllUserProfile = async (req, res) => {
  const userId = req.user._id;

  const allProfiles = await User.find().select(
    "name username email profilePicture",
  );

  const allRequestedIds = (
    await ConnectionRequest.find({
      senderId: userId,
    })
  ).map((connection) => connection.receiverId.toString());

  const allReceivedRequestIds = (
    await ConnectionRequest.find({
      receiverId: userId,
    })
  ).map((connection) => {
    if (connection.status_accepted === true) {
      return connection.senderId.toString();
    }
  });

  const filteredProfile = allProfiles
    .filter(
      (user) =>
        user._id.toString() !== userId.toString() &&
        !allRequestedIds.includes(user._id.toString()),
    )
    .filter((user) => !allReceivedRequestIds.includes(user._id.toString()));

  return res.status(200).json({ profiles: filteredProfile });
};

//------------------ GET SPECIFIC USER --------------------------------------------------------------
export const getUserProfileAndUserBasedOnId = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findOne({ _id: userId });
  const work = await Work.find({ userId });
  const education = await Education.find({ userId });

  if (!user) {
    throw new appError("User profile not found", 404);
  }

  res.status(200).json({ user, work, education });
};

//------------------ DOWNLOAD PROFILE ---------------------------------------------------------------
export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;

  const userProfile = await User.findOne({ _id: user_id });
  const allWorks = await Work.find({ userId: user_id });
  const allEducations = await Education.find({ userId: user_id });

  if (!userProfile) {
    throw new appError("Profile not found", 404);
  }

  let outputPath = await convertUserDataToPDF({
    userProfile,
    allWorks,
    allEducations,
  });

  const filePath = path.resolve("public", outputPath);

  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Delete failed:", err.message);
      } else {
        console.log("Resume deleted successfully");
      }
    });
  }, 10000);

  return res.status(200).json({ resumePath: outputPath });
};

// ---------------- UPDATE USER DATA --------------------------------------------------------------
export const updateUserData = async (req, res) => {
  const validationResult = updateUserSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new appError("Invalid Credentials", 401);
  }
  const userId = req.user._id;
  const newUserData = req.body;

  const user = await User.findOne({ _id: userId });

  const { username } = newUserData;
  if (username) {
    const existingUser = await User.findOne({
      username,
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      throw new appError("User with this username already exists", 400);
    }
  }

  Object.assign(user, newUserData);
  await user.save();

  return res.status(200).json({
    message: "Profile updated successfully",
  });
};

// ----------------- UPDATE PROFILE PICTURE -------------------------------------------------------
export const uploadProfilePicture = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });

  const filePath = path.resolve(req.file.path);
  const uploadResult = await uploadOnCloudinary(filePath);

  user.profilePicture = uploadResult?.secure_url;
  await user.save();

  res.status(200).json({ message: "Profile picture updated successfully" });
};

// ----------------- ADD WORK EXPERIENCE -----------------------------------------------------------
export const addUserWork = async (req, res) => {
  const validationResult = createWorkSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new appError("Invalid Credentials", 401);
  }

  const userId = req.user._id;
  const { company, position, years } = req.body;

  const newWork = new Work({
    userId,
    company,
    position,
    years,
  });
  await newWork.save();

  return res.status(200).json({
    message: "New Work Experience Added successfully",
  });
};

// ------------------- ADD USER EDUCATION ---------------------------------------------------------
export const addUserEducation = async (req, res) => {
  const validationResult = createEducationSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new appError("Invalid Credentials", 401);
  }

  const userId = req.user._id;
  const { school, degree, fieldOfStudy } = req.body;

  const newEducation = new Education({
    userId,
    school,
    degree,
    fieldOfStudy,
  });
  await newEducation.save();

  return res.status(200).json({
    message: "New Education Added successfully",
  });
};

// ---------------------- GET ALL USER WORKS -----------------------------------------------------
export const getAllUserWork = async (req, res) => {
  const userId = req.user._id;

  const allWorks = await Work.find({ userId });

  return res.status(200).json({
    allWorks,
  });
};

// ---------------------- GET ALL USER EDUCATIONS -----------------------------------------------------
export const getAllUserEducation = async (req, res) => {
  const userId = req.user._id;

  const allEducations = await Education.find({ userId });

  return res.status(200).json({
    allEducations,
  });
};

// -------------------- DELETE USER WORK --------------------------------------------------------------
export const deleteUserWork = async (req, res) => {
  const userId = req.user._id;
  const { workId } = req.body;

  const deleteWork = await Work.deleteOne({ _id: workId, userId });

  return res.status(200).json({
    message: "Work deleted successfully",
  });
};

// -------------------- DELETE USER EDUCATION ---------------------------------------------------------
export const deleteUserEducation = async (req, res) => {
  const userId = req.user._id;
  const { educationId } = req.body;

  const deleteEducation = await Education.deleteOne({
    _id: educationId,
    userId,
  });

  return res.status(200).json({
    message: "Education deleted successfully",
  });
};

//--------------------- SEND CONNECTION REQUEST -------------------------------------------------------
export const sendConnectionRequest = async (req, res) => {
  const userId = req.user._id;
  const { receiverId } = req.body;

  if (userId.toString() === receiverId) {
    throw new appError("You cannot connect with yourself", 400);
  }

  const connectionUser = await User.findById(receiverId);
  if (!connectionUser) {
    throw new appError("Connection user not found", 404);
  }

  // Check request in both directions
  const existingRequest = await ConnectionRequest.findOne({
    senderId: receiverId,
    receiverId: userId,
  });

  if (existingRequest) {
    existingRequest.status_accepted = true;
    existingRequest.save();
    return res.status(200).json({ message: "Request Accepted" });
  }

  await ConnectionRequest.create({
    senderId: userId,
    receiverId,
  });

  return res.status(200).json({ message: "Request sent" });
};

//---------------------- UNSEND REQUEST ---------------------------------------------------------------
export const unsendConnectionRequest = async (req, res) => {
  const { connectionId } = req.body;

  const deleteConnection = await ConnectionRequest.deleteOne({
    _id: connectionId,
  });
  return res.status(200).json({ message: "Connection Deleted" });
};

//-------------------- GET REQUESTED CONNECTIONS ------------------------------------------------------
export const getRequestedConnections = async (req, res) => {
  const userId = req.user._id;

  const requestedConnections = await ConnectionRequest.find({
    senderId: userId,
    status_accepted: false,
  }).populate("receiverId", "name username email profilePicture");

  res.status(200).json({ requestedConnections });
};

//-------------------- GET RECEIVED CONNECTIONS --------------------------------------------------------
export const getReceivedConnections = async (req, res) => {
  const userId = req.user._id;

  const recivedConnections = await ConnectionRequest.find({
    receiverId: userId,
    status_accepted: false,
  }).populate("senderId", "name username email profilePicture");

  res.status(200).json({ recivedConnections });
};

//-------------------- ACCEPT CONNECTION REQUEST -------------------------------------------------------
export const acceptConnectionRequest = async (req, res) => {
  const userId = req.user._id;
  const { connectionId } = req.body;

  const connection = await ConnectionRequest.findOne({ _id: connectionId });
  if (!connection) {
    throw new appError("Connection not found", 404);
  }

  connection.status_accepted = true;
  await connection.save();

  return res.status(200).json({ message: "Request updated" });
};

//-------------------- REJECT CONNECTION REQUEST -------------------------------------------------------
export const rejectConnectionRequest = async (req, res) => {
  const userId = req.user._id;
  const { connectionId } = req.body;

  const connection = await ConnectionRequest.deleteOne({ _id: connectionId });

  return res.status(200).json({ message: "Request Deleted" });
};

//-------------------- GET ALL ACCEPTED CONNECTIONS ------------------------------------------------------
export const getAllAcceptedConnectionOfUser = async (req, res) => {
  const userId = req.user._id;

  // Sent by me, accepted
  const sentConnections = await ConnectionRequest.find({
    senderId: userId,
    status_accepted: true,
  }).populate("receiverId", "name username email profilePicture");

  // Received by me, accepted
  const receivedConnections = await ConnectionRequest.find({
    receiverId: userId,
    status_accepted: true,
  }).populate("senderId", "name username email profilePicture");

  const acceptedConnections = [
    ...sentConnections.map((conn) => conn.receiverId),
    ...receivedConnections.map((conn) => conn.senderId),
  ];

  return res.status(200).json({ acceptedConnections });
};

//------------------- DELETE AN ACCEPTED CONNECTION ----------------------------------------------------
export const deleteAcceptedConnection = async (req, res) => {
  const userId = req.user._id;
  const { pairUserId } = req.body;

  if (!pairUserId) {
    return res.status(400).json({
      message: "pairUserId is required",
    });
  }

  const deletedConnection = await ConnectionRequest.findOneAndDelete({
    status_accepted: true,
    $or: [
      { senderId: userId, receiverId: pairUserId },
      { senderId: pairUserId, receiverId: userId },
    ],
  });

  if (!deletedConnection) {
    return res.status(404).json({
      message: "No accepted connection found",
    });
  }

  return res.status(200).json({
    message: "Connection removed successfully",
  });
};
