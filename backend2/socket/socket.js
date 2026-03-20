import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Message } from "../models/messageModel.js";

const app = express();
const server = http.createServer(app);

// Store userId -> socketId
const userSocketMap = {};

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";

const io = new Server(server, {
    cors: {
        origin: [FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000, // helps detect disconnects faster
});

// Get receiver socket
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    try {
        const userId = socket.handshake.query.userId;

        // ❗ Validate userId
        if (!userId || userId === "undefined") {
            console.log("❌ Invalid userId, disconnecting socket:", socket.id);
            socket.disconnect();
            return;
        }

        // ✅ Save user
        userSocketMap[userId] = socket.id;

        console.log("✅ User connected:", userId);
        console.log("🔌 Socket ID:", socket.id);

        // Send online users list
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // 🔄 Mark undelivered messages as delivered now that user is online
        (async () => {
            try {
                const pendingMessages = await Message.find({ receiverId: userId, status: 'sent' });
                if (pendingMessages.length > 0) {
                    await Message.updateMany(
                        { receiverId: userId, status: 'sent' },
                        { $set: { status: 'delivered' } }
                    );
                    
                    // Notify senders
                    pendingMessages.forEach(msg => {
                        const senderSocketId = getReceiverSocketId(msg.senderId);
                        if (senderSocketId) {
                            io.to(senderSocketId).emit("messageDelivered", msg._id);
                        }
                    });
                }
            } catch (err) {
                console.log("Error updating pending messages:", err);
            }
        })();

        // 🔁 Listen for manual ping (optional debugging)
        socket.on("pingCheck", () => {
            console.log("📡 Ping received from:", userId);
            socket.emit("pongCheck", "Server is alive ✅");
        });

        // Typing events
        socket.on("typing", (receiverId) => {
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("typing", userId);
            }
        });

        socket.on("stopTyping", (receiverId) => {
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("stopTyping", userId);
            }
        });

        // Message Status events
        socket.on("markDelivered", async ({ messageId, senderId }) => {
            const senderSocketId = getReceiverSocketId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageDelivered", messageId);
            }
            try {
                await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
            } catch (err) { console.log(err); }
        });

        socket.on("markSeen", async ({ messageId, senderId }) => {
            const senderSocketId = getReceiverSocketId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageSeen", messageId);
            }
            try {
                await Message.findByIdAndUpdate(messageId, { status: 'seen' });
            } catch (err) { console.log(err); }
        });

        // ❌ Handle disconnect
        socket.on("disconnect", (reason) => {
            console.log("❌ User disconnected:", userId);
            console.log("⚠️ Reason:", reason);

            delete userSocketMap[userId];

            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });

        // ⚠️ Handle errors
        socket.on("error", (err) => {
            console.log("🔥 Socket error:", err.message);
        });

    } catch (error) {
        console.log("🔥 Connection error:", error.message);
    }
});

export { app, io, server };