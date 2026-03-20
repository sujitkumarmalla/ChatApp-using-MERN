import express from "express";
import dotenv from "dotenv";
import conncetDB from "./config/database.js";
import userRoute from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js"
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";// 1. IMPORT app and server from your socket.js
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

// Configure Static serving for Render deployment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend1/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend1", "dist", "index.html"));
});

// 2. IMPORTANT: Change app.listen to server.listen
server.listen(PORT, () => {
    conncetDB();
    console.log(`🚀 Server and Socket running on port ${PORT}`);
});