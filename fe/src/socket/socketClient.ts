"use client";

import { io } from "socket.io-client";
import Cookies from "js-cookie";

// Retrieve the token from cookies with error handling
const getAuthToken = () => {
  const token = Cookies.get("__hisaabKitaab__");
  if (!token) {
    return null;
  }
  return token;
};

const token = getAuthToken();

export const socket = io("https://ltik3jaso5ir6ph4gmrskfbrlq.srv.us", {
  path: "/socket.io", // Ensure this matches the server's Socket.IO path
  transports: ["websocket", "polling"], // Use WebSocket and fallback to polling
  ackTimeout: 60000, // Timeout for acknowledgments
  multiplex: true, // Allow multiple connections to the same server
  reconnection: true, // Enable automatic reconnections
  reconnectionAttempts: Infinity, // Retry forever (or set a number)
  reconnectionDelay: 1000, // Start with 1s
  reconnectionDelayMax: 30000, // Max 30s between retries
  randomizationFactor: 0.5, // Add some jitter (0.5 = ±50%)
  auth: { token: token || "" }, // Pass the token for authentication (empty string if null)
  secure: false, // Set to true if using HTTPS
});
