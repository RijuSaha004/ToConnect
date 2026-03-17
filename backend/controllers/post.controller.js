import Comment from "../models/comments.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { appError } from "../utils/appError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//------------------- CREATE POST -------------------------------------------------------------------
export const createPost = async (req, res) => {
  const userId = req.user._id;
  const { body } = req.body;

  let uploadResult;
  if (req.file?.path) {
    uploadResult = await uploadOnCloudinary(req.file.path);
  }

  const post = new Post({
    userId: userId,
    body,
    media: uploadResult?.secure_url || "",
    fileType: uploadResult?.format || "",
  });

  await post.save();
  return res.status(200).json({ message: "Post created" });
};

//-------------------- GET ALL POST ----------------------------------------------------------------
export const getAllPost = async (req, res) => {
  const posts = await Post.find().populate(
    "userId",
    "name username profilePicture",
  );
  return res.status(200).json({ posts });
};

//-------------------- GET ALL USER POSTS -----------------------------------------------------------
export const getAllUserPost = async (req, res) => {
  const userId = req.user._id;

  const posts = await Post.find({ userId }).populate(
    "userId",
    "name username profilePicture",
  );
  return res.status(200).json({ posts });
};

//--------------------- DELETE USER POST -----------------------------------------------------------
export const deletePost = async (req, res) => {
  const userId = req.user._id;
  const { post_id } = req.body;

  const post = await Post.findOne({ _id: post_id, userId });
  if (!post) {
    throw new appError("Post not found", 404);
  }

  await Post.deleteOne({ _id: post_id });
  await Comment.deleteMany({ postId: post_id });
  res.status(200).json({ mesage: "Post deleted" });
};

//------------------- CREATE NEW COMMENT ON POST -------------------------------------------------
export const commentPost = async (req, res) => {
  const userId = req.user._id;
  const { post_id, commentBody } = req.body;

  const post = await Post.findOne({ _id: post_id });
  if (!post) {
    throw new appError("Post not found", 404);
  }

  const newComment = new Comment({
    userId: userId,
    postId: post_id,
    body: commentBody,
  });
  await newComment.save();

  return res.status(200).json({ message: "Comment added" });
};

//-------------------- GET ALL COMMENTS BY POST --------------------------------------------------------
export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.body;

  const comments = await Comment.find({ postId: post_id }).populate(
    "userId",
    "username name profilePicture",
  );

  return res.status(200).json({ comments });
};

//-------------------- DELETE COMMENT -----------------------------------------------------------------
export const delete_comment_of_user = async (req, res) => {
  const userId = req.user._id;
  const { comment_id } = req.body;

  const comment = await Comment.findOne({ _id: comment_id, userId });
  if (!comment) {
    throw new appError("Comment not found", 404);
  }

  if (comment.userId.toString() !== userId.toString()) {
    throw new appError("Unauthorized", 401);
  }

  await Comment.deleteOne({ _id: comment_id });

  res.status(200).json({ message: "Comment deleted" });
};

//------------------- LIKE ON POST -------------------------------------------------------------------
export const increment_likes = async (req, res) => {
  const userId = req.user._id;
  const { post_id } = req.body;

  const post = await Post.findOne({ _id: post_id });
  if (!post) {
    throw new appError("Post not found", 404);
  }

  if (post.likedIds.includes(userId)) {
    post.likedIds = post.likedIds.filter(
      (id) => id.toString() !== userId.toString(),
    );

    post.likes = post.likedIds.length;
  } else {
    post.likedIds.push(userId);
    post.likes = post.likedIds.length;
  }

  await post.save();

  return res.status(200).json({ message: "Likes Added" });
};
