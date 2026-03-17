import { Schema, model } from "mongoose";

const educationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  school: {
    type: String,
    default: "",
  },
  degree: {
    type: String,
    default: "",
  },
  fieldOfStudy: {
    type: String,
    default: "",
  },
});

const Education = model("Education", educationSchema);
export default Education;
