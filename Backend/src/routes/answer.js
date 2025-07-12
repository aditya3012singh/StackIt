import express from "express";
import { PrismaClient, VoteType } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Create answer
router.post("/:questionId", authMiddleware, async (req, res) => {
  const { description } = req.body;
  const { questionId } = req.params;

  try {
    const answer = await prisma.answer.create({
      data: {
        description,
        questionId,
        authorId: req.user.id,
      },
    });

    res.status(201).json({ message: "Answer created", answer });
  } catch (error) {
    console.error("Answer create error:", error);
    res.status(500).json({ message: "Failed to create answer" });
  }
});

// ✏️ Update answer
router.put("/:answerId", authMiddleware, async (req, res) => {
  const { answerId } = req.params;
  const { description } = req.body;

  try {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) return res.status(404).json({ message: "Not found" });

    if (answer.authorId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const updated = await prisma.answer.update({
      where: { id: answerId },
      data: { description },
    });

    res.json({ message: "Answer updated", answer: updated });
  } catch (error) {
    console.error("Answer update error:", error);
    res.status(500).json({ message: "Failed to update answer" });
  }
});

// 🗑️ Delete answer
router.delete("/:answerId", authMiddleware, async (req, res) => {
  const { answerId } = req.params;

  try {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) return res.status(404).json({ message: "Not found" });

    if (answer.authorId !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Forbidden" });

    await prisma.answer.delete({ where: { id: answerId } });

    res.json({ message: "Answer deleted" });
  } catch (error) {
    console.error("Answer delete error:", error);
    res.status(500).json({ message: "Failed to delete answer" });
  }
});

// ✅ Mark as accepted answer
router.patch("/:answerId/accept", authMiddleware, async (req, res) => {
  const { answerId } = req.params;

  try {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });

    if (!answer) return res.status(404).json({ message: "Not found" });

    if (answer.question.authorId !== req.user.id)
      return res.status(403).json({ message: "Only question author can accept" });

    await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    });

    res.json({ message: "Answer marked as accepted" });
  } catch (error) {
    console.error("Accept error:", error);
    res.status(500).json({ message: "Failed to mark answer" });
  }
});

// ✅ Vote (Up or Down)
router.post("/:answerId/vote", authMiddleware, async (req, res) => {
  const { answerId } = req.params;
  const { type } = req.body;

  if (!["UP", "DOWN"].includes(type)) {
    return res.status(400).json({ message: "Invalid vote type" });
  }

  try {
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_answerId: {
          userId: req.user.id,
          answerId,
        },
      },
    });

    if (existingVote) {
      await prisma.vote.update({
        where: {
          userId_answerId: {
            userId: req.user.id,
            answerId,
          },
        },
        data: { type },
      });
    } else {
      await prisma.vote.create({
        data: {
          userId: req.user.id,
          answerId,
          type,
        },
      });
    }

    res.json({ message: `Vote ${type} recorded` });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Failed to vote" });
  }
});

export default router;
