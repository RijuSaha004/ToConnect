import { Schema, model } from "mongoose";

const connectionRequestSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status_accepted: {
    type: Boolean,
    default: false,
  },
});

const ConnectionRequest = model("connectionRequest", connectionRequestSchema);
export default ConnectionRequest;
