import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /activity
 * Returns recent platform activity (questions, answers, comments)
 */
router.get("/", async (req, res) => {
  try {
    // Fetch recent questions
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        author: {
          select: { id: true, name: true, profileImage: true }
        },
        createdAt: true,
        updatedAt: true,
      }
    });

    // Fetch recent answers
    const answers = await prisma.answer.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        description: true,
        questionId: true,
        author: {
          select: { id: true, name: true, profileImage: true }
        },
        createdAt: true,
      }
    });

    // Fetch recent comments
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        content: true,
        questionId: true,
        answerId: true,
        author: {
          select: { id: true, name: true, profileImage: true }
        },
        createdAt: true,
      }
    });

    return res.status(200).json({
      questions,
      answers,
      comments
    });

  } catch (err) {
    console.error("Activity fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch activity" });
  }
});

export default router;
