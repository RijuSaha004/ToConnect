import "dotenv/config";
import jwt from "jsonwebtoken"
import { appError } from "../utils/appError.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new appError("Authentication required", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    throw new appError("Invalid or expired token", 401);
  }

  const user = await User.findById(decoded.id).select("-passwordHash");

  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  req.user = user;
  next();
});
