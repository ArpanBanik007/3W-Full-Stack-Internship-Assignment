// frontend/src/socket.js
import { io } from "socket.io-client";

export const socket = io("https://threew-full-stack-internship-assignment.onrender.com "||" http://localhost:8001", {
  withCredentials: true,
});
