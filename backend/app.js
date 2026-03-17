import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { frontend_url } from "./constants.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import messageRoute from "./routes/message.routes.js"

import { connectToSocket } from "./socket/socketManager.js";

const app = express();
const server = http.createServer(app);
export const io = connectToSocket(server);

app.use(cors({
    origin: frontend_url, 
    credentials: true,
  }));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/message", messageRoute)

app.get("/hello", (req, res) => {
  res.send("hello everyone");
});

app.use((err, req, res, next) => {  
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default server;
