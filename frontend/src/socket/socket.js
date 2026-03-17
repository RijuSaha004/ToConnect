import { io } from "socket.io-client";
import { base_url } from "../config/index.js";

export const socket = io(base_url, {
  withCredentials: true,
  autoConnect: false,
});
