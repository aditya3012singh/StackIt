import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /activity
 * Returns recent platform activity (questions, answers, comments)
 * Auth middleware is optional if using token to infer user
 */
router.get("/", async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    const answers = await prisma.answer.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        description: true,
        questionId: true,
        createdAt: true,
      },
    });

    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        content: true,
        questionId: true,
        answerId: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      questions,
      answers,
      comments,
    });
  } catch (err) {
    console.error("❌ Error fetching activity:", err);
    return res.status(500).json({ message: "Failed to fetch activity" });
  }
});

export default router;
