import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const projectsTable = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subtitle: text("subtitle").default("").notNull(),
  description: text("description").default("").notNull(),
  techStack: text("tech_stack").array().default([]).notNull(),
  githubLink: text("github_link").default("").notNull(),
  liveLink: text("live_link").default("").notNull(),
  image: text("image").default("").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  subtitle: z.string().max(200).optional().default(""),
  description: z.string().max(5000).optional().default(""),
  techStack: z.array(z.string().trim().min(1).max(40)).max(30).optional().default([]),
  githubLink: z.string().max(500).optional().default(""),
  liveLink: z.string().max(500).optional().default(""),
  image: z.string().max(2000).optional().default(""),
  sortOrder: z.number().int().optional().default(0),
});

export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;
export type ProjectInput = z.infer<typeof projectInputSchema>;
