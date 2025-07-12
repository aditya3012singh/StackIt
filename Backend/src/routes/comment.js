import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Add comment to a question or answer
router.post("/:targetType/:targetId", authMiddleware, async (req, res) => {
  const { targetType, targetId } = req.params;
  const { content } = req.body;

  if (!["question", "answer"].includes(targetType)) {
    return res.status(400).json({ message: "Invalid target type" });
  }

  try {
    const commentData = {
      content,
      authorId: req.user.id,
    };

    if (targetType === "question") commentData.questionId = targetId;
    else if (targetType === "answer") commentData.answerId = targetId;

    const comment = await prisma.comment.create({ data: commentData });

    res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    console.error("Comment creation error:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
});
// 👇 Get all comments for a question
router.get("/question/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { questionId },
      include: {
        author: {
          select: { id: true, name: true, profileImage: true }
        }
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments for question:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// 👇 Get all comments for an answer
router.get("/answer/:answerId", async (req, res) => {
  const { answerId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { answerId },
      include: {
        author: {
          select: { id: true, name: true, profileImage: true }
        }
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments for answer:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});


// ✏️ Edit comment
router.put("/:commentId", authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.authorId !== req.user.id)
      return res.status(403).json({ message: "Not your comment" });

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.json({ message: "Comment updated", comment: updated });
  } catch (error) {
    console.error("Comment update error:", error);
    res.status(500).json({ message: "Failed to update comment" });
  }
});

// 🗑️ Delete comment
router.delete("/:commentId", authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.authorId !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Not authorized" });

    await prisma.comment.delete({ where: { id: commentId } });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Comment delete error:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

export default router;
