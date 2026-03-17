import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteMessage,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.get(
  "/get-messages/:otherParticipantId",
  isLoggedIn,
  asyncHandler(getMessages),
);
router.post("/send/:receiverId", isLoggedIn, asyncHandler(sendMessage));
router.post("/delete", isLoggedIn, asyncHandler(deleteMessage));

export default router;
