import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /leaderboard
 * Returns top users sorted by XP
 */
router.get("/", async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 20, // top 20 users
      select: {
        id: true,
        name: true,
        email: true,
        xp: true,
        profileImage: true,
        currentStreak: true,
        longestStreak: true,
        createdAt: true,
      },
    });

    res.status(200).json({ leaderboard: topUsers });
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

export default router;
