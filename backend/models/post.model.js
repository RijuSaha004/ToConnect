import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
    },
    likedIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    media: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    fileType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Post = model("Post", postSchema);
export default Post;
