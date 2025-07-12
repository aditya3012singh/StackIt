import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Create a flag (Report)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, reason, questionId, answerId, commentId } = req.body;
    const reportedById = req.user.id;

    if (!type || !reason) {
      return res.status(400).json({ message: "Type and reason are required." });
    }

    const flag = await prisma.flag.create({
      data: {
        type,
        reason,
        questionId,
        answerId,
        commentId,
        reportedById,
      },
    });

    res.status(201).json({ message: "Content flagged successfully", flag });
  } catch (err) {
    console.error("Flag error:", err);
    res.status(500).json({ message: "Failed to create flag" });
  }
});

// Get all flags (Admin only)
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const flags = await prisma.flag.findMany({
      include: {
        reportedBy: {
          select: { id: true, email: true },
        },
        question: {
          select: { id: true, title: true },
        },
        answer: {
          select: { id: true, description: true },
        },
        comment: {
          select: { id: true, content: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ flags });
  } catch (err) {
    console.error("Fetch flags error:", err);
    res.status(500).json({ message: "Failed to fetch flags" });
  }
});

// Delete a flag (Admin resolves)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  const flagId = req.params.id;

  try {
    await prisma.flag.delete({ where: { id: flagId } });
    res.status(200).json({ message: "Flag removed" });
  } catch (err) {
    console.error("Delete flag error:", err);
    res.status(500).json({ message: "Failed to delete flag" });
  }
});

export default router;
