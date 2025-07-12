import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js"; // 👈 optional middleware to check admin role

const prisma = new PrismaClient();
const router = express.Router();

// ✅ Get pending questions (for moderation)
router.get("/pending/questions", authMiddleware, isAdmin, async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: { approved: false }, // requires `approved` field in schema
      include: { author: true },
    });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending questions" });
  }
});

// ✅ Approve a question
router.post("/approve/question/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.question.update({
      where: { id },
      data: { approved: true },
    });

    res.json({ message: "Question approved", question: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve question" });
  }
});

// ✅ Delete a reported item (question, answer, comment)
router.delete("/delete/:type/:id", authMiddleware, isAdmin, async (req, res) => {
  const { type, id } = req.params;

  const validTypes = {
    question: prisma.question,
    answer: prisma.answer,
    comment: prisma.comment,
  };

  const model = validTypes[type];
  if (!model) return res.status(400).json({ message: "Invalid type" });

  try {
    await model.delete({ where: { id } });
    res.json({ message: `${type} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Deletion failed" });
  }
});

// ✅ Get flagged content (requires `flags` field or separate model)
router.get("/flags", authMiddleware, isAdmin, async (req, res) => {
  try {
    const flags = await prisma.flag.findMany({
      include: {
        reportedBy: { select: { id: true, name: true } },
        question: true,
        answer: true,
        comment: true,
      },
    });

    res.json(flags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch flags" });
  }
});

export default router;
