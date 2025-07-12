// ✅ Auth: Signup
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(4, "Name must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImage: z.string().url().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  profileImage: z.string().url().optional()
});

// ✅ Question Submission
export const questionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(20, "Description must be detailed"),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
});

// ✅ Answer Submission
export const answerSchema = z.object({
  questionId: z.string().uuid("Invalid question ID"),
  description: z.string().min(10, "Answer must be at least 10 characters"),
});

// ✅ Comment Schema
export const commentSchema = z.object({
  content: z.string().min(2, "Comment must be at least 2 characters"),
  questionId: z.string().uuid().optional(),
  answerId: z.string().uuid().optional(),
}).refine(data => data.questionId || data.answerId, {
  message: "Comment must be attached to either a question or an answer",
});

// ✅ Vote Schema
export const voteSchema = z.object({
  answerId: z.string().uuid("Invalid answer ID"),
  type: z.enum(["UP", "DOWN"], {
    errorMap: () => ({ message: "Vote must be UP or DOWN" }),
  }),
});

// ✅ Tag Creation/Update
export const tagSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters"),
});

// ✅ Notification Mark-as-Read
export const markNotificationSchema = z.object({
  notificationId: z.string().uuid("Invalid notification ID"),
});

// ✅ Chat Message Schema
export const chatMessageSchema = z.object({
  roomId: z.string().uuid("Invalid chat room ID"),
  content: z.string().min(1, "Message content is required"),
});
