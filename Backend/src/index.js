import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { Server } from "socket.io";
import passport from "passport";
import session from "express-session";
import Redis from "ioredis";
import morgan from "morgan";

import "./config/passport.js";
import { initSocket } from "./routes/socket.js"; // Updated ✅

import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/question.js";
import answerRoutes from "./routes/answer.js";
import commentRoutes from "./routes/comment.js";
import voteRoutes from "./routes/vote.js";
import tagRoutes from "./routes/tag.js";
import flagRoutes from "./routes/flags.js";
import chatRoutes from "./routes/chat.js";
import notificationRoutes from "./routes/notificaton.js";
import oauthRoutes from "./routes/oauth.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import activityRoutes from "./routes/activity.js";
import searchRoutes from "./routes/search.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ Match CORS config in both Express and Socket.IO
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Redis check
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
redis.ping().then(console.log).catch(console.error);

// ✅ Sessions for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/answers", answerRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/votes", voteRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/flags", flagRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/auth/oauth", oauthRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/admin", adminRoutes);

// ✅ Real-time Socket setup
const io = new Server(server, {
  cors: corsOptions
});
initSocket(io); // 💡 Pass Socket.IO instance, not HTTP server

// ✅ 404 + error handling
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
