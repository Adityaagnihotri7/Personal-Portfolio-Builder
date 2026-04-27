import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  bio: text("bio").default("").notNull(),
  role: text("role").default("Software Developer").notNull(),
  location: text("location").default("").notNull(),
  avatarUrl: text("avatar_url").default("").notNull(),
  resumeUrl: text("resume_url").default("").notNull(),
  templateId: text("template_id").default("neon").notNull(),
  socialLinks: jsonb("social_links").$type<SocialLinks>().default({}).notNull(),
  isPro: boolean("is_pro").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: true,
});

export const registerUserSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  username: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9_-]+$/, "Username must be lowercase letters, numbers, _ or -"),
  password: z.string().min(8).max(200),
});

export const loginUserSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  bio: z.string().max(2000).optional(),
  role: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  avatarUrl: z.url().max(2000).optional().or(z.literal("")),
  resumeUrl: z.url().max(2000).optional().or(z.literal("")),
  templateId: z.enum(["neon", "minimal"]).optional(),
  socialLinks: z
    .object({
      github: z.string().max(500).optional(),
      linkedin: z.string().max(500).optional(),
      twitter: z.string().max(500).optional(),
      website: z.string().max(500).optional(),
    })
    .optional(),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type PublicUser = Omit<User, "passwordHash" | "email"> & { email?: string };

export function toPublicUser(user: User, includeEmail = false): PublicUser {
  const { passwordHash: _ph, email, ...rest } = user;
  return includeEmail ? { ...rest, email } : rest;
}
