import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// 🟢 Get all notifications for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
});

// 🟢 Mark a single notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: req.params.id,
      },
      data: {
        read: true,
      },
    });

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read." });
  }
});

// 🟢 Mark all notifications as read
router.put("/mark-all-read", authMiddleware, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        recipientId: req.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ message: "Failed to mark notifications." });
  }
});

export default router;
