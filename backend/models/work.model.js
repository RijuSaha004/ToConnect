import { Schema, model } from "mongoose";

const workSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  years: {
    type: Number,
    default: 0,
  },
});

const Work = model("Work", workSchema);
export default Work;