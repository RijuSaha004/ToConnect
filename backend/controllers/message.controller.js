import { io } from "../app.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId } from "../socket/socketManager.js";

export const getMessages = async (req, res, next) => {
  const myId = req.user._id;
  const otherParticipantId = req.params.otherParticipantId;

  if (!myId || !otherParticipantId) {
    return;
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [myId, otherParticipantId] },
  }).populate({
    path: "messages",
    populate: {
      path: "senderId",
      select: "name username",
    },
  });

  res.status(200).json({
    success: true,
    responseData: conversation,
  });
};

export const sendMessage = async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  if (!senderId || !receiverId || !message) {
    return;
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  let newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  newMessage = await newMessage.populate("senderId", "name username");

  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  // socket.io ------------------------------------------>
  const socketId = getSocketId(receiverId);

  if (socketId) {
    io.to(socketId).emit("newMessage", newMessage);
  }

  res.status(200).json({
    success: true,
    responseData: newMessage,
  });
};

// Delete message ------------------------------------------>
export const deleteMessage = async (req, res) => {
  const senderId = req.user._id;
  const { msgId } = req.body;

  const deletedMessage = await Message.findByIdAndDelete(msgId);

  if (!deletedMessage) {
    return;
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, deletedMessage.receiverId] },
  });

  if (conversation) {
    conversation.messages = conversation.messages.filter(
      (msg) => msg.toString() !== msgId,
    );

    await conversation.save();
  }

  // socket ----------------------------->
  const receiverSocketId = getSocketId(deletedMessage.receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("message_deleted", msgId);
  }

  res.status(200).json({
    success: true,
    deletedMessageId: msgId,
  });
};
