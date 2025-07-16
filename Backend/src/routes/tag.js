import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// 🔍 Get all tags
router.get("/", async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        followers: true,
        _count: {
          select: { questions: true }
        }
      }
    });

    res.json({ tags });
  } catch (error) {
    console.error("Fetch tags error:", error);
    res.status(500).json({ message: "Failed to fetch tags" });
  }
});


// ➕ Create new tag (admin only)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    const tag = await prisma.tag.create({
      data: { name },
    });
    res.status(201).json({ message: "Tag created", tag });
  } catch (error) {
    console.error("Create tag error:", error);
    res.status(500).json({ message: "Failed to create tag" });
  }
});

// 🔗 Assign tags to question
router.post("/assign/:qid", authMiddleware, async (req, res) => {
  const { qid } = req.params;
  const { tagIds } = req.body; // Example: ["tagid1", "tagid2"]

  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    return res.status(400).json({ message: "Provide valid tag IDs" });
  }

  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: qid },
      data: {
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        tags: true,
      },
    });

    res.status(200).json({ message: "Tags assigned", question: updatedQuestion });
  } catch (error) {
    console.error("Assign tags error:", error);
    res.status(500).json({ message: "Failed to assign tags" });
  }
});

// POST /tags/:id/follow
router.post("/:id/follow", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.tag.update({
      where: { id },
      data: {
        followers: { increment: 1 }
      }
    });

    res.json({ message: "Followed tag", tag: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to follow tag" });
  }
});


export default router;
