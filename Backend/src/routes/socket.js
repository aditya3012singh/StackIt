import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const connectedUsers = new Map(); // socketId -> userId

export function initSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      socket.userId = decoded.id;
      next();
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ New socket connected:", socket.id, "UserID:", socket.userId);
    connectedUsers.set(socket.id, socket.userId);

    // Join personal room for direct messages/notifications
    socket.join(socket.userId);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    });

    socket.on("send-message", async ({ roomId, content }) => {
      try {
        const message = await prisma.chatMessage.create({
          data: {
            content,
            senderId: socket.userId,
            roomId,
          },
          include: {
            sender: true,
          },
        });

        io.to(roomId).emit("receive-message", message);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("notify", async ({ recipientId, type, content, link }) => {
      try {
        const notification = await prisma.notification.create({
          data: {
            type,
            content,
            link,
            recipientId,
            read: false,
          },
        });

        io.to(recipientId).emit("notification", notification);
      } catch (error) {
        console.error("Failed to save and emit notification", error);
      }
    });



    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
      connectedUsers.delete(socket.id);
    });
  });
}
