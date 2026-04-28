import { pgTable, text, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").unique(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  bio: text("bio").notNull().default(""),
  headline: text("headline").notNull().default(""),
  location: text("location").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
  resumeUrl: text("resume_url").notNull().default(""),
  templateId: text("template_id").notNull().default("neon"),
  socialLinks: jsonb("social_links")
    .$type<{
      github?: string;
      linkedin?: string;
      twitter?: string;
      website?: string;
      email?: string;
    }>()
    .notNull()
    .default({}),
  isPro: boolean("is_pro").notNull().default(false),
  customDomain: text("custom_domain").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
