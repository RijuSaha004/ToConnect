import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(30, "Name is too long"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 10 characters"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(30).optional(),

  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),

  bio: z.string().max(100).optional(),

  currentPost: z.string().max(20).optional(),
});

export const createWorkSchema = z.object({
  company: z.string().trim().min(1).max(50, "Company name is too long"),

  position: z.string().trim().min(1).max(20, "Position is too long"),

  years: z.number().min(1).max(100, "Years is too long"),
});

export const createEducationSchema = z.object({
  school: z.string().trim().min(1).max(50, "School name is too long"),

  degree: z.string().trim().min(1).max(50, "Degree is too long"),

  fieldOfStudy: z.string().trim().min(1).max(50, "Field of study is too long"),
});
