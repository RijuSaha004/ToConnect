import { Server } from "socket.io";
import { frontend_url } from "../constants.js";

const onlineUsers = new Map();

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: frontend_url,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    socket.on("user_join", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });

    // Get all online user ----------------------->
    socket.on("get_onlineUsers", () => {
      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });

    // socket disconnected ----------------------->
    socket.on("disconnect", () => {
      //   console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });
  });

  return io;
};

export const getSocketId = (userId) => {
  return onlineUsers.get(userId.toString());
};
