import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const Comment = model("Comment", commentSchema);
export default Comment;
