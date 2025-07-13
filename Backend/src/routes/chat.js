import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Create or get 1-1 chat room
router.post("/room", authMiddleware, async (req, res) => {
  const { participantId } = req.body;
  const userId = req.user.id;

  try {
    let existingRoom = await prisma.chatRoom.findFirst({
      where: {
        isGroup: false,
        members: {
          every: {
            id: {
              in: [userId, participantId],
            },
          },
        },
      },
      include: { members: true },
    });

    if (!existingRoom) {
      existingRoom = await prisma.chatRoom.create({
        data: {
          members: {
            connect: [{ id: userId }, { id: participantId }],
          },
        },
        include: { members: true },
      });
    }

    res.json(existingRoom);
  } catch (err) {
    console.error("Error creating chat room:", err);
    res.status(500).json({ message: "Failed to create/get chat room" });
  }
});

// ✅ Send a message
router.post("/message", authMiddleware, async (req, res) => {
  const { content, roomId } = req.body;
  const userId = req.user.id;

  try {
    const message = await prisma.chatMessage.create({
      data: {
        content,
        senderId: userId,
        roomId,
      },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// ✅ Get messages from a room
router.get("/messages/:roomId", authMiddleware, async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true } } },
    });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to get messages" });
  }
});

// ✅ Get all rooms user is in
router.get("/rooms", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        members: {
          some: { id: userId },
        },
      },
      include: {
        members: {
          select: { id: true, name: true, email: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    res.json(rooms);
  } catch (err) {
    console.error("Error getting rooms:", err);
    res.status(500).json({ message: "Failed to get chat rooms" });
  }
});
router.post("/group", authMiddleware, async (req, res) => {
  const { name, memberIds } = req.body;
  const userId = req.user.id;

  const room = await prisma.chatRoom.create({
    data: {
      name,
      isGroup: true,
      members: {
        connect: [{ id: userId }, ...memberIds.map(id => ({ id }))],
      },
    },
    include: { members: true },
  });

  res.json(room);
});


export default router;
