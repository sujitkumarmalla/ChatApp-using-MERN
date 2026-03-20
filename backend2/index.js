import express from "express";
import dotenv from "dotenv";
import conncetDB from "./config/database.js";
import userRoute from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js"
import cors from "cors"

// 1. IMPORT app and server from your socket.js
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8080; // Ensure this matches your frontend URL

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads"));

const corsOption = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    credentials: true
}
app.use(cors(corsOption));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// 2. IMPORTANT: Change app.listen to server.listen
server.listen(PORT, () => {
    conncetDB();
    console.log(`🚀 Server and Socket running on port ${PORT}`);
});