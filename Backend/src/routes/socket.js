import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const connectedUsers = new Map(); // socketId -> userId

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      socket.userId = decoded.id;
      return next();
    } catch (err) {
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ New socket connection:", socket.id, socket.userId);
    connectedUsers.set(socket.id, socket.userId);
    socket.join(socket.userId); // personal room

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

    socket.on("notify", ({ recipientId, type, content, link }) => {
      io.to(recipientId).emit("notification", {
        type,
        content,
        link,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
      connectedUsers.delete(socket.id);
    });
  });

  return io;
}
