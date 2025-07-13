import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// 🟢 Create a new question
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const authorId = req.user.id;

    const question = await prisma.question.create({
      data: {
        title,
        description,
        authorId,
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    });

    res.status(201).json({ question });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(500).json({ message: "Failed to create question" });
  }
});

// 🟡 Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        author: { select: { id: true, name: true } },
        tags: true,
        answers: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ questions });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

// 🔵 Get one question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, name: true } },
        tags: true,
        answers: {
          include: {
            author: { select: { id: true, name: true } },
            comments: {
              include: {
                author: { select: { id: true, name: true } },
              },
            },
            votes: true,
          },
        },
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
        },
      },
    });


    if (!question) return res.status(404).json({ message: "Not found" });

    res.json({ question });
  } catch (error) {
    console.error("Get question error:", error);
    res.status(500).json({ message: "Failed to fetch question" });
  }
});

// 🟠 Update question (only author)
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) return res.status(404).json({ message: "Not found" });
    if (question.authorId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const updated = await prisma.question.update({
      where: { id: req.params.id },
      data: { title, description },
    });

    res.json({ message: "Updated", question: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update" });
  }
});

// 🔴 Delete question (author or admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) return res.status(404).json({ message: "Not found" });
    if (question.authorId !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Forbidden" });

    await prisma.question.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete" });
  }
});

export default router;
