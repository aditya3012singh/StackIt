import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// 🗳️ Vote on an answer (upvote/downvote)
router.post("/:aid", authMiddleware, async (req, res) => {
  const { aid } = req.params;
  const { type } = req.body; // type = "UP" | "DOWN"
  const userId = req.user.id;

  if (!["UP", "DOWN"].includes(type)) {
    return res.status(400).json({ message: "Invalid vote type" });
  }

  try {
    const existing = await prisma.vote.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId: aid,
        },
      },
    });

    if (existing) {
      // If same vote, remove it (toggle)
      if (existing.type === type) {
        await prisma.vote.delete({
          where: { userId_answerId: { userId, answerId: aid } },
        });
        return res.status(200).json({ message: "Vote removed" });
      } else {
        // If different type, update it
        await prisma.vote.update({
          where: { userId_answerId: { userId, answerId: aid } },
          data: { type },
        });
        return res.status(200).json({ message: "Vote updated" });
      }
    }

    await prisma.vote.create({
      data: {
        userId,
        answerId: aid,
        type,
      },
    });

    res.status(201).json({ message: "Vote added" });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Voting failed" });
  }
});

// 🔢 Get vote count for an answer
router.get("/:aid", async (req, res) => {
  const { aid } = req.params;

  try {
    const [upvotes, downvotes] = await Promise.all([
      prisma.vote.count({ where: { answerId: aid, type: "UP" } }),
      prisma.vote.count({ where: { answerId: aid, type: "DOWN" } }),
    ]);

    res.json({ upvotes, downvotes });
  } catch (error) {
    console.error("Vote count error:", error);
    res.status(500).json({ message: "Failed to get vote count" });
  }
});

export default router;
