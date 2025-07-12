import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /search?q=your+query
 * Search questions by title, description, or tags
 */
router.get("/", async (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Search in title or description
    const questions = await prisma.question.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            tags: {
              some: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        author: {
          select: { id: true, name: true, profileImage: true },
        },
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    res.json({ results: questions });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

export default router;
