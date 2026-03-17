import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  commentPost,
  createPost,
  delete_comment_of_user,
  deletePost,
  get_comments_by_post,
  getAllPost,
  getAllUserPost,
  increment_likes,
} from "../controllers/post.controller.js";

const router = Router();

router.post(
  "/create_post",
  upload.single("media"),
  isLoggedIn,
  asyncHandler(createPost),
);
router.get("/userPosts", isLoggedIn, asyncHandler(getAllUserPost));
router.get("/allPosts", isLoggedIn, asyncHandler(getAllPost));
router.post("/delete_post", isLoggedIn, asyncHandler(deletePost));
router.post("/comment", isLoggedIn, asyncHandler(commentPost));
router.post("/get_comments", isLoggedIn, asyncHandler(get_comments_by_post));
router.post(
  "/delete_comment",
  isLoggedIn,
  asyncHandler(delete_comment_of_user),
);
router.post("/increment_post_like", isLoggedIn, asyncHandler(increment_likes));

export default router;
